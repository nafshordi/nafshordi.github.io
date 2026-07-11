import Link from "next/link";
import type { ReactNode } from "react";
import { socialProfiles } from "../site-content";

const links = [
  ["Research", "/research"],
  ["People", "/group"],
  ["Papers", "/publications"],
  ["Talks & Outreach", "/talks"],
  ["News & Media", "/news"],
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
        <span className="footer-socials">{socialProfiles.map((profile) => <a href={profile.href} key={profile.label} target="_blank" rel="noreferrer">{profile.label}</a>)}</span>
        <Link href="/archive">Complete archive</Link>
      </footer>
    </div>
  );
}
