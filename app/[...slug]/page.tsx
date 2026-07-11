import Link from "next/link";
import { notFound } from "next/navigation";
import entries from "../../data/wordpress-content.json";
import talksCatalog from "../../data/talks-catalog.json";
import publicationsData from "../../data/publications.json";
import externalLinkAudit from "../../data/migration-audit/wordpress-external-links-2026-07-10.json";
import { SiteFrame } from "../components/SiteFrame";
import {
  alumniPeople,
  currentPeople,
  externalProfiles,
  recentTalks,
  researchFeatures,
  talksArchiveUrl,
} from "../site-content";

type Entry = (typeof entries)[number];

const legacyLinkReplacements: Record<string, string> = {
  "http://arxiv.org/find/grp_physics/1/au:+afshordi/0/1/0/all/0/1": "https://arxiv.org/search/?searchtype=author&query=Afshordi%2C+N&order=-announced_date_first&size=200&abstracts=show",
  "http://scholar.google.ca/citations?user=klM7VSMAAAAJ&hl=en": "https://scholar.google.ca/citations?user=xWZGFlEAAAAJ&hl=en",
  "http://cfa-www.harvard.edu/itc/": "https://itc.cfa.harvard.edu/",
  "http://pitp.ca/news/perimeter-mourns-passing-brilliant-rising-star-cosmology": "https://perimeterinstitute.ca/news/perimeter-mourns-passing-chiamaka-okoli-brilliant-rising-star-cosmology",
  "http://www.perimeterinstitute.ca/personal/nafshordi/thesis_niayesh.pdf": "/downloads/niayesh-afshordi-phd-thesis.pdf",
  "https://uwaterloo.ca/astrophysics-and-gravitation/": "https://uwaterloo.ca/physics-astronomy/areas-research/astrophysics-gravitation",
  "http://www.perimeterinstitute.ca/en/Scientific/Courses/Astrophysics_and_Cosmology_through_Problems/": "/welcome/my-courses/",
  "http://www.perimeterinstitute.ca/personal/nafshordi/My_Home_Page/Courses_files/P275s11intro.pdf": "/downloads/phys-275-introduction.pdf",
  "https://www.facebook.com/sabine.hossenfelder/posts/10156438692514574?comment_id=10156439172764574&reply_comment_id=10156442581219574&notif_id=1522146692570693&notif_t=mentions_comment&ref=notif": "https://www.facebook.com/sabine.hossenfelder/posts/10156438692514574",
  "https://docs.google.com/presentation/d/1-wNBc9WpeFADkgKljJkaoX3IIfWKvcVfab8HCM7bqlw/edit?usp=sharing": talksArchiveUrl,
  "https://docs.google.com/presentation/d/1GLEKB6fczg8UxNF_K7awwnw29sxq6m5lCmQCsuLItCs/edit?usp=sharing": talksArchiveUrl,
  "https://docs.google.com/presentation/d/1a7dX063-_n0-W3wWwfNJKxatFguWMIshzfzKiPgWihM/edit?usp=sharing": talksArchiveUrl,
};

for (const url of [
  "http://www.perimeterinstitute.ca/personal/nafshordi/My_Home_Page/Talks_files/22EF5473-428E-4A9B-B9C0-7B7EF8A30867.zip",
  "http://www.perimeterinstitute.ca/personal/nafshordi/My_Home_Page/Talks_files/BH_shape_dynamics.pdf",
  "http://www.perimeterinstitute.ca/personal/nafshordi/My_Home_Page/Talks_files/DM%20hierarchy_PI_Sep_11.pptx",
  "http://www.perimeterinstitute.ca/personal/nafshordi/My_Home_Page/Talks_files/DM%20hierarchy_PI_Sep_11_1.pptx",
  "http://www.perimeterinstitute.ca/personal/nafshordi/My_Home_Page/Talks_files/Einstein_CITA_Sep_2011.key",
  "http://www.perimeterinstitute.ca/personal/nafshordi/My_Home_Page/Talks_files/Einstein_KICP_Oct_2011.key",
  "http://www.perimeterinstitute.ca/personal/nafshordi/My_Home_Page/Talks_files/aether_APC_June_2011.key",
  "http://www.perimeterinstitute.ca/personal/nafshordi/My_Home_Page/Talks_files/missing_shanghai_2013.pdf",
  "http://www.perimeterinstitute.ca/personal/nafshordi/My_Home_Page/Talks_files/white_hole.key",
]) legacyLinkReplacements[url] = talksArchiveUrl;

