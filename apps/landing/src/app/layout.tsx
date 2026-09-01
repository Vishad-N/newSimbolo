import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { FloatingWhatsApp } from "@/components/shared/FloatingWhatsApp";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://thesimbolo.com"),
  title: "The Simbolo | AI-Powered Marketing Match",
  description: "Find the right digital marketing expert in seconds.",
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
    <html lang="en" suppressHydrationWarning>
      <body className="font-body antialiased cursor-default">
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
