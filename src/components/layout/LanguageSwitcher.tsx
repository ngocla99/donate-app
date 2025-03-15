import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "vi" ? "en" : "vi");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="text-xs border-amber-500 text-amber-700 hover:bg-amber-100"
    >
      {language === "vi" ? "English" : "Tiếng Việt"}
    </Button>
  );
};

export default LanguageSwitcher;