const confirmedDeadLinks = externalLinkAudit.links.filter((link) => link.state === "dead").map((link) => link.url);

function encodedUrlVariants(url: string) {
  return [...new Set([url, url.replaceAll("&", "&amp;")])];
}

function repairLegacyLinks(html: string) {
  let repaired = html;
  for (const [oldUrl, newUrl] of Object.entries(legacyLinkReplacements)) {
    for (const variant of encodedUrlVariants(oldUrl)) repaired = repaired.replaceAll(variant, newUrl);
  }
  for (const oldUrl of confirmedDeadLinks) {
    if (oldUrl in legacyLinkReplacements) continue;
    for (const variant of encodedUrlVariants(oldUrl)) {
      repaired = repaired
        .replaceAll(`href="${variant}"`, `data-archived-url="${variant}" title="Archived link: the original destination is no longer available"`)
        .replaceAll(`href='${variant}'`, `data-archived-url='${variant}' title='Archived link: the original destination is no longer available'`);
    }
  }
  return repaired;
}

function PageHero({ title, children }: { title: string; children?: React.ReactNode }) {
  return <section className="page-hero"><h1>{title}</h1>{children}</section>;
}

function Content({ html }: { html: string }) {
  const safeHtml = html
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "")
    .replaceAll("/media/2015/07/untitled.jpeg", "/media/2015/07/untitled-e1522977273857.jpeg")
    .replaceAll("/media/2018/07/img_3950.jpg", "/media/2018/07/img_3950-e1531213584786.jpg")
    .replaceAll("/welcome/covid/", "/covid/")
    .replaceAll("/welcome/my-group/photo-2/", "/group#jahed-abedi")
    .replaceAll("/welcome/my-group/unnamed/", "/group#hannah-dykaar");
  return <div className="content-page" dangerouslySetInnerHTML={{ __html: repairLegacyLinks(safeHtml) }} />;
}

function ResearchPage() {
  return <>
    <PageHero title="Research"><p>Observational routes into the puzzles of gravity, cosmology, and the quantum universe.</p></PageHero>
    <div className="content-page">
      <p className="notice">Updated in July 2026 from current research profiles and the recent publication record. The figures are selected illustrations from the preserved research archive.</p>
      <ul className="research-list">{researchFeatures.map((area, index) => <li key={area.id}><span>{String(index + 1).padStart(2, "0")}</span><a href={`#${area.id}`}>{area.title}</a></li>)}</ul>
      <h2>Research directions</h2>
      <p>I work on astrophysics, cosmology, and the physics of gravity, with a particular interest in observational hints that can address fundamental questions.</p>
      <div className="research-feature-grid">
        {researchFeatures.map((feature) => <article className="research-feature" id={feature.id} key={feature.title}>
          <figure><img src={feature.image} alt={feature.alt} loading="lazy" decoding="async" /><figcaption>{feature.caption}</figcaption></figure>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
          <h4>Selected papers</h4>
          <ul className="research-paper-list">{feature.papers.map((paper) => <li key={paper.href}><span>{paper.year}</span><a href={paper.href} target="_blank" rel="noreferrer">{paper.title} ↗</a></li>)}</ul>
          <Link className="research-archive-link" href={feature.archiveHref}>Preserved background & earlier work →</Link>
        </article>)}
      </div>
      <Link className="button" href="/welcome/research/">Explore the preserved research archive</Link>
    </div>
  </>;
}

function PersonCard({ person }: { person: (typeof currentPeople)[number] }) {
  const initials = person.name.split(" ").map((part) => part[0]).join("");
  const id = person.name.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return <article className="person-card" id={id}>
    {person.image ? <img src={person.image} alt={person.name} loading="lazy" decoding="async" /> : <div className="person-placeholder" aria-label={`${person.name}: photo pending verification`}>{initials}</div>}
    <div className="person-card-copy">
      <p className="eyebrow">{person.role}</p>
      <h3>{person.profileHref ? <a href={person.profileHref} target="_blank" rel="noreferrer">{person.name} ↗</a> : person.name}</h3>
      <p><strong>{person.years}</strong></p>
      <p>{person.research}</p>
      <p className="person-destination">{person.destination}</p>
      {person.verification ? <p className="person-verification">Verification requested: {person.verification}</p> : null}
    </div>
  </article>;
}

