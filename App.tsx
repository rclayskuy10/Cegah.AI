import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ChatAssistant from './pages/ChatAssistant';
import DamageReporter from './pages/DamageReporter';
import RiskAssessment from './pages/RiskAssessment';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chat" element={<ChatAssistant />} />
          <Route path="/report" element={<DamageReporter />} />
          <Route path="/risk" element={<RiskAssessment />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;