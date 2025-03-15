import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "../layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const Dashboard = () => {
  const { user, profile, isLoading } = useAuth();
  const { t } = useLanguage();

  // If not logged in and not loading, redirect to login
  if (!isLoading && !user) {
    return <Navigate to="/login" />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50/30">
        <Header />
        <div className="pt-24 pb-12 px-4">
          <div className="container mx-auto">
            <div className="flex justify-center items-center h-64">
              <p className="text-amber-700">Đang tải...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50/30">
      <Header />
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-amber-900 mb-6">
            {t("dashboard.title")}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("dashboard.welcome")}, {profile?.name || user?.email}
                </CardTitle>
                <CardDescription>
                  {t("dashboard.personalDashboard")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{t("dashboard.description")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.recentDonations")}</CardTitle>
                <CardDescription>
                  {t("dashboard.recentActivity")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{t("dashboard.noDonations")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.reminderSettings")}</CardTitle>
                <CardDescription>
                  {t("dashboard.reminderDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{t("dashboard.reminderConfig")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
