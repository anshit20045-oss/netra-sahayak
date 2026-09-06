const LINKS = [
  { href: "#problem", label: "Problem" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#demo", label: "Live demo" },
  { href: "#impact", label: "Impact" },
  { href: "#architecture", label: "Architecture" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[var(--color-paper)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <a href="#top" className="flex items-baseline gap-2.5">
          <span className="font-serif text-[17px] font-medium leading-none">Netra Sahayak</span>
          <span className="text-[11px] leading-none text-[var(--color-ink-soft)]">SIH26038</span>
        </a>
        <nav className="hidden items-center gap-7 text-[14.5px] text-[var(--color-ink-soft)] md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-[var(--color-ink)]">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#demo"
          className="rounded-sm bg-[var(--color-ink)] px-4 py-2 text-[13.5px] font-medium text-white transition-opacity hover:opacity-85"
        >
          Try the demo
        </a>
      </div>
    </header>
  );
}
