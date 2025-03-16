import { useAuth } from "@/contexts/AuthContext";
import { BarChart3, Bell, Home, Menu, User, X } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import LanguageSwitcher from "./LanguageSwitcher";
import UserMenu from "./UserMenu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isLoggedIn = !!user;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLoginClick = () => {
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const handleRegisterClick = () => {
    setMobileMenuOpen(false);
    navigate("/register");
  };

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await signOut();
    navigate("/");
  };

  return (
    <header className='w-full bg-amber-50 border-b border-amber-100 shadow-sm fixed top-0 z-50'>
      <div className='container mx-auto px-4 py-3 flex items-center justify-between'>
        {/* Logo and Brand */}
        <div className='flex items-center'>
          <Link to='/' className='flex items-center'>
            <div className='h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center mr-3'>
              <span className='text-white font-bold text-xl'>D</span>
            </div>
            <span className='text-amber-800 font-semibold text-xl hidden sm:block'>{t("app.name")}</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className='hidden md:flex items-center space-x-6'>
          <Link to='/' className='text-amber-700 hover:text-amber-900 flex items-center'>
            <Home className='mr-1 h-4 w-4' />
            <span>{t("nav.home")}</span>
          </Link>
          <Link to='/dashboard' className='text-amber-700 hover:text-amber-900 flex items-center'>
            <BarChart3 className='mr-1 h-4 w-4' />
            <span>{t("nav.dashboard")}</span>
          </Link>
          {/* <Link to='/announcements' className='text-amber-700 hover:text-amber-900 flex items-center'>
            <Bell className='mr-1 h-4 w-4' />
            <span>{t("nav.announcements")}</span>
          </Link> */}
          {isAdmin && (
            <Link to='/admin' className='text-amber-700 hover:text-amber-900 flex items-center'>
              <User className='mr-1 h-4 w-4' />
              <span>{t("nav.admin")}</span>
            </Link>
          )}
        </nav>

        {/* Auth Buttons / User Menu */}
        <div className='hidden md:flex items-center space-x-4'>
          <LanguageSwitcher />

          {isLoggedIn ? (
            <UserMenu />
          ) : (
            <>
              <Button
                onClick={handleLoginClick}
                variant='ghost'
                className='text-amber-700 hover:text-amber-900 hover:bg-amber-100'
              >
                {t("auth.login")}
              </Button>
              <Button onClick={handleRegisterClick} className='bg-amber-500 hover:bg-amber-600 text-white'>
                {t("auth.register")}
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className='md:hidden'>
          <Button variant='ghost' size='sm' className='text-amber-700 hover:bg-amber-100' onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className='md:hidden bg-amber-50 border-t border-amber-100 py-4'>
          <div className='container mx-auto px-4 flex flex-col space-y-4'>
            <Link
              to='/'
              className='text-amber-700 hover:text-amber-900 flex items-center py-2'
              onClick={() => {
                setMobileMenuOpen(false);
              }}
            >
              <Home className='mr-2 h-4 w-4' />
              <span>{t("nav.home")}</span>
            </Link>
            <Link
              to='/dashboard'
              className='text-amber-700 hover:text-amber-900 flex items-center py-2'
              onClick={() => {
                setMobileMenuOpen(false);
              }}
            >
              <BarChart3 className='mr-2 h-4 w-4' />
              <span>{t("nav.dashboard")}</span>
            </Link>
            {/* <Link to='/announcements' className='text-amber-700 hover:text-amber-900 flex items-center py-2'>
              <Bell className='mr-2 h-4 w-4' />
              <span>{t("nav.announcements")}</span>
            </Link> */}
            {isAdmin && (
              <Link to='/admin' className='text-amber-700 hover:text-amber-900 flex items-center py-2'>
                <User className='mr-2 h-4 w-4' />
                <span>{t("nav.admin")}</span>
              </Link>
            )}

            <div className='pt-2 flex flex-col space-y-2'>
              <LanguageSwitcher />

              {isLoggedIn ? (
                <Button
                  onClick={handleLogout}
                  variant='ghost'
                  className='text-amber-700 hover:text-amber-900 hover:bg-amber-100 justify-start'
                >
                  {t("auth.logout")}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleLoginClick}
                    variant='ghost'
                    className='text-amber-700 hover:text-amber-900 hover:bg-amber-100 justify-start'
                  >
                    {t("auth.login")}
                  </Button>
                  <Button
                    onClick={handleRegisterClick}
                    className='bg-amber-500 hover:bg-amber-600 text-white justify-start'
                  >
                    {t("auth.register")}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
