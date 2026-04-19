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
  keywords: ['portfolio', 'web development', 'Frank Oh', '포트폴리오', '웹 개발', 'backend', '서버', 'AI'],

  // Profile v2 외부 데이터 소스 URL
  external: {
    githubProfile: "https://github.com/kenshin579",
    githubProfileReadme: "https://raw.githubusercontent.com/kenshin579/kenshin579/master/README.md",
    status: "https://status.advenoh.pe.kr/",
    rss: {
      blog: "https://blog.advenoh.pe.kr/rss.xml",
      investment: "https://investment.advenoh.pe.kr/rss.xml",
    },
  },

  // Profile v2: Sidebar "Links" 블록 등에 노출할 서비스 링크
  services: [
    { id: "status", label: "Status", url: "https://status.advenoh.pe.kr/" },
    { id: "blog", label: "IT Blog", url: "https://blog.advenoh.pe.kr/" },
    { id: "investment", label: "Investment", url: "https://investment.advenoh.pe.kr/" },
    { id: "ai-chatbot", label: "AI Chatbot", url: "https://ai-chatbot.advenoh.pe.kr/" },
    { id: "inspire-me", label: "InspireMe", url: "https://inspire-me.advenoh.pe.kr/" },
  ],

  // GitHub 기여 캘린더 대상 계정
  githubLogin: "kenshin579",
} as const

export type SiteConfig = typeof siteConfig
