import {
  LayoutDashboard,
  type LucideIcon,
  Users,
  Trophy,
  Calendar,
  ClipboardList,
  MessageSquare,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/admin/dashboard/default",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: 2,
    label: "Management",
    items: [
      {
        title: "Events",
        url: "/admin/dashboard/events",
        icon: Calendar,
      },
      {
        title: "Registrations",
        url: "/admin/dashboard/registrations",
        icon: ClipboardList,
        isNew: true,
      },
      {
        title: "Teams",
        url: "/admin/dashboard/teams",
        icon: Trophy,
      },
      {
        title: "Users",
        url: "/admin/dashboard/users",
        icon: Users,
      },
      {
        title: "Messages",
        url: "/admin/dashboard/messages",
        icon: MessageSquare,
      },
    ],
  },
];


