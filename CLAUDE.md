# KaiWallet — 프로젝트 컨텍스트

## 한 줄 요약
카카오 / 네이버 소셜 로그인으로 블록체인 지갑을 생성·관리하는 서비스.
개인 키 관리 없이 한국 OAuth 계정만으로 Kaia 네트워크 지갑을 사용할 수 있게 하는 게 목표.

## 이 프로젝트를 만드는 이유
GitHub contribution graph를 채우기 위해 **매일 1 commit**씩 점진적으로 개발하는 프로젝트.
README의 30일 로드맵 순서대로 하루에 task 하나씩 처리 → commit.

## 기술 스택

| 영역 | 기술 |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| 한국 OAuth | NextAuth.js v5 beta (`next-auth@beta`) — Kakao, Naver provider |
| Web3 Wallet | Privy SDK v3 (`@privy-io/react-auth`) |
| Chain | Kaia Kairos testnet (한국 친화적 EVM 호환 체인) |

## 핵심 인증 흐름
```
사용자 → 카카오/네이버 OAuth (NextAuth.js)
      → NextAuth가 JWT 발급 + JWKS endpoint 노출
      → Privy SDK가 JWT 검증 (대시보드에 JWKS URL 등록)
      → Privy embedded wallet 자동 생성/연결
```
> Privy는 카카오/네이버를 직접 지원하지 않아 NextAuth → Privy Custom JWT Auth 패턴으로 우회.

## 파일 구조
```
src/
├── app/
│   ├── layout.tsx                      # PrivyProvider 래핑
│   ├── page.tsx                        # 랜딩: 로그인 버튼 + 지갑 주소 표시
│   └── api/auth/[...nextauth]/route.ts # NextAuth handler
└── lib/
    ├── auth.ts                         # NextAuth config (Kakao + Naver provider)
    └── privy/Provider.tsx              # Privy Provider wrapper
```

## 환경변수 (.env.local)
`.env.example` 참고. 필요한 키:
- `KAKAO_CLIENT_ID` / `KAKAO_CLIENT_SECRET` — [카카오 개발자 콘솔](https://developers.kakao.com)
- `NAVER_CLIENT_ID` / `NAVER_CLIENT_SECRET` — [네이버 개발자 콘솔](https://developers.naver.com)
- `NEXTAUTH_SECRET` — `openssl rand -base64 32`로 생성
- `NEXT_PUBLIC_PRIVY_APP_ID` — [Privy 대시보드](https://dashboard.privy.io)

## 개발 서버
```bash
npm run dev   # http://localhost:3000
```
앱 ID 없으면 Privy Provider가 비활성화된 채로 UI만 렌더링됨 (빌드는 통과).

## 30일 로드맵 진행 상황
README.md 참고. Day 1 셋업 완료, Day 2부터 순서대로 진행.

## 커밋 방식
사용자가 직접 commit. Claude는 코드 작업만 하고 `git commit`은 실행하지 않음.
