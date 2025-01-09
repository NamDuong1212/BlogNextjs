'use client'

import { usePathname } from "next/navigation";
import DashboardLayout from "./DashboardLayout";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return isAuthPage ? children : <DashboardLayout>{children}</DashboardLayout>;
}