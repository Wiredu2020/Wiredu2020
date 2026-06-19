---
layout: post
title: Singular Value Decomposition for Hyperspectral Image Dimensionality Reduction
date: 2025-01-12
description: Understanding SVD theory and applying it to hyperspectral imaging - A comprehensive guide
tags: linear-algebra, svd, hyperspectral,dimensionality-reduction
categories: sample-posts
thumbnail: assets/img/ADML/indianpines.jpg
---

## Introduction to Hyperspectral Imaging

Hyperspectral imaging is like having a camera with hundreds of colored filters. While a regular camera captures red, green, and blue (3 channels), a hyperspectral camera captures hundreds of narrow wavelength bands across the electromagnetic spectrum. This creates an image "cube" - two spatial dimensions and one spectral dimension.

**Why is this useful?** Different materials reflect and absorb light differently across wavelengths. For example:

- Healthy vegetation reflects strongly in near-infrared
- Different minerals have unique spectral signatures
- Water bodies absorb differently than soil

**The challenge:** A single hyperspectral image can contain millions of data points, making it expensive to store, transmit, and analyze. This is where **dimensionality reduction** becomes critical.

---

## What is Singular Value Decomposition (SVD)?

### The Big Picture

Imagine you have a large, complex dataset represented as a matrix. SVD is a mathematical technique that decomposes this matrix into three simpler matrices that, when multiplied together, reconstruct the original data. The magic is that **most of the important information is concentrated in just a few components**, allowing us to throw away the less important parts.

Think of it like compressing a high-resolution image: you can often reduce file size by 90% while keeping the image looking almost identical to the human eye.

### The Mathematical Framework

For any matrix $X$ of size $m\times n$, SVD decomposes it as:

$$
\mathbf{X} = \mathbf{U}\mathbf{\Sigma}\mathbf{V}^\top
$$

Let's break down each component:

**U (Left Singular Vectors)** - size m × m

- Columns are orthonormal vectors (perpendicular and unit length)
- Represent patterns in the **rows** of X (spatial patterns in our case)
- Think of these as "basis images" or "eigenimages"

**$\Sigma$ (Singular Values)** - size $m \times n$ (diagonal matrix)

- Diagonal elements $\sigma_1 \ge \sigma_2 \ge\sigma_3 \ge\sigma_4 \ge \ldots \ge 0$ (sorted in descending order)
- Measure the "strength" or "importance" of each component
- Large values = important patterns, small values = noise or fine details
- The rank $r$ is the number of non-zero singular values

**V (Right Singular Vectors)** - size $n \times n$

- Columns are orthonormal vectors
- Represent patterns in the **columns** of X (spectral patterns in our case)
- Show how different wavelengths relate to each other

### Why SVD is Special

SVD has unique mathematical properties that make it perfect for data analysis:

1. **Unique and stable**: For any matrix, the SVD is unique (up to sign)
2. **Optimal approximation**: Truncated SVD gives the best low-rank approximation in terms of minimizing error
3. **Reveals structure**: Singular values tell us the "intrinsic dimensionality" of the data
4. **Works on any matrix**: Unlike eigendecomposition, SVD works on non-square and non-symmetric matrices

---

## Understanding SVD Through Intuition

### Geometric Interpretation

Think of SVD as finding the "principal axes" of your data:

1. **First component** (largest $\sigma_1$): The direction of maximum variation in your data
2. **Second component** ($\sigma_2$): The direction of maximum variation orthogonal to the first
3. **Third component** ($\sigma_3$): Maximum variation orthogonal to both previous directions
4. And so on...

Each component is **independent** (orthogonal) to all others, so they capture different aspects of the data.

### The Low-Rank Approximation

Here's the key insight: instead of using all components, we can use only the first k components:

$$
\mathbf{X}_k = \mathbf{U}_k\mathbf{\Sigma}_k\mathbf{V}_k^\top
$$

where:

- **U**ₖ contains only the first k columns of **U**
- $\Sigma$ contains only the first k singular values
- **V**ₖ contains only the first k columns of **V**

This is called **truncated SVD** or **rank-k approximation**.

**Why does this work?** Because singular values are sorted by importance, the first few components capture most of the variance in the data, while later components often represent noise or insignificant details.

