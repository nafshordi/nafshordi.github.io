export const researchAreas = [
  "Quantum field theory in curved spacetime",
  "Black hole physics",
  "Early-universe cosmology",
  "Cosmic microwave background",
  "Dark matter, dark energy, and modified gravity",
  "Cosmological backreaction and missing baryons",
];

export const researchFeatures = [
  {
    title: "Quantum gravity & black holes",
    description: "How do quantum principles reshape gravity near black holes, horizons, and the earliest moments of the universe? This work seeks observable consequences of ideas that are often thought to be beyond experimental reach.",
    image: "/media/2015/12/uhrn1prime.png",
    alt: "Causal diagram from archived research on black holes and gravity",
    caption: "A causal-structure diagram from the research archive.",
  },
  {
    title: "Gravitational waves & compact objects",
    description: "Gravitational-wave signals provide a sharp new way to test strong gravity, black-hole structure, and the assumptions that underlie waveform models.",
    image: "/media/2017/01/mergingblackholes_v2-1.jpg",
    alt: "Illustration of merging black holes and emitted gravitational waves",
    caption: "An archived visualization of a compact-binary merger.",
  },
  {
    title: "Early universe & the cosmic microwave background",
    description: "The oldest observable light in the universe preserves clues about primordial physics, cosmic initial conditions, and the mechanisms that seeded today’s structure.",
    image: "/media/2015/07/planck_cmb.jpg",
    alt: "All-sky map of fluctuations in the cosmic microwave background",
    caption: "An all-sky cosmic-microwave-background map in the research archive.",
  },
  {
    title: "Dark universe & cosmic structure",
    description: "Large-scale structure, galaxies, and their environments offer complementary tests of dark matter, dark energy, gravity, and the physics linking small and cosmic scales.",
    image: "/media/2015/12/znorm_mass_new.png",
    alt: "Archived scientific plot comparing halo mass and velocity dispersion",
    caption: "An archived comparison plot from work on cosmic structure.",
  },
];

export type GroupMember = {
  name: string;
  role: string;
  years: string;
  research: string;
  destination: string;
  image?: string;
};

export const currentPeople: GroupMember[] = [
  {
    name: "Alice Chen",
    role: "PhD researcher",
    years: "2023–present in the 2025 CCV",
    research: "Machine learning and cosmic structure formation.",
    destination: "University of Waterloo and Perimeter Institute.",
    image: "/media/2019/05/bf1aaee0379c95bfb23647282f6efa13.gif",
  },
  {
    name: "Conner Dailey",
    role: "PhD researcher",
    years: "2020–2024 in the 2025 CCV",
    research: "The initial-boundary-value problem in numerical relativity.",
    destination: "Last recorded at the University of Waterloo and Perimeter Institute; status to reconfirm.",
    image: "/media/2024/09/conner-dailey-web.jpg",
  },
];

export const alumniPeople: GroupMember[] = [
  {
    name: "Jolene Zheng",
    role: "Undergraduate researcher",
    years: "2021",
    research: "COVID forecast modelling and the online dashboard.",
    destination: "Software Engineer, Bloomberg (recorded in the 2025 CCV).",
    image: "/media/2021/04/image-14.png",
  },
  {
    name: "Hannah Dykaar",
    role: "Undergraduate researcher",
    years: "2016",
    research: "Gravitational-wave echoes from the abyss.",
    destination: "PhD student, University of Toronto (recorded in the 2025 CCV).",
    image: "/media/2015/07/unnamed-e1502618910753.jpg",
  },
  {
    name: "Connor Adair",
    role: "Undergraduate researcher",
    years: "2017",
    research: "Gravitational-wave echoes.",
    destination: "MSc student, University of British Columbia (recorded in the 2025 CCV).",
    image: "/media/2019/02/profile-pic.jpg",
  },
  {
    name: "Aditya Dhumuntarao",
    role: "Visiting PhD researcher",
    years: "2017–2021",
    research: "Quantum field theory in curved spacetime and local observers.",
    destination: "Postdoctoral researcher, Sandia National Laboratories (recorded in the 2025 CCV).",
    image: "/media/2018/04/aditya-e1522979303913.jpg",
  },
  {
    name: "Michael Meiers",
    role: "Master’s researcher",
    years: "2014–2016",
    research: "Universal horizons in black holes.",
    destination: "PhD student, University of California–Davis (recorded in the 2025 CCV).",
    image: "/media/2015/07/michael-meiers-e1440388294268.jpg",
  },
  {
    name: "Yasaman K. Yazdi",
    role: "Master’s researcher",
    years: "2011–2013",
    research: "Vacuum states and entropy from a spacetime perspective.",
    destination: "Avadh Bhatia Postdoctoral Fellow, University of Alberta (recorded in the 2025 CCV).",
    image: "/media/2015/07/img_1650_2-e1440387894698.jpg",
  },
];

