# Karthik & Sandhya — wedding invitation

A responsive Tamil wedding invitation for 24 & 25 October 2026 at T.M.A Marriage Hall, Thirukarakavur, Papanasam.

Built with Next.js, React, TypeScript, Tailwind CSS and Framer Motion. Includes an animated invitation entrance, event timeline, IST countdown, photo gallery, Google Maps directions and optional ambient audio. Motion respects the visitor’s reduced-motion preference.

## Development

Requires Node.js 22.13 or newer.

```sh
npm ci
npm run dev
```

## GitHub Pages

Pushes to `main` run `.github/workflows/deploy-pages.yml`. The workflow builds a static Next.js export and publishes `out/` to GitHub Pages. The repository must use **GitHub Actions** as its Pages source. Asset paths use the Pages base path supplied by the workflow.

To reproduce the project-site build locally:

```sh
NEXT_PUBLIC_BASE_PATH=/karthik-sandhiya-invitation npm run build
```

Images are stored in `public/`. The couple image was supplied for this invitation; the temple and still-life images are original generated artwork. Ambient sound starts only after the visitor presses the sound control.
