---
layout: page
title: Topology-Supervised Multivector Incidence Routing for Graph Neural Networks
description: Exploring topology-supervised incidence routing and multivector message passing in graph neural networks.
img: assets/img/GraphML/multivector_message_passing.gif
# permalink: /projects/multivector-incidence-routing/
importance: 6
category: research
related_publications: false
---

**Donald Woukeng and Bright Wiredu Nuakoh**

## Multivector message passing

<figure class="mv-project-animation">
  <img
    src="{{ '/assets/img/GraphML/multivector_message_passing.gif' | relative_url }}"
    alt="Animated illustration of multivector message passing on a graph."
    class="img-fluid rounded"
    style="max-width: 100%; height: auto;"
    loading="lazy"
  >
  <figcaption class="caption">Illustrative multivector message-passing animation. This visualization does not show predictions from a trained model.</figcaption>
</figure>

[Open the animation]({{ '/assets/img/GraphML/multivector_message_passing.gif' | relative_url }}) to view it separately.

<link rel="stylesheet" href="{{ '/assets/css/graph-mvf.css' | relative_url }}">

Explore how local graph representations interact with hard multivector blocks and continuous incidence transport. This educational workspace exposes the routing decisions so you can inspect what changes when priorities, features, or graph structure change.

<div id="graph-mvf">
  <p class="mv-notice"><strong>Teaching simulation — no trained model loaded.</strong> All scores and event probabilities are synthetic controls. Displayed embeddings use transparent scalar analogies, not fitted GINE or neural feedback maps.</p>
  <noscript>This workspace needs JavaScript. Hard partitions select all maximal incident edges, retain exact ties, and partition vertex-cells and edge-cells by connected components. Soft transport instead uses continuous weighted sums through edge-cells. The animation above is available without JavaScript.</noscript>
  <div class="mv-controls">
    <label>Example graph<select data-mv="preset"></select></label>
    <label>Learning mechanism<select data-mv="mode"></select></label>
    <label>Residual amplitude<input data-mv="gate" type="range" min="0" max="1" step="0.05" value="0.3"></label>
  </div>
  <div class="mv-controls">
    <button type="button" data-mv="previous">Previous step</button>
    <button type="button" data-mv="play">Play</button>
    <button type="button" data-mv="next">Next step</button>
    <button type="button" data-mv="reset">Reset graph</button>
    <label>Step duration<select data-mv="speed"><option value="3000">Slow (3 s)</option><option value="1800" selected>Normal (1.8 s)</option><option value="800">Fast (0.8 s)</option></select></label>
  </div>
  <p class="mv-stage" data-mv="stage" aria-live="polite"></p>
  <div class="mv-workspace">
    <div>
      <svg data-mv="graph" viewBox="0 0 440 390" role="group" aria-label="Interactive graph; focus a cell and press Enter to inspect it"></svg>
      <p>Circle = vertex · square = edge-cell · thick half-edge = selected incidence · color = block membership · amber dot = transport direction. Colors repeat for large partitions; inspect cells for exact membership.</p>
    </div>
    <aside class="mv-detail" aria-label="Stage explanation and cell inspector">
      <p data-mv="equation" class="mv-equation"></p>
      <p data-mv="explanation"></p>
      <hr>
      <div data-mv="details" aria-live="polite"></div>
    </aside>
  </div>
  <div class="mv-controls">
    <label><input type="checkbox" data-mv="links" checked>Selected incidence links</label>
    <label><input type="checkbox" data-mv="blocks" checked>Block colors</label>
    <label><input type="checkbox" data-mv="dots" checked>Message dots</label>
    <label><input type="checkbox" data-mv="oracle">Ground-truth bridge overlay (orange)</label>
  </div>
  <p data-mv="readout" class="mv-summary" aria-live="polite"></p>
  <p data-mv="block-summary"></p>
  <h3>Edit the graph</h3>
  <div class="mv-controls">
    <button type="button" data-mv="add-node">Add vertex</button>
    <label>Vertex<select data-mv="remove-node"></select></label><button type="button" data-mv="delete-node">Remove vertex</button>
    <label>From<select data-mv="from"></select></label><label>To<select data-mv="to"></select></label>
    <button type="button" data-mv="toggle-edge">Add / remove edge</button>
  </div>
  <p data-mv="error" role="status"></p>
  <details><summary>Vertex input features</summary><div class="mv-controls" data-mv="features"></div></details>
  <details open><summary>Illustrative incidence weights and event probabilities</summary>
    <p>Values range from 0 to 1. Bridge probability is one minus cycle probability. Defaults are uniformly tied; changes recompute deterministically. Ground-truth labels never change these values.</p>
    <div class="mv-table"><table><thead><tr><th>Edge</th><th>First endpoint weight</th><th>Second endpoint weight</th><th>Cycle probability</th></tr></thead><tbody data-mv="scores"></tbody></table></div>
  </details>
  <h3>Compare topology-conditioned hard partitions</h3>
  <p>Both views use the same graph. Left priorities are synthetic cycle probabilities; right priorities are synthetic bridge probabilities. Uniform probabilities select every incidence, including all ties. A partition need not match true cycle components.</p>
  <div class="mv-comparison">
    <div><h4>Cycle-conditioned</h4><svg data-mv="cycle-graph" viewBox="0 0 440 390" role="group" aria-label="Cycle-conditioned partition"></svg></div>
    <div><h4>Bridge-conditioned</h4><svg data-mv="bridge-graph" viewBox="0 0 440 390" role="group" aria-label="Bridge-conditioned partition"></svg></div>
  </div>
  <details><summary>How the method works</summary>
    <p>Input graph → local residual GINE backbone → endpoint-conditioned sigmoid incidence scores → auxiliary cycle/bridge event head → hard partition and continuous transport branches → gated multivector feedback → invariant graph pooling and a classification head.</p>
    <p>Hard membership uses top-priority incidence selections and connected components on the full face poset. Exact ties are retained. Membership is discrete and stop-gradient; continuous embeddings inside a fixed block can still receive gradients. Soft transport has no top-1 selection and can carry gradients through continuous weights. The browser computes forward teaching values; it does not train or differentiate a model.</p>
    <p>Try C24 and C12 + C12 with uniform priorities and constant features: the local analogy gives identical states, but blocks have cardinalities (24,24) versus two blocks of (12,12). Cardinality features reveal a distinction; no classifier prediction is implied.</p>
  </details>
  <details><summary>What is real vs illustrated?</summary>
    <p>Graph editing, exact-tie partitioning, cell counts and the optional bridge overlay are computed algorithms. Scores, event probabilities, local scalar states, transport and block feedback are educational quantities. No trained graph or edge-event predictions are available. The GIF is illustrative.</p>
  </details>
  <details><summary>Experiments</summary>
    <p>The supplied specification reports separate cohorts: connectivity C24 vs C12 + C12, GINE 50.00% and MVF feedback 88.89% balanced accuracy; cycle-conditioned BZR, GINE 70.62% and learned hard + soft 75.76%; common topology-supervision cohort, BZR 72.55%, COX2 68.72%, DHFR 76.18%. These are reported study results, not outputs of this demo. Shuffled and uniform controls are relevant comparisons; results across cohorts do not establish superiority.</p>
  </details>
  <details><summary>Limitations</summary>
    <p>Scalar analogies omit learned vector maps and training. Graphs are limited to 30 vertices and 60 simple undirected edges. Ground-truth bridge detection is solely an educational overlay. Event classification does not guarantee better graph classification. The learned maps and trained-model numerical agreement must be validated before inference is integrated.</p>
  </details>
  <details><summary>References and implementation</summary>
    <p>Donald Woukeng and Bright Wiredu Nuakoh, <em>Topology-Supervised Multivector Incidence Routing for Graph Neural Networks</em>. Publication venue, year, DOI and code release have not been verified; no formal bibliographic citation is asserted.</p>
    <p>The manuscript was supplied locally; a public paper link is not yet available. · Implementation notes are maintained in the repository at <code>docs/multivector-routing-demo.md</code>.</p>
  </details>
</div>
<script type="module" src="{{ '/assets/js/graph-mvf/demo.mjs' | relative_url }}"></script>