function PeoplePage() {
  return <>
    <PageHero title="People"><p>Students, postdoctoral researchers, collaborators, and alumni who have shaped the work of the group.</p></PageHero>
    <div className="content-page">
      <h2>Current members</h2>
      <div className="people-grid">{currentPeople.map((person) => <PersonCard key={person.name} person={person} />)}</div>
      <p className="notice">Group roles were last reviewed in July 2026. Preferred portraits are still needed for the current members; new members, departures, projects, and destinations will be reconfirmed in the monthly group update.</p>
      <h2>Former group members</h2>
      <div className="people-grid">{alumniPeople.map((person) => <PersonCard key={person.name} person={person} />)}</div>
      <p className="notice">These cards cover the complete historical group roster carried by the original website. The broader supervision record—short projects, visiting students, and co-supervised researchers—is being reconciled with the long CV during the monthly review. Please send corrections or updated photographs; uncertain details are labelled rather than guessed.</p>
    </div>
  </>;
}

function PublicationsPage() {
  const groups = publicationsData.publications.reduce<Record<string, (typeof publicationsData.publications)[number][]>>((all, publication) => {
    (all[String(publication.year)] ??= []).push(publication);
    return all;
  }, {});
  return <>
    <PageHero title="Papers"><p>Publications, preprints, and research records.</p></PageHero>
    <div className="content-page">
      <p className="notice">{publicationsData.total_count} works, refreshed {publicationsData.generated_at}. The baseline is the complete arXiv author query, enriched and deduplicated with INSPIRE and ORCID, then cross-checked against Google Scholar. Scholar remains linked for citation counts and discovery; duplicate, translated, chapter-level, and non-paper records are not allowed to inflate the publication list.</p>
      <div className="profile-links">{externalProfiles.map((profile) => <a href={profile.href} key={profile.label} target="_blank" rel="noreferrer">{profile.label} ↗</a>)}</div>
      <h2>Complete publication record</h2>
      <div className="publication-years">{Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a)).map(([year, publications]) => <details key={year} open={Number(year) >= 2025}>
        <summary>{year} <span>{publications.length} {publications.length === 1 ? "work" : "works"}</span></summary>
        <ol className="publication-list">{publications.map((publication) => {
          const authorLine = publication.authors.length > 10
            ? `${publication.authors.slice(0, 10).join(", ")} + ${publication.authors.length - 10} collaborators`
            : publication.authors.join(", ");
          return <li key={`${publication.arxiv_id ?? publication.doi ?? publication.title}-${publication.date}`}>
            {publication.url ? <a className="publication-title" href={publication.url} target="_blank" rel="noreferrer">{publication.title} ↗</a> : <strong className="publication-title">{publication.title}</strong>}
            <p>{authorLine}</p>
            <div className="publication-meta"><span>{publication.journal || (publication.status === "forthcoming" ? "Forthcoming" : "Preprint")}</span>{publication.arxiv_url ? <a href={publication.arxiv_url} target="_blank" rel="noreferrer">arXiv</a> : null}{publication.doi_url ? <a href={publication.doi_url} target="_blank" rel="noreferrer">DOI</a> : null}</div>
          </li>;
        })}</ol>
      </details>)}</div>
      <div className="archive-tools"><span>Explore papers by research question and see the original topical notes.</span><Link className="button" href="/research">Research areas</Link><Link className="button button-outline" href="/welcome/research/">Preserved research archive</Link></div>
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
      <div className="archive-tools">
        <span>Looking for public coverage or an older page?</span>
        <div className="archive-actions"><Link className="button" href="/news">News & media</Link><Link className="button button-outline" href="/archive">Complete archive</Link></div>
      </div>
      <ul className="entry-list">{posts.map((post) => <li key={post.path}><time>{post.date}</time><Link href={post.path}>{post.title}</Link></li>)}</ul>
    </div>
  </>;
}

