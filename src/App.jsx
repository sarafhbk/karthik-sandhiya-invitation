import './styles/breakpoints.css';
import './styles/framer-components.css';
import './styles/wedding-slideshow.css';
import './styles/music-player.css';
import './styles/page7-trim.css';
import './styles/page4-sky.css';
import './styles/countdown-band.css';
import './styles/flower-rain.css';
import './styles/back-to-top.css';
import './styles/page6-blessing.css';
import './styles/page2-kolam.css';
import './styles/page2-invocation.css';
import './styles/page6-kolam.css';
import './styles/canvas-height.css';
import './styles/page6-tap.css';
import './styles/page6-fit.css';
import './styles/page5-story.css';

import { useRef } from 'react';

import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import Page4 from './pages/Page4';
import Page5 from './pages/Page5';
import Page6 from './pages/Page6';
// Page7 (countdown timer page) is temporarily hidden at the user's request —
// the component and its code are kept as-is, just not rendered, until told
// to bring it back.
// import Page7 from './pages/Page7';
import MusicPlayer from './components/MusicPlayer';
import CanvasScaler from './components/CanvasScaler';
import CountdownBand from './components/CountdownBand';
import BackToTop from './components/BackToTop';

/**
 * Root layout — reproduces the source export's DOM shell exactly:
 *   #main > [data-framer-root].framer-m7ulU.framer-72rtr7
 *     > .framer-ji2yub[MAIN FRAME]
 *       > .framer-1v6qekl[PAGE 1] ... .framer-131l9v1[PAGE 7]
 *
 * `framer-m7ulU` carries the component CSS variables/classes; `framer-72rtr7`
 * is the SSR breakpoint hash baked into styles/framer-components.css — its
 * base rule sets width:1200px, and each @media override in that same file
 * re-sets width for 390/810/1440/1920px, so the canvas is always a fixed
 * design-pixel size at any given breakpoint. On Framer's own hosting, a
 * runtime script overrides that canvas's inline `width` to exactly match
 * `window.innerWidth` on load and resize (verified live against the source
 * export — no CSS transform/scale is involved); that script isn't present
 * in the static export, so `CanvasScaler` reproduces the same behavior
 * here (see its file for details) — otherwise the page shows a plain white
 * gutter to the right whenever the viewport doesn't exactly match one of
 * those design widths.
 */
export default function App() {
  // PAGE 2 hosts a one-shot flower rain that must stop once PAGE 3 is
  // reached, so the two sections' nodes are wired together here — this is the
  // nearest common owner. PAGE 2 observes its own node to know when to start.
  const page2Ref = useRef(null);
  const page3Ref = useRef(null);

  return (
    <div id="main">
      <CanvasScaler>
        <div data-framer-root className="framer-m7ulU framer-72rtr7">
          <div className="framer-ji2yub" data-framer-name="MAIN FRAME">
            <Page1 />
            <Page2 ref={page2Ref} page3Ref={page3Ref} />
            <Page3 ref={page3Ref} />
            <Page4 />
            <Page5 />
            <Page6 />
          </div>
        </div>
      </CanvasScaler>
      {/* Deliberately outside CanvasScaler: that wrapper pins its child to a
          fixed design-pixel width, which would leave this band inset with a
          gutter. Kept a sibling so it spans the full viewport width. */}
      <CountdownBand />
      {/* In flow at the end of the page, not floating: it is the last thing
          the reader meets after the countdown band. MusicPlayer stays fixed
          (it has to be reachable while reading), but nothing else hovers. */}
      <BackToTop />
      <div id="overlay" />
      <MusicPlayer />
    </div>
  );
}
