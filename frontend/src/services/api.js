/**
 * SandGuard AI - API Client Service
 * Connects frontend React components and Stitch scripts directly to the FastAPI Backend API (/api/v1).
 */

const API_BASE_URL = 'http://localhost:8000/api/v1';

async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    try {
        const response = await fetch(url, { ...options, headers });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `API request failed with status ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        console.warn(`[SandGuard API Warning] Endpoint ${endpoint} request error:`, err.message);
        throw err;
    }
}

export const api = {
    // Health Check
    getHealth: () => fetch('http://localhost:8000/health').then(res => res.json()),

    // Executive Dashboard & Analytics
    getDashboardSummary: () => request('/dashboard/summary'),
    getDistrictHotspots: () => request('/analytics/hotspots'),

    // Satellite Intelligence
    getSatelliteImages: (sensorType) => request(`/satellite/${sensorType ? `?sensor_type=${sensorType}` : ''}`),
    searchExternalSatellite: (formData) => request('/satellite/search-external', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData)
    }),

    // Mining Sites & Events
    getMiningSites: () => request('/mining/sites'),
    getIllegalEvents: (severity) => request(`/mining/events${severity ? `?severity=${severity}` : ''}`),
    getHighRiskScores: (threshold = 50) => request(`/mining/risk-scores?threshold=${threshold}`),

    // AI Engine & Detection
    getAiModels: () => request('/ai/models'),
    triggerAiDetection: (imageId, detectionModel = 'yolo', segmentationModel = 'segformer') => request(
        `/ai/detect?satellite_image_id=${imageId}&detection_model=${detectionModel}&segmentation_model=${segmentationModel}`,
        { method: 'POST' }
    ),
    runAgentInvestigation: (districtName, lat, lng) => request('/agents/investigate', {
        method: 'POST',
        body: JSON.stringify({ district_name: districtName, latitude: lat, longitude: lng })
    }),

    // Alerts & Notifications
    getActiveAlerts: () => request('/alerts/'),
    acknowledgeAlert: (alertId) => request(`/alerts/${alertId}/acknowledge`, { method: 'POST' }),
    dispatchNotification: (title, districtName, message) => request(
        `/notifications/dispatch?title=${encodeURIComponent(title)}&district_name=${encodeURIComponent(districtName)}&message=${encodeURIComponent(message)}`,
        { method: 'POST' }
    ),

    // Reports Engine
    generateReport: (title, reportType = 'COURT_DOSSIER', format = 'PDF', districtName = 'Bhavani River') => request('/reports/generate', {
        method: 'POST',
        body: JSON.stringify({ title, report_type: reportType, format, district_name: districtName })
    }),
    getReports: () => request('/reports/'),

    // Auth
    login: (username, password) => {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        return request('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });
    }
};

export default api;
