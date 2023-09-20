import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { AlertProvider } from './shared/AlertContext';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';
import EmailVerification from './auth/EmailVerification';
import Alert from './shared/Alert';
import UserProfile from './user/UserProfile';
import './App.css';
import ResetPasswordForm from './user/ResetPasswordForm';
import RequestPasswordResetForm from './user/RequestPasswordResetForm';
import LandingPage from './pages/LandingPage';
import Dashboard from './dashboard/Dashboard';
import IPAddressView from './ip-address/IPAddressView';
import CollectorList from './collector/CollectorList';
import IPAddressList from './ip-address/IPAddressList';
import IncidentList from './incident/IncidentList';
import IncidentView from './incident/IncidentView';
import CollectorView from './collector/CollectorView';
import NotificationList from './notification/NotificationList';

function App() {
  return (
    <Router>
      <AlertProvider>
        <AuthProvider>
          <Alert />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/verify/:token" element={<EmailVerification />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/request-password-reset" element={<RequestPasswordResetForm />} />
            <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ip-addresses" element={<IPAddressList />} />
            <Route path="/ip-address" element={<IPAddressView />} />
            <Route path="/ip-address/:ip" element={<IPAddressView />} />
            <Route path="/collector" element={<CollectorList />} />
            <Route path="/collector/:id" element={<CollectorView />} />
            <Route path="/incidents" element={<IncidentList />} />
            <Route path="/incident/:id" element={<IncidentView />} />
            <Route path="/notifications" element={<NotificationList />} />
          </Routes>
        </AuthProvider>
      </AlertProvider>
    </Router>
  );
}

export default App;
