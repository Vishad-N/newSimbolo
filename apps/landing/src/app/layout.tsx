import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Montserrat, Open_Sans } from "next/font/google";
import { AppLayout } from "@/components/layout/AppLayout";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { FloatingWhatsApp } from "@/components/shared/FloatingWhatsApp";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans", display: "swap" });

export const metadata: Metadata = {
  title: "The Simbolo | AI-Powered Marketing Match",
  description: "Find the right digital marketing expert in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${montserrat.variable} ${openSans.variable} font-body antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AppLayout>
            {children}
            <FloatingWhatsApp />
          </AppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
