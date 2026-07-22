import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from './components/layouts/AuthLayout';
import { AppShell } from './components/layouts/AppShell';
import { ProtectedRoute } from './routes/ProtectedRoute';
import Home from './pages/Home';
import LiveMonitoring from './pages/LiveMonitoring';
import UploadVideo from './pages/UploadVideo';
import Reports from './pages/Reports';
import FAQ from './pages/FAQ';
import About from './pages/About';
import Profile from './pages/Profile';
import Login from './pages/Login';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthLayout />}>
        <Route index element={<Login />} />
      </Route>

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="live-monitoring" element={<LiveMonitoring />} />
        <Route path="upload-video" element={<UploadVideo />} />
        <Route path="reports" element={<Reports />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="about" element={<About />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
