import { useTranslation } from "react-i18next";
import AuthHandler from "@/components/auth/AuthHandler";

const Login = () => {
  const { t } = useTranslation();
  return (
    <div className='container pt-12 mx-auto max-w-md'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-amber-900'>{t("auth.welcomeBack")}</h1>
        <p className='text-amber-700 mt-2'>{t("auth.loginToAccount")}</p>
      </div>
      <AuthHandler defaultTab='login' redirectTo='/dashboard' />
    </div>
  );
};

export default Login;
