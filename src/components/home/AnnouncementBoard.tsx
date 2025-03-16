import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { CalendarDays, Bell, Heart, Users, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface Announcement {
  id: string;
  titleKey: string;
  contentKey: string;
  dateKey: string;
  type: "event" | "update" | "donation" | "community";
  disabled?: boolean;
  slug?: string;
}

interface AnnouncementBoardProps {
  customAnnouncements?: Announcement[];
}

export const defaultAnnouncementKeys: Announcement[] = [
  {
    id: "1",
    titleKey: "announcements.items.myanmar_donation.title",
    contentKey: "announcements.items.myanmar_donation.content",
    dateKey: "announcements.items.myanmar_donation.date",
    type: "donation",
    slug: "myanmar-donation",
  },
  {
    id: "2",
    titleKey: "announcements.items.meditation_retreat.title",
    contentKey: "announcements.items.meditation_retreat.content",
    dateKey: "announcements.items.meditation_retreat.date",
    type: "event",
    disabled: true,
    slug: "meditation-retreat",
  },
  {
    id: "3",
    titleKey: "announcements.items.dharma_talks.title",
    contentKey: "announcements.items.dharma_talks.content",
    dateKey: "announcements.items.dharma_talks.date",
    type: "event",
    disabled: true,
    slug: "dharma-talks",
  },
];

const AnnouncementBoard = ({ customAnnouncements = defaultAnnouncementKeys }: AnnouncementBoardProps) => {
  const { t } = useTranslation();

  return (
    <Card className='w-full max-w-[1200px] mx-auto bg-white shadow-md'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-2xl font-semibold text-amber-800'>{t("announcements.title")}</CardTitle>
        <CardDescription className='text-gray-600'>{t("announcements.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[240px] pr-4'>
          <div className='space-y-4'>
            {customAnnouncements.map((announcement) => (
              <AnnouncementItem key={announcement.id} announcement={announcement} disabled={announcement.disabled} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const AnnouncementItem = ({ announcement, disabled = false }: { announcement: Announcement; disabled?: boolean }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { titleKey, contentKey, dateKey, type, slug } = announcement;

  const title = t(titleKey);
  const content = t(contentKey);
  const date = t(dateKey);

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

  const { icon, color } = typeConfig[type];

  const handleClick = () => {
    if (!disabled && slug) {
      navigate(`/announcements/${slug}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors",
        !disabled && "cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className='flex justify-between items-start mb-2'>
        <div className='flex items-center gap-2'>
          <Badge className={`${color} flex items-center gap-1 px-2 py-1`}>
            {icon}
            <span className='capitalize'>{t(`announcements.${type}`)}</span>
          </Badge>
          <span className='text-sm text-gray-500'>{date}</span>
        </div>
        {!disabled && (
          <ChevronRight className="h-5 w-5 text-amber-500" />
        )}
      </div>
      <h3 className='text-lg font-medium text-gray-900 mb-1'>{title}</h3>
      <p className='text-gray-600'>{content}</p>
    </div>
  );
};

export default AnnouncementBoard;
