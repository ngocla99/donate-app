import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUpCircle, Users, DollarSign, Target } from "lucide-react";

interface QuickStatsProps {
  totalDonations?: number;
  recentActivity?: number;
  donorCount?: number;
  goalProgress?: number;
  goalAmount?: number;
}

const QuickStats = ({
  totalDonations = 125750,
  recentActivity = 15,
  donorCount = 342,
  goalProgress = 68,
  goalAmount = 200000,
}: QuickStatsProps) => {
  const { t } = useLanguage();
  return (
    <div className="w-full max-w-[1200px] mx-auto bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {t("stats.overview")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Donations Card */}
        <Card className="bg-white border border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {t("stats.totalDonations")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-amber-100 p-2">
                <DollarSign className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  ${totalDonations.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500">
                  {t("stats.lifetimeContributions")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card className="bg-white border border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {t("stats.recentActivity")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-green-100 p-2">
                <ArrowUpCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {recentActivity}
                </div>
                <p className="text-xs text-gray-500">
                  {t("stats.newDonationsThisWeek")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Donor Count Card */}
        <Card className="bg-white border border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {t("stats.donors")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-blue-100 p-2">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {donorCount}
                </div>
                <p className="text-xs text-gray-500">
                  {t("stats.communityMembers")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goal Progress Card */}
        <Card className="bg-white border border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {t("stats.annualGoal")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-2">
              <div className="mr-4 rounded-full bg-purple-100 p-2">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {goalProgress}%
                </div>
                <p className="text-xs text-gray-500">
                  {t("stats.of")} ${goalAmount.toLocaleString()}
                </p>
              </div>
            </div>
            <Progress value={goalProgress} className="h-2 bg-gray-100" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuickStats;
