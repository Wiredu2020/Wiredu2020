---
layout: post
title: Logistic Regression for Ultrasonic Flow Meter Health Classification
date: 2025-01-10
description: Binary classification of ultrasonic flow meter health using logistic regression and numerical optimization
tags: machine-learning classification optimization
categories: sample-posts
thumbnail: assets/img/ADML/ultrasonic.jpg
---

## Introduction

Condition monitoring and diagnostics play a critical role in ensuring the reliability of industrial measurement systems. In ultrasonic flow metering, installation effects can significantly distort measurements, leading to inaccurate flow estimation and potential operational risks.

This work focuses on developing a **binary classification model based on logistic regression** to determine whether an 8-path liquid ultrasonic flow meter (USM) is operating in a **healthy state** or is affected by **installation effects**. Using diagnostic parameters derived from experimental observations, we formulate the problem as a supervised learning task and analyze both optimization behavior and classification performance.

---

## Problem Formulation

Given a dataset  
$$\mathcal{D} = \{(x_i, y_i)\}_{i=1}^{N},$$
where $x_i \in \mathbb{R}^{36}$ represents diagnostic features and

$$
y_i \in \{0,1\}
$$

denotes the health state of the flow meter, the objective is to learn a parameter vector $\beta$ that models the probability

$$
P(y = 1 \mid x) = \sigma(x^\top \beta),
$$

where $\sigma(\cdot)$ is the sigmoid function.

---

## About the Dataset

The dataset, referred to as **Meter A**, consists of 87 experimental observations collected from an 8-path liquid ultrasonic flow meter .

**Key characteristics:**

- 87 total samples
- 36 continuous input features
- Binary target variable:
  - `1` → Healthy condition
  - `0` → Installation effect

The relatively small dataset size motivated careful preprocessing and evaluation to avoid biased conclusions.

---

## Data Preprocessing

### Feature Normalization

Initial exploration revealed that the predictors varied significantly in scale and dispersion. To ensure numerical stability during optimization, all features were standardized using **Z-score normalization**:

$$
z = \frac{x - \mu}{\sigma},
$$

where $\mu$ and $\sigma$ denote the mean and standard deviation of each feature.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/ADML/box1.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/ADML/box2.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
</div>

No missing values or categorical variables were detected in the dataset.

---

## Train–Test Splitting Strategy

Due to the sequential ordering of healthy and faulty observations, the dataset was **shuffled prior to splitting** to ensure representative samples in both subsets.

Multiple split ratios were evaluated: 60:40, 75:25, 80:20.

This allowed us to analyze how training data size affects convergence, generalization, and classification accuracy.

---

## Logistic Regression Model

### Sigmoid Function

Logistic regression maps linear combinations of features to probabilities using the sigmoid function:

$$
\sigma(x) = \frac{1}{1 + e^{-x}}.
$$

This formulation enables direct probabilistic interpretation of model outputs.

---

## Cost Function and Optimization

The model parameters were estimated by minimizing the **negative log-likelihood**:

$$
\mathcal{L}(\beta) =
- \sum_{i=1}^{n}
\left[
y_i \log(\sigma(X_i \beta)) +
(1 - y_i)\log(1 - \sigma(X_i \beta))
\right].
$$

### Optimization Method

- Initial weights: **zero initialization**
- Bias term embedded directly into the feature matrix
- Optimization performed using **MATLAB’s `fminsearch`**
- No explicit stopping criteria imposed

A custom output function tracked:

- loss value per iteration
- total number of iterations until convergence

This setup allowed us to study the **natural convergence behavior** of the optimizer.

---

## Optimization Behavior

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/ADML/fminsearch60.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/ADML/fminsearch75.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/ADML/fminsearch80.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
</div>

**Key observations:**

- All splits show monotonic decrease in loss
- Larger training sets require more optimization iterations
- Absence of stopping criteria increases computation cost for larger datasets

---

## Model Evaluation Metrics

Model performance was assessed using:

- **Accuracy**
- **Confusion Matrix**
- **Precision**
- **Recall**

$$
\text{Precision} = \frac{TP}{TP + FP}, \quad
\text{Recall} = \frac{TP}{TP + FN}
$$

---

## Classification Accuracy Results

```yml
pretty_table: true
```

```markdown
| split ratio | Tr. accuracy | Te. accuuracy |
| :---------- | :----------: | ------------: |
| 60:40       |    80.86     |         82.86 |
| 75:25       |    83.08     |        100.00 |
| 80:20       |     90.0     |         76.47 |
```

The **75:25 split** achieved perfect test accuracy, though this should be interpreted cautiously due to the small sample size.

---

## Feature Importance Analysis

Across all splits, the **25th feature** (gain at the fifth end of each of the eight paths) consistently exhibited the largest coefficient magnitude.

- Strong influence regardless of split ratio
- Indicates a dominant diagnostic role in identifying installation effects

---

## Confusion Matrix Analysis

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/ADML/conf60.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/ADML/conf75.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/ADML/conf80.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
</div>

---

## Discussion

This study demonstrates that logistic regression, when combined with appropriate normalization and numerical optimization, can effectively classify ultrasonic flow meter health states—even with limited data.

However:

- Small datasets increase variance in performance metrics
- Absence of stopping criteria impacts computational efficiency
- Feature dominance suggests opportunities for dimensionality reduction

---

## Final Remarks

Logistic regression remains a powerful and interpretable baseline for industrial diagnostic problems. Beyond classification accuracy, analyzing **optimization dynamics**, **feature influence**, and **data splitting strategies** provides deeper insight into model behavior and reliability.

Future work may include:

- regularization
- alternative optimizers
- cross-validation
- nonlinear extensions

---

_Code and experiments related to this project are available in the accompanying repository._
