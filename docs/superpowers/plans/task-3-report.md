# Task 3 Report

## Status

Implemented the archive volume library in the three files assigned by Task 3:

- `E:\Mountain and Sea\volumes.html`
- `E:\Mountain and Sea\css\library.css`
- `E:\Mountain and Sea\js\library.js`

The page uses native HTML, CSS, and ES modules only. It imports the shared `beasts` object from `js/data.js` and reuses `tokens.css`, `base.css`, and `components.css`.

## Implementation

- Added a semantic archive-library page with the existing bureau wordmark/navigation language, an archive heading, volume catalogue, result count, and footer.
- Added four URL-backed volume tabs with the exact values required by the brief:
  - `all` — 全部
  - `mountains` — 山经
  - `seas` — 海经
  - `wilderness` — 大荒经
- Implemented `normalizeVolume()` so missing, unknown, or otherwise invalid query values fall back to `all`.
- Implemented and exported `renderLibrary(volume)`, using the required expression:
  - `Object.entries(beasts).filter(([, beast]) => volume === 'all' || beast.volume === volume)`
- Rendered each result as one complete link to `specimen.html?id=<id>` with its local image, archive number, name, source, and observation place.
- Used DOM creation and `textContent` for record data. IDs are encoded with `encodeURIComponent()` before entering detail links.
- Added the exact empty-volume message “该卷册尚未开放观测”.
- Added active-tab `aria-current`, descriptive link labels, keyboard focus treatment, lazy/async image loading, an `aria-live` result grid, responsive layouts, and reduced-motion support.
- Continued the existing dark ancient-scroll, copper/gold rule, red-seal, and archive-catalogue visual language without altering the homepage.

## Verification and results

1. Baseline HTTP red check:
   - Requested `http://127.0.0.1:4173/volumes.html` before implementation.
   - Result: **404**, as expected.

2. JavaScript syntax:
   - Ran `node --check` against `js/app.js`, `js/audio.js`, `js/data.js`, and `js/library.js`.
   - Result: **PASS** for all four files.

3. Static source/data contract:
   - Confirmed all four stylesheet links (`tokens`, `base`, `components`, `library`).
   - Confirmed all four exact tab values.
   - Confirmed the required `Object.entries(...).filter(...)` expression, invalid-value fallback, encoded detail-link construction, and exact empty-state text.
   - Imported the real `beasts` data and verified the split: all = 4, mountains = 2, seas = 2, wilderness = 0.
   - Verified the seas names are exactly 精卫 and 夔牛; mountain entries are 赤羽应龙 and 白泽.
   - Verified `library.css` has balanced braces.
   - Result: **PASS**.

4. Local HTTP delivery:
   - Requested `volumes.html`, `css/library.css`, `js/library.js`, and `js/data.js` from the existing local server at port 4173.
   - Result: **200** for every resource.

5. Real headless-Chrome URL behavior over HTTP:
   - `/volumes.html` rendered 4 cards.
   - `?volume=seas` rendered 2 cards, linked only to `jingwei` and `kuiniu`, and contained neither mountain record.
   - `?volume=wilderness` rendered the exact empty state.
   - `?volume=unknown` fell back to 4 cards with the `all` tab active.
   - Result: **PASS**.

6. Responsive browser check:
   - Used Chrome DevTools device metrics to render the real HTTP page at a true 390 px viewport.
   - Verified `innerWidth = 390`, `scrollWidth = 390`, two sea cards rendered, and no element exceeded the viewport bounds.
   - Confirmed desktop and narrow-screen visual captures retain readable hierarchy and usable volume navigation.
   - Result: **PASS**.

## Scope audit

- Did not modify `index.html`, Hero, existing specimen cards, map markup/styles/behavior, `js/data.js`, or any existing production JavaScript.
- Did not add a framework, package, remote artwork, map SDK, or duplicate beast data.
- Confirmed `E:\Mountain and Sea\.git` is absent. Git was not initialized and no commit was attempted.

## Concerns

- `specimen.html` belongs to Task 4 and was not present while Task 3 was verified. The library emits the required detail URLs correctly; those destinations will resolve after Task 4 supplies the detail page.
- No Task 3 functional or layout defect remains from the checks above.
