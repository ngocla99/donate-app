import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Home, User, BarChart3, Bell, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import UserMenu from "./UserMenu";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const isLoggedIn = !!user;
  const username = profile?.name || user?.email || "Guest";

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const { t } = useLanguage();

  return (
    <header className="w-full bg-amber-50 border-b border-amber-100 shadow-sm fixed top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="text-amber-800 font-semibold text-xl hidden sm:block">
              Quyên Góp Phật Pháp
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-amber-700 hover:text-amber-900 flex items-center"
          >
            <Home className="mr-1 h-4 w-4" />
            <span>{t("nav.home")}</span>
          </Link>
          <Link
            to="/dashboard"
            className="text-amber-700 hover:text-amber-900 flex items-center"
          >
            <BarChart3 className="mr-1 h-4 w-4" />
            <span>{t("nav.dashboard")}</span>
          </Link>
          <Link
            to="/announcements"
            className="text-amber-700 hover:text-amber-900 flex items-center"
          >
            <Bell className="mr-1 h-4 w-4" />
            <span>{t("nav.announcements")}</span>
          </Link>
        </nav>

        {/* Auth Buttons / User Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center">
              <div className="mr-3 text-amber-700">
                {t("auth.welcome")}, {username}
              </div>
              <UserMenu />
              <div className="ml-3">
                <LanguageSwitcher />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                className="border-amber-500 text-amber-700 hover:bg-amber-100"
                onClick={handleLoginClick}
              >
                {t("auth.login")}
              </Button>
              <Button
                className="bg-amber-600 text-white hover:bg-amber-700"
                onClick={handleRegisterClick}
              >
                {t("auth.register")}
              </Button>
              <LanguageSwitcher />
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="text-amber-700 hover:bg-amber-100"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden bg-amber-50 border-t border-amber-100 overflow-hidden transition-all duration-300",
          mobileMenuOpen ? "max-h-screen py-4" : "max-h-0",
        )}
      >
        <div className="container mx-auto px-4 flex flex-col space-y-4">
          <Link
            to="/"
            className="text-amber-700 hover:text-amber-900 py-2 flex items-center"
          >
            <Home className="mr-2 h-5 w-5" />
            <span>{t("nav.home")}</span>
          </Link>
          <Link
            to="/dashboard"
            className="text-amber-700 hover:text-amber-900 py-2 flex items-center"
          >
            <BarChart3 className="mr-2 h-5 w-5" />
            <span>{t("nav.dashboard")}</span>
          </Link>
          <Link
            to="/announcements"
            className="text-amber-700 hover:text-amber-900 py-2 flex items-center"
          >
            <Bell className="mr-2 h-5 w-5" />
            <span>{t("nav.announcements")}</span>
          </Link>

          <div className="pt-2 border-t border-amber-100">
            {isLoggedIn ? (
              <div className="flex flex-col space-y-3">
                <div className="text-amber-700 py-1">
                  {t("auth.welcome")}, {username}
                </div>
                <Button
                  variant="outline"
                  className="border-amber-500 text-amber-700 hover:bg-amber-100 w-full justify-start"
                  onClick={() => navigate("/dashboard")}
                >
                  <User className="mr-2 h-4 w-4" />
                  {t("auth.myAccount")}
                </Button>
                <Button
                  variant="ghost"
                  className="text-amber-700 hover:bg-amber-100 w-full justify-start"
                  onClick={handleLogout}
                >
                  {t("auth.logout")}
                </Button>
                <div className="mt-2">
                  <LanguageSwitcher />
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Button
                  variant="outline"
                  className="border-amber-500 text-amber-700 hover:bg-amber-100 w-full"
                  onClick={handleLoginClick}
                >
                  {t("auth.login")}
                </Button>
                <Button
                  className="bg-amber-600 text-white hover:bg-amber-700 w-full"
                  onClick={handleRegisterClick}
                >
                  {t("auth.register")}
                </Button>
                <div className="mt-2">
                  <LanguageSwitcher />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