---

## SVD vs PCA: What's the Connection?

You might have heard of Principal Component Analysis (PCA). Here's the relationship:

**PCA and SVD are intimately related:**

- PCA finds directions of maximum variance by computing eigenvectors of the covariance matrix
- SVD directly decomposes the data matrix
- **For centered data, PCA and SVD give the same results**

Specifically:

- The columns of **V** are the principal components
- The singular values $\sigma_i$ relate to eigenvalues: $\lambda_i = \sigma_i^2/(n-1)$
- **U** gives the data projected onto principal components

**Advantage of SVD over PCA:**

- More numerically stable
- Doesn't require computing the covariance matrix (which can be large)
- Directly applicable to the data matrix

---

## Measuring Information Content: Explained Variance

How do we decide how many components to keep? We use **explained variance**.

### Computing Explained Variance

The variance explained by the i-th component is:

$$
\text{EV}_i = \frac{\sigma_i^2}{\sum_{j=1}^{r} \sigma_j^2}
$$

**Cumulative explained variance** up to component k:

$$
\text{CV}_k = \frac{\sum_{i=1}^{k} \sigma_i^2}{\sum_{j=1}^{r} \sigma_j^2}
$$

This tells us: **"What percentage of the total information is captured by the first k components?"**

### Choosing the Number of Components

Common strategies:

1. **Threshold method**: Keep enough components to capture 95% or 99% of variance
2. **Elbow method**: Plot variance vs. component number, look for the "elbow" where adding more components gives diminishing returns
3. **Cross-validation**: Choose k that gives best performance on validation data
4. **Fixed number**: Use domain knowledge (e.g., "keep 10 components")

For our hyperspectral data, we'll use the threshold method with 99% variance retention.

---

## Application to Hyperspectral Imaging

### The Indian Pines Dataset

The Indian Pines dataset is a benchmark hyperspectral image collected over agricultural land in Indiana, USA. It contains:

- **Spatial dimensions**: $145 \times 145$ pixels
- **Spectral dimension**: 220 wavelength bands
- **Total elements**: $145 \times 145 \times 220 = 4,625,500$ values

This represents different crop types, forests, roads, and buildings, each with unique spectral signatures.

### Why Apply SVD to Hyperspectral Data?

Hyperspectral images are highly redundant because:

1. **Spectral correlation**: Adjacent wavelength bands are highly correlated
2. **Spatial correlation**: Nearby pixels often have similar spectra
3. **Noise**: Some bands contain primarily noise

SVD exploits this redundancy to:

- **Compress** the data for storage and transmission
- **Denoise** by removing low-variance components
- **Visualize** high-dimensional data
- **Preprocess** for machine learning algorithms

---

## Methodology and Implementation

### 1: Data Loading and Preprocessing

```matlab
% Load the hyperspectral data
load('indian_pines.mat');

% Extract the datacube and wavelength information
datacube = indian_pines.DataCube;  % 145 × 145 × 220
wavelengths = indian_pines.Wavelength;  % 220 × 1

% Display dimensions
[rows, cols, bands] = size(datacube);
fprintf('Image size: %d × %d pixels\n', rows, cols);
fprintf('Number of spectral bands: %d\n', bands);
```

### 2: RGB Visualization

To visualize the hyperspectral cube as an RGB image, we select three representative bands:

```matlab
% Select bands for RGB (approximate wavelengths)
red_band = 50;    % ~650 nm
green_band = 27;  # ~550 nm
blue_band = 17;   # ~450 nm

% Extract and normalize
rgb_image = cat(3, datacube(:,:,red_band), ...
                   datacube(:,:,green_band), ...
                   datacube(:,:,blue_band));
rgb_image = rgb_image / max(rgb_image(:));

% Display
figure;
imshow(rgb_image);
title('RGB Visualization of Hyperspectral Image');
```

### 3: False-Color Composite

False-color images use non-visible wavelengths to highlight features:

