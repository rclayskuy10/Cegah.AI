import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Onboarding from './components/Onboarding';
import Dashboard from './pages/Dashboard';
import ChatAssistant from './pages/ChatAssistant';
import DamageReporter from './pages/DamageReporter';
import RiskAssessment from './pages/RiskAssessment';
import EmergencyChecklist from './pages/EmergencyChecklist';
import EarthquakeHistory from './pages/EarthquakeHistory';
import EmergencySOS from './pages/EmergencySOS';
import CommunityReports from './pages/CommunityReports';

const App: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return localStorage.getItem('cegah-onboarding-done') !== 'true';
  });

  return (
    <ThemeProvider>
      {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<ChatAssistant />} />
            <Route path="/report" element={<DamageReporter />} />
            <Route path="/risk" element={<RiskAssessment />} />
            <Route path="/checklist" element={<EmergencyChecklist />} />
            <Route path="/earthquakes" element={<EarthquakeHistory />} />
            <Route path="/sos" element={<EmergencySOS />} />
            <Route path="/community" element={<CommunityReports />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;