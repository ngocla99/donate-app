import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import AuthForms from "./AuthForms";
import { useState } from "react";

interface AuthHandlerProps {
  defaultTab?: "login" | "register";
  redirectTo?: string;
}

const AuthHandler = ({
  defaultTab = "login",
  redirectTo = "/",
}: AuthHandlerProps) => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await signIn(email, password);

    if (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
      setIsLoading(false);
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      // Don't set isLoading to false here to prevent UI flicker during redirect
      navigate(redirectTo);
    }
  };

  const handleRegister = async (
    name: string,
    email: string,
    password: string,
  ) => {
    setIsLoading(true);
    const { error } = await signUp(email, password, name);

    if (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message,
      });
      setIsLoading(false);
    } else {
      toast({
        title: "Registration successful",
        description: "You have been automatically logged in.",
      });
      // Don't set isLoading to false here to prevent UI flicker during redirect
      navigate(redirectTo);
    }
  };

  return (
    <AuthForms
      defaultTab={defaultTab}
      onLogin={handleLogin}
      onRegister={handleRegister}
      isLoading={isLoading}
    />
  );
};

export default AuthHandler;