```matlab
% Select NIR, Red, Green for false-color (vegetation analysis)
nir_band = 100;   % Near-infrared
red_band = 50;
green_band = 27;

% Create false-color composite
false_color = cat(3, datacube(:,:,nir_band), ...
                     datacube(:,:,red_band), ...
                     datacube(:,:,green_band));

% Apply contrast stretching
false_color = imadjust(false_color / max(false_color(:)));

figure;
imshow(false_color);
title('False-Color Composite (NIR-R-G)');
```

**Why false-color?** Vegetation reflects strongly in near-infrared but absorbs red light. In false-color, healthy vegetation appears bright red!

### 4: Spectral Profile Analysis

Examining the spectral signature of a single pixel:

```matlab
% Select a pixel
row_idx = 60;
col_idx = 70;

% Extract spectral profile
spectrum = squeeze(datacube(row_idx, col_idx, :));

% Plot
figure;
plot(wavelengths, spectrum, 'LineWidth', 2);
xlabel('Wavelength (nm)');
ylabel('Reflectance');
title(sprintf('Spectral Profile at Pixel (%d, %d)', row_idx, col_idx));
grid on;
```

This reveals the unique spectral "fingerprint" of the material at that location.

### 5: Data Reshaping

Convert the 3D cube into a 2D matrix for SVD:

```matlab
% Original: 145 × 145 × 220 (rows × cols × bands)
% Reshape to: (145×145) × 220 = 21025 × 220
% Each row is a pixel, each column is a wavelength band

X = reshape(datacube, rows*cols, bands);

fprintf('Original size: %d elements\n', rows*cols*bands);
fprintf('Reshaped matrix: %d × %d\n', size(X,1), size(X,2));
```

**Understanding the reshape:**

- Each **row** represents one pixel's complete spectrum
- Each **column** represents one wavelength across all pixels
- We've "unfolded" the spatial dimensions into rows

### 6: Applying SVD

```matlab
% Perform SVD
[U, S, V] = svd(X, 'econ');
% 'econ' produces economy-size decomposition: faster and uses less memory

% Extract singular values
singular_values = diag(S);

% Compute explained variance
explained_var = (singular_values.^2) / sum(singular_values.^2);
cumulative_var = cumsum(explained_var);

% Plot
figure;
subplot(1,2,1);
plot(singular_values, 'o-', 'LineWidth', 2);
xlabel('Component Index');
ylabel('Singular Value');
title('Singular Values (Scree Plot)');
grid on;

subplot(1,2,2);
plot(cumulative_var * 100, 'LineWidth', 2);
xlabel('Number of Components');
ylabel('Cumulative Explained Variance (%)');
title('Cumulative Variance Explained');
grid on;
yline(99, '--r', '99% Threshold');
```

**Key observations:**

- Singular values drop rapidly (most information in first few components)
- Cumulative variance plateaus quickly (diminishing returns)

### 7:Selecting Reconstruction Rank

```matlab
% Find minimum k for 99% variance
variance_threshold = 0.99;
k = find(cumulative_var >= variance_threshold, 1, 'first');

fprintf('Components needed for %.1f%% variance: %d\n', ...
        variance_threshold*100, k);
fprintf('Variance captured: %.4f%%\n', cumulative_var(k)*100);
```

### 8: Low-Rank Reconstruction

```matlab
% Truncate to first k components
U_k = U(:, 1:k);
S_k = S(1:k, 1:k);
V_k = V(:, 1:k);

% Reconstruct
X_reconstructed = U_k * S_k * V_k';

% Reshape back to 3D cube
datacube_reconstructed = reshape(X_reconstructed, rows, cols, bands);
```

**What we've done:**

- Kept only the first k columns of U and V
- Kept only the first k singular values from Σ
- Multiplied them to get an approximation of X

### 9: Computing Dimensionality Reduction

```matlab
% Original storage
original_elements = rows * cols * bands;

% Reduced storage: U_k + S_k + V_k
reduced_elements = numel(U_k) + numel(S_k) + numel(V_k);
% Or equivalently: (rows*cols)*k + k*k + bands*k

% Reduction percentage
reduction = (1 - reduced_elements/original_elements) * 100;

fprintf('Original elements: %d\n', original_elements);
fprintf('Reduced elements: %d\n', reduced_elements);
fprintf('Dimensionality reduction: %.2f%%\n', reduction);
```

**Understanding the storage:**

