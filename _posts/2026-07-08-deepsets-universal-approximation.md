---
layout: post
title: How Wide Does a Permutation-Invariant Bottleneck Need to Be?
date: 2026-07-08
description: Deriving the DeepSets universal approximation theorem via symmetric polynomials, and testing its prediction empirically
tags: theory generative-models set-functions
categories: sample-posts
thumbnail: assets/img/point-flow-matching/context_dim_ablation.png
---

Generative models over point clouds, molecules, and graphs share a structural requirement that models over images or sequences don't have: the network has to be **invariant** (or equivariant) under permutations of its input elements, because a set has no canonical order. The standard recipe for building such a network — used, in one guise or another, in DeepSets, PointNet, and most Graph Neural Network message-passing layers — is:

$$
f(x_1, \dots, x_M) = \rho\Big(\sum_{i=1}^{M} \phi(x_i)\Big)
$$

Each element is embedded independently by a shared map $\phi$, the embeddings are pooled by a symmetric operation (sum, in this post; mean in practice, which is just a rescaling), and a second map $\rho$ turns the pooled vector into the output. Summing is trivially permutation-invariant, so this architecture is invariant *by construction* — but that raises an immediate question: **is every permutation-invariant function representable this way, and if so, how wide does $\phi$'s output need to be?**

This turns out to have a clean, exact answer for an important special case, and the answer is not "wider is always better" — the required width is tied directly to how many elements the set can contain. This post derives that answer, then tests its qualitative prediction on the pooled architecture used in the [companion point-cloud flow-matching project]({{ '/projects/5_project/' | relative_url }}).

## The claim (DeepSets, informally)

