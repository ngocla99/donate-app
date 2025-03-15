import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import Dashboard from "./components/dashboard/Dashboard";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Toaster } from "./components/ui/toaster";
import routes from "tempo-routes";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RedirectIfAuthenticated from "./components/auth/RedirectIfAuthenticated";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Suspense fallback={<p>Loading...</p>}>
          <>
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={
                  <RedirectIfAuthenticated>
                    <LoginPage />
                  </RedirectIfAuthenticated>
                }
              />
              <Route
                path="/register"
                element={
                  <RedirectIfAuthenticated>
                    <RegisterPage />
                  </RedirectIfAuthenticated>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster />
          </>
        </Suspense>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
