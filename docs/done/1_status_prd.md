# PRD: 포트폴리오에 Status 사이트 추가

## 개요
새로 개발한 Status 모니터링 사이트를 포트폴리오 웹사이트에 추가

- **대상 사이트**: https://status.advenoh.pe.kr
- **작업 위치**: `contents/website/status/`

## 배경
- Status 모니터링 사이트 개발 완료
- 포트폴리오 사이트에 새 프로젝트로 등록 필요
- 기존 포트폴리오 항목들과 동일한 형식으로 추가

## 목표
- `contents/website/status/` 폴더 생성
- `index.md` 파일 작성 (frontmatter 포함)
- 커버 이미지 추가

## 작업 범위

### 생성할 파일
```
contents/website/
├── inspire-me/
│   ├── index.md
│   └── image.png
├── investment-blog/
│   ├── index.md
│   └── image3.png
├── it-blog/
│   ├── index.md
│   └── image2.png
└── status/           ← 새로 추가
    ├── index.md      ← 작성 필요
    └── image.png     ← 스크린샷 필요
```

### index.md 내용 (예시)
```markdown
---
site: https://status.advenoh.pe.kr/
title: Advenoh Status
description: A system server monitoring service that displays real-time status of all personal services.
cover: image.png
---
```

### 커버 이미지
- **파일명**: `image.png`
- **내용**: https://status.advenoh.pe.kr 사이트 스크린샷
- **권장 크기**: 16:10 비율 (기존 이미지와 동일)

## 작업 체크리스트

- [ ] `contents/website/status/` 폴더 생성
- [ ] `contents/website/status/index.md` 파일 작성
- [ ] Status 사이트 스크린샷 촬영
- [ ] `contents/website/status/image.png` 파일 추가
- [ ] `npm run dev`로 로컬 확인
- [ ] `npm run build`로 빌드 확인

## 참고: 기존 포트폴리오 항목

| 폴더 | 사이트 | 설명 |
|------|--------|------|
| `it-blog` | blog.advenoh.pe.kr | IT 기술 블로그 |
| `inspire-me` | inspire-me.advenoh.pe.kr | 명언 모음 사이트 |
| `investment-blog` | - | 투자 블로그 |
