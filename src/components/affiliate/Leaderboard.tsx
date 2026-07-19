"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Medal } from "lucide-react";
import { motion } from "framer-motion";
import { SectionCard } from "@/components/seo/SectionCard";

type Leader = {
  id: string;
  rank: number;
  name: string;
  email: string;
  avatar: string;
  earnings: string;
};

type LeaderboardProps = {
  leaders: Leader[];
};

export function Leaderboard({ leaders }: LeaderboardProps) {
  return (
    <SectionCard className="p-6 md:p-8 flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[1.15rem] font-black text-white">Top Affiliate Leaders</h2>
        <Link href="/leaderboard" className="flex items-center gap-1.5 text-[0.8rem] font-bold text-[var(--primary-light)] transition hover:text-white">
          View All
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      
      <div className="flex flex-col gap-4 flex-1">
        {leaders.map((leader, index) => {
          // Color based on rank
          let medalColor = "text-white/40";
          let bgMedal = "bg-white/10";
          if (leader.rank === 1) {
            medalColor = "text-yellow-400";
            bgMedal = "bg-yellow-400/20";
          } else if (leader.rank === 2) {
            medalColor = "text-gray-300";
            bgMedal = "bg-gray-300/20";
          } else if (leader.rank === 3) {
            medalColor = "text-amber-600";
            bgMedal = "bg-amber-600/20";
          }

          return (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex items-center gap-4 rounded-[8px] border border-white/5 bg-[var(--background)]/30 p-3 transition hover:bg-[var(--background)]/60"
            >
              <div className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${bgMedal} ${medalColor}`}>
                <Medal className="h-4 w-4" />
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--surface)] text-[0.6rem] font-bold text-white shadow-sm border border-white/10">
                  {leader.rank}
                </span>
              </div>
              
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10">
                <Image src={leader.avatar} alt={leader.name} fill className="object-cover" />
              </div>
              
              <div className="flex-1 overflow-hidden">
                <h3 className="truncate text-[0.9rem] font-bold text-white leading-tight">{leader.name}</h3>
                <p className="truncate text-[0.7rem] text-white/50">{leader.email}</p>
              </div>
              
              <div className="text-right">
                <div className="text-[1.05rem] font-black text-white">{leader.earnings}</div>
                <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-white/40">Total Earnings</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </SectionCard>
  );
}
