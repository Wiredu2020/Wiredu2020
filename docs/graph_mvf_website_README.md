# Topology-Supervised Multivector Incidence Routing — Interactive Website Demo

## Purpose
Create a standalone, responsive, interactive demonstration of **Topology-Supervised Multivector Incidence Routing for Graph Neural Networks**, based on the manuscript by Donald Woukeng and Bright Wiredu Nuakoh. Embed this demo in Bright Wiredu's existing Jekyll / al-folio portfolio as a **new project page**. Do not overwrite the existing `/projects/1_project/` robotics page.

The demo's principal goal is to let readers *see and manipulate* the three mechanisms: (1) trainable vertex–edge incidence scoring, (2) hard generalized multivector block construction and feedback, and (3) soft edge-cell transport conditioned by predicted bridge/cycle events. Explain how they feed a local GINE backbone and graph-level readout. The website must not pretend that illustrative sliders represent actual fitted neural weights.

## Research fidelity: model definition

1. Input: finite undirected simple graph `G=(V,E)` with vertex and edge features; graph face poset `X(G)=V ⊔ E`, whose nontrivial order relations are vertex–incident-edge pairs.
2. Local backbone: a residual GINE-type neural layer produces intermediate node representations `h_tilde[v]` and structural incidence messages. In the interactive teaching mode, explicitly label any simple weighted-average proxy as a **visual analogy**, not an exact GINE computation.
3. Incidence routing: each oriented incidence `(v,e)` can receive its own sigmoid score `a[v,e]`, despite undirected edges. Symmetrize suitably for undirected message computations. An edge priority `s[e]` may derive from neural scores or edge-event probabilities depending on mode.
4. Hard multivector partition: at each vertex select the highest-priority incident edge(s), **retaining all exact ties**. Form a bipartite graph with vertex-cells and edge-cells, connected only by selected incidence links; connected components partition **all cells** in `X(G)`, including singleton unselected edge-cells and isolated vertex-cells. This is a generalized combinatorial multivector field on the one-dimensional face poset. Recompute from the current priorities. This discrete step is **stop-gradient**.
5. Hard block signal: for each block `B`, pool updated vertex embeddings `h_B`, weighted edge-cell embeddings `z_B`, and include `log(1+|B∩V|)` and `log(1+|B∩E|)` in the block feature. Broadcast the computed block embedding to its member vertices as a learned residual with a gated amplitude. In teaching mode, show a transparent schematic block average and the two cardinalities; clarify this is not the fitted `phi/psi` mapping.
6. Soft transport: use continuous incidence weights `p[v,e]` and edge priority `q[e]`, first accumulating vertex information into edge-cell states `t[e](q)`, then transporting it back to vertices `T[v](q)`, with normalized weighted sums. Animate **vertex → edge cell → vertex**, not only ordinary vertex-to-vertex edges.
7. Auxiliary edge events: an edge-event head predicts `π[e] = (π_cycle[e], π_bridge[e])`; it is trained on bridge-versus-cycle labels on training graphs only. A bridge's removal increases connected components; nonbridge edges belong to a cycle. Predicted event probabilities support **two soft transports** and **two hard multivector partitions** (cycle and bridge). The training objective is `L = L_graph + 0.2 L_event` in the reported experiment. **Never use oracle bridge labels as test-time model features.**
8. Output: updated node states, invariant graph readout, graph-class prediction; show edge-event probabilities separately from graph classification.

## MVP page sections

- Title, two authors, plain-language abstract, one graphic, links to paper/code if actually available, citation block only after bibliographic details are verified.
- Interactive graph workspace and adjacent explanatory panel. Graph visualization in SVG using a lightweight dependency (or pure JS); no backend required for the first version.
- Stage indicator: `Input Graph → GINE + Incidence Scores → Event Head → Hard/Soft Routing → Block Feedback → Graph Readout`.
- Mode control: `GINE baseline`, `Hard MVF`, `Soft incidence transport`, `Hard + soft`, `Topology-supervised event-MVF`. Clearly distinguish **teaching simulation** from **real trained-model inference**.
- Transport/control: Play, Pause, Next step, Previous step, Reset, playback speed; keyboard accessible.
- Graph presets: `single cycle`, `two disconnected cycles`, `two cycles joined by a bridge`, `tree`, `small molecular-like graph`; a user may add/remove vertices/edges with basic safeguards. Include the paper's `C24` and `C12 ⊔ C12` controlled example to demonstrate identical local constant-feature states but different block cardinalities.
- Sliders or editable numeric fields for per-incidence/per-edge **illustrative scores**, color legend, labels and tooltip per cell; highlight exact tie handling and singleton blocks.
- Side-by-side view of cycle-conditioned and bridge-conditioned partitions. Toggle selected-incidence links, connected cell blocks, and moving message dots.
- Click a node/edge/block to show a readable details panel (current values, membership, scores, counts, probabilities and stage equations).
- Collapsible 'How the method works', 'What is real vs illustrated?', 'Experiments', 'Limitations', 'References' sections.

## Important scientific caveats

