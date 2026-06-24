import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { MainLayout } from './components/layout/MainLayout'
import { LoginPage } from './pages/LoginPage'
// import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { BookingsPage } from './pages/BookingsPage'
import { CalendarPage } from './pages/CalendarPage'
import { ProfilePage } from './pages/ProfilePage'
import { AdminRoomsPage } from './pages/AdminRoomsPage'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { authenticated, initializing } = useAuth()

  if (initializing) {
    return null
  }

  return authenticated ? children : <Navigate to="/login" replace />
}

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { authenticated, initializing, user } = useAuth()

  if (initializing) {
    return null
  }

  if (!authenticated || user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/register" element={<RegisterPage />} /> */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <MainLayout>
                <BookingsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CalendarPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rooms"
          element={
            <AdminRoute>
              <MainLayout>
                <AdminRoomsPage />
              </MainLayout>
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
