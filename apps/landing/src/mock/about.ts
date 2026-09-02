import {
  Lightbulb, Target, Sparkles, Handshake, TrendingUp, Zap,
  Search, Heart, Crown, Globe, FileCode2, Users, BarChart3, Database, Cloud
} from "lucide-react";

export const aboutData = {
  hero: {
    badge: "About The Simbolo",
    title: "Helping Businesses Grow Through Digital Innovation",
    description: "We are a team of passionate digital marketers, designers, and developers committed to transforming your business with modern, scalable, and data-driven solutions.",
    primaryCta: {
      text: "Start Your Project",
      href: "/#contact",
    },
    secondaryCta: {
      text: "Explore Services",
      href: "/services",
    }
  },
  story: {
    title: "Our Story",
    subtitle: "Built on Innovation and Trust",
    content: "The Simbolo was founded with a single mission: to empower businesses to thrive in the digital landscape. We noticed a gap in the market for agencies that truly understood both cutting-edge technology and human-centric design. We bridge that gap by offering full-service solutions that don't just look good, but perform exceptionally well.",
    quote: "We don't just build websites; we build scalable engines for growth.",
    image: "/images/about-story.jpg" // Placeholder
  },
  mission: {
    title: "Our Mission",
    description: "To democratize high-quality digital solutions for businesses of all sizes, delivering measurable growth and unparalleled transparency.",
    icon: Target
  },
  vision: {
    title: "Our Vision",
    description: "To be the leading global digital platform where innovation meets execution, shaping the future of business operations and marketing.",
    icon: Lightbulb
  },
  values: [
    { title: "Innovation", description: "We stay ahead of the curve, always adopting the latest and best technologies.", icon: Sparkles, accent: "blue" },
    { title: "Transparency", description: "No hidden fees, no confusing jargon. Just honest, data-driven reporting.", icon: Search, accent: "green" },
    { title: "Quality", description: "We believe in doing things right the first time, maintaining the highest standards.", icon: Crown, accent: "yellow" },
    { title: "Growth", description: "Your growth is our growth. We are obsessed with scalable solutions.", icon: TrendingUp, accent: "cyan" },
    { title: "Customer First", description: "Every decision we make is centered around the success of our clients.", icon: Heart, accent: "pink" },
    { title: "Long-term Partnership", description: "We build relationships that last, supporting you at every stage.", icon: Handshake, accent: "purple" }
  ],
  whyChooseUs: [
    { title: "Data-driven decisions", description: "Everything we do is backed by analytics and performance metrics." },
    { title: "Dedicated specialists", description: "Work with experts in SEO, development, and design." },
    { title: "Transparent reporting", description: "Access real-time dashboards for your campaigns." },
    { title: "ROI-focused strategies", description: "We focus on solutions that bring a clear return on investment." },
    { title: "Full-service digital solutions", description: "From branding to backend development, we do it all." },
    { title: "Modern technologies", description: "We use the latest frameworks like Next.js, React, and Node." },
    { title: "Scalable processes", description: "Our solutions are built to grow as your business scales." }
  ],
  process: [
    { step: "01", title: "Discovery", description: "Understanding your business goals and current challenges." },
    { step: "02", title: "Strategy", description: "Formulating a tailored plan backed by market research." },
    { step: "03", title: "Design", description: "Creating intuitive and beautiful user interfaces." },
    { step: "04", title: "Development", description: "Building scalable and robust technical solutions." },
    { step: "05", title: "Marketing", description: "Launching targeted campaigns to drive traffic and leads." },
    { step: "06", title: "Optimization", description: "Continuous testing and improving for maximum ROI." }
  ],
  statistics: [
    { value: "250", suffix: "+", label: "Projects Delivered" },
    { value: "100", suffix: "+", label: "Happy Clients" },
    { value: "12", suffix: "+", label: "Services Offered" },
    { value: "95", suffix: "%", label: "Client Retention" },
    { value: "4.9", suffix: "★", label: "Average Rating" },
    { value: "8", suffix: "+", label: "Years Experience" }
  ],
  team: [
    {
      id: "1",
      name: "Pratik Soni",
      role: "Founder & CEO",
      bio: "Visionary leader with a passion for digital transformation.",
      skills: ["Strategy", "Leadership", "Marketing"],
      photo: "/images/team/vishad.jpg",
      linkedin: "#",
      email: "vishad@thesimbolo.com"
    },
    {
      id: "2",
      name: "Vishad ",
      role: "Lead Developer",
      bio: "Full-stack expert specializing in scalable architectures.",
      skills: ["React", "Node.js", "System Design"],
      photo: "/images/team/alex.jpg",
      linkedin: "#",
      email: "alex@thesimbolo.com"
    },
    {
      id: "3",
      name: "Sarah",
      role: "Head of Design",
      bio: "Award-winning designer obsessed with user experience.",
      skills: ["UI/UX", "Branding", "Figma"],
      photo: "/images/team/sarah.jpg",
      linkedin: "#",
      email: "sarah@thesimbolo.com"
    }
  ],
  timeline: [
    { year: "2022", title: "Founded", description: "The Simbolo was officially launched with a core team of 3." },
    { year: "2023", title: "50 Clients Milestone", description: "Reached our first 50 happy clients and expanded our service offerings." },
    { year: "2024", title: "Platform Expansion", description: "Launched our proprietary agency dashboard and partner program." },
    { year: "2025", title: "Marketplace Launch", description: "Introduced the Simbolo Digital Marketplace for agencies and freelancers." },
    { year: "Future", title: "Global Expansion", description: "Taking our innovative solutions to the global stage." }
  ],
  technologies: [
    { name: "React", icon: FileCode2 },
    { name: "Next.js", icon: Zap },
    { name: "Node.js", icon: Database },
    { name: "MongoDB", icon: Database },
    { name: "PostgreSQL", icon: Database },
    { name: "Docker", icon: Cloud },
    { name: "AWS", icon: Cloud },
    { name: "Google Ads", icon: BarChart3 },
    { name: "Meta Ads", icon: Users },
    { name: "Shopify", icon: Globe }
  ],
  faq: [
    { id: "1", question: "Who is Simbolo?", answer: "Simbolo is a full-service digital platform combining agency expertise with cutting-edge technology." },
    { id: "2", question: "How long have you been in business?", answer: "We were founded in 2022 and have rapidly grown to serve over 100 clients globally." },
    { id: "3", question: "Which industries do you serve?", answer: "We serve a wide variety of industries including eCommerce, SaaS, Healthcare, Real Estate, and more." },
    { id: "4", question: "How do projects begin?", answer: "Every project starts with a comprehensive discovery phase where we analyze your goals and align our strategy." },
    { id: "5", question: "What makes Simbolo different?", answer: "Our unique blend of transparent reporting, proprietary dashboards, and world-class talent sets us apart." }
  ],
  testimonials: [
    { id: "1", quote: "Simbolo transformed our digital presence completely. We saw a 300% increase in leads within 3 months.", name: "Jane Doe", role: "CEO, TechFlow", rating: 5 },
    { id: "2", quote: "The transparency and dedication of the Simbolo team is unmatched. Highly recommended.", name: "John Smith", role: "Marketing Director, HealthPlus", rating: 5 },
    { id: "3", quote: "They don't just build websites, they build scalable business engines.", name: "Sarah Lee", role: "Founder, StyleCommerce", rating: 5 }
  ],
  cta: {
    title: "Ready to Grow Your Business?",
    subtitle: "Let's build something amazing together.",
    primaryButton: { text: "Start Your Project", href: "/contact" }
  },
  seo: {
    title: "About Us | The Simbolo",
    description: "Learn more about The Simbolo's mission, vision, team, and the core values that drive our digital innovations.",
    keywords: "About Simbolo, Digital Agency, Web Development, Marketing Experts"
  }
};
