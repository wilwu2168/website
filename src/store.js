import { create } from 'zustand'

export const GARAGE_OUT_OF_SERVICE = false

export const useGarageStore = create((set) => ({
  viewMode: 'intro', // 'intro' | '3d' | 'portfolio'
  setViewMode: (mode) => {
    set({ viewMode: mode })
    window.location.hash = mode === 'portfolio' ? 'portfolio' : ''
  },
  introVisible: true,
  hideIntro: () => set({ introVisible: false, viewMode: '3d' }),
  showIntro: () => set({ introVisible: true, viewMode: 'intro', returnFromDrive: false }),
  showIntroFromDrive: () => set({ introVisible: true, viewMode: 'intro', returnFromDrive: true }),
  returnFromDrive: false,
  currentGear: 0,
  gearContent: {
    1: { title: "About Me", content: "Builder from Oakland. UC Berkeley double major in Data Science & Applied Mathematics. Building impactful software at the intersection of ML, full-stack, and social impact." },
    2: { title: "Experience", content: "SWE Intern @ Hortus AI \u2014 Django, PostgreSQL, AWS, Celery/Redis \u2022 SWE Intern @ iTea \u2014 Next.js, AWS, Power BI dashboards" },
    3: { title: "Projects", content: "Audio & Genomic ML (CNN, DNABERT) \u2022 Ngordnet semantic word network (Java, 100k+ node graph)" },
    4: { title: "Contact", content: "Oakland, CA | UC Berkeley \u2022 wilsonwu022004@gmail.com \u2022 linkedin.com/in/wilsunah" },
  },
  portfolioSections: [
    {
      id: 'about',
      title: 'About Me',
      type: 'about',
      tagline: "Hi, I'm Wilson.",
      bio: "Growing up in Oakland, the path into the tech world wasn't always clear or easy. However, I refused to let my circumstances define my potential. That determination led me to UC Berkeley, where I am currently completing a double major in Data Science and Applied Mathematics.\n\nMy fascination with software development began in 2020 when I joined the Oakland Promise Safeway Tech Immersion Program. It was there that I first saw how engineers use code as a tool for social impact. Coming from a low-income background, I realized early on that the only way to create change is to be the one to take that first step.\n\nFast forward to today: I've spent my time at university and beyond mastering everything from Machine Learning algorithms to the collaborative power of Git. I feel incredibly privileged to have studied at such a high level and to have worked alongside some of the brightest minds in the field. Now, I'm ready to apply that knowledge to build the next generation of impactful software.",
      bioShort: "From Oakland to UC Berkeley. Building at the intersection of ML, full-stack engineering, and social impact.",
      interests: "",
    },
    {
      id: 'experience',
      title: 'Experience',
      type: 'experience',
      education: [
        {
          school: 'UC Berkeley',
          degree: 'B.A. Data Science & Applied Mathematics',
          dates: '2022 – 2026',
          details: ['Double major', 'Expected graduation 2026'],
        },
      ],
      items: [
        {
          role: 'Mechanic / Automotive',
          company: 'Mechanic Shop',
          location: 'Oakland, CA',
          dates: 'Aug 2020 – Aug 2022',
          bullets: [],
          articleUrl: 'https://www.speedhunters.com/2023/02/is-it-a-show-car-is-it-a-race-car-this-m2-is-both-more/',
          articleTitle: 'Featured Article – Award-Winning Work at Car Shows',
        },
        {
          role: 'Software Engineering Intern',
          company: 'Safeway Tech Immersion Program',
          location: 'Oakland, CA',
          dates: 'Jul 2021 – Aug 2021',
          bullets: [],
        },
        {
          role: 'Software Engineering Intern',
          company: 'Hortus AI',
          location: 'Oakland, CA',
          dates: 'Dec 2025 \u2013 Feb 2026',
          bullets: [],
        },
        {
          role: 'Software Engineering Intern',
          company: 'iTea',
          location: 'Alameda, CA',
          dates: 'Dec 2024 \u2013 Present',
          bullets: [],
        },
      ],
    },
    {
      id: 'projects',
      title: 'Projects',
      type: 'projects',
      items: [
        {
          name: 'Audio & Genomic Machine Learning',
          tech: ['PyTorch', 'NumPy', 'Scikit-Learn', 'DNABERT'],
          description: 'CNN for environmental noise classification via STFT/MFCCs. Genomic NLP pipeline using DNABERT with k-mer tokenization for DNA sequence classification. Ranked in the top 1st percentile of a performance benchmark.',
        },
        {
          name: 'Ngordnet: Semantic Word Network',
          tech: ['Java', 'Spark', 'Directed Graphs', 'JUnit'],
          description: 'Full-stack platform modeling semantic relationships over WordNet + Google Ngrams. Directed graph engine handling 100k+ nodes with sub-second query latency. Decoupled REST backend using Spark Java.',
        },
      ],
    },
    {
      id: 'funfacts',
      title: 'Fun Facts',
      type: 'funfacts',
      facts: [
        { icon: 'car', title: "I love cars", text: "From weekend wrenching to car shows—I've spent time at a mechanic shop and even had my work featured in an award-winning article. There's something satisfying about turning wrenches and bringing engines back to life.", articleUrl: "https://www.speedhunters.com/2023/02/is-it-a-show-car-is-it-a-race-car-this-m2-is-both-more/", articleTitle: "Is It A Show Car? Is It A Race Car? This M2 Is Both & More", articleImage: "https://www.speedhunters.com/wp-content/uploads/2023/02/022323-Speedhunters-M2-John-Lau-1-1200x800.jpg" },
        { icon: 'sports', title: "I love sports", text: "Go Raiders! I'm a die-hard Oakland fan and never miss a chance to catch a game or debate the latest plays." },
        { icon: 'volleyball', title: "I love volleyball", text: "2x IM champion at UC Berkeley for volleyball. When I'm not coding, you'll find me on the court." },
      ],
    },
    {
      id: 'contact',
      title: "Let's Connect",
      type: 'contact',
      name: 'Wilson Wu',
      role: 'UC Berkeley Student',
      description: 'Experience in AWS, Azure, Docker, Java Spring Boot, Node, and React.',
      location: 'Oakland, CA | UC Berkeley',
      email: 'wilsonwu022004@gmail.com',
      emailDisplay: 'wilsonwu022004 [at] gmail [dot] com',
      linkedin: 'linkedin.com/in/wilsunah',
      ctaMessage: "I'm always up for a chat or a coffee! Feel free to reach out.",
    },
  ],
  setGear: (gear) => set({ currentGear: gear }),
  cycleGear: () => set((state) => ({ 
    currentGear: state.currentGear >= 4 ? 1 : state.currentGear + 1 
  })),
  isDriving: false,
  setIsDriving: (val) => set({ isDriving: val }),
  _driveToGear: null,
  _setDriveToGear: (fn) => set({ _driveToGear: fn }),
  _exitCar: null,
  _setExitCar: (fn) => set({ _exitCar: fn }),
  workbenchActive: false,
  setWorkbenchActive: (active) => set({ workbenchActive: active }),
  insideCar: false,
  setInsideCar: (val) => set({ insideCar: val }),
  _startDriving: null,
  _setStartDriving: (fn) => set({ _startDriving: fn }),
  _goToWorkbench: null,
  _setGoToWorkbench: (fn) => set({ _goToWorkbench: fn }),
}))