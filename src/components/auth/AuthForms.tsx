import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

interface AuthFormsProps {
  defaultTab?: "login" | "register";
  onLogin?: (email: string, password: string) => void;
  onRegister?: (name: string, email: string, password: string) => void;
  isLoading?: boolean;
}

const AuthForms = ({
  defaultTab = "login",
  onLogin = () => {},
  onRegister = () => {},
  isLoading = false,
}: AuthFormsProps) => {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(loginForm.email, loginForm.password);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(registerForm.name, registerForm.email, registerForm.password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
      <CardHeader className="text-center bg-amber-50 rounded-t-xl">
        <CardTitle className="text-2xl font-bold text-amber-800">
          {t("auth.welcome")}
        </CardTitle>
        <CardDescription className="text-amber-700">
          {t("auth.joinCommunity")}
        </CardDescription>
      </CardHeader>
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full mt-4 mx-4">
          <TabsTrigger value="login">{t("auth.login")}</TabsTrigger>
          <TabsTrigger value="register">{t("auth.register")}</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="p-4">
          <form onSubmit={handleLoginSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder={t("auth.email")}
                    className="pl-10"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.password")}
                    className="pl-10 pr-10"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-2.5 text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <a
                  href="#"
                  className="text-sm text-amber-600 hover:text-amber-800"
                >
                  {t("auth.forgotPassword")}
                </a>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700"
                disabled={isLoading}
              >
                {isLoading ? t("auth.loggingIn") : t("auth.login")}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>

        <TabsContent value="register" className="p-4">
          <form onSubmit={handleRegisterSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t("auth.fullName")}
                    className="pl-10"
                    value={registerForm.name}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder={t("auth.email")}
                    className="pl-10"
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.password")}
                    className="pl-10 pr-10"
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-2.5 text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {t("auth.termsAgreement")}{" "}
                <a href="#" className="text-amber-600 hover:text-amber-800">
                  {t("auth.termsOfService")}
                </a>{" "}
                {t("auth.and")}{" "}
                <a href="#" className="text-amber-600 hover:text-amber-800">
                  {t("auth.privacyPolicy")}
                </a>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700"
                disabled={isLoading}
              >
                {isLoading
                  ? t("auth.creatingAccount")
                  : t("auth.createAccountButton")}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthForms;