Zaheer et al. ([2017](https://arxiv.org/abs/1703.06114)) show that for elements drawn from a countable universe, *every* permutation-invariant function of a set can be written in the sum-decomposition form above, for *some* choice of $\phi$ and $\rho$ (their construction encodes each element as a distinct power of 4 so that the sum can be uniquely decoded back into the original multiset — clever, but not the kind of $\phi$ you'd want to actually learn). What we want instead is a statement that (a) is fully constructive, (b) tells us how wide $\phi$'s output needs to be, and (c) is provably *tight* — i.e., that going narrower provably loses information. Wagstaff et al. ([2019](https://arxiv.org/abs/1901.09006)) prove exactly this for general continuous invariant functions. Rather than reproduce their (more technical) argument, the rest of this post derives the same conclusion for the case of **symmetric polynomials**, where the whole thing follows from a 19th-century fact about polynomials and is fully rigorous.

## The exact case: symmetric polynomials

Let $x = (x_1, \dots, x_M) \in \mathbb{R}^M$ be a set (with repeats allowed) of $M$ real numbers. A function $q(x_1, \dots, x_M)$ is called *symmetric* if it's unchanged by permuting its arguments — exactly the invariance property we want.

Define the **power sums**

$$
p_k = \sum_{i=1}^{M} x_i^k, \qquad k = 1, \dots, M,
$$

and the **elementary symmetric polynomials**

$$
e_1 = \sum_i x_i, \quad e_2 = \sum_{i<j} x_i x_j, \quad \dots, \quad e_M = x_1 x_2 \cdots x_M.
$$

Two classical facts, together, give us everything we need:

**1. The fundamental theorem of symmetric polynomials.** Every symmetric polynomial in $x_1, \dots, x_M$ can be written as a polynomial in $e_1, \dots, e_M$ — and this representation is unique. In other words, $(e_1, \dots, e_M)$ is a complete, non-redundant set of coordinates for the space of symmetric polynomials.

**2. Newton's identities.** The power sums and elementary symmetric polynomials determine each other through the recursion

$$
p_k = e_1 p_{k-1} - e_2 p_{k-2} + \cdots + (-1)^{k-2} e_{k-1} p_1 + (-1)^{k-1} k\, e_k, \qquad k \le M.
$$

Because the coefficient of $e_k$ is $\pm k \ne 0$, this recursion can be solved for $e_k$ given $e_1, \dots, e_{k-1}$ and $p_1, \dots, p_k$ — so $(p_1, \dots, p_M)$ determines $(e_1, \dots, e_M)$ exactly as well as the other way around.

**Putting them together:** set $\phi(x) = (x, x^2, \dots, x^M) \in \mathbb{R}^M$. Then

$$
\sum_{i=1}^M \phi(x_i) = (p_1, \dots, p_M),
$$

and by Newton's identities there is a fixed, invertible polynomial map $E$ with $(e_1, \dots, e_M) = E(p_1, \dots, p_M)$. By the fundamental theorem, any symmetric polynomial $q$ equals some polynomial $P$ applied to $(e_1,\dots,e_M)$. So

$$
q(x_1, \dots, x_M) = \underbrace{P \circ E}_{=: \rho}\Big(\sum_{i=1}^M \phi(x_i)\Big),
$$

exactly the DeepSets sum-decomposition — with a $\phi$ that is *fixed and universal* (it doesn't depend on $q$ at all) and an $M$-dimensional bottleneck. Since polynomials are dense in continuous functions on compact domains (Stone–Weierstrass), and symmetrizing preserves that density, this sum-decomposition with a width-$M$ bottleneck can approximate **any** continuous permutation-invariant function of $M$ elements arbitrarily well.

## Why you can't go narrower

Suppose the bottleneck has width $L < M$, i.e. $\phi: \mathbb{R} \to \mathbb{R}^L$. The map $\Phi(x_1,\dots,x_M) = \sum_i \phi(x_i)$ then sends an $M$-dimensional input to an $L$-dimensional summary, $L < M$. Generically, this cannot be injective on sets of $M$ elements: there is a positive-dimensional family of *different* multisets that $\Phi$ collapses to the *same* point in $\mathbb{R}^L$, no matter how $\phi$ is chosen. Since $\rho$ only ever sees $\Phi(x)$, it must give the same output for every multiset in such a collision — so any permutation-invariant target function that actually varies within that family cannot be represented, no matter how expressive $\rho$ is. This is the essence of Wagstaff et al.'s impossibility result.

A concrete instance with $L = 1$ (only the sum, $\phi(x) = x$): the sets $\{1, 1, 4\}$ and $\{2, 2, 2\}$ have the same sum ($p_1 = 6$), so any $\rho(\text{sum})$ must output the same value for both. But the **variance** — a perfectly ordinary permutation-invariant function — is $2$ for the first set and $0$ for the second. A width-1 bottleneck provably cannot represent variance; you need at least $p_2$ (equivalently, $L=2$) to tell these two sets apart at all.

## Testing the qualitative prediction

The [point-cloud flow-matching model]({{ '/projects/5_project/' | relative_url }}) uses exactly this pooling architecture (with a mean instead of a sum, and MLPs instead of the exact power/Newton maps) to predict a velocity field over sets of points. Its pooled context vector is the same kind of bottleneck analyzed above. Retraining the same model with context widths $2^0$ through $2^6$ and measuring the Chamfer distance between generated and real point sets:

{% include figure.liquid loading="eager" path="assets/img/point-flow-matching/context_dim_ablation.png" title="Sample quality vs context width" class="img-fluid rounded z-depth-1" %}

Quality degrades sharply for widths below about 4, then plateaus. This is exactly the qualitative shape the theory predicts: a bottleneck that's too narrow provably discards information no $\rho$ can recover, so quality should drop off once width falls below whatever the task actually requires — and adding width beyond that point should stop helping, since there's nothing left to gain. It's worth being precise about what this experiment does and doesn't show, though: the theorem above gives a *sufficient* (and, for polynomials, tight) bound of $M$ for representing *arbitrary* invariant functions of $M$ elements — here $M$ is up to 64, far more than the widths tested. The four shape families in this experiment are a much lower-complexity target than "an arbitrary symmetric function of 64 points," so it's entirely consistent with the theory that a far smaller bottleneck already saturates: the theorem bounds the worst case, not this specific, simple data distribution. What the ablation does confirm is the qualitative mechanism — too narrow a bottleneck measurably hurts, in a way that lines up with a real information bottleneck rather than an optimization artifact.

## Why this matters beyond toy shapes

The same pooling structure underlies most permutation-invariant and permutation-equivariant architectures used on graphs — message-passing GNNs aggregate neighbor features through an analogous sum/mean bottleneck at every layer. The question this post works through for a simple polynomial case — *what is the actual capacity constraint imposed by a symmetric pooling operation, and how does it scale with the size of the set being pooled over?* — is a special case of a more general one: characterizing exactly what structural properties an invariant or equivariant architecture needs in order to generalize and remain valid as the size of its input grows. That is a considerably harder question once you replace "sum over a flat set" with "aggregate over a graph's neighborhood structure," and it's the kind of question that determines whether a model trained on small graphs (or small point clouds) can be trusted at all on larger ones.

**References**
- Zaheer, M. et al. [Deep Sets](https://arxiv.org/abs/1703.06114). NeurIPS 2017.
- Wagstaff, E. et al. [On the Limitations of Representing Functions on Sets](https://arxiv.org/abs/1901.09006). ICML 2019.
- Lipman, Y. et al. [Flow Matching for Generative Modeling](https://arxiv.org/abs/2210.02747). ICLR 2023.
