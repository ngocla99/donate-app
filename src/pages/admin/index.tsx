import ExcelUpload from "@/components/admin/ExcelUpload";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

const Admin = () => {
  const { profile } = useAuth();
  const { t } = useTranslation();

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6'>{t("admin.title")}</h1>
      <p className='text-gray-600 mb-8'>
        {t("admin.welcomeBack")}, {profile?.name || t("common.guest")}
      </p>

      <Tabs defaultValue='upload' className='w-full'>
        {/* <TabsList className='grid w-full grid-cols-1'>
          <TabsTrigger value='upload'>{t("admin.bankStatementUploadTab")}</TabsTrigger>
        </TabsList> */}
        <TabsContent value='upload'>
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.excelUploadTitle")}</CardTitle>
              <CardDescription>{t("admin.excelUploadDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ExcelUpload />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
