import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// New Pages
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import QRGeneratorPage from './pages/QRGeneratorPage';
import NotFoundPage from './pages/NotFoundPage';
import ExpiredPage from './pages/ExpiredPage';

// Loader component for auth checking state
function AppLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <div className="w-10 h-10 border-[3px] border-coral border-t-transparent rounded-full animate-[spin_1s_linear_infinite]" />
    </div>
  );
}

function HomeRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <AppLoader />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Home />;
}

function GuestOnly({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <AppLoader />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public / Guest Routes */}
      <Route path="/" element={<HomeRoute />} />
      <Route
        path="/login"
        element={
          <GuestOnly>
            <LoginPage />
          </GuestOnly>
        }
      />
      <Route
        path="/register"
        element={
          <GuestOnly>
            <SignupPage />
          </GuestOnly>
        }
      />
      <Route path="/forgot-password" element={<GuestOnly><ForgotPasswordPage /></GuestOnly>} />
      <Route path="/reset-password/:token" element={<GuestOnly><ResetPasswordPage /></GuestOnly>} />
      
      {/* Informational / Public Routes */}
      <Route path="/expired" element={<ExpiredPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics/:urlId"
        element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* QR Generator Route */}
      <Route path="/qr-generator" element={<ProtectedRoute><QRGeneratorPage /></ProtectedRoute>} />
      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
      
    </Routes>
  );
}
