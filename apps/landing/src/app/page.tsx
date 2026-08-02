import { LandingPage } from "@/components/sections/landing-page";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <LandingPage />
    </Suspense>
  );
}
