import type { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  active?: boolean;
};

export type ServiceCardData = {
  title: string;
  icon: LucideIcon;
  image: string;
  bullets: string[];
  price: string;
  rating: string;
  accent: "blue" | "green" | "cyan" | "purple" | "pink";
};
