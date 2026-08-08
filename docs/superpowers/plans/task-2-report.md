# Task 2 Report

## What changed

- Replaced the former circular `.map-orb` block inside `section#map` with the requested four-part map system:
  - `.map-board`: clipped ancient-paper observation board, paper grain, coordinate grid, and corner marks.
  - `.map-astrolabe`: three independently rotating copper rings for 山经、海经、荒经.
  - `.map-terrain`: original inline SVG mountain ridges, paired sea lines, river, cloud forms, and four observation routes.
  - `.map-legend`: layered observation desk showing live status, `mapLabel` location, specimen number/name, rank, element, note, and archive-index action.
- Preserved all four `.map-region[data-beast]` buttons and their `yinglong` / `bailu` / `jingwei` / `kuiniu` bindings. Each remains a native `<button>` with a readable label, focus styling, and `aria-pressed` state.
- Added copper-ring, terrain-line, active-route, paper-texture, focus, red-seal diffusion, and staggered observation-desk styles. The active board state selects the matching SVG route through `data-active-beast`.
- Added mobile behavior at 780px and a dedicated 430px breakpoint covering the required 390px layout. The map remains before the desk in DOM/grid order, and node targets remain 48px square.
- Retained the global `prefers-reduced-motion: reduce` rule, which disables ring rotation, route flow, seal diffusion, desk reveal, transitions, and smooth scrolling.
- Added `syncMapState(id)` in `js/app.js`. It:
  - sets `mapBoard.dataset.activeBeast`;
  - makes exactly one map node `.active`;
  - synchronizes every node's `aria-pressed` value;
  - writes `beasts[id].mapLabel` to the desk;
  - restarts the short desk reveal sequence.
- Changed map-node clicks to call `setSpecimen(id, false)`, so selecting a map node does not force the user back to the hero.
- Preserved record-card switching, specimen image/field updates, the record dialog, audio control, and the “查看档案索引” smooth-scroll action to `.record-rail`.

## Test commands and results

1. Baseline syntax:
   - `node --check js/app.js`
   - Result: **PASS** before implementation.

2. TDD red source-contract check (Node assertions for `.map-board`, `.map-astrolabe`, `.map-terrain`, `.map-legend`, `syncMapState`, and non-scrolling map clicks):
   - Result before implementation: **FAIL as expected** at `map board must own the active beast state`.

3. Green source-contract check (Node assertions over `index.html`, `js/app.js`, `css/sections.css`, and `css/responsive.css`):
   - Verified four layers, four map buttons, four routes, all eight retained `data-beast` bindings across cards/map, `syncMapState`, `aria-pressed`, `mapLabel`, `setSpecimen(..., false)`, smooth index scrolling, 52px desktop targets, 48px small-screen targets, and reduced-motion coverage.
   - Result: **PASS** (`Task 2 source contract passed: 4 layers, 4 nodes, 4 routes, state sync, mobile and reduced motion`).

4. `syncMapState` behavior test using the actual function body with real `beasts` data and lightweight DOM objects:
   - Called `syncMapState('jingwei')`.
   - Verified `data-active-beast="jingwei"`, only 精卫 `.active`, only 精卫 `aria-pressed="true"`, and desk label `东海·发鸠`.
   - Verified an unknown id leaves the prior valid state unchanged.
   - Result: **PASS**.

5. HTML semantic check using Python's `html.parser`:
   - Verified unique IDs, exactly four native map buttons, the exact four beast bindings, and exactly one initial pressed state.
   - Result: **PASS**.

6. JavaScript syntax checks:
   - `node --check js/app.js`
   - `node --check js/data.js`
   - `node --check js/audio.js`
   - Result: **PASS** for all files.

7. CSS structural check:
   - Node brace-balance assertions for `css/sections.css` and `css/responsive.css`.
   - Result: **PASS**.

8. Source self-review searches:
   - Confirmed the legacy `.map-orb` / `.map-key` selectors and markup are gone.
   - Confirmed existing `.record-rail`, card handlers, `record-dialog`, `open-record`, and `close-record` handlers remain.

## Files changed

- `E:\Mountain and Sea\index.html`
- `E:\Mountain and Sea\css\sections.css`
- `E:\Mountain and Sea\css\responsive.css`
- `E:\Mountain and Sea\js\app.js`
- `E:\Mountain and Sea\docs\superpowers\plans\task-2-report.md`

