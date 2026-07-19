import type { GoogleAdsFaq } from "@/types/googleAds";

export const googleAdsFaqs: GoogleAdsFaq[] = [
  {
    id: "budget",
    question: "What ad budget do I need to start?",
    answer: "Starter campaigns can begin with a modest test budget. We recommend scaling only after conversion tracking and early campaign data confirm the best-performing audience and keywords.",
  },
  {
    id: "tracking",
    question: "Do you set up conversion tracking?",
    answer: "Yes. Conversion tracking, call tracking guidance, landing page events, and reporting foundations are included so performance decisions are based on clean data.",
  },
  {
    id: "optimization",
    question: "How often are campaigns optimized?",
    answer: "Optimization cadence depends on the plan. Growth and higher plans include frequent bid, search term, creative, and audience improvements.",
  },
];
