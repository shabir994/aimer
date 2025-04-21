import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthLayout from './components/AuthLayout';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import EmotionalAnalysis from './pages/EmotionalAnalysis';
import MotivationHub from './pages/MotivationHub';
import RealTimeAssistance from './pages/RealTimeAssistance';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NotificationProvider>
          <Router>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth/*" element={<AuthLayout />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="emotional-analysis" element={<EmotionalAnalysis />} />
                  <Route path="motivation-hub" element={<MotivationHub />} />
                  <Route path="real-time-assistance" element={<RealTimeAssistance />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>
            </AuthProvider>
          </Router>
        </NotificationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;