"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  photo: string;
};

export function ProjectTeam({ team }: { team: TeamMember[] }) {
  if (!team || team.length === 0) return null;

  return (
    <section className="py-10 sm:py-14 bg-[color:var(--bg)] border-t border-[color:var(--border)]">
      <div className="px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto">
        <div className="mb-6">
          <span className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-[color:var(--primary)] mb-2">
            Credits
          </span>
          <h2 className="hero-headline text-[1.3rem] sm:text-[1.5rem] font-bold text-[color:var(--text)] leading-tight tracking-[-0.02em]">
            Team Behind This Project
          </h2>
        </div>

        <div className="flex flex-wrap gap-4">
          {team.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
              className="flex items-center gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3"
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                <Image
                  src={member.photo || ""}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-[color:var(--text)] leading-tight">{member.name}</p>
                <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[color:var(--primary)]">
                  {member.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
