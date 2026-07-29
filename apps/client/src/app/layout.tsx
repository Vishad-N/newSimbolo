import type { Metadata } from "next";
import "./globals.css";
import { ClientLayout } from "@/layouts/ClientLayout";

export const metadata: Metadata = {
  title: "Client Workspace | The Simbolo",
  description: "Manage your projects, invoices, and reports securely.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased bg-[#050816]"
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
