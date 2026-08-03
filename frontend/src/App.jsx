import React, { useState } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import CommandCenterDashboard from './components/screens/CommandCenterDashboard';
import GisMonitoringScreen from './components/screens/GisMonitoringScreen';
import SatelliteIntelligenceScreen from './components/screens/SatelliteIntelligenceScreen';
import DroneVerificationScreen from './components/screens/DroneVerificationScreen';
import VehicleAnalyticsScreen from './components/screens/VehicleAnalyticsScreen';
import AiPredictionScreen from './components/screens/AiPredictionScreen';
import AiExplainabilityScreen from './components/screens/AiExplainabilityScreen';
import AlertManagementScreen from './components/screens/AlertManagementScreen';
import ReportGenerationScreen from './components/screens/ReportGenerationScreen';
import MobileFieldOfficerApp from './components/screens/MobileFieldOfficerApp';
import LoginScreen from './components/screens/LoginScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [renderEngine, setRenderEngine] = useState('REACT');

  const stitchMap = {
    dashboard: '/stitch_html/02_command_center_dashboard.html',
    gis: '/stitch_html/03_gis_monitoring.html',
    satellite: '/stitch_html/04_satellite_intelligence.html',
    drone: '/stitch_html/05_drone_verification.html',
    vehicle: '/stitch_html/06_vehicle_analytics.html',
    prediction: '/stitch_html/07_ai_prediction.html',
    xai: '/stitch_html/08_ai_explainability.html',
    alerts: '/stitch_html/09_alert_management.html',
    reports: '/stitch_html/10_report_generation.html',
    mobile: '/stitch_html/11_mobile_field_officer.html',
    login: '/stitch_html/01_login.html'
  };

  const handleNavigate = (screenId) => {
    setCurrentScreen(screenId);
  };

  const handleToggleEngine = () => {
    setRenderEngine(prev => (prev === 'REACT' ? 'STITCH' : 'REACT'));
  };

  if (currentScreen === 'login') {
    if (renderEngine === 'REACT') {
      return (
        <div className="w-screen h-screen bg-[var(--bg-sand-dark)] overflow-hidden">
          <LoginScreen onLoginSuccess={() => setCurrentScreen('dashboard')} />
        </div>
      );
    }
  }

  return (
    <div className="w-screen h-screen bg-[var(--bg-sand-dark)] flex flex-col overflow-hidden text-[var(--text-primary)] font-sans select-none">
      {/* Top Header Navigation Bar */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        renderEngine={renderEngine}
        onToggleEngine={handleToggleEngine}
      />

      {/* Main Container */}
      <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
        />

        {/* Content Canvas */}
        <main className="flex-1 h-full overflow-y-auto p-6 bg-[var(--bg-sand-panel)] relative">
          {renderEngine === 'REACT' ? (
            <>
              {currentScreen === 'dashboard' && <CommandCenterDashboard onNavigate={handleNavigate} />}
              {currentScreen === 'gis' && <GisMonitoringScreen onNavigate={handleNavigate} />}
              {currentScreen === 'satellite' && <SatelliteIntelligenceScreen onNavigate={handleNavigate} />}
              {currentScreen === 'drone' && <DroneVerificationScreen onNavigate={handleNavigate} />}
              {currentScreen === 'vehicle' && <VehicleAnalyticsScreen onNavigate={handleNavigate} />}
              {currentScreen === 'prediction' && <AiPredictionScreen onNavigate={handleNavigate} />}
              {currentScreen === 'xai' && <AiExplainabilityScreen onNavigate={handleNavigate} />}
              {currentScreen === 'alerts' && <AlertManagementScreen onNavigate={handleNavigate} />}
              {currentScreen === 'reports' && <ReportGenerationScreen onNavigate={handleNavigate} />}
              {currentScreen === 'mobile' && <MobileFieldOfficerApp onNavigate={handleNavigate} />}
            </>
          ) : (
            <iframe
              src={stitchMap[currentScreen] || stitchMap.dashboard}
              title={`Sand Guard - ${currentScreen}`}
              className="w-full h-full border-none rounded-xl bg-[#151007]"
            />
          )}
        </main>
      </div>
    </div>
  );
}
