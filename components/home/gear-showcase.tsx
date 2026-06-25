"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const easeOut = [0.22, 1, 0.36, 1] as const;

export type GearItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  featured?: boolean;
};

type Props = {
  title?: string;
  subtitle?: string;
  gear: GearItem[];
};

export function GearShowcase({
  title = "Our Gear",
  subtitle = "Professional equipment for exceptional results. We invest in the best tools to deliver outstanding quality.",
  gear,
}: Props) {
  if (!gear || gear.length === 0) return null;

  const featuredGear = gear.filter((g) => g.featured);
  const otherGear = gear.filter((g) => !g.featured);

  const categoryCounts = gear.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <section className="py-16 sm:py-24 bg-[color:var(--bg)] border-t border-[color:var(--border)]">
      <div className="px-5 sm:px-10 lg:px-16 max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase text-[color:var(--primary)] mb-3">
            <span className="w-8 h-px bg-[color:var(--primary)]/40" />
            Equipment
            <span className="w-8 h-px bg-[color:var(--primary)]/40" />
          </span>
          <h2 className="hero-headline text-[clamp(1.6rem,4.5vw,2.6rem)] font-bold text-[color:var(--text)] leading-tight tracking-[-0.02em] mb-3">
            {title}
          </h2>
          <p className="text-sm sm:text-[15px] text-[color:var(--muted)] leading-relaxed max-w-xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Featured Gear - Large Cards */}
        {featuredGear.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          >
            {featuredGear.slice(0, 2).map((item, i) => (
              <div
                key={item.id}
                className="group relative bg-[color:var(--surface)] border border-[color:var(--border)] rounded-2xl overflow-hidden"
              >
                <div className="aspect-[4/3] relative">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={i < 2}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/50 transition-colors duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                {/* Category count — top */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center justify-center min-w-[2.25rem] h-9 px-2.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 text-lg font-bold text-white">
                    {categoryCounts[item.category]}
                  </span>
                </div>
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block text-[10px] font-semibold tracking-[0.15em] uppercase text-amber-400 mb-2">
                    {item.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-white/70 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Featured Badge */}
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-bold tracking-[0.12em] uppercase text-amber-400 bg-black/60 backdrop-blur-sm border border-amber-400/30 rounded-full px-3 py-1.5">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Featured
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Other Gear - Smaller Grid */}
        {otherGear.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {otherGear.map((item) => (
              <div
                key={item.id}
                className="group relative bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl overflow-hidden"
              >
                <div className="aspect-square relative">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/50 transition-colors duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                </div>

                {/* Category count — top */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center justify-center min-w-[1.75rem] h-7 px-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 text-sm font-bold text-white">
                    {categoryCounts[item.category]}
                  </span>
                </div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                  <span className="block text-[9px] font-semibold tracking-[0.12em] uppercase text-amber-400/80 mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-semibold text-white leading-tight line-clamp-2">
                    {item.name}
                  </h3>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