function NewsPage() {
  const legacy = entries.find((entry) => entry.path === "/welcome/for-public/");
  return <>
    <PageHero title="News & media"><p>Public talks, interviews, articles, reviews, and media coverage in English and Persian.</p></PageHero>
    <div className="content-page news-intro">
      <p className="notice">This restores the complete public-news collection from the original site. Its active external links and embedded sources are retained, while the original address remains available in the archive.</p>
    </div>
    {legacy ? <Content html={legacy.html} /> : null}
  </>;
}

function ArchivePage() {
  const pages = entries.filter((entry) => entry.type === "page").sort((a, b) => a.title.localeCompare(b.title));
  const posts = entries.filter((entry) => entry.type === "post").sort((a, b) => b.date.localeCompare(a.date));
  return <>
    <PageHero title="Complete archive"><p>Every page and post imported from the original WordPress website, including research, courses, outreach, COVID material, and group history.</p></PageHero>
    <div className="content-page">
      <p className="notice">Nothing in this index sends you back to WordPress: each item is a local page in the GitHub site. Historical external references are retained on their original pages when the destination is still available.</p>
      <div className="archive-collections">
        <Link href="/welcome/original-home/"><strong>Original homepage</strong><span>Biographical notes and links preserved beneath the new design</span></Link>
        <Link href="/welcome/my-courses/"><strong>Courses</strong><span>Teaching material from the original site</span></Link>
        <Link href="/covid/"><strong>COVID-19 project</strong><span>Models, seminars, publications, media, and team pages</span></Link>
        <Link href="/welcome/echoes-in-southern-ontario/"><strong>Echoes in Southern Ontario</strong><span>Workshop and regional collaboration archive</span></Link>
      </div>
      <h2>Pages & projects</h2>
      <ul className="archive-route-list">{pages.map((entry) => {
        const href = entry.path === "/" ? "/welcome/original-home/" : entry.path;
        return <li key={entry.path}><Link href={href}>{entry.path === "/" ? "Original WordPress homepage" : entry.title}</Link><span>{href}</span></li>;
      })}</ul>
      <h2>Posts</h2>
      <ul className="entry-list">{posts.map((entry) => <li key={entry.path}><time>{entry.date}</time><Link href={entry.path}>{entry.title}</Link></li>)}</ul>
    </div>
  </>;
}

function CvPage() {
  return <>
    <PageHero title="Curriculum vitae"><p>A public, regularly reviewed account of research, appointments, teaching, talks, and service.</p></PageHero>
    <div className="content-page">
      <p className="notice">These public PDFs omit private information and are reviewed alongside the monthly website update.</p>
      <div className="cv-downloads">
        <a className="button" href="/downloads/niayesh-afshordi-cv.pdf" target="_blank" rel="noreferrer">Open CV <span>Short public CV · PDF</span></a>
        <a className="button button-outline" href="/downloads/niayesh-afshordi-academic-cv.pdf" target="_blank" rel="noreferrer">Open full CV <span>Long academic CV · PDF</span></a>
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
  else if (slug.length === 1 && slug[0] === "news") body = <NewsPage />;
  else if (slug.length === 1 && slug[0] === "updates") body = <UpdatesPage />;
  else if (slug.length === 1 && slug[0] === "cv") body = <CvPage />;
  else if (slug.length === 1 && slug[0] === "archive") body = <ArchivePage />;
  else if (slug.join("/") === "welcome/news") body = <UpdatesPage />;
  else if (slug.join("/") === "welcome/for-public") body = <NewsPage />;
  else if (slug.join("/") === "welcome/my-talks") body = <TalksPage />;
  else if (slug.join("/") === "welcome/original-home") {
    const entry = entries.find((item) => item.path === "/");
    if (!entry) notFound();
    body = <LegacyPage entry={{ ...entry, title: "Original WordPress homepage" }} />;
  }
  else {
    const entry = entries.find((item) => item.path === path);
    if (!entry) notFound();
    body = <LegacyPage entry={entry} />;
  }

  return <SiteFrame>{body}</SiteFrame>;
}
