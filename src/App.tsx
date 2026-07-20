import { lazy, Suspense, type ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from '@/services/auth'
import { StoreProvider } from '@/services/store'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import AppLayout from '@/components/layout/AppLayout'
import Landing from '@/pages/Landing'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import NotFound from '@/pages/NotFound'
import { LogoMark } from '@/components/brand/Logo'

const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Chat = lazy(() => import('@/pages/Chat'))
const Tools = lazy(() => import('@/pages/Tools'))
const ToolPage = lazy(() => import('@/pages/ToolPage'))
const Profile = lazy(() => import('@/pages/Profile'))
const Settings = lazy(() => import('@/pages/Settings'))

function FullScreenLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <LogoMark className="h-14 w-14 animate-pulse" />
        <p className="text-sm text-muted-foreground">Loading your workspace…</p>
      </div>
    </div>
  )
}

function PageLoader() {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <LogoMark className="h-10 w-10 animate-pulse" />
    </div>
  )
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <FullScreenLoader />
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  return <>{children}</>
}

function GuestOnly({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <FullScreenLoader />
  if (user) return <Navigate to="/app" replace />
  return <>{children}</>
}

function ThemedToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'rgba(12, 17, 40, 0.92)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(16px)',
          color: '#eef1ff',
          borderRadius: '14px',
        },
      }}
    />
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <StoreProvider>
          <ThemedToaster />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
            <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
            <Route path="/forgot-password" element={<GuestOnly><ForgotPassword /></GuestOnly>} />
            <Route
              path="/app"
              element={
                <RequireAuth>
                  <AppLayout />
                </RequireAuth>
              }
            >
              <Route index element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
              <Route path="chat" element={<Suspense fallback={<PageLoader />}><Chat /></Suspense>} />
              <Route path="tools" element={<Suspense fallback={<PageLoader />}><Tools /></Suspense>} />
              <Route path="tools/:toolId" element={<Suspense fallback={<PageLoader />}><ToolPage /></Suspense>} />
              <Route path="profile" element={<Suspense fallback={<PageLoader />}><Profile /></Suspense>} />
              <Route path="settings" element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </StoreProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
