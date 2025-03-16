import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Admin from "./pages/admin";
import AnnouncementDetail from "./pages/announcements/AnnouncementDetail";
import AdminRoute from "./components/auth/AdminRoute";
import Login from "./pages/auth/Login";
import RedirectIfAuthenticated from "./components/auth/RedirectIfAuthenticated";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard";
import Home from "./pages/home";
import AppLayout from "./components/layout/AppLayout";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path='/' element={<Home />} />
              <Route
                path='/login'
                element={
                  <RedirectIfAuthenticated>
                    <Login />
                  </RedirectIfAuthenticated>
                }
              />
              <Route
                path='/register'
                element={
                  <RedirectIfAuthenticated>
                    <Register />
                  </RedirectIfAuthenticated>
                }
              />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route
                path='/admin'
                element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                }
              />
              <Route path='/announcements/:slug' element={<AnnouncementDetail />} />
            </Route>
          </Routes>
          <Toaster />
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