- Do not imply the top-1 and connected-component decisions are differentiable. Their memberships are discrete; gradients flow through continuous cell embeddings, scoring and transport-related computations as specified by the implementation.
- Do not claim that a partition must coincide with true cycle components or that edge-event classification guarantees better graph classification.
- Do not equate edge-event labels with the model's predicted probabilities. For preset graphs, ground-truth bridge/cycle labels may be displayed as an **optional educational overlay**, not used as model inference inputs.
- Do not present simulated output confidence as measured model predictions. To support authentic inference later, use exported trained weights and a faithful browser-compatible runtime, or a separate secured inference API, after validating numerical agreement with Python model outputs.
- Report experimental numbers in separately labeled cohorts; never conflate: connectivity C24 vs C12⊔C12 (GINE 50.00%, MVF feedback 88.89% balanced accuracy); cycle-conditioned BZR (GINE 70.62%, learned hard+soft 75.76%); common topology-supervision cohort (BZR 72.55%, COX2 68.72%, DHFR 76.18% for topology-supervised MVF). Mention relevant shuffled/uniform controls and avoid superiority claims across cohorts.

## Technical implementation requirements

1. Open and inspect the website repository first, including `AGENTS.md`, `.github/copilot-instructions.md`, `_config.yml`, `_projects/`, `_pages/`, assets, and the current `1_project` entry. Respect al-folio's own routing, front matter, project grid and plugin/asset boundaries.
2. Add a **new** project entry, with correct Jekyll front matter. Do not rename existing project routes or edit unrelated pages. Prefer a clean dedicated route like `/projects/multivector-incidence-routing/`, using the site's existing permalink/baseurl conventions.
3. Keep demo logic in maintainable, modular JS, styles in a dedicated scoped stylesheet, and optionally SVG assets in the existing assets convention. Avoid large dependencies unless already present. Do not add a new site-wide runtime or override theme behavior just to support the demo.
4. Use `relative_url`/`site.baseurl` for local asset URLs so GitHub Pages works under `/Wiredu2020` and local preview. Avoid hard-coded domain-relative `/assets/...` paths.
5. Ensure accessible labels, contrast, keyboard navigability, and reduced-motion support (`prefers-reduced-motion`). Pause animation when offscreen/hidden where feasible; provide static explanations when JavaScript is disabled.
6. No live API keys, user-uploaded arbitrary code execution, or direct Python evaluation inside the public page.
7. If you implement actual trained inference, first obtain authorized trained model weights, feature preprocessing, and a test vector from the researchers. Do not invent a predictive model.

## Suggested interaction stages

**Stage 0 — Graph:** draw `G`, vertex and edge features, undirected adjacency.

**Stage 1 — Local backbone:** illustrate neighborhood message aggregation; annotate as schematic if not computing GINE.

**Stage 2 — Incidences:** split each graph edge into its two `(vertex, edge-cell)` incidences and display their independently adjustable scores.

**Stage 3 — Edge-event head:** display cycle/bridge probability fields (demo values explicitly synthetic until model outputs are loaded).

**Stage 4 — Hard partitions:** select top-scoring incident edge(s) at each vertex, preserve ties, compute connected components of the full bipartite incidence graph; show colored blocks and count features.

**Stage 5 — Soft transport:** animate node → edge-cell → node with weighted normalized flow, separately for cycle and bridge priorities.

**Stage 6 — Feedback:** broadcast each block's representation to member vertices, combine with local backbone and soft transport; show before/after state visualization.

**Stage 7 — Readout:** graph-level aggregation and schematic output; distinguish demonstration output from validated trained predictions.

## Tests and acceptance criteria

- Existing robotics page remains intact.
- Demo page is reachable using the project's configured GitHub Pages baseurl and links from the project's list.
- Creating a simple triangle selects all incidences under uniform tied priorities; the resulting face-poset partition has a single six-cell block.
- On a three-node path, the two edge cells and three vertices form one block when all incidences are tied and selected; display both edges as true bridges in *ground truth overlay*.
- Under a priority pattern with unselected endpoint incidences, isolated edge-cells are retained as singleton blocks.
- An isolated vertex is included as a singleton block.
- Permuting node labels without changing structure and scores permutes block membership consistently.
- C24 versus C12 ⊔ C12, with constant features and uniform priorities, gives blocks with `(24 vertices, 24 edges)` versus two blocks with `(12,12)`; do not promise an actual trained classifier if not loaded.
- Score controls recompute partitions deterministically and reset restores preset defaults.
- All animation controls function on desktop and mobile; reduced-motion accessibility works.
- Inspect browser console for errors, run existing repository formatting/lint/build checks, and document exact test commands and any limitations.

## README deliverables Codex should update in repo

- A project-specific `README.md` stored alongside demo source or as `docs/multivector-routing-demo.md`, stating purpose, technical components, graph algorithms, illustrative-vs-trained distinction, testing, development instructions, citation and screenshots.
- Short project page explanation linking to the demo and paper (when available).
- A concise changelog of files modified, commands executed, and known gaps.

## Rollout order

1. Inspect repository and plan paths consistent with theme.
2. Create project page and educational interactive demo, verify static site build.
3. Polish scientific explanations, mathematical annotations, diagrams and mobile behavior.
4. Only after appropriate weights and test vectors are provided, add validated real-model inference as a distinct selectable mode.
