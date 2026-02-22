import { create } from 'zustand'

export const useGarageStore = create((set) => ({
  viewMode: 'intro', // 'intro' | '3d' | 'portfolio'
  setViewMode: (mode) => {
    set({ viewMode: mode })
    window.location.hash = mode === 'portfolio' ? 'portfolio' : ''
  },
  introVisible: true,
  hideIntro: () => set({ introVisible: false, viewMode: '3d' }),
  currentGear: 0,
  gearContent: {
    1: { title: "About Me", content: "UC Berkeley B.A. in Data Science & Applied Mathematics (2022\u20132026). Building at the intersection of machine learning, full-stack engineering, and mathematical modeling." },
    2: { title: "Experience", content: "SWE Intern @ Hortus AI \u2014 Django, PostgreSQL, AWS, Celery/Redis \u2022 SWE Intern @ iTea \u2014 Next.js, AWS, Power BI dashboards" },
    3: { title: "Projects", content: "Audio & Genomic ML (CNN, DNABERT) \u2022 Ngordnet semantic word network (Java, 100k+ node graph)" },
    4: { title: "Skills", content: "Python \u2022 Java \u2022 C++ \u2022 JavaScript/Next.js \u2022 SQL \u2022 AWS \u2022 Power BI \u2022 Tableau" },
    5: { title: "Contact", content: "Oakland, CA \u2022 wilwu2168@berkeley.edu \u2022 linkedin.com/in/wilsunah" },
  },
  portfolioSections: [
    {
      id: 'about',
      title: 'About Me',
      type: 'about',
      tagline: "I like to build things that matter.",
      bio: "I\u2019m a senior at UC Berkeley studying Data Science and Applied Mathematics. I love turning messy, real-world problems into clean engineering solutions\u2014whether that\u2019s optimizing supply chains with regression models, building async pipelines for AI marketplaces, or designing graph engines that query 100k nodes in milliseconds.",
      interests: "When I\u2019m not coding, you\u2019ll find me tinkering with cars, exploring the Oakland food scene, or diving into a new math proof for fun.",
    },
    {
      id: 'experience',
      title: 'Experience',
      type: 'experience',
      items: [
        {
          role: 'Software Engineering Intern',
          company: 'Hortus AI',
          location: 'Oakland, CA',
          dates: 'Dec 2025 \u2013 Feb 2026',
          bullets: [
            'Built full-stack features for an AI-services marketplace using Django and PostgreSQL',
            'Engineered async upload pipeline with AWS S3 + MongoDB, decoupling file ingestion from app lifecycle',
            'Architected Celery/Redis distributed task queue\u2014reduced pipeline latency by 40%',
          ],
        },
        {
          role: 'Software Engineering Intern',
          company: 'iTea',
          location: 'Alameda, CA',
          dates: 'Dec 2024 \u2013 Present',
          bullets: [
            'Built Next.js + AWS (Lambda/DynamoDB) scheduling engine, replacing a 10-hour manual workflow',
            'Created Power BI dashboards syncing supply chain orders with demand\u2014cut perishable waste by 22%',
            'Developed regression-based labor model predicting customer traffic with 90% accuracy',
          ],
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
      id: 'skills',
      title: 'Skills',
      type: 'skills',
      categories: [
        { label: 'Languages & Frameworks', items: ['Python', 'Java', 'C++', 'R', 'JavaScript', 'Next.js', 'Node.js', 'Django'] },
        { label: 'Data & Cloud', items: ['SQL', 'PostgreSQL', 'Snowflake', 'AWS Lambda', 'AWS S3', 'MongoDB', 'Redis', 'Git'] },
        { label: 'Analytics & Viz', items: ['Tableau', 'Power BI', 'Looker Studio', 'GA4', 'A/B Testing'] },
        { label: 'Math & ML', items: ['Numerical Analysis', 'Statistical Inference', 'Linear Algebra', 'Scikit-Learn', 'PyTorch'] },
      ],
    },
    {
      id: 'contact',
      title: "Let\u2019s Connect",
      type: 'contact',
      email: 'wilwu2168@berkeley.edu',
      linkedin: 'linkedin.com/in/wilsunah',
      location: 'Oakland, CA',
      note: "I\u2019m actively looking for Software Engineering and Data Science roles. Always happy to chat\u2014reach out anytime.",
    },
  ],
  setGear: (gear) => set({ currentGear: gear }),
  cycleGear: () => set((state) => ({ 
    currentGear: state.currentGear >= 5 ? 1 : state.currentGear + 1 
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
  enteringCar: false,
  setEnteringCar: (val) => set({ enteringCar: val }),
  _enterCar: null,
  _setEnterCar: (fn) => set({ _enterCar: fn }),
  _goToWorkbench: null,
  _setGoToWorkbench: (fn) => set({ _goToWorkbench: fn }),
}))