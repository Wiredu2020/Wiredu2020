# Multivector incidence routing demo

A browser-only teaching workspace for **Topology-Supervised Multivector Incidence Routing for Graph Neural Networks**, by Donald Woukeng and Bright Wiredu Nuakoh.

## Files and architecture

- `_projects/multivector-incidence-routing.md`: al-folio project entry, GIF, workspace, scientific explanations and experiment cohorts.
- `assets/css/graph-mvf.css`: styles scoped to the workspace; mobile layout and reduced-motion rules.
- `assets/js/graph-mvf/model.mjs`: pure graph algorithms and scalar teaching engine.
- `assets/js/graph-mvf/demo.mjs`: SVG rendering, inspector, input validation, editing and playback.
- `test/graph-mvf.test.mjs`: algorithm acceptance cases.
- `test/graph-mvf-server.cjs`, `test/graph-mvf.playwright.cjs`, `test/graph-mvf.interactions.cjs`: standalone browser checks.

There are no new public runtime dependencies, theme overrides, global build scripts, API keys or external services. The project collection automatically includes the new research entry. Existing project routes are unchanged. Asset references use `relative_url`; module imports are relative to the module URL.

## Mathematics and teaching choices

The locally supplied manuscript was read with PDF.js, including Sections 3.1–3.5 and experimental tables. Its exact title and authors were confirmed. No publication year, DOI or venue is asserted. The manuscript is Git-ignored and contains draft annotations; the page therefore does not link to an undeployed PDF. Add a verified public paper URL when ready.

Hard construction follows equation (3.3): select all exactly maximal incident edge priorities at each vertex, build the bipartite cell-incidence graph, and compute its connected components. All vertex and edge cells, including isolated cells, occur in the partition. Membership is discrete and stop-gradient. Union-find implements the components; comparison uses exact equality, without an epsilon tie heuristic.

Endpoint scores are independently editable probabilities. Their arithmetic mean supplies symmetric illustrative edge priorities. Event mode uses synthetic cycle and bridge probabilities as two priorities; these values are never derived from ground-truth labels.

Soft transport follows normalized sums in (3.9–3.10) with epsilon `1e-8`, and replaces learned rho by the identity on the aggregated scalar. The edge priority participates in both normalization stages; zero priority gives zero transport. There is no differentiation engine in the browser. These continuous formulas illustrate the differentiable route of a trained implementation.

The local backbone is explicitly an input-plus-neighbor-mean **visual analogy**, not GINE. Scalar feedback displays pooled local states, mean weighted edge-cell values, and both log cardinalities. It averages these four coordinates instead of applying learned psi/phi, normalization and vector projections from (3.5–3.8). Two event-conditioned residuals are averaged schematically rather than passed through a learned concatenation projection. Mean pooling is an invariant graph summary. No graph-class probability or synthetic confidence is fabricated.

Ground-truth bridge labels are computed by endpoint reachability after edge deletion and displayed only on request. They are never passed to the simulation engine. Reduced motion suppresses moving SVG dots; manual stage stepping remains available. Hidden/offscreen workspaces pause playback.

## Local development and checks

From the repository root:

```sh
npm ci
node --test test/graph-mvf.test.mjs
npx prettier --check _projects/multivector-incidence-routing.md assets/css/graph-mvf.css assets/js/graph-mvf/*.mjs docs/multivector-routing-demo.md test/graph-mvf*.cjs test/graph-mvf.test.mjs
npx playwright test --config test/graph-mvf.playwright.cjs
npm run lint:style-contract
bundle exec jekyll build --baseurl /Wiredu2020
```

The standalone browser harness substitutes only local asset `relative_url` expressions; it does **not** compile Liquid/Markdown or load the al-folio theme. A successful browser run does not replace the Jekyll build and final theme review. It serves at `http://127.0.0.1:4190/Wiredu2020/projects/multivector-incidence-routing/`. The config uses installed Chrome on Windows; set `MVF_CHROME` to another Chrome/Chromium executable when needed.

The browser checks cover presets, mode switches, editor safeguards, deterministic reset, synthetic scores, overlay isolation, keyboard inspection, animation controls, mobile overflow and reduced-motion behavior. Screenshots from successful runs are stored in `output/playwright/mvf-desktop.png` and `output/playwright/mvf-mobile.png` (ignored local review artifacts).

## Trained inference integration

`TeachingEngine.run(graph, mode, gate)` defines a small synchronous teaching adapter. To integrate inference, introduce a separate validated adapter and visibly distinct trained mode. Obtain authorized weights, vector feature schema, preprocessing, class names and representative Python test vectors first. Match intermediate incidence/event values, cell transport, memberships, feedback and logits numerically. Keep ground-truth edge labels outside inference inputs. A browser-compatible model runtime or secured API may then supply authentic predictions. Do not silently substitute those predictions for teaching values.

## Deployment review

No commits, pushes or publication are performed by this implementation. Before committing, review the project and assets, run Jekyll with the configured baseurl, and verify the project card, GIF, module MIME types and dark/light styling in the actual theme. The existing deployment workflow builds on GitHub using Ruby 3.3.5 and Node 24. A user push to its configured branch can publish automatically.

Current environment limitations: Ruby/Bundler are absent, so Jekyll cannot be built locally. The existing starter style contract fails because `_sass` is present; this directory is unchanged by the demo. Full-site lint may report existing formatting problems. See the final implementation report for exact successful checks.

## Validation record — 30 October 2026

- `npm ci --ignore-scripts`: passed; locked tooling installed, lockfile unchanged.
- `node --check assets/js/graph-mvf/demo.mjs` and `node --check assets/js/graph-mvf/model.mjs`: passed.
- `node --test test/graph-mvf.test.mjs`: **8 passed** (ties, full-cell coverage, bridges, singleton cells, connectivity example, relabeling/storage order, zero-weight normalization and overlay independence).
- Targeted Prettier command above: passed for all added/modified project files.
- `npx playwright test --config test/graph-mvf.playwright.cjs --workers 1`: **4 passed**, desktop and mobile including reduced motion. No browser page errors. Checked GIF loading, visible CSS borders, viewport width, controls, inspection, score reset and screenshots. The harness performs limited heading/link formatting as well as asset substitutions; it does not provide the al-folio theme.
- `npm run lint:prettier`: existing formatting warnings in **113 unrelated files**; none reformatted.
- `node test/style_contract.js`: existing `_sass` ownership violation; directory unchanged.
- `bundle exec jekyll build --baseurl /Wiredu2020`: blocked, Bundler is not installed. Ruby-dependent integration and theme visual regression checks remain unrun.

The GIF is hidden on this page under reduced motion; its separate link remains available for intentional viewing. The scoped CSS includes PurgeCSS ignore directives to preserve dynamically created SVG cell styles under the existing deployment optimizer. There are no theme-owned overrides requiring an override audit.

Changes made: expanded the previously created project page, added two JS modules and a scoped stylesheet, this implementation document, and four dedicated test/harness files. The existing GIF is reused. No unrelated project, deployment configuration or lockfile changed.
