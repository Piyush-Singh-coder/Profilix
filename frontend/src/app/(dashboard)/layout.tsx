import { Metadata } from "next";
import DashboardLayoutClient from "./ClientLayout";

export const metadata: Metadata = {
  title: "Dashboard | Profilix",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
