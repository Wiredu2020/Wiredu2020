---
layout: post
title: On the optimization algorithms and learning rate
date: 2025-01-05
description: Gradient descent (GD), Stochastic GD, Adam optimizer
tags: formatting videos
categories: sample-posts
thumbnail: assets/img/optim.png
---

## Introduction

Optimization lies at the heart of machine learning. Nearly every learning problem can be framed as the task of minimizing (or maximizing) an objective function that quantifies error, loss, or energy. Whether we are fitting a linear model or training a deep neural network with millions of parameters, the learning process reduces to an optimization problem.

This article introduces the fundamental ideas behind optimization in machine learning and gradually builds intuition for some of the most widely used algorithms: **Gradient Descent (GD)**, **Stochastic Gradient Descent (SGD)**, and **Adam**.

---

## Optimization as a Minimization Problem

In supervised learning, we are given a dataset $\mathcal{D} = \{(x_i, y_i)\}_{i=1}^N$and a model parameterized by $\theta$. Learning consists of minimizing a loss function:

$$
\theta^* = \arg\min_{\theta} \mathcal{L}(\theta),
\quad \text{where} \quad \mathcal{L}(\theta) = \frac{1}{N} \sum_{i=1}^{N} \ell\big(f(x_i; \theta), y_i\big).
$$

The loss surface can be convex or non-convex, smooth or highly irregular, low- or high-dimensional.

Optimization algorithms define _how_ we move on this surface to reach a good solution.

---

## Gradient Descent (GD)

Gradient Descent is the most fundamental first-order optimization method. It iteratively updates parameters in the direction of the negative gradient of the loss function:

$$\theta_{t+1} = \theta_t - \eta \nabla_{\theta}\mathcal{L}(\theta_t)$$

where $\nabla_{\theta}\mathcal{L}$ is the gradient and $\eta > 0\$ is the learning rate.

## Example of its convergence

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include video.liquid path="assets/video/gradient_descent_convergence.mp4" class="img-fluid rounded z-depth-1" controls=true autoplay=true %}
    </div>
</div>

### Intuition

The gradient points in the direction of steepest ascent. Moving in the opposite direction ensures we descend toward a minimum. However, the choice of learning rate is critical.

The animations here illustrate this clearly:

- **Small learning rate**: stable but slow convergence
- **Large learning rate**: faster movement but risk of overshooting or divergence

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include video.liquid path="assets/video/small_lr.mp4" class="img-fluid rounded z-depth-1" controls=true autoplay=true %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include video.liquid path="assets/video/large_lr.mp4" class="img-fluid rounded z-depth-1" controls=true %}
    </div>
</div>

### Limitations

- Requires computing gradients over the _entire dataset_
- Slow for large-scale problems
- Sensitive to learning rate selection

---

## Stochastic Gradient Descent (SGD)

To address scalability, **Stochastic Gradient Descent** approximates the full gradient using a single sample or a mini-batch:

$$\theta_{t+1} = \theta_t - \eta \nabla_{\theta}\ell(f(x_i; \theta_t), y_i)$$

### Why SGD Works

Although SGD introduces noise into the optimization process, this randomness often helps:

- escape shallow local minima
- improve generalization
- speed up training dramatically

### Trade-offs

- Faster per-iteration updates
- Noisy convergence
- Requires careful tuning of learning rate schedules

---

## Momentum-Based Methods

Pure SGD may oscillate heavily, especially in ravines where curvature differs across dimensions. Momentum methods address this by accumulating past gradients:

$v_t = \beta v_{t-1} + (1 - \beta)\nabla_{\theta}\mathcal{L}(\theta_t)$
$\theta_{t+1} = \theta_t - \eta v_t$

Momentum smooths updates and accelerates convergence along consistent directions.

---

## Adam Optimizer

**Adam (Adaptive Moment Estimation)** combines:

- momentum (first moment)
- adaptive learning rates (second moment)

It maintains running estimates of:

- mean of gradients
- uncentered variance of gradients

Update rules:

$$m_t = \beta_1 m_{t-1} + (1 - \beta_1) g_t$$
$$v_t = \beta_2 v_{t-1} + (1 - \beta_2) g_t^2$$

After bias correction:

$$\theta_{t+1} = \theta_t - \eta \frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \epsilon}$$

## Example of its convergence

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include video.liquid path="assets/video/adam_convergence.mp4" class="img-fluid rounded z-depth-1" controls=true autoplay=true %}
    </div>
</div>

### Why Adam is Popular

- Minimal tuning
- Handles sparse gradients well
- Works robustly in deep learning

However, Adam is not always optimal for generalization and may converge to worse minima than SGD in some settings.

---

## Choosing the Right Optimizer

There is no universally optimal optimizer. The choice depends on:

- dataset size
- model complexity
- smoothness of the loss
- generalization requirements

**Rule of thumb**:

- Start with **Adam** for fast prototyping
- Switch to **SGD + momentum** for better generalization when training stabilizes

---

## Final Remarks

Optimization algorithms define the dynamics of learning. Understanding how and why they work is essential not only for training models efficiently, but also for diagnosing failure modes such as divergence, slow convergence, or poor generalization.

From classical Gradient Descent to adaptive methods like Adam, optimization remains an active and evolving research area—especially in large-scale and multimodal learning systems.

---

_Code implementations and experiments related to these algorithms are available in the accompanying repository._
