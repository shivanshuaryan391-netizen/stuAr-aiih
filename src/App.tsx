import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { StoreProvider } from '@/services/store'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import AppLayout from '@/components/layout/AppLayout'
import { LogoMark } from '@/components/brand/Logo'

const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Chat = lazy(() => import('@/pages/Chat'))
const Tools = lazy(() => import('@/pages/Tools'))
const ToolPage = lazy(() => import('@/pages/ToolPage'))
const Profile = lazy(() => import('@/pages/Profile'))
const Settings = lazy(() => import('@/pages/Settings'))

function PageLoader() {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <LogoMark className="h-10 w-10 animate-pulse" />
    </div>
  )
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
      <StoreProvider>
        <ThemedToaster />

        <Routes>

  <Route path="/" element={<Navigate to="/app" replace />} />

  <Route path="/app" element={<AppLayout />}>
    <Route
      index
      element={
        <Suspense fallback={<PageLoader />}>
          <Dashboard />
        </Suspense>
      }
    />

    <Route path="chat" element={<Suspense fallback={<PageLoader />}><Chat /></Suspense>} />
    <Route path="tools" element={<Suspense fallback={<PageLoader />}><Tools /></Suspense>} />
    <Route path="tools/:toolId" element={<Suspense fallback={<PageLoader />}><ToolPage /></Suspense>} />
    <Route path="profile" element={<Suspense fallback={<PageLoader />}><Profile /></Suspense>} />
    <Route path="settings" element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
  </Route>

  <Route path="*" element={<Navigate to="/app" replace />} />

</Routes>
      </StoreProvider>
    </ErrorBoundary>
  )
}