import Link from "next/link";
import { SiteFrame } from "./components/SiteFrame";
import {
  currentMembers,
  externalProfiles,
  recentTalks,
  recentUpdates,
  researchAreas,
  talksArchiveUrl,
} from "./site-content";

export default function Home() {
  return (
    <SiteFrame>
      <section className="hero">
        <div className="hero-layout">
          <div>
            <p className="eyebrow">ASTROPHYSICS · COSMOLOGY · GRAVITY</p>
            <h1>Curiosity at the edge of the universe.</h1>
            <div className="hero-copy">
              <p>
                I am an astrophysicist and professor at the University of Waterloo,
                and Associate Faculty at Perimeter Institute. My work looks for
                observational clues to the deepest questions in fundamental physics.
              </p>
              <div className="hero-actions">
                <Link className="button" href="/research">Explore the research</Link>
                <Link className="text-link" href="/cv">View CV <span>↗</span></Link>
              </div>
            </div>
          </div>
          <figure className="hero-portrait">
            <img src="/images/niayesh-afshordi-hero.png" alt="Niayesh Afshordi" />
          </figure>
        </div>
        <div className="orbit-mark" aria-hidden="true"><i /><i /><i /></div>
      </section>

      <section className="feature-grid section-pad">
        <div className="feature-intro">
          <p className="eyebrow">RESEARCH</p>
          <h2>Following the evidence where it leads.</h2>
          <p>
            From black holes and the early universe to dark energy and the cosmic
            microwave background, the questions are connected by a common aim:
            making fundamental physics answerable to observation.
          </p>
          <Link className="text-link" href="/research">All research areas <span>↗</span></Link>
        </div>
        <ul className="research-list">
          {researchAreas.map((area, index) => (
            <li key={area}><span>0{index + 1}</span>{area}</li>
          ))}
        </ul>
      </section>

      <section className="news-strip section-pad">
        <div>
          <p className="eyebrow">CURRENTLY</p>
          <h2>Recent writing & announcements</h2>
        </div>
        <div className="update-list">
          {recentUpdates.map((item) => (
            <Link href={item.href} key={item.href}>
              <span>{item.date}</span>
              <strong>{item.title}</strong>
              <b>↗</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="split-section section-pad">
        <div className="paper-card">
          <p className="eyebrow">PUBLICATIONS</p>
          <h2>Research papers & preprints</h2>
          <p>
            Browse a complete scholarly record through the field&apos;s leading
            indexes, or explore selected work in the research archive.
          </p>
          <div className="profile-links">
            {externalProfiles.map((profile) => (
              <a href={profile.href} key={profile.label} target="_blank" rel="noreferrer">{profile.label} ↗</a>
            ))}
          </div>
        </div>
        <div className="people-card">
          <p className="eyebrow">THE GROUP</p>
          <h2>People make the questions sharper.</h2>
          <ul>
            {currentMembers.map((member) => <li key={member}>{member}</li>)}
          </ul>
          <Link className="text-link" href="/group">Meet the group & alumni <span>↗</span></Link>
        </div>
      </section>

      <section className="talk-section section-pad">
        <p className="eyebrow">TALKS & OUTREACH</p>
        <h2>Conversations about cosmology, fundamental physics, and how science works.</h2>
        <div className="talks-grid">
          {recentTalks.map((talk) => (
            <a className="talk-card-link" href={talksArchiveUrl} key={`${talk.date}-${talk.title}`} target="_blank" rel="noreferrer" aria-label={`Open materials for ${talk.title}`}>
              <article>
              <p>{talk.date}</p>
              <h3>{talk.title}</h3>
              <span>{talk.venue}</span>
              </article>
            </a>
          ))}
        </div>
        <Link className="button button-light" href="/talks">Talks & public work</Link>
      </section>
    </SiteFrame>
  );
}
