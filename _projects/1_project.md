---
layout: page
title: 3D Computer Vision & Robotics
description: Calibrating the robot's environment using camera calibration with DLT, followed by cube picking and transporting it to a designated location
img: assets/img/robotic-vision/3.png
importance: 1
category: research
related_publications: false
---

<h2>📷 1. Camera Calibration (DLT)</h2>
<p>To convert 2D image coordinates into 3D world coordinates, the camera was calibrated using the <strong>Direct Linear Transform (DLT)</strong>. A known set of 3D-2D correspondences was used to estimate the projection matrix <code>P</code>, allowing us to reconstruct 3D coordinates from a single image.</p>

<h3>🔧 Key Steps</h3>
<ol>
    <li>Capture known 3D object points and their 2D image projections.</li>
    <li>Solve for the 3x4 projection matrix <code>P</code> using least squares.</li>
    <li>Use <code>P</code> to map future 2D detections into 3D world space.</li>
</ol>

<h2>📍 2. Localization of Robot and Objects</h2>
<p>Using the camera's projection matrix, we estimate the 3D positions of all important elements:</p>
<ul>
    <li>Robot base and arm</li>
    <li>Colored cubes (<code>r_cube</code>, <code>g_cube</code>, <code>b_cube</code>)</li>
    <li>Target locations (<code>*_target</code>)</li>
</ul>

<h3>🔲 2D View of Localized Points (Z Flattened)</h3>
<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/3dplot.png" title="2D Plot of Localized Points" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/newplot.png" title="2D Plot of Localized Points" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

<h3>🧭 3D Spatial Layout</h3>
<p>The following 3D plot visualizes the spatial relationship between robot components and objects:</p>
<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/3dplot.png" title="3D Point Plot" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

<h2>📐 3. Distance and Angle Computation</h2>
<p>Once all objects are localized, we compute:</p>
<ul>
    <li><strong>Euclidean Distance</strong> from the robot's arm to each cube.</li>
    <li><strong>Orientation Angle</strong> required for the arm to align with the cube's position.</li>
</ul>

## Demo Video

Click the image below to watch the result:

[![Watch the video](https://img.youtube.com/vi/83yQuB9Ru-Y/0.jpg)](https://youtu.be/83yQuB9Ru-Y)
