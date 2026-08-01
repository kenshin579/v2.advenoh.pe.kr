export const siteConfig = {
  name: "Frank Oh Portfolio",
  description: "Portfolio website showcasing web development projects",
  url: "https://advenoh.pe.kr",
  author: {
    name: "Frank Oh",
    jobTitle: "Software Engineer",
    // 사이드바 Links · JSON-LD sameAs · 커맨드 팔레트가 모두 이 배열에서 파생된다.
    // 계정을 추가하려면 여기에 항목 한 줄만 넣으면 된다.
    social: [
      { id: "github", label: "github/kenshin579", url: "https://github.com/kenshin579" },
      { id: "linkedin", label: "linkedin/frank-oh", url: "https://www.linkedin.com/in/frank-oh-abb80b10/" },
      { id: "instagram", label: "instagram/frank.photosnap", url: "https://www.instagram.com/frank.photosnap/" },
      { id: "instagram-coffee", label: "instagram/frank.coffeetime", url: "https://www.instagram.com/frank.coffeetime/" },
    ],
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

export type SocialId = (typeof siteConfig.author.social)[number]['id']

/**
 * id → url 조회용 파생 맵.
 * `as const` 덕분에 SocialId 가 리터럴 유니온이라 `socialUrl.github` 이 타입 안전하고,
 * 배열에서 항목을 지우면 소비처가 컴파일 에러로 잡힌다.
 */
export const socialUrl = Object.fromEntries(
  siteConfig.author.social.map(s => [s.id, s.url])
) as Record<SocialId, string>
