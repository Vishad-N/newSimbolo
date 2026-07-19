import { Link, Wallet, HandCoins, Users, LineChart, MessageSquare, ShieldCheck, Mail, Film, Image as ImageIcon, Briefcase, MousePointer2 } from "lucide-react";

export const affiliateBenefits = [
  "High Commission",
  "Lifetime Earnings",
  "Real-time Tracking",
  "Fast & Easy Payouts",
];

export const howItWorksSteps = [
  {
    id: 1,
    title: "Join for Free",
    description: "Sign up for our affiliate program in less than 2 minutes.",
    icon: Users,
  },
  {
    id: 2,
    title: "Share Your Link",
    description: "Get your unique affiliate link and share it with your audience.",
    icon: Link,
  },
  {
    id: 3,
    title: "User Makes Purchase",
    description: "When someone purchases our service using your link.",
    icon: MousePointer2,
  },
  {
    id: 4,
    title: "You Earn Commission",
    description: "You earn a commission on every successful referral.",
    icon: Wallet,
  },
  {
    id: 5,
    title: "Get Paid",
    description: "Receive your earnings directly to your bank account.",
    icon: HandCoins,
  },
];

export const commissionPlans = [
  {
    id: "cp-1",
    name: "Starter Plan",
    commission: "₹2,000",
    description: "Per Sale",
  },
  {
    id: "cp-2",
    name: "Growth Plan",
    commission: "₹5,000",
    description: "Per Sale",
    isPopular: true,
    badge: "Most Popular",
  },
  {
    id: "cp-3",
    name: "Scale Plan",
    commission: "₹10,000",
    description: "Per Sale",
  },
  {
    id: "cp-4",
    name: "Premium Plan",
    commission: "₹25,000+",
    description: "Per Sale",
  },
];

export const affiliateFeatures = [
  {
    id: "af-1",
    title: "High Payouts",
    description: "Earn some of the highest commissions in the industry.",
    icon: Wallet,
  },
  {
    id: "af-2",
    title: "Lifetime Cookie",
    description: "Get credit for referrals within 30 days of first click.",
    icon: Clock,
  },
  {
    id: "af-3",
    title: "Marketing Support",
    description: "Get banners, templates, and content to boost your conversions.",
    icon: Briefcase,
  },
  {
    id: "af-4",
    title: "Real-time Tracking",
    description: "Track clicks, referrals and earnings in real-time.",
    icon: LineChart,
  },
  {
    id: "af-5",
    title: "Reliable Payouts",
    description: "Timely payments through secure methods.",
    icon: ShieldCheck,
  },
];

export const marketingAssets = [
  {
    id: "ma-1",
    title: "Banners",
    description: "High-converting banners",
    icon: ImageIcon,
    accent: "pink",
  },
  {
    id: "ma-2",
    title: "Social Media Posts",
    description: "Ready to post creatives",
    icon: MessageSquare,
    accent: "blue",
  },
  {
    id: "ma-3",
    title: "Email Templates",
    description: "Conversion-focused email templates",
    icon: Mail,
    accent: "purple",
  },
  {
    id: "ma-4",
    title: "Videos",
    description: "Promotional videos",
    icon: Film,
    accent: "green",
  },
];

export const affiliateLeaderboard = [
  {
    id: "al-1",
    rank: 1,
    name: "Rohit Sharma",
    email: "rohit.marketer@gmail.com",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80",
    earnings: "₹1,32,500",
  },
  {
    id: "al-2",
    rank: 2,
    name: "Neha Verma",
    email: "neha.digital@gmail.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    earnings: "₹98,750",
  },
  {
    id: "al-3",
    rank: 3,
    name: "Aman Yadav",
    email: "aman.yadav10@gmail.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    earnings: "₹76,300",
  },
];

// Helper icon import since clock is used in features
import { Clock } from "lucide-react";
