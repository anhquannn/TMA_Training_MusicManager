import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';

import authService from './services/auth/auth.service';
import { api, AuthTokenManager } from './services/apiService';

import { BrowserUtils } from './utils/browserUtils';

import { ROUTES, TOAST_CONFIG } from './constants/app.constants';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return authService.isAuthenticated() ? <>{children}</> : <Navigate to={ROUTES.LOGIN} />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return !authService.isAuthenticated() ? <>{children}</> : <Navigate to={ROUTES.DASHBOARD} />;
};

function App() {
  useEffect(() => {
    BrowserUtils.init();
    const token = AuthTokenManager.getAccessToken();
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path={ROUTES.LOGIN} 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path={ROUTES.REGISTER} 
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } 
          />
          <Route 
            path={ROUTES.FORGOT_PASSWORD} 
            element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            } 
          />

          <Route 
            path={ROUTES.DASHBOARD} 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />

          <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} />} />
          <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} />} />
        </Routes>

        <ToastContainer
          position={TOAST_CONFIG.POSITION}
          autoClose={TOAST_CONFIG.AUTO_CLOSE}
          hideProgressBar={TOAST_CONFIG.HIDE_PROGRESS_BAR}
          closeOnClick={TOAST_CONFIG.CLOSE_ON_CLICK}
          pauseOnHover={TOAST_CONFIG.PAUSE_ON_HOVER}
          draggable={TOAST_CONFIG.DRAGGABLE}
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;