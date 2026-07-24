import type { ReactNode } from "react";
import { StickyConsultationWidget } from "@/components/shared/StickyConsultationWidget";

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <StickyConsultationWidget />
    </>
  );
}