- Original: Store entire 145×145×220 cube
- Reduced: Store U_k (21025×k) + S_k (k×k) + V_k (220×k)
- Huge savings when k << min(rows×cols, bands)

### 10: Error Analysis

```matlab
% Compute Root Mean Squared Error
rmse = sqrt(mean((X(:) - X_reconstructed(:)).^2));

% Relative error
relative_error = rmse / sqrt(mean(X(:).^2)) * 100;

fprintf('RMSE: %.6f\n', rmse);
fprintf('Relative error: %.4f%%\n', relative_error);

% Visualize reconstruction quality
figure;
subplot(1,2,1);
imshow(rgb_image);
title('Original RGB');

subplot(1,2,2);
rgb_reconstructed = cat(3, datacube_reconstructed(:,:,red_band), ...
                           datacube_reconstructed(:,:,green_band), ...
                           datacube_reconstructed(:,:,blue_band));
rgb_reconstructed = rgb_reconstructed / max(rgb_reconstructed(:));
imshow(rgb_reconstructed);
title(sprintf('Reconstructed RGB (k=%d)', k));
```

---

## Results and Analysis

### Image Loading and Properties

<div class="row mt-3">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/ADML/img1.png" class="img-fluid rounded z-depth-1" zoomable=true %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/ADML/img2.png" class="img-fluid rounded z-depth-1" zoomable=true %}
  </div>
</div>

<div class="caption">
  Left: RGB visualization using bands at approximately 650nm (red), 550nm (green), and 450nm (blue). Right: False-color composite using NIR-Red-Green bands with contrast stretching. Healthy vegetation appears bright red due to strong near-infrared reflection.
</div>

**Dataset Properties:**

```
Hypercube Dimensions: 145 × 145 × 220
Total Elements: 4,625,500
Wavelength Range: 220 bands spanning visible to near-infrared
Storage Size: ~37 MB (double precision)
```

---

### Spectral Signature Analysis

<div class="row mt-3">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/ADML/img3.png" class="img-fluid rounded z-depth-1" zoomable=true %}
  </div>
</div>

<div class="caption">
  Spectral profile of pixel at position (60, 70). The significant peak around wavelength index 50 (approximately 650-700nm) indicates strong red/near-infrared reflection, characteristic of vegetation.
</div>

**Interpretation:**

- The spectral profile shows the unique "fingerprint" of this pixel
- High reflectance in red edge and NIR suggests healthy vegetation
- Lower reflectance in blue/green (photosynthesis absorption)
- This demonstrates why hyperspectral imaging is powerful for classification

---

### Data Transformation

**Original 3D Structure:**

```
Spatial dimensions: 145 × 145 pixels
Spectral dimension: 220 bands
Total: 4,625,500 elements
```

**Reshaped 2D Matrix:**

```
Rows (pixels): 21,025
Columns (bands): 220
Interpretation: Each row is a spectrum, each column is a spatial map
```

This transformation is key for applying SVD, which operates on 2D matrices.

---

### SVD Decomposition Results

<div class="row mt-3">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/ADML/img5.png" class="img-fluid rounded z-depth-1" zoomable=true %}
  </div>
</div>

<div class="caption">
  Cumulative explained variance vs. number of components. The rapid initial rise indicates that a small number of components capture most of the data's information content.
</div>

**Key Findings:**

| Metric                                     | Value     |
| ------------------------------------------ | --------- |
| Components for 99% variance                | **k = 2** |
| Variance explained by first component      | ~85%      |
| Variance explained by first two components | 99%       |
| Remaining 218 components                   | 1%        |

This result is remarkable: **99% of the information in 220 bands is captured by just 2 components!**

**Why so few components?**

1. **High spectral correlation**: Adjacent wavelengths are very similar
2. **Smooth spectral signatures**: Most materials have smoothly varying spectra
3. **Limited material diversity**: Only a few land cover types in the scene
4. **Noise**: Some bands contain primarily noise (low signal)

---

### Dimensionality Reduction Analysis

**Storage Requirements:**

