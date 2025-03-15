import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const RedirectIfAuthenticated = ({
  children,
  redirectTo = "/dashboard",
}: RedirectIfAuthenticatedProps) => {
  const { user, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // If authenticated, redirect to dashboard
  if (user) {
    return <Navigate to={redirectTo} />;
  }

  // If not authenticated, render the children (login/register page)
  return <>{children}</>;
};

export default RedirectIfAuthenticated;
