import { lazy, Suspense, type ReactNode } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import RouteLoader from "./components/common/RouteLoader";
import AppErrorBoundary from "./components/common/AppErrorBoundary";
import { ProtectedRoute } from "./features/auth/components/ProtectedRoute";
import { WorkspaceGuard } from "./features/settings/components/WorkspaceGuard";
import { useAuth } from "./features/auth/hooks/useAuth";
import { useWorkspace } from "./features/settings/hooks/useWorkspace";

const SignIn = lazy(() => import("./pages/AuthPages/SignIn"));
const SignUp = lazy(() => import("./pages/AuthPages/SignUp"));
const NotFound = lazy(() => import("./pages/OtherPage/NotFound"));
const UserProfiles = lazy(() => import("./pages/UserProfiles"));
const LineChart = lazy(() => import("./pages/Charts/LineChart"));
const BarChart = lazy(() => import("./pages/Charts/BarChart"));
const Calendar = lazy(() => import("./pages/Calendar"));
const BasicTables = lazy(() => import("./pages/Tables/BasicTables"));
const FormElements = lazy(() => import("./pages/Forms/FormElements"));
const BusinessOnboardingPage = lazy(
  () => import("./features/settings/pages/BusinessOnboardingPage")
);

function PublicRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <RouteLoader />;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function OnboardingGuard({ children }: { children: ReactNode }) {
  const { businesses, isLoading } = useWorkspace();
  if (isLoading) return <RouteLoader />;
  if (businesses.length > 0) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <AppErrorBoundary>
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              {/* Protected Dashboard Layout (auth + workspace required) */}
              <Route
                element={
                  <ProtectedRoute>
                    <WorkspaceGuard>
                      <AppLayout />
                    </WorkspaceGuard>
                  </ProtectedRoute>
                }
              >
                <Route index path="/" element={<Home />} />

                <Route path="/profile" element={<UserProfiles />} />
                <Route path="/calendar" element={<Calendar />} />

                {/* Forms */}
                <Route path="/form-elements" element={<FormElements />} />

                {/* Tables */}
                <Route path="/basic-tables" element={<BasicTables />} />

                {/* Charts */}
                <Route path="/line-chart" element={<LineChart />} />
                <Route path="/bar-chart" element={<BarChart />} />
              </Route>

              {/* Onboarding (auth required, no workspace yet) */}
              <Route
                path="/onboarding/business"
                element={
                  <ProtectedRoute>
                    <OnboardingGuard>
                      <BusinessOnboardingPage />
                    </OnboardingGuard>
                  </ProtectedRoute>
                }
              />

              {/* Public Auth Routes */}
              <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />

              {/* Fallback Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AppErrorBoundary>
      </Router>
    </>
  );
}
