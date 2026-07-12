import Link from "next/link";
import { SiteFrame } from "./components/SiteFrame";
import {
  battleOfBigBang,
  currentMembers,
  externalProfiles,
  recentTalks,
  recentUpdates,
  researchFeatures,
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
          <a className="text-link" href="https://nafshordi.github.io/aps-dashboard/" target="_blank" rel="noreferrer">Big Mysteries dashboard <span>↗</span></a>
        </div>
        <ul className="research-list">
          {researchFeatures.map((area, index) => (
            <li key={area.id}><span>{String(index + 1).padStart(2, "0")}</span><Link href={`/research#${area.id}`}>{area.title}</Link></li>
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

      <section className="book-feature section-pad">
        <div className="book-feature-cover"><img src={battleOfBigBang.cover} alt="Battle of the Big Bang book cover" /></div>
        <div>
          <p className="eyebrow">BOOK</p>
          <h2>{battleOfBigBang.title}</h2>
          <p className="book-feature-subtitle">{battleOfBigBang.subtitle}</p>
          <p>{battleOfBigBang.description}</p>
          <Link className="button" href="/battle-of-the-big-bang">Book page &amp; media archive <span>↗</span></Link>
        </div>
      </section>

      <section className="split-section section-pad">
        <div className="paper-card">
          <p className="eyebrow">PUBLICATIONS</p>
          <h2><Link className="paper-card-title-link" href="/papers">Research papers &amp; preprints <span>↗</span></Link></h2>
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
            <a className="talk-card-link" href={talk.href} key={`${talk.date}-${talk.title}`} target="_blank" rel="noreferrer" aria-label={`Open PDF deck for ${talk.title}`}>
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
