import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
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