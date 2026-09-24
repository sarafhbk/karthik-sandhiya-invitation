// Maps original Framer-hosted image hashes to locally bundled assets.
//
// The source markup references images by content hash
// (framerusercontent.com/images/<hash>), so the pages still ask for them by
// hash and this table resolves each one to a file in public/images/.
//
// Only hashes the pages actually request are listed. Entries for sections
// that have since been removed (PAGE 3's old photo slideshow, PAGE 5's
// golden-frame photo hashes, PAGE 6's thumbnails) were dropped — several of
// them pointed at files that are not in public/images/ at all, so they would
// have 404'd if anything had ever asked for them.
//
// PAGE 5's slideshow photos are no longer resolved through here: they are
// real photographs of the couple, referenced by their own filenames from
// GOLDEN_FRAME_PHOTOS in content.jsx.
const BASE = '/images/';

// Module-local: every caller goes through `img()` below, so the table itself
// is not part of this module's public surface.
const images = {
  // PAGE 1 — sky background
  xZKlIX9XaacbmAvyKmu8rqVXE: BASE + 'xZKlIX9XaacbmAvyKmu8rqVXE.webp',
  // PAGE 1 — temple
  J6YiMAQTDPTAlfG2On7An1Q5lB4: BASE + 'J6YiMAQTDPTAlfG2On7An1Q5lB4.webp',
  // PAGE 1 — tree (source references .webp, downloaded as .avif — same asset)
  VrdsdVM2OwyjQkw6YWOB0OowTQ: BASE + 'VrdsdVM2OwyjQkw6YWOB0OowTQ.avif',
  // PAGE 2 — design background
  iciTJeQ6Cx2u0gNdZeuKHPf1I: BASE + 'iciTJeQ6Cx2u0gNdZeuKHPf1I.webp',
  // PAGE 3 — background
  D4pzTjtAOLwhyi0UPGweoWoztA: BASE + 'D4pzTjtAOLwhyi0UPGweoWoztA.webp',
  // PAGE 4 — sky
  Rt8UBMylAa1Uf8GIPommwOJom8: BASE + 'Rt8UBMylAa1Uf8GIPommwOJom8.webp',
  // PAGE 4 — cloud
  hV0sxZSugZ1H4ccFPtXXsbHVi54: BASE + 'hV0sxZSugZ1H4ccFPtXXsbHVi54.webp',
  // PAGE 4 — TEMPLE overlay
  CUxzxi5SNqNa0t77tmEkNmfHc: BASE + 'CUxzxi5SNqNa0t77tmEkNmfHc.webp',
  // PAGE 4 — COUPLE CUT OUT
  sdAKyTg4o5WmZhgAcUR0DbKY: BASE + 'sdAKyTg4o5WmZhgAcUR0DbKY.avif',
  // PAGE 5 — design background
  sc2GPAV2jTrdKAHcfHti42Mz5YE: BASE + 'sc2GPAV2jTrdKAHcfHti42Mz5YE.webp',
  // PAGE 5 — golden frame png
  a6l8leK3Q1bKzvdCCwf3nSzy7E: BASE + 'a6l8leK3Q1bKzvdCCwf3nSzy7E.png',
  // PAGE 6 — background. The source's own asset for this hash was not among
  // the downloaded files, so it reuses PAGE 5's close-toned background.
  '6f9AxarIs54UBYT1Lrm4ws9V764': BASE + 'sc2GPAV2jTrdKAHcfHti42Mz5YE.webp',
  // PAGE 7 — ARTFUL INVITES DESIGN background (source .png, downloaded as
  // .avif). PAGE 7 is currently not rendered (see App.jsx), but the page
  // component is kept intact, so its asset mapping is kept with it.
  QUYudzcydz5OmxfmIxgjPrFyb6I: BASE + 'QUYudzcydz5OmxfmIxgjPrFyb6I.avif',
};

export function img(hash) {
  return images[hash] || BASE + hash;
}
