export const siteConfig = {
  name: "Frank Oh Portfolio",
  description: "Portfolio website showcasing web development projects",
  url: "https://advenoh.pe.kr",
  author: {
    name: "Frank Oh",
    jobTitle: "Software Engineer",
    social: {
      instagram: "https://www.instagram.com/frank.photosnap/",
      linkedin: "https://www.linkedin.com/in/frank-oh-abb80b10/",
      github: "https://github.com/kenshin579"
    }
  },
  keywords: ['portfolio', 'web development', 'Frank Oh', '포트폴리오', '웹 개발', 'backend', '서버', 'AI']
} as const

export type SiteConfig = typeof siteConfig
