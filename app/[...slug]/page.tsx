import Link from "next/link";
import { notFound } from "next/navigation";
import entries from "../../data/wordpress-content.json";
import talksCatalog from "../../data/talks-catalog.json";
import { SiteFrame } from "../components/SiteFrame";
import {
  alumni,
  alumniPeople,
  currentPeople,
  currentMembers,
  externalProfiles,
  recentTalks,
  researchAreas,
  researchFeatures,
  talksArchiveUrl,
} from "../site-content";

type Entry = (typeof entries)[number];

function PageHero({ title, children }: { title: string; children?: React.ReactNode }) {
  return <section className="page-hero"><h1>{title}</h1>{children}</section>;
}

function Content({ html }: { html: string }) {
  const safeHtml = html.replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "");
  return <div className="content-page" dangerouslySetInnerHTML={{ __html: safeHtml }} />;
}

function ResearchPage() {
  return <>
    <PageHero title="Research"><p>Observational routes into the puzzles of gravity, cosmology, and the quantum universe.</p></PageHero>
    <div className="content-page">
      <p className="notice">Research pages and their linked papers are preserved locally from the WordPress archive. This index will be reviewed as new work appears; the figures below are selected illustrations from the archive, not a claim to the latest result in each area.</p>
      <ul className="research-list">{researchAreas.map((area, index) => <li key={area}><span>0{index + 1}</span>{area}</li>)}</ul>
      <h2>Research directions</h2>
      <p>I work on astrophysics, cosmology, and the physics of gravity, with a particular interest in observational hints that can address fundamental questions.</p>
      <div className="research-feature-grid">
        {researchFeatures.map((feature) => <article className="research-feature" key={feature.title}>
          <figure><img src={feature.image} alt={feature.alt} /><figcaption>{feature.caption}</figcaption></figure>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </article>)}
      </div>
      <Link className="button" href="/welcome/research/">Explore the preserved research archive</Link>
    </div>
  </>;
}

function PersonCard({ person }: { person: (typeof currentPeople)[number] }) {
  const initials = person.name.split(" ").map((part) => part[0]).join("");
  return <article className="person-card">
    {person.image ? <img src={person.image} alt={person.name} /> : <div className="person-placeholder" aria-label={`${person.name}: photo pending verification`}>{initials}</div>}
    <div className="person-card-copy">
      <p className="eyebrow">{person.role}</p>
      <h3>{person.name}</h3>
      <p><strong>{person.years}</strong></p>
      <p>{person.research}</p>
      <p className="person-destination">{person.destination}</p>
    </div>
  </article>;
}

function PeoplePage() {
  return <>
    <PageHero title="People"><p>Students, postdoctoral researchers, collaborators, and alumni who have shaped the work of the group.</p></PageHero>
    <div className="content-page">
      <h2>Current members</h2>
      <div className="people-grid">{currentPeople.map((person) => <PersonCard key={person.name} person={person} />)}</div>
      <p className="notice">Current roles are based on the 2025 CCV and will be reconfirmed in the monthly group update. New members and changes will be reviewed with Niayesh before publication.</p>
      <h2>Former group members</h2>
      <div className="people-grid">{alumniPeople.map((person) => <PersonCard key={person.name} person={person} />)}</div>
      <h2>Full historical group list</h2>
      <ul className="people-list">{alumni.map((member) => <li key={member}>{member}</li>)}</ul>
      <p className="notice">The profile cards now include former members with a verified project and last-recorded destination from the CV. I will add the remaining biographies and photographs only after their details are confirmed.</p>
    </div>
  </>;
}

function PublicationsPage() {
  return <>
    <PageHero title="Papers"><p>Publications, preprints, and research records.</p></PageHero>
    <div className="content-page">
      <p>For a complete and current publication record, use the scholarly databases below. New work will be checked monthly before it is added to the site.</p>
      <div className="profile-links">{externalProfiles.map((profile) => <a href={profile.href} key={profile.label} target="_blank" rel="noreferrer">{profile.label} ↗</a>)}</div>
      <h2>Research archive</h2>
      <p>The original topical pages are retained under the research archive and will be consolidated into selected-paper records during the migration.</p>
      <Link className="button" href="/welcome/research/">Open research archive</Link>
    </div>
  </>;
}

