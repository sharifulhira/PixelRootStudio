import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="hero-headline text-[1.6rem] sm:text-[1.9rem] font-bold text-[color:var(--text)] leading-tight tracking-[-0.02em] mt-10 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="hero-headline text-[1.25rem] sm:text-[1.4rem] font-bold text-[color:var(--text)] leading-tight mt-8 mb-3">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-base sm:text-lg font-bold text-[color:var(--text)] leading-tight mt-6 mb-2">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-[0.95rem] text-[color:var(--text)] leading-[1.85] mb-5">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-amber-400/60 pl-5 my-8 italic text-[color:var(--muted)] text-[0.95rem] leading-[1.85]">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-outside pl-5 space-y-2 mb-6 text-[0.95rem] text-[color:var(--text)] leading-[1.85]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-outside pl-5 space-y-2 mb-6 text-[0.95rem] text-[color:var(--text)] leading-[1.85]">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const target = value?.blank ? "_blank" : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="text-[color:var(--primary)] underline underline-offset-2 hover:opacity-70 transition-opacity"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?.url) return null;
      return (
        <figure className="my-8">
          <div className="relative w-full overflow-hidden rounded-xl">
            <Image
              src={value.asset.url}
              alt={value.alt || ""}
              width={value.asset.metadata?.dimensions?.width || 1200}
              height={value.asset.metadata?.dimensions?.height || 800}
              className="w-full h-auto rounded-xl"
              sizes="(max-width: 768px) 100vw, 720px"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-xs text-[color:var(--muted)] mt-3">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export function ProjectBody({ body }: { body: any[] }) {
  if (!body || body.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-[color:var(--bg)]">
      <div className="px-5 sm:px-10 lg:px-16 max-w-[780px] mx-auto">
        <PortableText value={body} components={components} />
      </div>
    </section>
  );
}
