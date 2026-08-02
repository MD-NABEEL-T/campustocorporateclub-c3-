import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import ClickSpark from './components/ClickSpark';

// Layouts
import { PublicLayout } from './components/layouts/PublicLayout';
import { DashboardLayout } from './components/layouts/DashboardLayout';

// Public Pages
import Home from './pages/public/Home';
import PublicSessions from './pages/public/PublicSessions';
import Gallery from './pages/public/Gallery';
import Apply from './pages/public/Apply';
import Login from './pages/public/Login';

// Member Portal Pages
import Dashboard from './pages/member/Dashboard';
import MyAttendance from './pages/member/MyAttendance';
import Sessions from './pages/member/Sessions';
import SessionDetail from './pages/member/SessionDetail';

// Admin Portal Pages
import AllAttendance from './pages/admin/AllAttendance';
import SessionForm from './pages/admin/SessionForm';
import EventForm from './pages/admin/EventForm';

// Nav clicks route hash links (#about) to "/#about". React Router doesn't
// auto-scroll on that, so this watches the URL and scrolls to the matching
// section - retrying briefly in case the page (and its sections) just mounted.
const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    let attempts = 0;
    let frameId;

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (attempts < 30) {
        attempts += 1;
        frameId = requestAnimationFrame(tryScroll);
      }
    };
    tryScroll();

    return () => cancelAnimationFrame(frameId);
  }, [location.pathname, location.hash]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <ScrollToHash />
          <ClickSpark sparkColor="#ffffff" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
            <Routes>
{/* Public Layout Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
                <Route path="/sessions-archive" element={<PublicSessions />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/apply" element={<Apply />} />
                <Route path="/login" element={<Login />} />
              </Route>

              {/* Member Portal Protected Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/attendance" element={<MyAttendance />} />
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/sessions/:id" element={<SessionDetail />} />
              </Route>

              {/* Admin Portal Protected Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="members" element={<AllAttendance />} />
                <Route path="sessions" element={<Sessions />} />
                <Route path="sessions/new" element={<SessionForm />} />
                <Route path="events" element={<EventForm />} />
                <Route path="attendance" element={<AllAttendance />} />
              </Route>

              {/* Catch-all Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ClickSpark>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;