function TalksPage() {
  const legacy = entries.find((entry) => entry.path === "/welcome/my-talks/");
  const groups = talksCatalog.talks.reduce<Record<string, (typeof talksCatalog.talks)[number][]>>((all, talk) => {
    (all[talk.category] ??= []).push(talk);
    return all;
  }, {});
  return <>
    <PageHero title="Talks & outreach"><p>Lectures, seminars, interviews, writing, and public conversation about cosmology and fundamental physics.</p></PageHero>
    <div className="content-page">
      <h2>Recent talks</h2>
      <ul className="entry-list">{recentTalks.map((talk) => <li key={talk.title}><time>{talk.date}</time><div><strong>{talk.title}</strong><p>{talk.venue}</p></div></li>)}</ul>
      <h2>Talk archive</h2>
      <p>The archive below is a complete, source-file catalogue built from the local <em>My Talks</em> collection: {talksCatalog.count} decks and slide exports. The original materials stay in their existing Dropbox archive rather than being copied into the website.</p>
      <div className="archive-tools">
        <span>{talksCatalog.by_format.PDF} PDFs · {talksCatalog.by_format.Keynote} Keynotes · {talksCatalog.by_format.PowerPoint} PowerPoints · {talksCatalog.by_format["Web slides"]} web slide sets</span>
        <a className="button" href={talksArchiveUrl} target="_blank" rel="noreferrer">Open the talk materials</a>
      </div>
      <div className="talk-archive">
        {Object.entries(groups).map(([category, talks]) => <details key={category}>
          <summary>{category} <span>{talks.length} items</span></summary>
          <ul>{talks.map((talk) => <li key={talk.path}><a href={talksArchiveUrl} target="_blank" rel="noreferrer" aria-label={`Open talk materials for ${talk.title}`}><strong>{talk.title}</strong><span>{talk.year ?? talk.modified.slice(0, 4)} · {talk.format}</span></a></li>)}</ul>
        </details>)}
      </div>
    </div>
    {legacy ? <Content html={legacy.html} /> : null}
  </>;
}

function UpdatesPage() {
  const posts = entries.filter((entry) => entry.type === "post").sort((a, b) => b.date.localeCompare(a.date));
  return <>
    <PageHero title="Writing & updates"><p>Announcements, essays, public-facing research, and a record of the group&apos;s life.</p></PageHero>
    <div className="content-page">
      <ul className="entry-list">{posts.map((post) => <li key={post.path}><time>{post.date}</time><Link href={post.path}>{post.title}</Link></li>)}</ul>
    </div>
  </>;
}

function CvPage() {
  return <>
    <PageHero title="Curriculum vitae"><p>A public, regularly reviewed account of research, appointments, teaching, talks, and service.</p></PageHero>
    <div className="content-page">
      <p className="notice">The full Canadian Common CV is a private source document and includes personal information. These public CVs draw only on verified professional portions. The maintained source and the downloadable PDFs are reviewed with the monthly website scan.</p>
      <div className="cv-downloads">
        <a className="button" href="/downloads/niayesh-afshordi-cv.pdf" download>Download CV <span>Short public CV · PDF</span></a>
        <a className="button button-outline" href="/downloads/niayesh-afshordi-academic-cv.pdf" download>Download full CV <span>Long academic CV · PDF</span></a>
      </div>
      <h2>Appointments</h2>
      <ul>
        <li>Professor, Department of Physics and Astronomy, University of Waterloo</li>
        <li>Founding Faculty Member, Waterloo Centre for Astrophysics</li>
        <li>Associate Faculty, Cosmology and Gravitation Group, Perimeter Institute</li>
      </ul>
      <h2>Education and earlier appointments</h2>
      <p>PhD, Princeton University Observatory (2004). Former fellow at the Institute for Theory and Computation, Harvard-Smithsonian Center for Astrophysics (2004–2007), and Distinguished Research Fellow at Perimeter Institute (2008–2009).</p>
      <h2>Scholarly record</h2>
      <p>Complete publications are available through arXiv, INSPIRE, NASA ADS, and Google Scholar. Talks, public writing, teaching, and supervised researchers are maintained in the sections of this site.</p>
      <div className="profile-links">{externalProfiles.map((profile) => <a href={profile.href} key={profile.label} target="_blank" rel="noreferrer">{profile.label} ↗</a>)}</div>
    </div>
  </>;
}

function LegacyPage({ entry }: { entry: Entry }) {
  return <><PageHero title={entry.title}>{entry.type === "post" ? <p>{entry.date}</p> : null}</PageHero><Content html={entry.html} /></>;
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const path = `/${slug.join("/")}/`;
  let body: React.ReactNode;

  if (slug.length === 1 && slug[0] === "research") body = <ResearchPage />;
  else if (slug.length === 1 && slug[0] === "group") body = <PeoplePage />;
  else if (slug.length === 1 && slug[0] === "publications") body = <PublicationsPage />;
  else if (slug.length === 1 && slug[0] === "talks") body = <TalksPage />;
  else if (slug.length === 1 && slug[0] === "updates") body = <UpdatesPage />;
  else if (slug.length === 1 && slug[0] === "cv") body = <CvPage />;
  else {
    const entry = entries.find((item) => item.path === path);
    if (!entry) notFound();
    body = <LegacyPage entry={entry} />;
  }

  return <SiteFrame>{body}</SiteFrame>;
}
