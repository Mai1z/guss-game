import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth';
import { ProtectedRoute } from '@/components';
import { LoginPage, RoundsListPage, RoundPage } from '@/pages';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/rounds"
            element={
              <ProtectedRoute>
                <RoundsListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rounds/:id"
            element={
              <ProtectedRoute>
                <RoundPage />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/rounds" replace />} />

          <Route path="*" element={<Navigate to="/rounds" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;