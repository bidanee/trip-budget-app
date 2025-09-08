# ✈️ Trip Budget App 프로젝트 회고 및 다음 단계

이 문서는 **'Trip Budget App'** 프로젝트의 개발 과정과 성과를 요약하고, 앞으로의 계획을 정리한 문서입니다.

---

## 1. ✨ 최종 성과물
나만의 여행 예산을 계획하고 관리하는 **풀스택 웹 애플리케이션**을 성공적으로 개발하고 배포했습니다.

- **프론트엔드 (Vercel 배포):** https://trip-budget-app.vercel.app/
- **백엔드 (Render 배포):** https://trip-budget-app-server.onrender.com  

---

## 2. 🛠️ 적용된 기술 스택 (Tech Stack)

**Frontend:** React (Vite), Zustand, React Router, Axios, CSS Modules, lucide-react, react-hot-toast  
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, dotenv, bcryptjs  
**Deployment:** Vercel (Frontend), Render (Backend)  
**Version Control:** Git, GitHub  

---

## 3. 💡 구현된 핵심 기능

### 🔐 사용자 인증 (Authentication)
- JWT 기반의 안전한 회원가입 및 로그인/로그아웃 기능 구현  

### 📔 예산 계획 CRUD (Create, Read, Update, Delete)
- 여행 예산 계획 생성, 조회, 수정, 삭제 가능  

### 💸 상세 지출 관리 및 예산 추적 (Expense Tracking)
- 항목 추가/삭제: ‘숙소’, ‘식비’ 등 지출 항목 자유롭게 관리 가능  
- 실시간 잔액 계산: 총 예산에서 지출 합계를 자동 계산해 남은 예산 표시  

### 🎨 세련된 사용자 경험 (UX)
- 로딩/에러 상태 시각화  
- 사용자 알림을 부드러운 토스트 메시지로 통일  

---

## 4. 🚀 다음 단계 (Future Improvements)

앞으로 계획

### 🚀 최신 RAG(Retrieval-Augmented Generation) 기술 도입
- 🤖 **AI 여행 Q&A 챗봇**  
  - 사용자가 *“도쿄에서 저렴하고 맛있는 현지 맛집 알려줘”* 라고 물으면, 최신 여행 블로그/리뷰 데이터를 **실시간 검색(Retrieval)** → **답변 생성(Generation)**  
  - 예: *“시부야의 A라멘, 신주쿠의 B초밥이 가성비 좋다는 평가가 많습니다.”*  

- 🤖 **AI 예산 추천**  
  - 여행지와 여행 스타일(예: *가성비*, *럭셔리*)에 맞춰 예상 총 경비와 항목별 추천 예산 자동 생성  

- 🤖 **AI 지출 분석 및 제안**  
  - 지출 패턴 분석 후 절약 팁 제공  
  - 예: *“식비 비중이 높은 편입니다. 현지 시장을 활용해보세요.”*  

- 🤖 **AI 일정 생성**  
  - 관심사 기반 여행 코스 + 예상 비용을 자동으로 제안하는 맞춤형 플랜 제공  

### 💹 실시간 환율 적용 및 자동 환산
- 외부 환율 API 연동 (예: ExchangeRate-API)  
- 현지 통화 ↔ 원화(KRW) 자동 환산 기능  

### 📊 지출 내역 차트 시각화
- 카테고리별 지출을 원형 차트 등으로 시각화  
- Chart.js 또는 Recharts 활용  

### 코드 품질 향상
- ✅ **테스트 코드 작성**: Jest + React Testing Library 적용  
- 🇹🇸 **TypeScript 도입**: 타입 안정성을 통한 버그 감소 및 유지보수성 향상

---
