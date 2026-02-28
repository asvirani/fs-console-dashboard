# Field Service — Console Dashboard

A comprehensive Lightning Web Component dashboard for Salesforce Field Service operations. Provides 8 real-time KPI widgets covering PM compliance, critical assets, fleet availability, MTTR, SLA compliance, first-time fix rate, open recalls, and contract renewal risk. Includes a configurable settings admin panel, chart library, and mobile-optimized view.

![Console Dashboard Screenshot](docs/screenshot-placeholder.png)

## What's Included

### Lightning Web Components

#### Core Dashboard
| Component | Description |
|---|---|
| `fslConsoleDashboard` | Main console dashboard — 8 KPI widgets for operational monitoring |
| `mainDashboard` | Configurable dashboard with dynamic card rendering |
| `sfs_dashboard_mobile` | Mobile-optimized dashboard view |

#### Dashboard Admin & Settings
| Component | Description |
|---|---|
| `dashboardSettingsMain` | Admin settings panel — create, edit, reorder, and delete dashboard cards |
| `dashboardSettingsCard` | Individual card configuration with preview |
| `dashboardAddButton` | Add new card button |
| `dashboardIconsPicker` | Icon selection for dashboard cards |
| `dashboardToastMessage` | Toast notification component |
| `editCardModal` | Modal for editing card filters and configuration |
| `basicFilter` | Filter builder for dashboard card queries |
| `subFilterCard` | Sub-filter configuration card |
| `subFilterSummaryComponent` | Sub-filter summary display |
| `summaryComponent` | Data summary component with GraphQL support |

#### Chart Library
| Component | Description |
|---|---|
| `chart` | Base Chart.js wrapper component |
| `chartBuilder` | Dynamic chart builder with Apex data provider |
| `chartConfigService` | Chart configuration service |
| `data` | Chart data element |
| `dataset` | Chart dataset container |
| `legend` | Chart legend |
| `title` | Chart title |
| `cartesianAxis` | Base Cartesian axis |
| `cartesianCategoryAxis` | Category axis for bar/line charts |
| `cartesianLinearAxis` | Linear numeric axis |
| `cartesianLogarithmicAxis` | Logarithmic scale axis |
| `cartesianTimeAxis` | Time-based axis |
| `radialLinearAxis` | Radial axis for radar/polar charts |

### Apex Controllers

| Class | Description |
|---|---|
| `FSLDashboardController` | Main KPI controller — queries WorkOrder, Asset, AssetDowntimePeriod, Case, and ServiceContract for 8 dashboard metrics |
| `ChartBuilderController` | Dynamic chart data provider proxy |
| `ChartDataProvider` | Abstract chart data provider interface |
| `ChartDataProviderTest` | Test class for ChartDataProvider |
| `DashboardSettingsService` | CRUD operations for `Mobile_Dashboard_Setting__c` — admin-only card management |
| `serviceAppointmentSearchController` | Service appointment search, product request creation, and mobile chart data |

## KPI Widgets

1. **PM Compliance Rate** — Preventive maintenance completion vs. scheduled
2. **Critical Assets Down** — Assets with active unplanned downtime
3. **Fleet Availability %** — Average availability across installed assets
4. **MTTR by Product Line** — Mean time to repair grouped by product family
5. **SLA Compliance** — Critical work order response time adherence
6. **First Time Fix Rate** — Percentage of issues resolved on first visit
7. **Open Recalls** — Active product recall campaigns and remediation progress
8. **Contract Renewal Risk** — Service contracts expiring within 90 days

## Prerequisites

- Salesforce org with **Field Service** enabled
- **Asset Lifecycle Management** features enabled (AssetWarranty, AssetDowntimePeriod)
- Custom object: `Mobile_Dashboard_Setting__c` (for configurable dashboard cards)
- Custom metadata type: `DemoChartSFS__mdt` (for mobile chart configuration)
- Salesforce CLI (`sf`) installed locally

## Installation

### Option 1: Unlocked Package Install (Recommended)

Install directly via URL:

https://login.salesforce.com/packaging/installPackage.apexp?p0=04tKa000002bKcmIAE

Or via CLI:

```bash
sf package install --package 04tKa000002bKcmIAE --target-org my-org --wait 10
```

### Option 2: Deploy Source via CLI

```bash
# Clone the repo
git clone https://github.com/asvirani/fs-console-dashboard.git
cd fs-console-dashboard

# Authenticate to your org
sf org login web --alias my-org

# Deploy using the manifest
sf project deploy start --manifest manifest/package.xml --target-org my-org
```

### Option 3: Deploy Source Directly

```bash
sf project deploy start --source-dir force-app --target-org my-org
```

### After Deployment

1. Navigate to an **App Page** or **Home Page** in Lightning App Builder
2. Drag the **Console Dashboard** component onto the page layout
3. For the configurable dashboard, use the **Dashboard Settings** admin panel to create and manage KPI cards

## Project Structure

```
fs-console-dashboard/
├── force-app/main/default/
│   ├── classes/                          # Apex controllers
│   │   ├── FSLDashboardController.cls    # Main KPI data provider
│   │   ├── ChartBuilderController.cls    # Chart data proxy
│   │   ├── ChartDataProvider.cls         # Abstract data provider
│   │   ├── DashboardSettingsService.cls  # Dashboard admin CRUD
│   │   └── serviceAppointmentSearchController.cls
│   └── lwc/                              # Lightning Web Components
│       ├── fslConsoleDashboard/          # Main dashboard
│       ├── mainDashboard/                # Configurable dashboard
│       ├── sfs_dashboard_mobile/         # Mobile view
│       ├── dashboardSettingsMain/        # Admin settings
│       ├── chartBuilder/                 # Chart library
│       └── ...                           # 20+ supporting components
├── manifest/
│   └── package.xml                       # Deployment manifest
├── config/
│   └── project-scratch-def.json
└── sfdx-project.json
```

## Author

**Armaan Virani**
