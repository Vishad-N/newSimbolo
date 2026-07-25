"use client";

import { motion } from "framer-motion";
import { Globe, Mail } from "lucide-react";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  skills: string[];
  photo: string;
  linkedin?: string;
  email?: string;
};

type MeetTheTeamProps = {
  team: TeamMember[];
};

export function MeetTheTeam({ team }: MeetTheTeamProps) {
  return (
    <section className="py-24 px-6 relative z-10 bg-white/[0.01]">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Meet the Team</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            The passionate minds behind The Simbolo. We are a diverse group of experts dedicated to your success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-3xl bg-white/[0.02] border border-white/10 overflow-hidden hover:border-white/20 transition-all hover:-translate-y-2 flex flex-col"
            >
              <div className="aspect-[4/3] w-full relative overflow-hidden bg-white/5">
                {/* Fallback pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/20 to-cyan-500/10 flex items-center justify-center">
                  <span className="text-white/30 text-2xl font-bold">{member.name.charAt(0)}</span>
                </div>
                {member.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={member.photo} 
                    alt={member.name} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    loading="lazy"
                  />
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-[#0a0f1c]/40 to-transparent" />
                
                <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                  <div>
                    <h3 className="text-2xl font-bold text-white leading-none mb-1">{member.name}</h3>
                    <p className="text-[var(--primary)] font-medium text-sm">{member.role}</p>
                  </div>
                  <div className="flex gap-2">
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[var(--primary)] transition-colors backdrop-blur-md">
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-cyan-500 transition-colors backdrop-blur-md">
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                  {member.bio}
                </p>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