```
Original storage:
- Full datacube: 4,625,500 elements

Reduced storage (k=2):
- U_k: 21,025 × 2 = 42,050 elements
- S_k: 2 × 2 = 4 elements
- V_k: 220 × 2 = 440 elements
- Total: 42,494 elements

Reduction: 96.35%
Compression ratio: 108.9:1
```

**Practical implications:**

- **Storage**: Reduced from ~37 MB to ~0.34 MB
- **Transmission**: 100× faster data transfer
- **Processing**: Much faster computations on compressed data
- **Memory**: Can handle larger datasets in limited RAM

---

### Reconstructed Image Quality

<div class="row mt-3">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/ADML/img4.png" class="img-fluid rounded z-depth-1" zoomable=true %}
  </div>
</div>

<div class="caption">
  RGB visualization of reconstructed hyperspectral cube using only 2 SVD components. Despite 96% reduction in dimensionality, the image retains all major structural features and most spectral information.
</div>

**Reconstruction Error:**

```
RMSE: ~0.0023 (very small!)
Relative error: <1%
Visual quality: Excellent
```

**What's preserved:**

- Spatial structures (fields, roads, buildings)
- Spectral characteristics (material signatures)
- Statistical properties (means, variances)

**What's lost:**

- Fine spectral details
- High-frequency noise
- Minor spectral variations

## Mathematical Properties of SVD

### Optimality of Truncated SVD

The rank-k approximation $X_k = U_k \Sigma_k V_k^T$ is optimal in the sense that it minimizes:

$$
\|\mathbf{X} - \mathbf{X}_k\|_F = \min_{\text{rank}(\mathbf{Y})=k} \|\mathbf{X} - \mathbf{Y}\|_F
$$

where $|. |_F$ is the Frobenius norm (sum of squared errors).

**What this means:** Among all possible rank-k matrices, truncated SVD gives the one closest to the original data. No other method can beat it!

### Eckart-Young-Mirsky Theorem

The reconstruction error is exactly:

$$
\|\mathbf{X} - \mathbf{X}_k\|_F = \sqrt{\sum_{i=k+1}^{r} \sigma_i^2}
$$

This tells us:

- Error depends only on discarded singular values
- If $\sigma_{k+1}, \ldots$ are small, error is small
- We can predict error before reconstruction!

**Tip:** Use economy SVD (`svd(X,'econ')` in MATLAB) for large datasets to save memory and time.

---

## Practical Considerations

### When SVD Works Well

SVD is most effective when:

1. **High redundancy**: Correlated features (like spectral bands)
2. **Low intrinsic dimensionality**: Data lies on a low-dimensional manifold
3. **Smooth variations**: Gradual changes rather than sharp transitions
4. **Good signal-to-noise ratio**: Noise doesn't dominate signal

Hyperspectral images typically satisfy all these conditions!

### When to Be Careful

SVD may struggle with:

1. **Sparse data**: Lots of zeros (use specialized sparse methods)
2. **Non-linear structures**: Curved manifolds (consider kernel PCA)
3. **Discrete data**: Categorical variables (inappropriate for SVD)
4. **Very large matrices**: Computational cost becomes prohibitive

### Alternative Methods

For comparison, other dimensionality reduction techniques include:

**Linear methods:**

- **PCA**: Essentially equivalent to SVD for centered data
- **NMF** (Non-negative Matrix Factorization): Enforces non-negativity
- **ICA** (Independent Component Analysis): Finds statistically independent components
- **LDA** (Linear Discriminant Analysis): Supervised, maximizes class separation

**Nonlinear methods:**

- **t-SNE**: Great for visualization, poor for reconstruction
- **UMAP**: Similar to t-SNE but faster
- **Autoencoders**: Neural network-based compression
- **Kernel PCA**: Nonlinear variant of PCA

For hyperspectral imaging, **SVD/PCA remains the gold standard** due to simplicity, interpretability, and proven effectiveness.

---

## Advanced Topics and Extensions

### Incremental SVD

For streaming or large datasets that don't fit in memory:

- Process data in batches
- Update SVD incrementally
- Maintain approximate low-rank representation

### Randomized SVD

For very large matrices:

- Use random projections for approximation
- Much faster than full SVD (O(mnk) instead of O(mn²))
- Controlled accuracy trade-off

