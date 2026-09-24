import { useEffect, useRef, useState } from 'react';
import { MUSIC_PLAYER_A11Y, MUSIC_PLAYLIST } from '../content';

// Source's original track lived on Framer's asset CDN
// (framerusercontent.com), which isn't reachable outside the Framer site.
// The user supplied YouTube links instead — a browser has no way to pull a
// raw audio stream from a YouTube watch URL, so this loads YouTube's IFrame
// Player API and keeps the player itself off-screen (not display:none/0x0,
// which YouTube refuses to actually play); only the existing play/pause +
// volume UI below is visible.
const IFRAME_API_SRC = 'https://www.youtube.com/iframe_api';
const PLAYER_ELEMENT_ID = 'yt-audio-player';

// YT.PlayerState: -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued
const YT_STATE_PLAYING = 1;
const YT_STATE_ENDED = 0;
const YT_STATE_BUFFERING = 3;

// How often to check whether a clipped track has reached its `end`. The API
// exposes no "seek to time X" event, so polling is the only option; 250ms is
// imperceptible as a loop seam and costs nothing.
const END_POLL_MS = 250;

/**
 * Pick the track for this page load.
 *
 * Deliberately called inside the mount effect rather than during render:
 * Math.random() in a render body would make the server and client markup
 * disagree, and React would warn on hydration. The player has no rendered
 * output that depends on which track won, so choosing at mount is free.
 */
function pickTrack() {
  return MUSIC_PLAYLIST[Math.floor(Math.random() * MUSIC_PLAYLIST.length)];
}

let apiPromise = null;

function loadIframeApi() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve) => {
    const existingCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof existingCallback === 'function') existingCallback();
      resolve(window.YT);
    };

    if (!document.querySelector(`script[src="${IFRAME_API_SRC}"]`)) {
      const script = document.createElement('script');
      script.src = IFRAME_API_SRC;
      document.head.appendChild(script);
    }
  });

  return apiPromise;
}

/**
 * Fixed bottom-left background-music player, verbatim from the source's
 * inline code component (play/pause + expandable volume slider), backed by
 * a hidden YouTube IFrame Player instead of an <audio> element.
 */
