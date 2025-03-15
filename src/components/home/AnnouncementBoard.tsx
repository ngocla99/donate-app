import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { CalendarDays, Bell, Heart, Users } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: "event" | "update" | "donation" | "community";
}

interface AnnouncementBoardProps {
  announcements?: Announcement[];
}

const AnnouncementBoard = ({
  announcements = defaultAnnouncements,
}: AnnouncementBoardProps) => {
  const { t } = useLanguage();
  return (
    <Card className="w-full max-w-[1200px] mx-auto bg-white shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-semibold text-amber-800">
          {t("announcements.title")}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {t("announcements.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[240px] pr-4">
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <AnnouncementItem
                key={announcement.id}
                announcement={announcement}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const AnnouncementItem = ({ announcement }: { announcement: Announcement }) => {
  const { t } = useLanguage();
  const { title, content, date, type } = announcement;

  const typeConfig = {
    event: {
      icon: <CalendarDays className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-800",
    },
    update: {
      icon: <Bell className="h-5 w-5" />,
      color: "bg-amber-100 text-amber-800",
    },
    donation: {
      icon: <Heart className="h-5 w-5" />,
      color: "bg-rose-100 text-rose-800",
    },
    community: {
      icon: <Users className="h-5 w-5" />,
      color: "bg-green-100 text-green-800",
    },
  };

  const { icon, color } = typeConfig[type];

  return (
    <div className="p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <Badge className={`${color} flex items-center gap-1 px-2 py-1`}>
            {icon}
            <span className="capitalize">{t(`announcements.${type}`)}</span>
          </Badge>
          <span className="text-sm text-gray-500">{date}</span>
        </div>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-600">{content}</p>
    </div>
  );
};

const defaultAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Quỹ Trùng Tu Chùa Hàng Tháng",
    content:
      "Chúng ta đã đạt được 75% mục tiêu hàng tháng! Cảm ơn tất cả những người đã đóng góp cho đến nay.",
    date: "15 Tháng 6, 2023",
    type: "donation",
  },
  {
    id: "2",
    title: "Mở Đăng Ký Khóa Tu Thiền",
    content:
      "Khóa tu thiền mùa hè của chúng tôi hiện đã mở đăng ký. Số lượng chỗ có hạn.",
    date: "12 Tháng 6, 2023",
    type: "event",
  },
  {
    id: "3",
    title: "Chương Trình Nhân Đôi Quyên Góp Mới",
    content:
      "Tất cả các khoản quyên góp trong tháng này sẽ được nhà hảo tâm ẩn danh đối ứng. Nhân đôi tác động của bạn!",
    date: "10 Tháng 6, 2023",
    type: "update",
  },
  {
    id: "4",
    title: "Ngày Tình Nguyện Cộng Đồng",
    content:
      "Hãy tham gia với chúng tôi vào thứ Bảy này cho dự án phục vụ cộng đồng hàng tháng tại nơi trú ẩn địa phương.",
    date: "8 Tháng 6, 2023",
    type: "community",
  },
  {
    id: "5",
    title: "Chuỗi Pháp Thoại",
    content:
      "Chuỗi pháp thoại hàng tuần của chúng tôi tiếp tục với diễn giả khách mời Hòa Thượng Thích Nhất Hạnh.",
    date: "5 Tháng 6, 2023",
    type: "event",
  },
];

export default AnnouncementBoard;
