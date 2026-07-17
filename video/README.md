# CareerFlow Remotion demo

The portfolio video is isolated from the production Next.js application. Its dependencies live in `video/package.json`, and the deployed application never imports Remotion.

## Prerequisites

- Node.js 22.x
- npm 11.x or newer
- The committed screenshots under `docs/assets/screenshots/`
- A local Chromium download managed by Remotion during rendering

Install the video workspace independently:

```bash
npm --prefix video ci
```

## Studio

Open Remotion Studio from the repository root:

```bash
npm run video:studio
```

The main composition is `CareerFlowV1Demo` at 1920×1080, 30 fps, and 3,150 frames (105 seconds). `CareerFlowPreview` is a 10-second excerpt.

## Render

```bash
npm run video:render
npm run video:render:preview
```

Expected outputs:

- `docs/assets/video/careerflow-v1-demo.mp4`
- `docs/assets/video/careerflow-preview.mp4`

Both commands use H.264 with the broadly compatible `yuv420p` pixel format. The demo is intentionally silent and has no external network assets, downloaded music, or paid media-generation dependency.

## Updating source captures

The compositions load repository-owned PNG files through Remotion's static-asset pipeline. Browser screenshots must be regenerated only when the production interface or the intended portfolio data changes. Keep raw recordings, browser profiles, render caches, and uncompressed intermediates out of Git according to the root `.gitignore`.
