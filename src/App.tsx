import { ReactNode, Suspense, lazy, useEffect, useRef } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";
import { Toaster } from "react-hot-toast";
import MainLoader from "./components/Common/MainLoader";
import ProtectedDashboard from "./components/Protected/ProtectedDashBoard";
import LoginModal from "./components/LoginModal/Loginmodal";
import { PostJobProtectedRoute } from "./components/Protected/JobProtectedRoute";




// Lazy Loaded Components
const Layout = lazy(() => import("./pages/Layout"));
const Landing = lazy(() => import("./pages/LandingPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const JobPost = lazy(() => import("./pages/JobPost"));
const Auth = lazy(() => import("./pages/Auth"));
const StudentFilter = lazy(() => import("./pages/StudentFilter"));
const StudentProfile = lazy(() => import("./pages/StudentProfile"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Contact = lazy(() => import("./pages/Contact"));
const DashBoard = lazy(() => import("./pages/DashBoard"));
const Plans = lazy(() => import("./pages/Plans"));
const PlanUsage = lazy(() => import("./pages/Usage"));
const LoginTerms = lazy(() => import("./pages/LoginTerms"));
const Terms = lazy(() => import("./pages/Terms"));
const Refund = lazy(() => import("./pages/Refund"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const VerifyPlan = lazy(() => import("./pages/VerifyPlan"));





// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated ? children : <Navigate to="/auth" state={{ from: location }} />;
};





function App() {
  const { isAuthenticated, isLoginModalOpen, setLoginModalOpen } = useAuth();
  const location = useLocation();
  const hasPromptedLogin = useRef(false);


  useEffect(() => {

    if (isAuthenticated) {
      hasPromptedLogin.current = false;
      return;
    }

    if (!hasPromptedLogin.current && location.pathname !== "/auth") {
      setLoginModalOpen(true);
      hasPromptedLogin.current = true;
    }

  }, [isAuthenticated, location.pathname, setLoginModalOpen]);


  return (

    <>

      <Suspense fallback={<MainLoader />}>


        <Routes>


          {/* Auth Routes */}
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />


          {/* Protected Dashboard */}
          <Route path="/dashboard" element={<ProtectedDashboard> <DashBoard /> </ProtectedDashboard>} />



          {/* Main Layout Routes */}
          <Route element={<Layout />}>

            <Route path="/" element={<Landing />} />
            <Route
              path="/postjob"
              element={
                <PostJobProtectedRoute>
                  <JobPost />
                </PostJobProtectedRoute>
              }
            />
            <Route path="/findtalent" element={<StudentFilter />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/termscondition" element={<Terms />} />
            <Route path="/privacypolicy" element={<Privacy />} />
            <Route path="/refundpolicy" element={<Refund />} />
            <Route path="/loginterms" element={<LoginTerms />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/planSuccess" element={<VerifyPlan />} />


            {/* Protected Routes */}
            <Route
              path="/planusage"
              element={
                <ProtectedRoute>
                  <PlanUsage />
                </ProtectedRoute>
              }
            />


            <Route
              path="/employerprofile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />


            <Route
              path="/userprofile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />


            <Route
              path="/studentprofile/:id"
              element={
                <ProtectedRoute>
                  <StudentProfile />
                </ProtectedRoute>
              }
            />


            <Route
              path="/plans"
              element={
                <ProtectedRoute>
                  <Plans />
                </ProtectedRoute>
              }
            />

          </Route>

        </Routes>

      </Suspense>

      {/* Notifications */}
      <Toaster position="top-center" />

      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setLoginModalOpen} />
    </>

  );
}

export default App;
