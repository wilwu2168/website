import { create } from 'zustand'

export const useGarageStore = create((set) => ({
  introVisible: true,
  hideIntro: () => set({ introVisible: false }),
  currentGear: 0,
  gearContent: {
    1: {
      title: "About Me",
      content: "UC Berkeley Senior studying Applied Math & Data Science. Passionate about building innovative solutions at the intersection of mathematics and technology."
    },
    2: {
      title: "Experience", 
      content: "Software Engineer at Hortus AI • Data Science Intern at iTEA • Operations Lead at GarageWorks USA"
    },
    3: {
      title: "Projects",
      content: "ML CNN/Transformers for computer vision • Ngordnet etymology search engine • Financial Risk Dashboard with real-time analytics"
    },
    4: {
      title: "Coursework",
      content: "Abstract Algebra • Complex Analysis • Natural Language Processing • Machine Learning • Statistical Computing"
    },
    5: {
      title: "Contact",
      content: "Oakland-based • Open to Software Engineering & Data Science roles • Ready to drive innovation forward"
    }
  },
  setGear: (gear) => set({ currentGear: gear }),
  cycleGear: () => set((state) => ({ 
    currentGear: state.currentGear >= 5 ? 1 : state.currentGear + 1 
  })),
}))