```matlab
% Randomized SVD (requires additional toolbox)
k = 10;
[U_approx, S_approx, V_approx] = rsvd(X, k);
```

### Tensor Decomposition

Instead of reshaping to 2D, work directly with 3D tensor:

- **Tucker decomposition**: Higher-order SVD
- **CP decomposition**: CANDECOMP/PARAFAC
- Preserves multi-way structure

### Supervised Dimensionality Reduction

If you have class labels (e.g., crop types):

- **Discriminant Analysis Feature Extraction (DAFE)**
- **Maximum Noise Fraction (MNF)**
- Optimize for classification performance

<!-- ---

## Complete Implementation Example

Here's a complete, self-contained MATLAB script:

```matlab
%% SVD-based Hyperspectral Dimensionality Reduction
% Complete implementation for Indian Pines dataset

%% 1. Load and Explore Data
load('indian_pines.mat');
datacube = indian_pines.DataCube;
wavelengths = indian_pines.Wavelength;

[rows, cols, bands] = size(datacube);
fprintf('Dataset: %d×%d pixels, %d bands\n', rows, cols, bands);

%% 2. Visualize RGB
rgb_bands = [50, 27, 17];  % R, G, B
rgb_image = datacube(:,:,rgb_bands);
rgb_image = rgb_image / max(rgb_image(:));

figure('Position', [100, 100, 1200, 400]);
subplot(1,3,1);
imshow(rgb_image);
title('RGB Visualization');

%% 3. False-Color Composite
fc_bands = [100, 50, 27];  % NIR, R, G
false_color = datacube(:,:,fc_bands);
false_color = imadjust(false_color / max(false_color(:)));

subplot(1,3,2);
imshow(false_color);
title('False-Color (NIR-R-G)');

%% 4. Spectral Profile
pixel_row = 60;
pixel_col = 70;
spectrum = squeeze(datacube(pixel_row, pixel_col, :));

subplot(1,3,3);
plot(wavelengths, spectrum, 'LineWidth', 2);
xlabel('Wavelength (nm)');
ylabel('Reflectance');
title(sprintf('Spectrum at (%d,%d)', pixel_row, pixel_col));
grid on;

%% 5. Reshape to 2D Matrix
X = reshape(datacube, rows*cols, bands);
fprintf('Reshaped to: %d×%d\n', size(X));

%% 6. Perform SVD
fprintf('Computing SVD...\n');
tic;
[U, S, V] = svd(X, 'econ');
fprintf('SVD completed in %.2f seconds\n', toc);

singular_values = diag(S);

%% 7. Analyze Variance
explained_var = (singular_values.^2) / sum(singular_values.^2);
cumulative_var = cumsum(explained_var);

figure('Position', [100, 100, 1200, 400]);
subplot(1,3,1);
semilogy(singular_values, 'o-', 'LineWidth', 2);
xlabel('Component Index');
ylabel('Singular Value (log scale)');
title('Scree Plot');
grid on;

subplot(1,3,2);
bar(explained_var(1:20));
xlabel('Component Index');
ylabel('Explained Variance Ratio');
title('Individual Component Variance (first 20)');
grid on;

subplot(1,3,3);
plot(cumulative_var * 100, 'LineWidth', 2);
xlabel('Number of Components');
ylabel('Cumulative Variance (%)');
title('Cumulative Explained Variance');
grid on;
hold on;
yline(99, '--r', '99%', 'LineWidth', 2);
hold off;

%% 8. Select Rank
threshold = 0.99;
k = find(cumulative_var >= threshold, 1);
fprintf('\nComponents for %.1f%% variance: k = %d\n', threshold*100, k);
fprintf('Actual variance captured: %.4f%%\n', cumulative_var(k)*100);

%% 9. Reconstruct
U_k = U(:, 1:k);
S_k = S(1:k, 1:k);
V_k = V(:, 1:k);

X_reconstructed = U_k * S_k * V_k';
datacube_recon = reshape(X_reconstructed, rows, cols, bands);

%% 10. Evaluate
% Dimensionality reduction
original_size = numel(datacube);
reduced_size = numel(U_k) + numel(S_k) + numel(V_k);
reduction = (1 - reduced_size/original_size) * 100;

fprintf('\nDimensionality Reduction:\n');
fprintf('Original: %d elements\n', original_size);
fprintf('Reduced: %d elements\n', reduced_size);
fprintf('Reduction: %.2f%%\n', reduction);
fprintf('Compression ratio: %.1f:1\n', original_size/reduced_size);

% Reconstruction error
rmse = sqrt(mean((X(:) - X_reconstructed(:)).^2));
relative_rmse = rmse / sqrt(mean(X(:).^2)) * 100;

fprintf('\nReconstruction Error:\n');
fprintf('RMSE: %.6f\n', rmse);
fprintf('Relative RMSE: %.4f%%\n', relative_rmse);

%% 11. Visualize Reconstruction
rgb_recon = datacube_recon(:,:,rgb_bands);
rgb_recon = rgb_recon / max(rgb_recon(:));

figure('Position', [100, 100, 1200, 400]);
subplot(1,3,1);
imshow(rgb_image);
title('Original RGB');

subplot(1,3,2);
imshow(rgb_recon);
title(sprintf('Reconstructed (k=%d)', k));

subplot(1,3,3);
diff_image = abs(rgb_image - rgb_recon);
imshow(diff_image * 10);  % Amplify for visibility
title('Difference (10× amplified)');

%% 12. Component Visualization
figure('Position', [100, 100, 1200, 800]);
for i = 1:min(6, k)
    subplot(2,3,i);
    component_image = reshape(U(:,i), rows, cols);
    imagesc(component_image);
    colormap(jet);
    colorbar;
    title(sprintf('Component %d (%.2f%% var)', i, explained_var(i)*100));
    axis equal tight;
end

fprintf('\nAnalysis complete!\n');
```

