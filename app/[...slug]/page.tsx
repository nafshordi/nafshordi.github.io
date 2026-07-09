import Link from "next/link";
import { notFound } from "next/navigation";
import entries from "../../data/wordpress-content.json";
import { SiteFrame } from "../components/SiteFrame";
import {
  alumni,
  currentMembers,
  externalProfiles,
  recentTalks,
  researchAreas,
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
      <p className="notice">Research pages and their linked papers are preserved from the WordPress archive below. This index will be kept current as new work appears.</p>
      <ul className="research-list">{researchAreas.map((area, index) => <li key={area}><span>0{index + 1}</span>{area}</li>)}</ul>
      <h2>Research statement</h2>
      <p>I work on astrophysics, cosmology, and the physics of gravity, with a particular interest in observational hints that can address fundamental questions.</p>
    </div>
  </>;
}

function PeoplePage() {
  return <>
    <PageHero title="People"><p>Students, postdoctoral researchers, collaborators, and alumni who have shaped the work of the group.</p></PageHero>
    <div className="content-page">
      <h2>Current members</h2>
      <ul className="people-list">{currentMembers.map((member) => <li key={member}>{member}</li>)}</ul>
      <h2>Alumni</h2>
      <ul className="people-list">{alumni.map((member) => <li key={member}>{member}</li>)}</ul>
      <p className="notice">Member biographies, research interests, photographs, and alumni destinations will be added as they are verified.</p>
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
  return <>
    <PageHero title="Talks & outreach"><p>Lectures, seminars, interviews, writing, and public conversation about cosmology and fundamental physics.</p></PageHero>
    <div className="content-page">
      <h2>Recent talks</h2>
      <ul className="entry-list">{recentTalks.map((talk) => <li key={talk.title}><time>{talk.date}</time><div><strong>{talk.title}</strong><p>{talk.venue}</p></div></li>)}</ul>
      <h2>Talk archive</h2>
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
      <p className="notice">The full Canadian Common CV is a private source document and includes personal information. This public CV draws on the verified professional portions only; proposed updates are reviewed with the monthly website scan.</p>
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
