import { lazy, ReactNode, Suspense } from 'react'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation,
} from 'react-router-dom'

import { RoutePaths } from '@/enums'

import { createDeepPath } from './helpers'
import PublicLayout from './layouts/PublicLayout'
import { useNear } from './near'
import { useSiwnIdentity } from './siwn'

function WalletConnectedRoute({ children }: { children: ReactNode }) {
  const { isConnected } = useNear()
  const location = useLocation()

  return isConnected ? (
    children
  ) : (
    <Navigate to={RoutePaths.LoginPage} replace state={{ from: location }} />
  )
}

function LoggedInRoute({ children }: { children: ReactNode }) {
  const { isConnected } = useNear()
  const location = useLocation()

  return isConnected ? (
    <Navigate to={RoutePaths.LoginICPPage} replace state={{ from: location }} />
  ) : (
    children
  )
}

function ICPConnectedRoute({ children }: { children: ReactNode }) {
  const { identity } = useSiwnIdentity()

  return identity ? (
    children
  ) : (
    <Navigate to={RoutePaths.LoginICPPage} replace state={{ from: location }} />
  )
}

export const AppRoutes = () => {
  const LoginPage = lazy(() => import('@/pages/Login'))
  const LoginICPPage = lazy(() => import('@/pages/LoginICP'))
  const HomePage = lazy(() => import('@/pages/Home'))

  const router = createBrowserRouter([
    {
      path: RoutePaths.Root,
      element: (
        <PublicLayout>
          <Suspense fallback={<></>}>
            <Outlet />
          </Suspense>
        </PublicLayout>
      ),
      children: [
        {
          path: createDeepPath(RoutePaths.LoginPage),
          element: (
            <LoggedInRoute>
              <LoginPage />
            </LoggedInRoute>
          ),
        },
        {
          path: createDeepPath(RoutePaths.LoginICPPage),
          element: (
            <WalletConnectedRoute>
              <LoginICPPage />
            </WalletConnectedRoute>
          ),
        },
        {
          path: createDeepPath(RoutePaths.HomePage),
          element: (
            <WalletConnectedRoute>
              <ICPConnectedRoute>
                <HomePage />
              </ICPConnectedRoute>
            </WalletConnectedRoute>
          ),
        },
        {
          path: RoutePaths.Root,
          element: <Navigate replace to={RoutePaths.LoginPage} />,
        },
        {
          path: '*',
          element: <Navigate replace to={RoutePaths.Root} />,
        },
      ],
    },
  ])

  return <RouterProvider router={router} />
}