## Self-review

- Scope stayed within Task 2 production files plus this required report; no framework, map SDK, video, or texture asset was added.
- `js/data.js` remains the only beast data source, and the new desk consumes the Task 1 `mapLabel` fields rather than duplicating runtime data.
- `section#map`, four native buttons, all `data-beast` values, cards, dialog, image switching, audio, and smooth index navigation remain in place.
- Desktop map targets are 52px and the 390px path uses 48px targets. DOM order guarantees map-above-desk on the single-column mobile grid.
- Native buttons provide Tab focus and Enter/Space activation without custom keyboard code; visible `:focus-visible` styling was added.
- The shared reduced-motion rule uses `animation: none !important`, `transition: none !important`, and `scroll-behavior: auto !important`, covering every new animated map/desk element.
- `E:\Mountain and Sea` has no `.git` repository. Per instruction, Git was not initialized and no commit was attempted.

## Concerns / unperformed verification

- The in-app browser automation interface required by the available browser skill (`node_repl` JavaScript control) was not exposed in this agent session. Therefore I could not perform a rendered 390px screenshot check, live Tab + Enter sequence, or computed-style reduced-motion inspection in a real browser.
- Static, semantic, syntax, and isolated behavior tests passed, but final visual overlap/touch behavior should still be spot-checked in a browser at 390px because that rendered verification could not be executed here.

## Review follow-up: reduced-motion scrolling

- Fixed the Important review finding in `js/app.js` by adding `getScrollBehavior()`, which checks `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and returns `auto` for reduced motion or `smooth` otherwise.
- Routed both existing scroll sites through the helper: the optional archive scroll in `setSpecimen()` and the “查看档案索引” scroll to `.record-rail`. No other behavior changed.
- TDD red: the source contract failed before the fix because no reduced-motion query existed and both calls hard-coded `behavior: 'smooth'`.
- Green verification:
  - `node --check js/app.js`: **PASS**.
  - Node source assertions verified there are exactly two `scrollIntoView` calls using `getScrollBehavior()` and no hard-coded smooth scroll call remains: **PASS**.
  - Isolated execution of the actual helper verified reduced motion returns `auto` and the default returns `smooth`: **PASS**.

## Incremental map refinement

- Updated each `.map-region` so its resting/active appearance shows only the numeric seal. Hover and keyboard focus now reveal a compact three-line dossier containing `NO.`, location, and beast name; the dossier is not forced open by `.active`.
- Added a dedicated `.map-scan` layer and `triggerMapScan()`. Every map-node click restarts one short, low-opacity scan pass before invoking the unchanged `setSpecimen(region.dataset.beast, false)` flow.
- Kept active route selection driven by `data-active-beast` and added a subdued ink-wash area halo around the selected node.
- Preserved the `LIVE OBSERVATION` desk structure while making its labels explicit: `OBSERVATION SITE`, `SPECIMEN`, `ARCHIVE NO`, `RISK LEVEL`, and `ABILITY`.
- Renamed the desk action to “调取异兽档案 →”; it still targets the existing `.record-rail` and continues to honor reduced-motion scrolling.
- Enriched the existing original SVG terrain with low-opacity cartographic texture, ink-wash stains, mountain/river emphasis, and very light pointer parallax. No particles, radar UI, map SDK, external texture, or new data binding was introduced.
- Added a reduced-motion override that fixes the new terrain/ink layers in place in addition to disabling their animations/transitions.

### Incremental verification

- TDD red: the initial contract failed because no `.map-node-tooltip` elements existed.
- `node --check js/app.js`: **PASS**.
- Node source/structure assertions verified:
  - four node dossiers with `NO.`, location, and beast name;
  - a `.map-scan` layer and click-only `triggerMapScan()` call;
  - unchanged non-scrolling map specimen selection;
  - all five requested observation-desk labels and the renamed action;
  - hover/focus-only dossier visibility, selected-region halo, scan keyframes, restrained parallax, reduced-motion parallax reset, and balanced CSS braces.
- Result: **PASS** (`Incremental map polish PASS`).
- Files changed in this increment: `index.html`, `css/sections.css`, `css/responsive.css`, `js/app.js`, and this report. Hero markup, record-card markup, `js/data.js`, and specimen/dialog bindings were not changed.
