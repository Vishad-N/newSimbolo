import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AdminLayout } from "@/layouts/AdminLayout";

export const metadata: Metadata = {
  title: "Simbolo Admin",
  description: "Admin CMS for The Simbolo",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-body antialiased bg-background text-white">
        <AdminLayout>
          {children}
        </AdminLayout>
      </body>
    </html>
  );
}
