---
layout: page
title: Advanced CVPR for Biometrics
description: Facial Emotion Recognition using EfficientNetB3, VGG16, Neural ODEs, and classical CV pipelines
img: assets/img/bios.png
importance: 2
category: research
related_publications: false
---

Facial biometric analysis pipeline combining deep learning classifiers, classical feature extraction (CLAHE + PCA), and a Flask inference API — trained on the FER dataset across 7 emotion classes.


<div class="row justify-content-center mb-4">
  <div class="col-auto">
    <a href="https://github.com/Wiredu2020/Advanced-CVPR-For-Biometrics/" target="_blank" class="btn btn-sm z-depth-1" style="background:#24292e;color:white;border:none;padding:7px 18px;border-radius:6px;font-size:13px;">
      <i class="fab fa-github me-1"></i> GitHub
    </a>
  </div>
</div>

---

---

## Tech Stack

<div class="row mt-3 mb-2">
  <div class="col-12">
    <img src="https://img.shields.io/badge/Python-3.9+-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python"/>
    &nbsp;
    <img src="https://img.shields.io/badge/PyTorch-2.0+-EE4C2C?style=flat-square&logo=pytorch&logoColor=white" alt="PyTorch"/>
    &nbsp;
    <img src="https://img.shields.io/badge/torchdiffeq-dopri5-orange?style=flat-square" alt="torchdiffeq"/>
    &nbsp;
    <img src="https://img.shields.io/badge/Flask-3.0+-000000?style=flat-square&logo=flask&logoColor=white" alt="Flask"/>
    &nbsp;
    <img src="https://img.shields.io/badge/OpenCV-CLAHE-5C3EE8?style=flat-square&logo=opencv&logoColor=white" alt="OpenCV"/>
    &nbsp;
    <img src="https://img.shields.io/badge/scikit--learn-PCA-F7931E?style=flat-square&logo=scikit-learn&logoColor=white" alt="sklearn"/>
  </div>
</div>

---

## 🧠 Models

### EfficientNetB3 (Transfer Learning)

Pre-trained on ImageNet and fine-tuned on the FER dataset (28,709 training images, 7 classes). The classifier head uses dual BatchNorm layers and staged dropout to stabilize training on the imbalanced FER distribution.

```
EfficientNetB3 → BN → Dense(256, L2) → BN → Dropout(0.4) → Dense(128) → Dropout(0.3) → Softmax(7)
```

| Split | Accuracy |
|---|---|
| Train | 53.5% |
| Validation | 47.1% |
| Test | **69%** (after full fine-tune) |

Training used `ReduceLROnPlateau`, `EarlyStopping`, and `ModelCheckpoint` with Adamax optimizer.

### VGG16

Compared against EfficientNetB3 on the same FER pipeline. Used as a baseline to evaluate transfer learning depth vs. breadth trade-offs for low-resolution facial images (96×96).



## 🖼️ Classical CV Pipeline

- **CLAHE** (Contrast Limited Adaptive Histogram Equalization) via OpenCV for preprocessing low-contrast facial images before feature extraction
- **PCA** for dimensionality reduction of handcrafted features, used as a lightweight baseline alongside the deep models

---

## 🚀 Flask Inference API

A REST endpoint wraps the trained model for real-time emotion prediction from uploaded images:

```python
POST /predict  →  { "emotion": "happy", "confidence": 0.87 }
```

---

## 📓 Notebook