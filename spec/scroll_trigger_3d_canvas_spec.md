# Scroll-Triggered 3D Canvas Architecture — Implementation Spec

**This is the execution guide for implementing the Apple-style scroll-scrubbed 3D product explosion on the frontend.** Once an idea is finalized and product visuals are selected, follow this spec to generate frames, automate processing, and embed the high-performance canvas engine into the React frontend.

---

## Division of Responsibilities

```yaml
workflow_division:
  human_tasks:
    - "Select or snap a clean hero product photo (or choose a product domain)."
    - "Generate the initial hero image and exploded end frame via Google Flow or Midjourney."
    - "Run the image-to-video generation (5s locked camera animation)."
    - "Drop the resulting video or image zip into the workspace."
  agent_automation_tasks:
    - "Generate tailored, hyper-specific Prompt A, B, and C with exact hex matching."
    - "Automate video-to-frames extraction and webp compression via local ffmpeg script."
    - "Pre-wire the React ScrollCanvas component in frontend/src/components/ScrollCanvas.tsx."
    - "Sync the canvas background hex with Tailwind theme variables."
    - "Build scroll-synchronized narrative text overlays tied to frame progress."
    - "Execute memory leak and frame-rate performance tests."
```

---

## Milestone 1 — Intake, Graphify Query & Color Hex Lock
**Input:** Finalized idea name, target product/hardware/software asset, and brand color palette.

**Actions:**
1. **Graphify Search Phase:**
   - Run `graphify query "ScrollCanvas OR frontend UI components"` to check for existing canvas or animation primitives in `frontend/src`.
2. **Color Hex Synchronization:**
   - Define `#BACKGROUND` (e.g., `#050505` for deep obsidian, `#090d16` for midnight navy, or `#f4f3ec` for warm paper).
   - Lock this hex code across all subsequent prompts, CSS variables, and canvas clearing logic.

**Output:**
```yaml
canvas_intake:
  product_name: "Name of product"
  canvas_background_hex: "#090d16"
  container_height_vh: 400
  target_fps: 30
  frame_count_target: 120
  aspect_ratio: "16:9"
```

---

## Milestone 2 — Visual Generation & Prompt Pack Tailoring
**Input:** Product details and `#BACKGROUND` hex from Milestone 1.

**Actions:**
1. The agent dynamically generates tailored prompts for the user to run in Google Flow / Midjourney / Runway:
   - **Prompt A (Hero Image):** 16:9, centered, locked camera, studio lighting, exact `#BACKGROUND`.
   - **Prompt B (Exploded End Frame):** Image-to-image edit preserving camera, scale, lighting, pulling parts apart calmly.
   - **Prompt C (Image-to-Video):** Start frame = assembled, end frame = exploded, locked camera, zero zoom, 5 seconds.
2. User provides the video file (`product_explosion.mp4`) or frame ZIP.

**Output:**
```yaml
prompt_pack_manifest:
  prompt_a_hero: "Hyper-realistic studio photograph of [PRODUCT], centered and floating, on a perfectly flat seamless #090d16 background with no gradient and no floor line. Soft rim lighting, realistic textures, gentle shadow. 16:9. No text."
  prompt_b_exploded: "This is an image edit, not a new image. Take the uploaded [PRODUCT] and separate it into a clean exploded blueprint diagram, while keeping everything else identical. Same camera angle, same scale, same #090d16 background. Float components evenly with soft shadows."
  prompt_c_animation: "Cinematic product animation. [PRODUCT] starts fully assembled and smoothly eases apart into a floating exploded diagram. Locked camera, no pan, no zoom, no camera shake. Flat #090d16 background the whole duration. 5 seconds, 30fps."
```

---

## Milestone 3 — Automated Frame Extraction & WebP Optimization
**Input:** `product_explosion.mp4` dropped into `backend/assets/` or `frontend/public/raw_video.mp4`.

**Actions (Automated by Agent via FFmpeg / Node):**
Instead of manually using web converters like ezgif, the agent automates frame extraction directly on Windows via FFmpeg:
1. Create directory `frontend/public/frames/product/`.
2. Execute extraction script:
   ```powershell
   ffmpeg -i input.mp4 -vf "fps=30,scale=1920:1080:force_original_aspect_ratio=decrease" -q:v 2 frontend/public/frames/product/frame_%04d.jpg
   ```
3. (Optional) Batch-convert frames to WebP to reduce total asset size from 40MB down to <8MB:
   ```powershell
   ffmpeg -i input.mp4 -vf "fps=30" -c:v libwebp -quality 80 frontend/public/frames/product/frame_%04d.webp
   ```

