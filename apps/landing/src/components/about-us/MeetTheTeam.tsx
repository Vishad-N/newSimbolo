"use client";

import { motion } from "framer-motion";
import { Globe, Mail } from "lucide-react";
import { ButtonCarousel } from "../ui/button-carousel";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio?: string;
  skills?: string[];
  photo?: string;
  linkedin?: string;
  email?: string;
};

type MeetTheTeamProps = {
  team: TeamMember[];
};

export function MeetTheTeam({ team }: MeetTheTeamProps) {
  // Convert team members to Carousel items
  const carouselItems = team.map((member) => ({
    label: member.name,
    sublabel: member.role,
    description: member.bio,
    image: member.photo || undefined,
    buttonImage: member.photo || undefined,
    socials: (
      <>
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[var(--primary)] transition-colors backdrop-blur-md"
          >
            <Globe className="w-4 h-4" />
          </a>
        )}
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[var(--primary)] transition-colors backdrop-blur-md"
          >
            <Mail className="w-4 h-4" />
          </a>
        )}
      </>
    )
  }));

  return (
    <section className="py-24 px-6 relative z-10 bg-white/[0.01]">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            Meet the Team
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            The passionate minds behind The Simbolo. We are a diverse group of experts dedicated to your success.
          </motion.p>
        </div>

        <div className="h-[700px] w-full max-w-5xl mx-auto rounded-3xl bg-white/[0.02] border border-white/5 p-4 md:p-8">
          {team.length > 0 ? (
            <ButtonCarousel 
              items={carouselItems} 
              cardRadius={20}
              imageWidth="100%"
              imageHeight={350}
              buttonCount={Math.min(team.length, 7)}
              buttonSize={60}
              gap={20}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No team members found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