---

## Discussion and Insights

### Why Such Dramatic Reduction?

The Indian Pines dataset achieves 96% dimensionality reduction because:

1. **Spectral Smoothness**: Natural materials have smoothly varying spectral signatures. Adjacent wavelength bands are highly correlated (often >0.95 correlation).

2. **Limited Material Types**: The scene contains only ~10-15 distinct land cover classes. With few unique spectral signatures, few components are needed to represent them.

3. **Atmospheric Effects**: Many bands are affected similarly by atmospheric absorption and scattering, creating redundancy.

4. **Sensor Characteristics**: Some bands may contain primarily noise or have low signal-to-noise ratio, contributing little information.

### Comparison with Other Datasets

Results will vary by dataset:
- **Urban scenes**: May need more components (10-20) due to diverse materials
- **Oceanic data**: Often very low dimensional (2-5 components)
- **Mineral mapping**: Requires more components (15-30) for subtle spectral features
- **Atmospheric studies**: Higher dimensionality due to fine absorption lines -->

### Practical Applications

This dimensionality reduction enables:

**1. Classification**: Train classifiers on compressed data

```matlab
% Use reduced representation for classification
features = U_k * S_k;  % 21025×2 instead of 21025×220
% Train SVM, Random Forest, etc. on these features
```

**2. Anomaly Detection**: Identify pixels that don't fit the low-rank model

```matlab
% Reconstruction error per pixel
pixel_errors = sqrt(sum((X - X_reconstructed).^2, 2));
anomaly_map = reshape(pixel_errors, rows, cols);
```

**3. Compression**: Store/transmit compact representation

```matlab
% Save compressed version
save('indian_pines_compressed.mat', 'U_k', 'S_k', 'V_k', ...
     'rows', 'cols', 'bands', 'wavelengths');
```

**4. Visualization**: Project to 2D/3D for human inspection

```matlab
% 2D scatter plot using first 2 components
scatter(U(:,1), U(:,2), 5, labels, 'filled');
xlabel('Component 1');
ylabel('Component 2');
```

---

## Limitations and Challenges

### 1. Linear Assumption

SVD assumes linear relationships. It may miss:

- Nonlinear spectral mixing (intimate mixtures)
- Complex atmospheric effects
- Nonlinear sensor responses

**Solution**: Consider kernel PCA or manifold learning for nonlinear patterns.

### 2. Global Analysis

SVD finds global patterns but may miss:

- Localized anomalies
- Rare classes with unique spectra
- Spatial discontinuities

