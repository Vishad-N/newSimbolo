"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { services as mockServices } from "@/data/landing";
import { ServiceCard, type AccentColor } from "@/components/ui/ServiceCard";

const ACCENT_COLORS: AccentColor[] = ["blue", "green", "cyan", "purple", "pink", "orange", "teal"];

interface FeaturedServiceItem {
  id?: string;
  title: string;
  image: string;
  price: string;
  rating: string;
  accent?: string;
}

interface FeaturedServicesProps {
  services?: FeaturedServiceItem[];
}

export function FeaturedServices({ services }: FeaturedServicesProps) {
  const router = useRouter();

  const hasCmsServices = Array.isArray(services) && services.some((s) => s.title && s.image && s.price);
  const cards = hasCmsServices
    ? services!.filter((s) => s.title && s.image && s.price)
    : mockServices;

  return (
    <section className="mx-auto max-w-[1290px] border-t border-white/10 px-4 pt-4 sm:px-8 lg:px-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading flex items-center gap-2 text-[1.45rem] font-extrabold text-white">
          <span className="text-[#2DD4BF]">✦</span>
          Featured Services
        </h2>
        <Link href="/packages" className="hidden items-center gap-2 text-[0.95rem] font-semibold text-[#2DD4BF] transition hover:text-[#14B8A6] sm:flex">
          View all packages <span className="text-xl">→</span>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((service, index) => (
          <ServiceCard
            key={service.title}
            title={service.title}
            image={service.image}
            bullets={(service as any).bullets}
            price={service.price}
            rating={service.rating}
            accent={(ACCENT_COLORS.includes(service.accent as AccentColor) ? service.accent : ACCENT_COLORS[index % ACCENT_COLORS.length]) as AccentColor}
            delay={index * 0.05}
            showCta={false}
            onClick={() => router.push("/packages")}
          />
        ))}
      </div>
    </section>
  );
}
