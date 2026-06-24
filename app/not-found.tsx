import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[70dvh] px-5 py-20 text-center bg-[color:var(--bg)]">
      <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[color:var(--primary)] mb-3">
        404
      </span>
      <h1 className="hero-headline text-[clamp(2rem,6vw,3rem)] font-bold text-[color:var(--text)] leading-tight tracking-[-0.02em] mb-3">
        Page Not Found
      </h1>
      <p className="text-sm text-[color:var(--muted)] max-w-sm leading-relaxed mb-8">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[color:var(--primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Back to Home
        </Link>
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[color:var(--border)] text-sm font-semibold text-[color:var(--text)] hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] transition-colors"
        >
          View Portfolio
        </Link>
      </div>
    </section>
  );
}