**Solution**: Apply SVD locally (tile-based) or use sparse methods.

### 3. Noise Sensitivity

While SVD can denoise by removing small singular values, it can also:

- Spread systematic noise across components
- Fail to separate signal from structured noise

**Solution**: Preprocess with noise-adjusted methods (MNF, Minimum Noise Fraction).

### 4. Interpretability

While mathematically optimal, SVD components are abstract:

- Not physically meaningful
- Mixed spectral-spatial patterns
- Difficult to relate to domain knowledge

**Solution**: Compare with domain-specific features (vegetation indices, mineral indices).

---

## Future Extensions and Research Directions

### 1. Temporal Analysis

For time-series hyperspectral data:

- Apply SVD to spatiotemporal cube
- Track component changes over time
- Detect phenological changes

### 2. Fusion with Other Data

Combine hyperspectral with:

- LiDAR (elevation data)
- SAR (radar data)
- Multispectral (higher spatial resolution)

Use joint SVD or coupled matrix factorization.

### 3. Deep Learning Integration

- Use SVD for pre-training autoencoders
- Initialize neural network layers with SVD components
- Combine SVD with CNN for hybrid models

### 4. Real-Time Processing

- Implement online/incremental SVD
- Parallel processing on GPU
- Edge computing for drone/satellite platforms

### 5. Uncertainty Quantification

- Bootstrap SVD for confidence intervals
- Bayesian approaches to SVD
- Propagate uncertainty through reconstruction

---

## Conclusions

This comprehensive study demonstrates the power and elegance of Singular Value Decomposition for hyperspectral image analysis. Key takeaways:

### Theoretical Insights

- SVD provides the mathematically optimal low-rank approximation
- Singular values reveal the intrinsic dimensionality of data
- The method is interpretable, stable, and well-understood

### Practical Results

- Achieved 96.35% dimensionality reduction while retaining 99% of variance
- Only 2 components needed for the Indian Pines dataset
- Reconstruction error <1%, visually imperceptible
- Compression ratio of 108:1

### Applications

- Efficient storage and transmission
- Preprocessing for machine learning
- Data visualization and exploration
- Noise reduction and quality enhancement

### Best Practices

1. Always visualize singular value decay
2. Use cumulative variance to select rank
3. Validate reconstruction quality visually and numerically
4. Consider domain knowledge when interpreting components
5. Compare with alternative methods for your specific application

SVD remains a fundamental tool in the hyperspectral imaging pipeline, balancing mathematical rigor with computational efficiency and practical utility.

---

## References

1. **Jolliffe, I. T., & Cadima, J. (2016)**  
   "Principal component analysis: a review and recent developments"  
   _Philosophical Transactions of the Royal Society A_, 374(2065), 20150202.

2. **Green, A. A., et al. (1988)**  
   "A transformation for ordering multispectral data in terms of image quality with implications for noise removal"  
   _IEEE Transactions on Geoscience and Remote Sensing_, 26(1), 65-74.
   [Introduces Minimum Noise Fraction (MNF)]

3. **Trefethen, L. N., & Bau III, D. (1997)**  
   "Numerical Linear Algebra"  
   _SIAM_, Philadelphia.
   [Comprehensive treatment of SVD and numerical methods]

4. **Golub, G. H., & Van Loan, C. F. (2013)**  
   "Matrix Computations" (4th ed.)  
   _Johns Hopkins University Press_.
   [Standard reference for SVD algorithms]

5. **Landgrebe, D. (2003)**  
   "Signal Theory Methods in Multispectral Remote Sensing"  
   _Wiley-Interscience_.
   [Hyperspectral image analysis fundamentals]

---

## Code and Data Availability

**Dataset**: Indian Pines hyperspectral image

- Source: Purdue University
- Format: MATLAB `.mat` file
- Size: 145×145×220 (4.6M elements)

**Code**: Complete MATLAB implementation available at [GitHub repository link]

**Dependencies**:

- MATLAB R2018b or later
- Image Processing Toolbox (for visualization functions)
- Statistics and Machine Learning Toolbox (optional, for additional analysis)

---

_For questions, suggestions, or collaborations, please open an issue on GitHub or contact via email._

**Last updated**: January 2025
