import TransactionsView from "@/components/dashboard/TransactionsView";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { isLoading } = useAuth();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <p className='text-amber-700'>{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className='container pt-8 pb-12 mx-auto grid gap-6 px-2'>
      <h1 className='text-3xl font-bold text-amber-900'>{t("dashboard.title")}</h1>

      <div className='grid gap-6 md:grid-cols-1 lg:grid-cols-1'>
        <TransactionsView />
      </div>
    </div>
  );
};

export default Dashboard;
