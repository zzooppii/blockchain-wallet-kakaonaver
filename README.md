# KaiWallet

카카오 / 네이버 계정으로 로그인해 블록체인 지갑을 바로 사용하는 서비스.  
개인 키 관리 없이 소셜 로그인만으로 Kaia 네트워크 지갑을 생성·관리합니다.

## 기술 스택

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Auth**: NextAuth.js v5 — Kakao / Naver OAuth provider
- **Wallet**: Privy SDK (embedded wallet, custom JWT auth)
- **Chain**: Kaia Kairos testnet

## 인증 흐름

```
사용자 → 카카오/네이버 OAuth (NextAuth)
      → JWT 발급 (JWKS endpoint)
      → Privy Custom Auth 검증
      → Embedded wallet 자동 생성
```

## 시작하기

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.example .env.local
# .env.local 을 열어서 아래 키들을 채웁니다:
#   - Kakao: https://developers.kakao.com
#   - Naver: https://developers.naver.com
#   - Privy App ID: https://dashboard.privy.io
#   - NEXTAUTH_SECRET: openssl rand -base64 32

# 3. 개발 서버 실행
npm run dev
```

## GitHub 연결

```bash
git remote add origin https://github.com/<username>/kaiwallet.git
git push -u origin main
```

---

## 30일 로드맵

| Day | 작업 | 상태 |
|-----|------|------|
| 1 | 프로젝트 초기 셋업 (Next.js + Privy + NextAuth 구조) | ✅ |
| 2 | NextAuth Kakao provider 설정 + 환경변수 가이드 | ⬜ |
| 3 | NextAuth Naver provider 설정 | ⬜ |
| 4 | 로그인/로그아웃 버튼 컴포넌트 분리 | ⬜ |
| 5 | 로그인 후 사용자 프로필 표시 (이름, 이메일, 아바타) | ⬜ |
| 6 | NextAuth JWT callback 커스터마이즈 (Privy claim 포함) | ⬜ |
| 7 | JWKS endpoint 라우트 추가 (`/api/auth/jwks`) | ⬜ |
| 8 | Privy Provider Kaia Kairos testnet 설정 | ⬜ |
| 9 | Privy Custom Auth 연결 코드 | ⬜ |
| 10 | 지갑 주소 컴포넌트 (`<WalletAddress />`) | ⬜ |
| 11 | 지갑 잔액 조회 hook (`useBalance`) | ⬜ |
| 12 | 잔액 표시 UI | ⬜ |
| 13 | 트랜잭션 보내기 폼 UI | ⬜ |
| 14 | 트랜잭션 로직 + viem 통합 | ⬜ |
| 15 | 트랜잭션 결과 토스트 | ⬜ |
| 16 | 트랜잭션 히스토리 컴포넌트 | ⬜ |
| 17 | Kaia 익스플로러 링크 연결 | ⬜ |
| 18 | 다크모드 토글 | ⬜ |
| 19 | 모바일 반응형 정리 | ⬜ |
| 20 | 랜딩 히어로 섹션 | ⬜ |
| 21 | 프로젝트 소개 섹션 추가 | ⬜ |
| 22 | 에러 바운더리 추가 | ⬜ |
| 23 | 로딩 스피너 컴포넌트 | ⬜ |
| 24 | i18n (한/영) 셋업 | ⬜ |
| 25 | 한국어 번역 | ⬜ |
| 26 | 영어 번역 | ⬜ |
| 27 | 메타데이터 / OG 이미지 | ⬜ |
| 28 | favicon | ⬜ |
| 29 | Vercel 배포 설정 | ⬜ |
| 30 | README 배지 + 데모 링크 | ⬜ |
