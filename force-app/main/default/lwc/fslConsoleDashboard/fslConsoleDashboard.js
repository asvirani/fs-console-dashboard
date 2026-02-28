import { LightningElement, wire } from 'lwc';
import getDashboardData from '@salesforce/apex/FSLDashboardController.getDashboardData';

export default class FslConsoleDashboard extends LightningElement {
    data;
    error;
    isLoading = true;
    lastRefresh;

    @wire(getDashboardData)
    wiredData({ error, data }) {
        if (data) {
            this.data = data;
            this.error = undefined;
            this.isLoading = false;
            this.lastRefresh = new Date().toLocaleTimeString();
        } else if (error) {
            this.error = error;
            this.data = undefined;
            this.isLoading = false;
        }
    }

    get hasData() {
        return this.data != null;
    }

    // ===== 1. PM Compliance =====
    get pmComplianceRate() {
        return this.data?.pmComplianceRate ?? 0;
    }
    get pmComplianceClass() {
        const rate = this.pmComplianceRate;
        if (rate >= 90) return 'kpi-value kpi-good';
        if (rate >= 75) return 'kpi-value kpi-warning';
        return 'kpi-value kpi-critical';
    }
    get pmScheduled() {
        return this.data?.pmScheduled ?? 0;
    }
    get pmCompletedOnTime() {
        return this.data?.pmCompletedOnTime ?? 0;
    }
    get pmOverdue() {
        return this.data?.pmOverdue ?? 0;
    }
    get pmComplianceGaugeStyle() {
        return `width: ${Math.min(this.pmComplianceRate, 100)}%`;
    }

    // ===== 2. Critical Assets Down =====
    get criticalAssetsDown() {
        return this.data?.criticalAssetsDown ?? 0;
    }
    get criticalAssetsList() {
        return (this.data?.criticalAssetsList ?? []).map(a => ({
            ...a,
            hoursDownFormatted: a.hoursDown != null ? Number(a.hoursDown).toFixed(1) + 'h' : 'N/A',
            downSinceFormatted: a.downSince ? new Date(a.downSince).toLocaleString() : 'N/A'
        }));
    }
    get hasCriticalAssets() {
        return this.criticalAssetsDown > 0;
    }
    get criticalAssetsClass() {
        return this.criticalAssetsDown > 0 ? 'kpi-value kpi-critical' : 'kpi-value kpi-good';
    }

    // ===== 3. Asset Availability =====
    get fleetAvailability() {
        return this.data?.fleetAvailability ?? 0;
    }
    get availabilityClass() {
        const rate = this.fleetAvailability;
        if (rate >= 98) return 'kpi-value kpi-good';
        if (rate >= 95) return 'kpi-value kpi-warning';
        return 'kpi-value kpi-critical';
    }
    get totalInstalledAssets() {
        return this.data?.totalInstalledAssets ?? 0;
    }
    get assetsAboveThreshold() {
        return this.data?.assetsAboveThreshold ?? 0;
    }
    get availabilityGaugeStyle() {
        return `width: ${Math.min(this.fleetAvailability, 100)}%`;
    }
    get assetsBelowThreshold() {
        return this.totalInstalledAssets - this.assetsAboveThreshold;
    }

    // ===== 4. MTTR =====
    get overallMTTR() {
        return this.data?.overallMTTR ?? 0;
    }
    get mttrClass() {
        const h = this.overallMTTR;
        if (h <= 4) return 'kpi-value kpi-good';
        if (h <= 8) return 'kpi-value kpi-warning';
        return 'kpi-value kpi-critical';
    }
    get mttrByProductLine() {
        return (this.data?.mttrByProductLine ?? []).map(m => ({
            ...m,
            barWidth: `width: ${Math.min((m.avgHours / 24) * 100, 100)}%`,
            avgHoursFormatted: Number(m.avgHours).toFixed(1)
        }));
    }
    get hasMttrData() {
        return this.mttrByProductLine.length > 0;
    }

    // ===== 5. SLA Compliance =====
    get slaComplianceRate() {
        return this.data?.slaComplianceRate ?? 0;
    }
    get slaClass() {
        const rate = this.slaComplianceRate;
        if (rate >= 95) return 'kpi-value kpi-good';
        if (rate >= 85) return 'kpi-value kpi-warning';
        return 'kpi-value kpi-critical';
    }
    get slaCriticalTotal() {
        return this.data?.slaCriticalTotal ?? 0;
    }
    get slaMetCount() {
        return this.data?.slaMetCount ?? 0;
    }
    get slaMissed() {
        return this.slaCriticalTotal - this.slaMetCount;
    }
    get slaGaugeStyle() {
        return `width: ${Math.min(this.slaComplianceRate, 100)}%`;
    }

    // ===== 6. FTFR =====
    get firstTimeFixRate() {
        return this.data?.firstTimeFixRate ?? 0;
    }
    get ftfrClass() {
        const rate = this.firstTimeFixRate;
        if (rate >= 85) return 'kpi-value kpi-good';
        if (rate >= 75) return 'kpi-value kpi-warning';
        return 'kpi-value kpi-critical';
    }
    get totalResolved() {
        return this.data?.totalResolved ?? 0;
    }
    get resolvedFirstVisit() {
        return this.data?.resolvedFirstVisit ?? 0;
    }
    get resolvedRepeatVisit() {
        return this.totalResolved - this.resolvedFirstVisit;
    }
    get ftfrGaugeStyle() {
        return `width: ${Math.min(this.firstTimeFixRate, 100)}%`;
    }

    // ===== 7. Open Recalls =====
    get openRecallCampaigns() {
        return this.data?.openRecallCampaigns ?? 0;
    }
    get affectedAssets() {
        return this.data?.affectedAssets ?? 0;
    }
    get remediationPercent() {
        return this.data?.remediationPercent ?? 0;
    }
    get remediationGaugeStyle() {
        return `width: ${Math.min(this.remediationPercent, 100)}%`;
    }
    get recallClass() {
        return this.openRecallCampaigns > 0 ? 'kpi-value kpi-warning' : 'kpi-value kpi-good';
    }

    // ===== 8. Contract Renewal Risk =====
    get contractsExpiring90() {
        return this.data?.contractsExpiring90 ?? 0;
    }
    get contractsRenewing() {
        return this.data?.contractsRenewing ?? 0;
    }
    get contractsAtRisk() {
        return this.data?.contractsAtRisk ?? 0;
    }
    get contractsLapsed() {
        return this.data?.contractsLapsed ?? 0;
    }
    get contractRiskClass() {
        if (this.contractsAtRisk > 3) return 'kpi-value kpi-critical';
        if (this.contractsAtRisk > 0) return 'kpi-value kpi-warning';
        return 'kpi-value kpi-good';
    }

    handleRefresh() {
        this.isLoading = true;
        getDashboardData()
            .then(result => {
                this.data = result;
                this.error = undefined;
                this.isLoading = false;
                this.lastRefresh = new Date().toLocaleTimeString();
            })
            .catch(error => {
                this.error = error;
                this.isLoading = false;
            });
    }
}