export default function MusicPlayer() {
  const holderRef = useRef(null);
  const playerRef = useRef(null);
  const playerReadyRef = useRef(false);
  const pendingPlayRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [volume, setVolume] = useState(0.6);
  // YouTube tells us specifically when the browser has rejected audible
  // autoplay.  There is no browser API that lets a website enable the
  // setting itself, but we can give the guest a clear, one-tap recovery.
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  // Mirrors `volume` for the player callbacks. `onReady` fires seconds after
  // mount, from an effect that closes over the FIRST render — so reading the
  // state there would apply 0.6 even if the guest has since moved the slider
  // (their change is skipped while the player is still loading). The ref is
  // always the live value.
  const volumeRef = useRef(0.6);
  // Set once the visitor has pressed pause/stop themselves. After that the
  // autoplay fallback below must never start the music again — a guest who
  // switched the song off and then scrolled would otherwise have it come
  // back on, which reads as broken.
  const stoppedByUserRef = useRef(false);
  // Whether the visitor has interacted with the page yet. Browsers only
  // permit audible playback after a gesture, and the player often becomes
  // ready AFTER the first interaction, so this records the gesture for `onReady`
  // to act on rather than losing it.
  const userGesturedRef = useRef(false);
  const cleanupGesturesRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const track = pickTrack();
    const start = track.start ?? 0;
    let endTimer = null;

    // YouTube's own `loop` param always restarts at 0:00, so it can't honour a
    // `start` offset or an early `end`. Whenever either is set we drive the
    // loop ourselves by seeking back to `start`.
    const needsManualLoop = start > 0 || track.end != null;

    const restart = (player) => {
      player.seekTo(start, true);
      player.playVideo();
    };

    const stopEndPoll = () => {
      if (endTimer !== null) {
        clearInterval(endTimer);
        endTimer = null;
      }
    };

    const startEndPoll = (player) => {
      if (track.end == null) return;
      stopEndPoll();
      endTimer = setInterval(() => {
        const t = player.getCurrentTime?.();
        if (typeof t === 'number' && t >= track.end) restart(player);
      }, END_POLL_MS);
    };

    const GESTURES = ['click', 'pointerdown', 'touchstart', 'touchend', 'keydown'];

    const onFirstGesture = () => {
      if (stoppedByUserRef.current) {
        removeGestureListeners();
        return;
      }
      const player = playerRef.current;
      if (!playerReadyRef.current || !player?.playVideo) {
        userGesturedRef.current = true;
        pendingPlayRef.current = true;
        return;
      }
      try {
        player.playVideo();
      } catch (err) {
        console.warn('Playback error on gesture:', err);
      }
    };

    function removeGestureListeners() {
      GESTURES.forEach((type) =>
        window.removeEventListener(type, onFirstGesture, { capture: true })
      );
    }

    GESTURES.forEach((type) =>
      window.addEventListener(type, onFirstGesture, {
        capture: true,
        passive: true,
      })
    );
    cleanupGesturesRef.current = removeGestureListeners;

    loadIframeApi().then((YT) => {
      if (cancelled || !YT || !YT.Player) return;

      if (!holderRef.current) return;
      let container = holderRef.current.querySelector(`#${PLAYER_ELEMENT_ID}`);
      if (!container) {
        container = document.createElement('div');
        container.id = PLAYER_ELEMENT_ID;
        holderRef.current.appendChild(container);
      }

      playerRef.current = new YT.Player(container, {
        videoId: track.id,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          playsinline: 1,
          start,
          ...(needsManualLoop ? {} : { loop: 1, playlist: track.id }),
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            playerReadyRef.current = true;
            event.target.setVolume(Math.round(volumeRef.current * 100));

            // Ensure iframe has autoplay permission
            const iframe = holderRef.current?.querySelector('iframe');
            if (iframe) {
              iframe.setAttribute('allow', 'autoplay; encrypted-media');
            }

            if (!stoppedByUserRef.current) {
              try {
                event.target.playVideo();
              } catch (err) {
                console.warn('Autoplay prevented on load:', err);
              }
            }
          },
          onStateChange: (event) => {
            const isPlaying = event.data === YT_STATE_PLAYING;

            if (isPlaying) {
              // Successfully started playback - safe to remove gesture listeners
              removeGestureListeners();
              startEndPoll(event.target);
              setAutoplayBlocked(false);
            } else {
              stopEndPoll();
            }

            if (isPlaying && stoppedByUserRef.current) {
              event.target.pauseVideo();
              setPlaying(false);
              return;
            }

            setPlaying(isPlaying);

            if (needsManualLoop && event.data === YT_STATE_ENDED) {
              restart(event.target);
            }
          },
          onAutoplayBlocked: () => {
            if (!stoppedByUserRef.current) setAutoplayBlocked(true);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      stopEndPoll();
      removeGestureListeners();
      if (playerRef.current) {
        try {
          if (typeof playerRef.current.destroy === 'function') {
            playerRef.current.destroy();
          }
        } catch {}
      }
      playerRef.current = null;
      playerReadyRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = () => {
    const player = playerRef.current;
    if (!player) return;

    // Decide from the PLAYER's live state, not the `playing` React state.
    //
    // `playing` is only updated when YouTube fires `onStateChange`, which
    // lags the actual playback by up to a second or two (buffering, network).
    // Reading the stale value here meant that pressing the button while the
    // track was starting took the "play" branch: it cleared the opt-out and
    // called playVideo() on already-playing audio, so the guest's press did
    // nothing and the music then came back on the next scroll. Traced in
    // real Chrome: after pause + scroll the button showed "Pause" again.
    //
    // `getPlayerState()` is synchronous and authoritative, so the button now
    // always does what the guest expects. `playing` is still used for the
    // icon — lag there is invisible.
    const state = player.getPlayerState?.();
    const isActuallyPlaying =
      state === YT_STATE_PLAYING || state === YT_STATE_BUFFERING || playing;

    if (isActuallyPlaying) {
      // Remember this. The music now starts on its own, so without a record
      // of the guest's choice the first scroll after they pressed pause
      // would switch it straight back on.
      stoppedByUserRef.current = true;
      pendingPlayRef.current = false;
      cleanupGesturesRef.current?.();
      player.pauseVideo();
      setPlaying(false);
      return;
    }

    // Pressing play again clears the opt-out.
    stoppedByUserRef.current = false;
    setAutoplayBlocked(false);

    if (!playerReadyRef.current) {
      pendingPlayRef.current = true;
      return;
    }
    player.playVideo();
  };

  const handleVolumeChange = (e) => {
    const v = Number(e.target.value);
    setVolume(v);
    volumeRef.current = v;
    if (playerReadyRef.current && playerRef.current) {
      playerRef.current.setVolume(Math.round(v * 100));
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        zIndex: 9999,
        opacity: 1,
        transform: 'translateY(0)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {autoplayBlocked && !playing && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Start background music"
          style={{
            position: 'absolute',
            bottom: 68,
            left: 0,
            width: 'max-content',
            maxWidth: 'calc(100vw - 48px)',
            padding: '10px 14px',
            border: '1px solid rgba(205, 174, 128, 0.45)',
            borderRadius: 20,
            background: 'rgb(255, 255, 255)',
            color: 'rgb(26, 26, 26)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
            cursor: 'pointer',
            font: '500 14px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
          }}
        >
          Tap to play music
        </button>
      )}
      {/* Kept technically inside the viewport (not offscreen at -9999px where
          browsers throttle/pause cross-origin iframes) but 1x1px, 0.001 opacity,
          behind the canvas, non-interactive, and overflow hidden. */}
      <div
        ref={holderRef}
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          width: 1,
          height: 1,
          opacity: 0.001,
          pointerEvents: 'none',
          zIndex: -1,
          overflow: 'hidden',
        }}
      >
        <div id={PLAYER_ELEMENT_ID} />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          padding: 0,
          background: 'rgb(255, 255, 255)',
          borderRadius: 28,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.2s ease',
          border: '1px solid rgba(205, 174, 128, 0.2)',
        }}
      >
        <button
          type="button"
          aria-label={playing ? MUSIC_PLAYER_A11Y.pause : MUSIC_PLAYER_A11Y.play}
          onClick={togglePlay}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            background: 'rgb(205, 174, 128)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            boxShadow: 'none',
          }}
        >
          {playing ? (
            <svg width={22.4} height={22.4} viewBox="0 0 24 24" fill="rgb(255, 255, 255)">
              <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
            </svg>
          ) : (
            <svg width={22.4} height={22.4} viewBox="0 0 24 24" fill="rgb(255, 255, 255)" style={{ marginLeft: 2 }}>
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <button
          type="button"
          aria-label={expanded ? MUSIC_PLAYER_A11Y.collapse : MUSIC_PLAYER_A11Y.expand}
          aria-expanded={expanded}
          onClick={() => setExpanded((e) => !e)}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginLeft: -8,
            opacity: 0.6,
            transition: 'all 0.2s ease',
          }}
        >
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="rgb(26, 26, 26)"
            style={{
              transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>
        {expanded && (
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            aria-label={MUSIC_PLAYER_A11Y.volume}
            // Without this a screen reader reads the raw value ("0.6"), which
            // means nothing to a listener. The percentage does.
            aria-valuetext={`${Math.round(volume * 100)}%`}
            style={{ width: 90, marginRight: 16, accentColor: 'rgb(205, 174, 128)' }}
          />
        )}
      </div>
    </div>
  );
}
