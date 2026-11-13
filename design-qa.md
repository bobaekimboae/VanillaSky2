# VanillaSky2 Design / Functional QA

## Reference observed

- Source: `https://app.vanillasky.ai/start` and the authorized test draft editor at `/create?id=…`.
- Captured desktop and 390×844 mobile source viewports.
- Observed flow: vehicle photos/details → video format and shape → style, background, music, voice, brand → storyboard review → payment and AI video generation.
- Only the editor before payment was inspected. The source paid generation action was not activated.

## Implementation

- Independent Korean responsive upload, settings, storyboard and preview UI informed by the inspected flow.
- Local photo upload (3–20), car details, format/ratio/style/overlay color/music options, local logo, scene editing/reordering and canvas preview.
- Client-side WebM export from the canvas and browser Korean voice preview.
- No source account backend, paid AI generation, external listing import, payment, cloud storage or server-based AI voice. Background presets tint the original photo; they do not replace its background. Audio is synthesized ambience, not licensed or AI music. These distinctions are shown in the UI and README.
- Test photos remain outside the public source repository.

## Verification

- Deployed GitHub Pages flow: uploaded the provided three BMW photos, entered vehicle details, selected social format, 9:16 and the three-scene template, then confirmed the real-photo vertical preview.
- Rendered and downloaded the resulting WebM file in the browser. The UI reached `4 / 4 · 다운로드`, displayed `영상 파일이 준비됐어요` and `영상 다운로드가 시작됐어요 · 완료`; the browser download event returned a local file path.
- The embedded browser initially kept waiting at 100% for the recorder stop event. The renderer now waits a bounded four seconds after stop, and the script URL is versioned to bypass a stale cached renderer.
- No browser console errors were observed during the successful run.
- Source AI generation/payment parity was not tested or claimed.

## Current outcome

Previous VanillaSky flow was verified end to end with test BMW photos. VanillaSky2 is a separate Pages deployment of the same checked implementation. This is a client-side slideshow renderer, not the source service's paid generative video backend.

