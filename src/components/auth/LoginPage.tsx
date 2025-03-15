import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "../layout/Header";
import AuthHandler from "./AuthHandler";

const LoginPage = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-amber-50/30">
      <Header />
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-900">
              {t("auth.welcomeBack")}
            </h1>
            <p className="text-amber-700 mt-2">{t("auth.loginToAccount")}</p>
          </div>
          <AuthHandler defaultTab="login" redirectTo="/dashboard" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
