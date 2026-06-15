import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Shell } from '../components/layout/Shell';
import { AiAssistantPage } from '../features/ai/AiAssistantPage';
import { DashboardPage } from '../features/dashboards/DashboardPage';
import { DoctorsPage } from '../features/doctors/DoctorsPage';
import { HomePage } from '../features/public/HomePage';
import { AuthPage } from '../features/auth/AuthPage';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Shell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route
              path="/patient"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <DashboardPage role="patient" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DashboardPage role="doctor" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assistant"
              element={
                <ProtectedRoute allowedRoles={['assistant']}>
                  <DashboardPage role="assistant" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardPage role="admin" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/super-admin"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <DashboardPage role="superAdmin" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai"
              element={
                <ProtectedRoute>
                  <AiAssistantPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Shell>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
