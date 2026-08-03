# SandGuard AI

**AI-Based Illegal Sand Mining Detection and Monitoring System**

🚧 *Project Status: Under Development* — currently focused on building the AI pipeline, geospatial processing workflow, and monitoring dashboard.

---

## Overview

SandGuard AI is a geospatial intelligence platform designed to identify potential illegal sand mining activities using satellite imagery, drone-based verification, road surveillance analysis, and machine learning-based risk assessment.

The system focuses on detecting **indirect indicators** of sand mining, since underwater dredging activities are difficult to identify directly from satellite images.

## Problem

Illegal sand mining affects river ecosystems by causing:

- Riverbed degradation
- Groundwater imbalance
- Loss of biodiversity
- Increased erosion
- Uncontrolled extraction of natural resources

Current monitoring approaches mainly depend on manual inspection, which is time-consuming and difficult to scale across large geographical areas. SandGuard AI aims to provide an automated monitoring approach by combining multiple data sources and generating evidence-based risk alerts.

## System Overview

SandGuard AI processes information from multiple sources through a unified pipeline:

```
Satellite Data ──┐
Drone Images ─────┼──► AI Processing Pipeline ──► Evidence Fusion & Risk Analysis ──► GIS Monitoring Dashboard
Road Surveillance ┘
```

## Features

### 1. Satellite Image Analysis

Analyzes multi-temporal satellite imagery to identify environmental changes associated with sand mining.

**Data sources:** Sentinel-2, Landsat

**Processing pipeline:**
- Cloud removal
- Image enhancement
- Land/water segmentation
- Change detection

**Detected indicators:**
- River morphology changes
- Water turbidity variation
- Sandbar changes
- Vegetation loss
- Shoreline displacement

### 2. AI-Based Change Detection

Historical and recent satellite images are compared to identify unusual changes.

**Possible approaches:**
- Siamese Network based change detection
- U-Net segmentation
- DeepLabV3+

**Example output:**

| Field | Value |
|---|---|
| Location | River Zone A |
| Detected Change | High |
| Change Score | 0.87 |

### 3. Drone-Based Verification

Satellite analysis identifies suspicious locations, which are then verified using drone imagery.

**Model:** YOLO-based object detection

**Object detection includes:**
- Excavators
- Dredging vessels
- Sand piles
- Heavy vehicles

**Example output:**

| Field | Value |
|---|---|
| Object | Excavator |
| Confidence | 92% |
| Coordinates | Latitude, Longitude |

### 4. Road and Tollgate Analytics

Illegal sand extraction usually involves transportation. The system analyzes vehicle movement patterns using:

- Vehicle detection
- Number plate recognition
- Route tracking
- Repeated trip analysis

**Example output:**

| Field | Value |
|---|---|
| Vehicle | TN52 AB4321 |
| Repeated Trips | 12 |
| Route Pattern | River area → Storage location |

### 5. Environmental Impact Analysis

Environmental indicators are calculated to understand the impact of mining activities.

**Indicators:**
- NDVI (Normalized Difference Vegetation Index)
- NDWI (Normalized Difference Water Index)
- Bare Soil Index
- River width variation
- Sediment changes

## Risk Assessment Engine

Multiple evidence sources are combined to calculate a unified mining risk score.

**Evidence weighting:**

| Source | Contribution |
|---|---|
| Satellite Analysis | 30% |
| Drone Detection | 20% |
| Vehicle Evidence | 20% |
| Movement Pattern | 10% |
| Vegetation Change | 10% |
| River Impact | 10% |

**Machine learning models:** XGBoost, LightGBM

**Example output:**

| Field | Value |
|---|---|
| Mining Risk Score | 90% |
| Risk Category | HIGH |

## Dashboard

The web dashboard provides:

- Interactive GIS map
- Suspicious zone visualization
- Risk score display
- Historical comparison
- Detection reports
- Evidence summary

## Technology Stack

**Machine Learning**
- Python
- PyTorch
- OpenCV
- YOLO
- U-Net
- XGBoost

**Geospatial Processing**
- Google Earth Engine
- Rasterio
- GeoPandas
- PostGIS

**Backend**
- FastAPI
- PostgreSQL
- PostGIS

**Frontend**
- React.js
- Leaflet / Mapbox
- Chart.js

## Project Architecture

```
Data Sources
     │
     ▼
Preprocessing
     │
     ▼
AI Models
     │
     ▼
Evidence Fusion
     │
     ▼
Risk Prediction
     │
     ▼
Dashboard
```
<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/b9a1ab12-8890-4c94-9246-ae0c1ec7eb9a" />


## Future Improvements

- Real-time satellite monitoring
- Automated drone deployment
- Mobile application for field verification
- Government GIS integration
- Improved temporal prediction models

---
