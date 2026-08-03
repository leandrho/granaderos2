interface PageHeaderProps {
  title: string;
  eyebrow?: string;
}

export function PageHeader({
  title,
  eyebrow = "Club Deportivo",
}: PageHeaderProps) {
  return (
    <section className="bg-surface pt-28 pb-24">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <p className="font-label text-sm uppercase tracking-[0.1em] text-gold-glimmer">
          {eyebrow}
        </p>
        <h1 className="mt-4 font-headline text-5xl uppercase leading-none tracking-wide text-on-surface md:text-7xl">
          {title}
        </h1>
      </div>
    </section>
  );
}