export const currentMembers = currentPeople.map((member) => member.name);

export const alumni = [
  "Matthew Robbins", "Tomas Ghersi", "Mohammad Zhoolideh Haghighi",
  "Chanda Prescod-Weinstein", "Daniel Guariento", "Michael Meiers",
  "Samantha Hergott", "Aditya Dhumuntarao", "Naritaka Oshita",
  "Mehdi Saravani", "Hannah Dykaar", "Tianyi Yang", "Mansour Karami",
  "Razieh Pourhasan", "Chiamaka Okoli", "Jesus Zavala", "Beth Gould",
  "Yasaman K. Yazdi", "Morag Scrimgeour", "Guilhem Lavaux", "Zach Elgood",
  "Connor Adair", "Natacha Altamirano", "Nosiphiwo Zwane", "Shant Baghram",
  "Farbod Kamiab", "Jahed Abedi", "Siavash Aslanbeigi", "Krishan Saraswat",
  "Morgan Lynch", "Jolene Zheng",
];

export const recentTalks = [
  {
    date: "April 2025",
    title: "Copenhagen Survey on Black Holes and Fundamental Physics",
    venue: "IPM Physics Colloquium, Iran (in Farsi)",
  },
  {
    date: "March 2025",
    title: "Battle of the Big Bang: How the Universe Began (and Why It’s a Big Mystery!)",
    venue: "Physics Literacy for Kids",
  },
  {
    date: "July 2024",
    title: "Quantum Spacetime in the Sky: From Horizon to Horizon",
    venue: "ICBS 2024, BIMSA, China",
  },
  {
    date: "November 2023",
    title: "Quantum Spacetime & the Cosmic Endgame",
    venue: "Simon Fraser University Physics Colloquium",
  },
];

export const talksArchiveUrl = "https://www.dropbox.com/scl/fo/h3czitrga1jxz2tiev3dz/AA4bmJHNu_nipZS4aF5guus?rlkey=hr3wsei04cwpvprfe0952auim&dl=0";

export const recentUpdates = [
  {
    date: "March 2025",
    title: "Join Me at the Royal Institution — Battle of the Big Bang",
    href: "/2025/03/25/join-me-at-the-royal-institution-on-june-28-battle-of-the-big-bang/",
  },
  {
    date: "January 2025",
    title: "Meaning of Beauty :معنی قشنگ",
    href: "/2025/01/20/meaning-of-beauty-%d9%85%d8%b9%d9%86%db%8c-%d9%82%d8%b4%d9%86%da%af/",
  },
  {
    date: "October 2024",
    title: "Battle of the Big Bang: New Tales of Our Cosmic Origins",
    href: "/2024/10/19/battle-of-the-big-bang-new-tales-of-our-cosmic-origins/",
  },
];

export const externalProfiles = [
  { label: "arXiv", href: "https://arxiv.org/search/?searchtype=author&query=Afshordi%2C+N&order=-announced_date_first&size=200&abstracts=show" },
  { label: "INSPIRE", href: "https://inspirehep.net/authors/1010979" },
  { label: "NASA ADS", href: "https://ui.adsabs.harvard.edu/search/q=author%3A%22Afshordi%22" },
  { label: "Google Scholar", href: "https://scholar.google.ca/citations?user=xWZGFlEAAAAJ&hl=en" },
];
