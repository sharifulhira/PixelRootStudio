export function ProjectBody({ body }: { body: string[] }) {
  if (!body || body.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-[color:var(--bg)]">
      <div className="px-5 sm:px-10 lg:px-16 max-w-[780px] mx-auto">
        {body.map((paragraph, i) => (
          <p
            key={i}
            className="text-[0.95rem] text-[color:var(--text)] leading-[1.85] mb-5"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
