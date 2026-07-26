import type { LucideIcon } from "lucide-react";
import {
  Archive,
  BookOpen,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  PlusCircle,
  Settings,
  ShoppingCart,
  User,
} from "lucide-react";
import { ACCOUNT_TYPE } from "@/data/constants";

interface DashboardLink {
  name: string;
  path: string;
  icon: LucideIcon;
  type?: string;
}

/** Single source of truth for all dashboard navigation links.
 *  Used by sidebar nav, profile dropdown, and mobile menu. */
export const dashboardLinks: DashboardLink[] = [
  {
    name: "Profile",
    path: "/dashboard",
    icon: User,
  },
  {
    name: "Analytics",
    path: "/dashboard/analytics",
    icon: LayoutDashboard,
    type: ACCOUNT_TYPE.INSTRUCTOR,
  },
  {
    name: "My Courses",
    path: "/dashboard/my-courses",
    icon: BookOpen,
    type: ACCOUNT_TYPE.INSTRUCTOR,
  },
  {
    name: "Add Course",
    path: "/dashboard/add-course",
    icon: PlusCircle,
    type: ACCOUNT_TYPE.INSTRUCTOR,
  },
  {
    name: "Enrolled Courses",
    path: "/dashboard/enrolled-courses",
    icon: GraduationCap,
    type: ACCOUNT_TYPE.STUDENT,
  },
  {
    name: "Cart",
    path: "/dashboard/cart",
    icon: ShoppingCart,
    type: ACCOUNT_TYPE.STUDENT,
  },
  {
    name: "Payment History",
    path: "/dashboard/payment-history",
    icon: CreditCard,
    type: ACCOUNT_TYPE.STUDENT,
  },
  {
    name: "Admin Panel",
    path: "/dashboard/admin-panel",
    icon: Archive,
    type: ACCOUNT_TYPE.ADMIN,
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
  },
];
