# Frank Oh Portfolio

개인 포트폴리오 웹사이트 - Next.js 14와 TypeScript로 구축된 정적 사이트

## 🚀 기술 스택

- **Framework**: Next.js 14 (App Router, Static Export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **UI Components**: shadcn/ui (Radix UI)
- **Theme**: next-themes (다크/라이트 모드)
- **Content**: Markdown (gray-matter)
- **Validation**: Zod
- **Deployment**: Netlify

## 📦 설치

```bash
npm install
```

## 🛠️ 개발

```bash
# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 타입 체크
npm run check

# 린트 실행
npm run lint
```

## 🏗️ 빌드

```bash
# 프로덕션 빌드 (정적 사이트 생성)
npm run build

# 빌드 결과는 out/ 디렉토리에 생성됩니다
```

## 📂 프로젝트 구조

```
.
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃 (폰트, 메타데이터, 테마)
│   ├── page.tsx           # 홈페이지 (포트폴리오 그리드)
│   ├── not-found.tsx      # 404 페이지
│   └── globals.css        # 글로벌 스타일 (테마 변수)
├── components/            # React 컴포넌트
│   ├── Header.tsx        # 헤더 (네비게이션, 테마 토글)
│   ├── Footer.tsx        # 푸터 (SNS 링크)
│   ├── PortfolioCard.tsx # 포트폴리오 카드
│   ├── theme-provider.tsx # 테마 프로바이더
│   └── ui/               # shadcn/ui 컴포넌트
├── lib/                   # 유틸리티
│   ├── site-config.ts    # 사이트 설정
│   ├── portfolio.ts      # 포트폴리오 데이터 로더
│   └── utils.ts          # 헬퍼 함수 (cn)
├── contents/website/      # 마크다운 콘텐츠
│   └── *.md              # 포트폴리오 아이템
├── shared/               # 공유 스키마
│   └── schema.ts         # Zod 스키마
└── netlify.toml          # Netlify 배포 설정
```

## 📝 콘텐츠 관리

포트폴리오 아이템은 `contents/website/` 디렉토리의 마크다운 파일로 관리됩니다:

```markdown
---
site: https://example.com
title: 프로젝트 제목
description: 프로젝트 설명
---
```

- `site`: 필수 - 프로젝트 URL
- `title`: 선택 - 기본값은 URL에서 자동 추출
- `description`: 필수 - 카드에 표시될 설명

## 🎨 테마 시스템

- **다크/라이트 모드**: `next-themes`로 구현
- **지속성**: localStorage에 테마 설정 저장
- **CSS 변수**: Tailwind CSS 커스텀 프로퍼티 사용
- **컴포넌트 대응**: 모든 컴포넌트가 양쪽 테마 지원

## 🌐 배포

### Netlify 배포

프로젝트는 Netlify에 자동 배포되도록 설정되어 있습니다:

1. GitHub 저장소를 Netlify에 연결
2. Build command: `npm run build`
3. Publish directory: `out`

`netlify.toml` 파일에 빌드 설정과 헤더, 리다이렉트 규칙이 정의되어 있습니다.

### 수동 배포

```bash
npm run build
# out/ 디렉토리를 정적 호스팅 서비스에 업로드
```

## 🔧 개발 가이드

### 새 컴포넌트 추가

```bash
# shadcn/ui 컴포넌트 설치
npx shadcn-ui@latest add [component-name]
```

### Path Aliases

프로젝트는 TypeScript path aliases를 사용합니다:

```typescript
import Component from "@/components/Component"  // 루트 기준
import { schema } from "@shared/schema"         // shared/ 디렉토리
```

### 폰트

- **본문**: Inter (next/font로 최적화)
- **제목**: Space Grotesk (next/font로 최적화)

## 📄 라이선스

Copyright © 2024 Frank Oh. All rights reserved.

## 👤 작성자

**Frank Oh**

- GitHub: [@kenshin579](https://github.com/kenshin579)
- LinkedIn: [frank-oh-abb80b10](https://www.linkedin.com/in/frank-oh-abb80b10/)
- Instagram: [@frank.photosnap](https://www.instagram.com/frank.photosnap/)
