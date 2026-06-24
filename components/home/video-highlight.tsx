"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const easeOut = [0.22, 1, 0.36, 1] as const;

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/shorts\/([^&\s?]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

type Props = {
  videoUrl?: string;
  title?: string;
  subtitle?: string;
};

export function VideoHighlight({ 
  videoUrl, 
  title = "Behind the Lens",
  subtitle = "Watch our creative process and see how we bring your vision to life through cinematic storytelling."
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  if (!videoUrl) return null;
  
  const videoId = getYouTubeId(videoUrl);
  if (!videoId) return null;
  
  const thumbnailUrl = getYouTubeThumbnail(videoId);
  
  return (
    <section className="py-16 sm:py-24 bg-[color:var(--surface)] border-t border-[color:var(--border)]">
      <div className="px-5 sm:px-10 lg:px-16 max-w-[1200px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase text-[color:var(--primary)] mb-3">
            <span className="w-8 h-px bg-[color:var(--primary)]/40" />
            Video Showcase
            <span className="w-8 h-px bg-[color:var(--primary)]/40" />
          </span>
          <h2 className="hero-headline text-[clamp(1.6rem,4.5vw,2.6rem)] font-bold text-[color:var(--text)] leading-tight tracking-[-0.02em] mb-3">
            {title}
          </h2>
          <p className="text-sm sm:text-[15px] text-[color:var(--muted)] leading-relaxed max-w-xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Video Player */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
          className="relative aspect-video rounded-2xl overflow-hidden border border-[color:var(--border)] shadow-2xl bg-black"
        >
          {isPlaying ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title="Video showcase"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          ) : (
            <>
              {/* Thumbnail */}
              <img
                src={thumbnailUrl}
                alt="Video thumbnail"
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />
              
              {/* Play button */}
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex items-center justify-center group cursor-pointer"
                aria-label="Play video"
              >
                <div className="relative">
                  {/* Pulse ring */}
                  <div className="absolute inset-0 rounded-full bg-amber-500/30 animate-ping" style={{ animationDuration: "2s" }} />
                  
                  {/* Button */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-500 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <svg 
                      viewBox="0 0 24 24" 
                      className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" 
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </button>
              
              {/* Bottom label */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-semibold tracking-[0.15em] uppercase text-white/60">
                  Click to play
                </span>
                <span className="text-[10px] sm:text-xs font-semibold tracking-[0.15em] uppercase text-white/60 flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                  YouTube
                </span>
              </div>
            </>
          )}
        </motion.div>

        {/* Optional: Feature highlights below video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }}
          className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
        >
          {[
            { icon: "🎬", label: "Cinematic Quality", desc: "4K production standard" },
            { icon: "🎯", label: "Story-Driven", desc: "Every frame has meaning" },
            { icon: "✨", label: "Premium Finish", desc: "Color graded to perfection" },
          ].map((item, i) => (
            <div
              key={item.label}
              className="flex items-center gap-4 p-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--bg)]"
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-sm font-semibold text-[color:var(--text)]">{item.label}</p>
                <p className="text-xs text-[color:var(--muted)]">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
