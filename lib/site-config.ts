export const siteConfig = {
  name: "Frank Oh Portfolio",
  description: "Portfolio website showcasing web development projects",
  url: "https://advenoh.pe.kr",
  author: {
    name: "Frank Oh",
    social: {
      instagram: "https://www.instagram.com/frank.photosnap/",
      linkedin: "https://www.linkedin.com/in/frank-oh-abb80b10/",
      github: "https://github.com/kenshin579"
    }
  }
} as const

export type SiteConfig = typeof siteConfig
