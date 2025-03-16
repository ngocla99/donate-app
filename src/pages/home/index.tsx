import AuthHandler from "@/components/auth/AuthHandler";
import AnnouncementBoard from "@/components/home/AnnouncementBoard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isLoggedIn = !!user;
  return (
    <>
      {/* Hero Section */}
      <section className='pt-16 pb-12 px-4 bg-gradient-to-b from-amber-50 to-white'>
        <div className='container mx-auto max-w-6xl'>
          <div className='flex flex-col md:flex-row items-center gap-8 md:gap-32'>
            <div className='flex-1 space-y-6'>
              <h1 className='text-4xl md:text-5xl font-bold text-amber-900 leading-tight'>{t("home.heroTitle")}</h1>
              <p className='text-lg text-amber-700'>{t("home.heroSubtitle")}</p>
              <div className='flex flex-wrap gap-4 pt-4'>
                <Button
                  className='bg-amber-600 hover:bg-amber-700 text-white px-6 py-2'
                  onClick={() => {
                    navigate("/announcements/myanmar-donation");
                  }}
                >
                  <Heart className='mr-2 h-5 w-5' />
                  {t("home.donateNow")}
                </Button>
                <Button
                  variant='outline'
                  className='border-amber-500 text-amber-700 hover:bg-amber-100 px-6 py-2'
                  onClick={() => {
                    navigate("/dashboard");
                  }}
                >
                  {t("dashboard.title")}
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Button>
              </div>
            </div>
            <div className='relative h-[400px] w-[320px] overflow-hidden rounded-lg bg-[#3c1f09] p-4 shadow-lg'>
              <img
                src='/images/buddha.jpg'
                alt='Buddhist Temple'
                className='rounded-lg shadow-lg w-full max-w-md mx-auto object-cover '
                onError={(e) => {
                  // Fallback to a placeholder if the image fails to load
                  e.currentTarget.src = "https://placehold.co/600x400/amber/white?text=Temple+Image";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      {/* <section className='py-12 px-4'>
        <div className='container mx-auto'>
          <QuickStats />
        </div>
      </section> */}

      {/* Announcements Section */}
      <section className='py-12 px-4 bg-white'>
        <div className='container mx-auto'>
          <AnnouncementBoard />
        </div>
      </section>

      {/* Auth Section (only show if not logged in) */}
      {!isLoggedIn && (
        <section className='py-16 px-4 bg-gradient-to-b from-white to-amber-50/50'>
          <div className='container mx-auto max-w-6xl'>
            <div className='text-center mb-10'>
              <h2 className='text-3xl font-bold text-amber-900 mb-4'>{t("home.joinCommunity")}</h2>
              <p className='text-amber-700 max-w-3xl mx-auto'>{t("home.joinDescription")}</p>
            </div>
            <div className='max-w-md mx-auto'>
              <AuthHandler defaultTab='register' redirectTo='/dashboard' />
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className='bg-amber-800 text-amber-100 py-8 px-4'>
        <div className='container mx-auto max-w-6xl'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div>
              <h3 className='text-xl font-semibold mb-4'>{t("app.name")}</h3>
              <p className='text-amber-200'>{t("footer.supportText")}</p>
            </div>
            <div>
              <h3 className='text-xl font-semibold mb-4'>{t("footer.quickLinks")}</h3>
              <ul className='space-y-2'>
                <li>
                  <Link to='/' className='hover:text-white transition-colors'>
                    {t("nav.home")}
                  </Link>
                </li>
                <li>
                  <Link to='/dashboard' className='hover:text-white transition-colors'>
                    {t("nav.dashboard")}
                  </Link>
                </li>
                {/* <li>
                  <Link to='/announcements' className='hover:text-white transition-colors'>
                    {t("nav.announcements")}
                  </Link>
                </li> */}
                {/* <li>
                  <Link to='/about' className='hover:text-white transition-colors'>
                    {t("nav.about")}
                  </Link>
                </li> */}
              </ul>
            </div>
            <div>
              <h3 className='text-xl font-semibold mb-4'>{t("footer.contact")}</h3>
              <address className='not-italic text-amber-200'>
                <p>{t("footer.address1")}</p>
                <p>{t("footer.address2")}</p>
                <p className='mt-2'>{t("footer.email")}</p>
                <p>{t("footer.phone")}</p>
              </address>
            </div>
          </div>
          <div className='border-t border-amber-700 mt-8 pt-6 text-center text-amber-300'>
            <p>
              &copy; {new Date().getFullYear()} {t("app.name")}. {t("footer.copyright")}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
