import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ChatAssistant from './pages/ChatAssistant';
import DamageReporter from './pages/DamageReporter';
import RiskAssessment from './pages/RiskAssessment';
import EmergencyChecklist from './pages/EmergencyChecklist';
import EarthquakeHistory from './pages/EarthquakeHistory';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<ChatAssistant />} />
            <Route path="/report" element={<DamageReporter />} />
            <Route path="/risk" element={<RiskAssessment />} />
            <Route path="/checklist" element={<EmergencyChecklist />} />
            <Route path="/earthquakes" element={<EarthquakeHistory />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;