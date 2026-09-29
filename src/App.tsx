import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { ManualVerifyPage } from './pages/ManualVerifyPage';
import { ManufacturerFormPage } from './pages/ManufacturerFormPage';
import { ManufacturersListPage } from './pages/ManufacturersListPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProductFormPage } from './pages/ProductFormPage';
import { ProductsListPage } from './pages/ProductsListPage';
import { ScanPage } from './pages/ScanPage';
import { VerificationHistoryPage } from './pages/VerificationHistoryPage';
import { VerifyResultPage } from './pages/VerifyResultPage';

export default function App() {
  return (
    <Routes>
      {/* Public — no login required */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/scan" element={<ScanPage />} />
      <Route path="/verify" element={<ManualVerifyPage />} />
      <Route path="/verify/:token" element={<VerifyResultPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Authenticated — admin + manufacturer share the shell and most pages; the backend
          enforces which data each role actually sees (see ProductsService.scope and
          DashboardService), so the frontend doesn't need parallel /admin/* and
          /manufacturer/* route trees for the same screens. */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsListPage />} />
        <Route path="/products/new" element={<ProductFormPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/verifications" element={<VerificationHistoryPage />} />
        <Route path="/verifications/suspicious" element={<VerificationHistoryPage suspiciousOnly />} />
        <Route
          path="/manufacturers"
          element={<ProtectedRoute allowedRoles={['ADMIN']}><ManufacturersListPage /></ProtectedRoute>}
        />
        <Route
          path="/manufacturers/new"
          element={<ProtectedRoute allowedRoles={['ADMIN']}><ManufacturerFormPage /></ProtectedRoute>}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
