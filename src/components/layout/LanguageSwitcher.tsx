import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18next.changeLanguage(lng);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='gap-2 h-8 px-2 text-orange-600 min-w-[96px] hover:text-orange-700 hover:bg-orange-50'
        >
          <Globe className='h-4 w-4' />
          <span className=''>
            {i18next.language === "vi" ? t("language.vietnamese") : t("language.english")}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-[140px] bg-white border border-orange-100'>
        <DropdownMenuItem
          onClick={() => changeLanguage("vi")}
          className='hover:bg-orange-50 focus:bg-orange-50 cursor-pointer'
        >
          {t("language.vietnamese")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage("en")}
          className='hover:bg-orange-50 focus:bg-orange-50 cursor-pointer'
        >
          {t("language.english")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
