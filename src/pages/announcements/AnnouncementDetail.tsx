import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Bell, CalendarDays, ExternalLink, Facebook, Heart, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

// Import the default announcements to use as our data source
import { defaultAnnouncementKeys } from "../../components/home/AnnouncementBoard";

const AnnouncementDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState<any>(null);

  useEffect(() => {
    // For demonstration, we'll just find the announcement in our static data
    // In a real app, you might fetch this from an API
    const found = defaultAnnouncementKeys.find((a) => a.slug === slug);

    if (found) {
      setAnnouncement({
        ...found,
        title: t(found.titleKey),
        content: t(found.contentKey),
        date: t(found.dateKey),
      });
    }

    setLoading(false);
  }, [slug, t, i18n.language]);

  const typeConfig = {
    event: {
      icon: <CalendarDays className='h-5 w-5' />,
      color: "bg-blue-100 text-blue-800",
    },
    update: {
      icon: <Bell className='h-5 w-5' />,
      color: "bg-amber-100 text-amber-800",
    },
    donation: {
      icon: <Heart className='h-5 w-5' />,
      color: "bg-rose-100 text-rose-800",
    },
    community: {
      icon: <Users className='h-5 w-5' />,
      color: "bg-green-100 text-green-800",
    },
  };

  // Base path for translation keys
  const base = "announcements.items.myanmar_donation.detail";
  // Render detailed content for Myanmar donation page with simplified styling
  const renderMyanmarDonationDetail = () => {
    if (slug !== "myanmar-donation") return null;

    return (
      <div className='space-y-6'>
        <div>
          <p className='text-gray-700 mb-6'>{t(`${base}.introduction`)}</p>
        </div>

        {/* Simple Lifestyle Section */}
        <div className='mb-8'>
          <h3 className='text-xl font-bold text-gray-900 mb-3'>{t(`${base}.lifestyle.title`)}</h3>
          <p className='mb-4'>{t(`${base}.lifestyle.description`)}</p>
          <ul className='list-disc pl-6 space-y-2'>
            {[0, 1, 2, 3].map((index) => (
              <li key={index} className='text-gray-700'>
                {t(`${base}.lifestyle.points.${index}`)}
              </li>
            ))}
          </ul>
        </div>

        {/* Principal Section */}
        <div className='mb-8'>
          <h3 className='text-xl font-bold text-gray-900 mb-3'>{t(`${base}.principal.title`)}</h3>
          <p>{t(`${base}.principal.description`)}</p>
        </div>

        {/* Access Difficulties Section */}
        <div className='mb-8'>
          <h3 className='text-xl font-bold text-gray-900 mb-3'>{t(`${base}.access.title`)}</h3>
          <p>{t(`${base}.access.description`)}</p>
        </div>

        {/* Contact Information Section */}
        <div className='mb-8 border-t border-b py-6'>
          <h3 className='text-xl font-bold text-gray-900 mb-3'>{t(`${base}.contact.title`)}</h3>
          <p className='mb-4'>{t(`${base}.contact.description`)}</p>

          <p className='font-semibold mb-2'>{t(`${base}.contact.info`)}</p>
          <ul className='list-disc pl-6 space-y-2 mb-4'>
            {/* Phone & Viber */}
            <li className='text-gray-700'>{t(`${base}.contact.details.0`)}</li>
            {/* Kpay */}
            <li className='text-gray-700'>{t(`${base}.contact.details.1`)}</li>
            {/* Facebook with link */}
            <li className='text-gray-700'>
              Facebook:{" "}
              <a
                href='https://www.facebook.com/thet.zin.7921'
                target='_blank'
                rel='noopener noreferrer'
                className='text-amber-700 hover:text-amber-900 hover:underline inline-flex items-center'
              >
                Thet Tun Than Htay
                <svg
                  className='w-4 h-4 ml-1'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'></path>
                  <polyline points='15 3 21 3 21 9'></polyline>
                  <line x1='10' y1='14' x2='21' y2='3'></line>
                </svg>
              </a>
            </li>
          </ul>

          <div className='text-sm italic mt-4'>
            <p>💡 {t(`${base}.contact.note`)}</p>
          </div>
        </div>

        {/* Conclusion */}
        <div className='mt-6'>
          <p className='mb-4'>{t(`${base}.conclusion`)}</p>
          <a
            href='https://www.facebook.com/share/p/1AGTSat3yn/'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center'
          >
            <Facebook className='h-4 w-4 mr-1' />
            <span>Xem bài viết đầy đủ trên Facebook</span>
            <ExternalLink className='h-3 w-3 ml-1' />
          </a>
          <div className='text-center mt-8'>
            <p className='text-lg font-medium'>🙏 {t(`${base}.closing`)} 🙏</p>
          </div>

          <div className='mt-8 flex justify-center'>
            <Button className='bg-amber-600 hover:bg-amber-700 text-white px-6 py-2'>
              <Heart className='mr-2 h-5 w-5' />
              {t("home.donateNow")}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='container mx-auto pt-8 pb-16 px-4 max-w-4xl'>
      <Link to='/' className='inline-flex items-center text-amber-700 hover:text-amber-900 mb-6'>
        <ArrowLeft className='h-4 w-4 mr-2' />
        {t("common.backToHome")}
      </Link>

      {loading ? (
        <Card className='shadow-sm'>
          <CardContent className='pt-6'>
            <p>{t("common.loading")}</p>
          </CardContent>
        </Card>
      ) : !announcement ? (
        <Card className='shadow-sm'>
          <CardContent className='pt-6'>
            <p>{t("common.notFound")}</p>
          </CardContent>
        </Card>
      ) : (
        <Card className='shadow-sm'>
          <CardHeader>
            <div className='flex items-center gap-2 mb-2'>
              <Badge className={`${typeConfig[announcement.type].color} flex items-center gap-1 px-2 py-1`}>
                {typeConfig[announcement.type].icon}
                <span className='capitalize'>{t(`announcements.${announcement.type}`)}</span>
              </Badge>
              <span className='text-sm text-gray-500'>{announcement.date}</span>
            </div>
            <CardTitle className='text-2xl font-bold text-amber-800'>{t(`${base}.heading`)}</CardTitle>
            {/* Featured Image */}
            {slug === "myanmar-donation" && (
              <div className='relative w-full h-64 mb-8 overflow-hidden rounded-lg sm:h-80 md:h-96'>
                <img
                  src='/images/monastery.jpg'
                  alt='Mahāvihāra Forest Monastery'
                  className='object-cover w-full h-full'
                />
              </div>
            )}
          </CardHeader>

          <CardContent>
            <div className='prose max-w-none text-gray-700'>
              {/* Render detailed content for Myanmar donation */}
              {renderMyanmarDonationDetail()}

              {/* For other announcements, show standard "How to Contribute" section */}
              {slug !== "myanmar-donation" && (
                <div className='mt-6'>
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>{t("announcements.howToContribute")}</h3>
                  <p>{t("announcements.contributionInstructions")}</p>

                  <div className='mt-4'>
                    <Button className='bg-amber-600 hover:bg-amber-700 text-white'>
                      <Heart className='mr-2 h-4 w-4' />
                      {t("home.donateNow")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnnouncementDetail;
