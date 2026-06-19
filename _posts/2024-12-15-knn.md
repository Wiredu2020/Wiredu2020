---
layout: post
title: K-Nearest Neighbor (KNN) -- How your closest connections define you!
date: 2024-12-15
description: KNN algorithm from scratch
tags: formatting code
categories: sample-posts
featured: true
---

K-Nearest Neighbor (KNN) is an intuitive, supervised machine learning algorithm named a lazy learner. That is because rather than constructing an explicit training model, KNN makes predictions by directly relying on the surrounding data points—its `neighbors`—to classify or determine the label of a new instance. This behavior can be analogized to human interactions: to understand someone, we often observe their social circle, as their friends tend to influence or describe who they are. In the context of KNN, the challenge lies in determining the optimal number of neighbors (k) to consider in order to best describe or classify a new point.

From a mathematical perspective, KNN determines "closeness" by calculating `distances` between data points. Machines operate on numerical input, so distance metrics serve as a foundation for determining which neighbors are closest. Various distance measures exist, such as the Euclidean distance (L2 norm), Manhattan distance (L1 norm), and others. Selecting the appropriate distance metric is critical, as it influences the algorithm's performance and suitability for specific problems.

In this work, we provide a complete implementation of the KNN algorithm from scratch. We define custom functions to compute the necessary distances, identify neighbors, and make predictions, offering a comprehensive understanding of the model’s inner workings.

## custom sum function

```python
def fixed_custom_sum(arr, axis=None):
    if axis is None:  # Sum of all elements
        return sum(sum(row) if isinstance(row, list) else row for row in arr)
    elif axis == 0:  # Column-wise sum
        return [sum(row[i] for row in arr) for i in range(len(arr[0]))]
    elif axis == 1:  # Row-wise sum
        return [sum(row) for row in arr]
    else:
        raise ValueError("Invalid axis. Use 0 for columns or 1 for rows.")
```

## sorting

```python
def custom_argsort(arr):
    return sorted(range(len(arr)), key=lambda i: arr[i])

```

## distance

Now we define euclidean distance we will utilize.
$$d(x,y) = \sqrt{\sum_{i=1}^{n} (x_i - y_i)^2}$$

This is very nice distance computing because it is implemented as vector computation. Therefore,By avoiding loops and using vectorized operations for distance calculation, we significantly improved the performance of the algorithm.

```python
def euclidean_metric(traindata, testdata):
    num_train_samples = len(traindata)
    num_test_samples = len(testdata)
    num_features = len(traindata[0])

    distances = []
    for i in range(num_test_samples):
        test_sample = testdata[i]
        test_distances = []
        for j in range(num_train_samples):
            train_sample = traindata[j]
            squared_diff = [(a - b) ** 2 for a, b in zip(train_sample, test_sample)]
            test_distances.append(custom_sum(squared_diff))
        distances.append(test_distances)

    return distances
```

## Majority vote for classification

Here, we choose the class that represents the majority of the closest neighbors, because the labels of the nearest neighbors collectively determine the final prediction for the test point.

```python
def majority_vote(labels):
    label_count = {}

    for label in labels:
        if label in label_count:
            label_count[label] += 1
        else:
            label_count[label] = 1

    # Find the label with the maximum count
    max_count = -1
    most_common_label = None
    for label, count in label_count.items():
        if count > max_count:
            max_count = count
            most_common_label = label

    return most_common_label
```

## KNN implementation and its instantiation

```python
class KNN:
    def __init__(self, k=3):
        self.k = k

    def fit(self, traindata, trainclass):
        self.traindata = traindata
        self.trainclass = trainclass

    def predict(self, testdata):
        distances = euclidean_metric(self.traindata, testdata)

        k_nearest_labels = []
        for d in distances:
            k_indices = custom_argsort(d)[:self.k]
            k_labels = [self.trainclass[i] for i in k_indices]
            k_nearest_labels.append(majority_vote(k_labels))

        return k_nearest_labels
```

Contribution

No Libraries for Core Algorithm: This project is a pure implementation of KNN, providing a deeper understanding of how the algorithm works under the hood.
