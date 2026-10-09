/* ============================================================
   WORK INDEX — projects, certifications, work experience
   ------------------------------------------------------------
   This is the ONLY file you need to edit to add anything new.

   To add an item:
   1. For a project: create a new HTML file inside /projects/
      with whatever layout that project needs, then add an entry
      with type: "project".
   2. For a certification: add an entry with type: "certification".
   3. For work experience: add an entry with type: "experience".
   4. For anything else (3D prints, experiments, tools, etc.):
      add an entry with type: "other".
   5. Drop assets in /assets/projects/<name>/.

   Each entry only contains the metadata needed for cards and
   filtering. The actual project content lives in the HTML file.
   ============================================================ */

const workItems = [
  /* ---------- PROJECTS ---------- */
  {
    type: "project",
    title: "guten-sort",
    description:
      "A python toolkit for bulk sorting project gutenberg txt files",
    category: "SOFTWARE",
    date: "11/2025",
    image: "assets/images/placeholder-16x9.svg",
    url: "https://github.com/Nipunvardhan-Naredla/guten-sort",
    featured: true,
  },
  {
    type: "project",
    title: "lang16-detector",
    description:
      "A lightweight pytorch model that can classify 16 different languages",
    category: "SOFTWARE",
    date: "12/2025",
    image: "assets/images/placeholder-16x9.svg",
    url: "projects/lang16-detector/lang16.html",
    featured: true,
  },
  {
    type: "project",
    title: "WorldQuant Brain Gold",
    description:
      "Achieved Gold on the WorldQuant Brain Gold Platform",
    category: "QUANTITATIIVE",
    date: "08/2025",
    image: "assets/images/worldquant_gold.png",
    url: "https://www.linkedin.com/in/nipunvardhan-naredla",
    featured: true,
  },

  /* ---------- CERTIFICATIONS ---------- */
  {
    type: "certification",
    title: "PCEP™ – Certified Entry-Level Python Programmer",
    description:
      "Entry-Level Python Programming",
    category: "Programming",
    date: "12/06/2025",
    image: "assets/images/pcep_cert.png",
    url: "https://verify.openedg.org",
    issuer: "Python Institute",
  },

  /* ---------- WORK EXPERIENCE ---------- */
  {
    type: "experience",
    title: "CS 115 Course Assistant",
    description:
      "A Course Assistant for an Introductory Python Course",
    category: "SOFTWARE",
    date: "09/01/2026",
    image: "/assets/images/stevens.png",
    url: "https://www.linkedin.com/in/nipunvardhan-naredla",
    organization: "Stevens Institute of Technology",
  },
  {
    type: "experience",
    title: "WorldQuant Brain Research Consultant",
    description:
      "WorldQuant Brain's Research Consultant Program where I build alphas for them",
    category: "QUANTITATIIVE",
    date: "09/01/2026",
    image: "assets/images/worldquant_brain.png",
    url: "https://www.linkedin.com/in/nipunvardhan-naredla",
    organization: "Stevens Institute of Technology",
  },

  /* ---------- OTHER ---------- */
  {
    type: "other",
    title: "3D printed XY Gantry System",
    description:
      "Its a fully 3D printed XY Gantry System",
    category: "MAKING",
    date: "11/14/2024",
    image: "/assets/images/xy_gantry.png",
    url: "https://makerworld.com/en/models/788565-fp-cnc-fully-3d-printed-x-y-gantry-system",
  },
  {
    type: "other",
    title: "3D printed Mini Press",
    description:
      "Its a fully 3D printed Mini Press",
    category: "MAKING",
    date: "09/01/2024",
    image: "/assets/images/Cardpress.png",
    url: "https://makerworld.com/en/models/618173-fully-3d-printed-mechanical-press#profileId-541884",
  },
];
