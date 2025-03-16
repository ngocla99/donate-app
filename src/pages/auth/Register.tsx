import { useTranslation } from "react-i18next";
import AuthHandler from "@/components/auth/AuthHandler";

const Register = () => {
  const { t } = useTranslation();
  return (
    <div className='container pt-12 mx-auto max-w-md'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-amber-900'>{t("auth.joinCommunity")}</h1>
        <p className='text-amber-700 mt-2'>{t("auth.createAccount")}</p>
      </div>
      <AuthHandler defaultTab='register' redirectTo='/dashboard' />
    </div>
  );
};

export default Register;
