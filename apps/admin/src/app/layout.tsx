import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import { AdminLayout } from "@/layouts/AdminLayout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Simbolo Admin",
  description: "Admin CMS for The Simbolo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${montserrat.variable} ${openSans.variable} font-body antialiased bg-background text-white`}>
        <AdminLayout>
          {children}
        </AdminLayout>
      </body>
    </html>
  );
}
