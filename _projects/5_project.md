---
layout: page
title: Set-Based Flow Matching for Point-Cloud Generation
description: A permutation-equivariant flow-matching model that generates point sets of any size, with an ablation tying sample quality to pooling width
img: assets/img/point-flow-matching/real_vs_generated.png
importance: 3
category: research
related_publications: false
---

<p>Generative models over point clouds and graphs have to deal with two properties that generative models over images or text don't: the data has <strong>no canonical ordering</strong> (a point cloud is a <em>set</em>, invariant under permutation of its points), and it can have <strong>variable size</strong> (a shape can be represented with 16 points or 300). This project builds a minimal flow-matching model that respects both properties by construction, then empirically tests a theoretical prediction about the architecture's capacity.</p>

<h2>🧩 Method</h2>
<p>The velocity field follows the <a href="https://arxiv.org/abs/1703.06114" target="_blank" rel="noopener">DeepSets</a> template: a shared per-point MLP embeds every point (conditioned on flow-time and shape identity), a permutation-<strong>invariant</strong> mean-pool forms a global context vector, and a second shared MLP combines each point's embedding with that context to predict its velocity. Because the network is applied point-wise with a symmetric pooling step, it is permutation-<strong>equivariant</strong> and has no dependence on the number of points <code>N</code> in its parameter count &mdash; the same weights generate a set of 8 points or 800.</p>
<p>Training uses conditional flow matching (<a href="https://arxiv.org/abs/2210.02747" target="_blank" rel="noopener">Lipman et al., 2022</a>) with the linear interpolation path between Gaussian noise and data; sampling integrates the learned ODE with simple Euler steps.</p>

<h2>📊 Results</h2>
<p>Trained for 7000 steps (~4 minutes, CPU-only) on four synthetic 2D point-set shapes (circle, square, star, two-moons) with <code>N</code> uniformly random in <code>[16, 64]</code> per batch.</p>

<h3>Real vs. generated, conditioned on shape identity</h3>
<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/point-flow-matching/real_vs_generated.png" title="Real vs generated point sets" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

<h3>Size transferability</h3>
<p>Generating at sizes never seen during training (trained on <code>N</code> in <code>[16, 64]</code>; here <code>N</code> = 8, 16, 64, 150, 300) with the exact same weights, no retraining:</p>
<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/point-flow-matching/size_transfer.png" title="Size transfer" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

<h3>Training loss</h3>
<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/point-flow-matching/loss_curve.png" title="Training loss" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<p>The loss plateaus above zero, as expected: with independently sampled (non-optimal-transport) noise/data pairing, the conditional flow-matching loss floor is the conditional variance of the pairing itself, not the model's approximation error.</p>

<h3>Sample quality vs. pooling width</h3>
<p>The architecture's pooled context vector is a bottleneck through which all cross-point information must flow. A companion <a href="{{ '/blog/2026/deepsets-universal-approximation/' | relative_url }}">write-up</a> derives why this width matters for universal approximation of permutation-invariant functions. Retraining the same model with context widths <code>2<sup>0</sup></code> through <code>2<sup>6</sup></code> and measuring Chamfer distance to real shapes:</p>
<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/point-flow-matching/context_dim_ablation.png" title="Sample quality vs context width" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<p>Quality degrades sharply below a context width of about 4, then plateaus &mdash; consistent with the theoretical prediction that a sufficiently wide pooling bottleneck is necessary (and, past a point, no longer the limiting factor) for representing the relevant permutation-invariant summary of the point set.</p>


<h2>💻 Code</h2>
<p>Full implementation: <a href="https://github.com/Wiredu2020/3D-Computer-Vision-And-Robotics/tree/main/PointCloudFlowMatching" target="_blank" rel="noopener">PointCloudFlowMatching</a> on GitHub.</p>
