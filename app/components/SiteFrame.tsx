import Link from "next/link";
import type { ReactNode } from "react";

const links = [
  ["Research", "/research"],
  ["People", "/group"],
  ["Papers", "/publications"],
  ["Talks & Outreach", "/talks"],
  ["Writing", "/updates"],
  ["CV", "/cv"],
] as const;

export function SiteFrame({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="Niayesh Afshordi home">
          <span>Niayesh</span> Afshordi
        </Link>
        <nav aria-label="Primary navigation">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <p>Niayesh Afshordi · Astrophysics, cosmology, and gravity</p>
        <a href="mailto:nafshordi@pitp.ca">nafshordi@pitp.ca</a>
        <a href="https://www.physics.uwaterloo.ca/">University of Waterloo</a>
        <a href="https://perimeterinstitute.ca/">Perimeter Institute</a>
      </footer>
    </div>
  );
}