**Output:**
```yaml
frame_assets:
  output_directory: "frontend/public/frames/product/"
  naming_pattern: "frame_%04d.webp"
  total_frames: 150
  average_frame_size_kb: 45
  total_payload_mb: 6.75
```

---

## Milestone 4 — React ScrollCanvas Engine Implementation
**Input:** Frame assets directory and canvas settings.

**Actions:**
1. Scaffold `frontend/src/components/ScrollCanvas.tsx`.
2. Implement 3 core engineering mechanisms:
   - **Asynchronous Preloading Cache:** Instantiates `new Image()` for all 150 frames on component mount, tracking load progress with a subtle loading bar.
   - **Sticky Viewport Scaffolding:** Outer container pinned to `h-[400vh]`, inner viewport pinned to `sticky top-0 h-screen w-full`.
   - **Lerp (Linear Interpolation) Scroll Loop:**
     ```ts
     currentFrame += (targetFrame - currentFrame) * 0.12;
     ```
     Guarantees buttery 60fps rendering even under aggressive touch/wheel scrolling.
   - **Exact Hex Background Fill:** `ctx.fillStyle = '#090d16'` on every canvas redraw to ensure seamless blending.

**Output:**
```yaml
component_architecture:
  file_path: "frontend/src/components/ScrollCanvas.tsx"
  props:
    frame_count: 150
    frame_path_generator: "(index: number) => `/frames/product/frame_${String(index).padStart(4, '0')}.webp`"
    bg_color: "#090d16"
    lerp_factor: 0.12
  performance_mechanisms:
    - "Offscreen canvas buffering"
    - "Passive scroll event listener"
    - "requestAnimationFrame rendering loop"
```

---

## Milestone 5 — Synchronized Narrative Text Overlays
**Input:** Key architectural benefits and product specs.

**Actions:**
Bind narrative callouts to specific scroll milestone brackets:
- **0% – 20% Scroll:** *The Assembled Product.* Hero headline & value proposition fade in.
- **25% – 50% Scroll:** *Core Engine Exposed.* Callout pointing to the custom AI architecture or core module.
- **55% – 80% Scroll:** *Security & Realtime Layer.* Specs, sub-millisecond latency badge, and database capabilities.
- **85% – 100% Scroll:** *Re-assembled CTA.* Launch button and live demo trigger.

**Output:**
```yaml
narrative_milestones:
  - scroll_range: [0.0, 0.20]
    headline: "Uncompromising Performance"
    subtext: "The complete full-stack engine built for speed."
    alignment: "center"
  - scroll_range: [0.30, 0.50]
    headline: "Modular Core Architecture"
    subtext: "Every layer isolated, auditable, and extensible."
    alignment: "left"
  - scroll_range: [0.60, 0.80]
    headline: "Local-First Realtime Engine"
    subtext: "Powered by PocketBase with instant SQLite SSE sync."
    alignment: "right"
  - scroll_range: [0.85, 1.00]
    headline: "Ready for Launch"
    cta_button: "Experience Live Demo"
    alignment: "center"
```

---

## Milestone 6 — Graphify Update & Performance Verification
**Input:** Completed component and assets.

**Actions:**
1. **Performance Check:**
   - Verify memory consumption during 5 minutes of continuous scrolling remains flat (<120MB heap).
   - Ensure canvas redraw takes <12ms per animation frame on standard hardware.
2. **Graphify Update Phase:**
   - Run `graphify update .` to log the new component relations and UI tree.

---

## Security, Guardrails & TDD Validation

### 1. Guardrails
```yaml
guardrails:
  max_payload_cap: "Total frame directory must not exceed 15MB to prevent slow venue loading"
  memory_safety: "Image cache must be dereferenced on component unmount to prevent leaks"
  frame_aspect_ratio: "Canvas must letterbox/contain gracefully across mobile and desktop without distortion"
```

### 2. TDD & Security Verification
- [ ] **Frame Index Bounds Test:** Assert scroll progress `< 0` clamps to `frame_0001` and `> 1` clamps to last frame.
- [ ] **Memory Leak Test:** Mount and unmount `<ScrollCanvas />` 10 times in Vitest; assert heap memory stabilizes.
- [ ] **STRIDE Denial of Service Check:** Ensure malformed frame paths fall back to the last successfully drawn frame rather than crashing the rendering loop with blank canvas.
