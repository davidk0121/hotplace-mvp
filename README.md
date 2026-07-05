# HotPlace MVP

**HotPlace = 가보고 싶은 모든 장소를 한 지도에 모아두는 앱.**

> Your personal map for every place you want to try.
> 지도 링크·릴스·틱톡·추천에서 발견한 맛집, 카페, 데이트, 여행 장소를 한 지도에.

한국 여행이 첫 번째 핵심 유스케이스지만(지역칩·예시에 반영), 앱 자체는
글로벌 — LA/오렌지카운티 등 어디서든 동일하게 동작한다.

오랜만에 한국 가는 사람은 요즘 뭐가 좋은지 알기 어렵고, 발견한 장소는 인스타/틱톡/
네이버·카카오·구글·애플 지도/메시지/블로그에 흩어져 있습니다. HotPlace는 그것들을
붙여넣기 한 번으로 **내 한국 지도**에 모으고, 카테고리·지역·컬렉션으로 정리하고,
여행/데이트 코스로 이어주는 것을 목표로 합니다. (AI 여행 플래너가 아니라 지도 중심의
"저장한 장소" 앱)

## 현재 상태 (Step 1~4 완료)

- [x] Next.js 14 + TypeScript + Tailwind CSS 프로젝트 세팅
- [x] **Home = map-first 대시보드**: 풀블리드 목업 지도 위에 플로팅 붙여넣기 바 +
      지역칩 + 지도 컨트롤(줌/리센터/내 위치/지도·위성 토글), 핀 선택 시 글래스
      상세 카드. 아래는 바텀시트 스타일(주변 둘러보기·최근 저장·컬렉션).
      "가보고 싶은 모든 장소를 한 지도에" — 글로벌 포지셔닝, iOS Liquid Glass 스타일
- [x] **출처 자동 감지(로컬)**: 붙여넣은 값이 Google/Apple/Naver/Kakao 지도,
      Instagram/Reels, TikTok, 웹 링크, 일반 텍스트 중 무엇인지 URL 패턴으로 구분
      (`lib/source.ts`, API 호출 없음). URL이면 원본 링크 자동 채움
- [x] **목업 지도**: 실제 지도 API 없이 `lib/mockMap.ts`가 place.id 해시로 핀 좌표
      생성. 나중에 좌표→투영으로 교체 가능
- [x] **"내 위치" / 주변 둘러보기 (전부 preview)**: "Near me"를 누르면 브라우저
      Geolocation(무료)으로 좌표만 받아 **미리보기 상태**를 만든다 — 지도에 파란
      펄스 마커 + "내 주변 · 미리보기" 배지 표시. 로딩("내 위치 찾는 중…")과
      차단/불가 시 지역 선택 폴백 안내까지 상태별 피드백 제공. **주변 제안은
      실제 검색 결과가 아니라 지역칩(Near me/LA/오렌지카운티/서울/성수/홍대/강남/
      제주/부산)별 mock 큐레이션**이며, 실제 지도·장소 검색 연동은 나중에
      `lib/nearby.ts`·`MockMap.tsx`(MapViewProps 인터페이스)만 교체해 붙인다
- [x] 장소 저장 / 목록 / 수정 / 삭제 (localStorage, anonymous 사용자) —
      이름만 필수 + 카테고리 chip + 나머지 선택(접기)
- [x] 하단 탭: Home / Places / Lists / Plan (모바일)
- [x] 카테고리 필터, Google/Naver/Kakao Map 검색 링크 열기
- [x] i18n: English(기본) / 한국어, 언어 스위처, 선택 언어 localStorage 저장
- [x] 공유 리스트: 리스트 생성/수정/삭제, 목적 태그, 장소 추가/제거(bottom sheet),
      mock 공유 링크 복사, 보기 전용 공유 페이지 (`/lists/share/[shareId]`)
- [x] 디자인 리뉴얼: Figma Make "Travel & Discovery" 참고 — 라이트(크림)/다크
      테마 토글, coral(#ff385c) 액센트, Onest 폰트, 큰 radius 카드, 카테고리
      컬러 커버, 모바일 하단 네비. 시맨틱 CSS 토큰(`bg-card`/`text-foreground` 등)
      기반이라 테마 전환이 클래스 하나(`.dark`)로 처리됨
- [x] AI Plan (mock): `/plan` 페이지 — 자연어 입력 + 저장 장소를 시간대(오전/
      점심/오후/저녁) 코스로 배치하는 로컬 mock 생성기(`src/lib/plan.ts`).
      리스트 상세의 "코스 짜기" 버튼 → `/plan?list=<id>`로 컨텍스트 전달.
      **실제 AI/OpenAI 호출 없음.** 반환 타입은 향후 `saved_plans` 테이블과 1:1 대응.
- [ ] Supabase 연결 (스키마는 `supabase/schema.sql`에 준비됨, 아직 미연결)
- [ ] AI Plan 실제 연동 — `generatePlan()` 내부만 OpenAI 호출로 교체 (비용 발생, 검증 후)

지금은 **회원가입도 없고, 서버 DB도 없습니다.** 모든 데이터는 브라우저의
localStorage에만 저장되는 "익명 사용자 1인용 프로토타입" 단계로, UX 흐름을
빠르게 검증하기 위한 것입니다.

의도된 한계 (베타 기준):
- 지도는 **미리보기(mock)** — 핀 위치가 지리적으로 정확하지 않음 (UI에 작은 배지로 안내)
- **"내 위치"는 미리보기 상태 전용** — 브라우저 위치 권한은 파란 마커/배지 등
  preview 상태를 만드는 데만 쓰이고, 좌표로 실제 검색을 하지 않는다
- **주변 제안은 mock** — 실제 라이브 검색 결과가 아니라 지역별 큐레이션 샘플
- 실제 지도/장소 검색 연동(Mapbox·Google Maps·Apple MapKit 등)은 이후 단계
- 장소는 붙여넣은 링크/이름을 **한 건씩 저장** — 구글/네이버/카카오에 저장해둔
  리스트를 통째로 가져오는 bulk import는 아직 없음 (향후 확장)

## 기술 스택 (전부 무료 티어)

- Frontend: Next.js 14 (App Router) + TypeScript
- Styling: Tailwind CSS (시맨틱 토큰 + `darkMode: "class"`), 폰트 Onest
- 데이터(현재): 브라우저 localStorage
- 데이터(예정): Supabase 무료 티어
- 배포(예정): Vercel 무료 플랜
- 지도: 별도 API 없이 Google/Naver/Kakao 지도 "검색 링크"를 새 탭으로 열기만 함
- AI: 아직 없음 (mock 응답으로 대체 예정)

## 프로젝트 구조

```
hotplace-mvp/
  src/
    app/
      layout.tsx            # 전체 레이아웃 (Navbar + BottomNav + Footer)
      page.tsx               # Home 대시보드 (save-first: 빠른저장·주변·최근·리스트)
      places/
        page.tsx              # 장소 리스트 (필터, 카드 그리드)
        new/page.tsx           # 장소 추가
        [id]/edit/page.tsx      # 장소 수정
      lists/
        page.tsx              # 내 리스트 (카드 그리드)
        new/page.tsx           # 리스트 만들기
        [id]/page.tsx           # 리스트 상세 (장소 추가/제거, 공유, AI 버튼)
        [id]/edit/page.tsx       # 리스트 수정
        share/[shareId]/page.tsx  # 공유 링크 보기 전용 페이지 (현재는 같은 기기만)
      plan/
        page.tsx              # 코스 도우미 (AI Plan mock) — ?list=<id>로 컨텍스트
    components/
      Navbar.tsx               # 상단 바 (데스크톱 링크 + 언어/테마 토글)
      BottomNav.tsx            # 모바일 하단 탭 (Home/Places/Lists/Plan)
      Footer.tsx               # 피드백 CTA + 베타 안내
      LanguageSwitcher.tsx
      ThemeProvider.tsx / ThemeToggle.tsx   # 라이트/다크
      QuickSave.tsx            # 플로팅 붙여넣기 바 (출처감지→오버레이 확인→지도 저장)
      MockMap.tsx              # 목업 지도 + 컨트롤/유저마커 — MapViewProps 인터페이스로
                               #   Mapbox/Google/MapKit 교체 지점 (실제 지도 API 없음)
      SaveFromAnywhere.tsx     # "어디서든 저장" 3단계 안내
      NearbyExplore.tsx        # 주변 둘러보기 제안 섹션 (mock, 모드는 Home이 관리)
      WaitlistForm.tsx
      PlaceForm.tsx           # 장소 추가/수정 공용 폼 (이름만 필수 + chip + 접기)
      PlaceCard.tsx            # 액션 유연 (삭제 / 리스트에서 빼기 / 보기 전용)
      CategoryBadge.tsx
      OnboardingSteps.tsx      # 빈 상태 3단계 안내
      ListCard.tsx
      ListForm.tsx             # 리스트 생성/수정 공용 폼 (목적 태그 선택)
      AddPlacesSheet.tsx        # 리스트에 장소 추가하는 bottom sheet
    i18n/
      config.ts               # 지원 언어 목록 (en, ko / 추후 ja, zh, es)
      I18nProvider.tsx         # 언어 상태 Context + localStorage 저장
      locales/
        en.ts                  # 기본 언어 사전 (Dictionary 타입의 기준)
        ko.ts                  # 한국어 사전 (en과 같은 구조 강제)
        index.ts               # 사전 등록부
    lib/
      types.ts                # Place, PlaceList 등 타입 (Supabase 스키마와 1:1 대응)
      constants.ts             # 카테고리 목록 + 색상
      nearby.ts                # 한국 둘러보기 mock 제공자 (실제 검색 API 교체 지점)
      source.ts                # 붙여넣기 출처 감지 (지도앱/소셜, API 없음)
      mockMap.ts               # place.id → 목업 지도 핀 좌표
      config.ts                # FEEDBACK_FORM_URL 등 교체 가능한 링크
      storage.ts                # localStorage 기반 데이터 저장소 (나중에 Supabase로 교체)
      mapLinks.ts                # Google/Naver/Kakao 지도 검색 링크 생성
      plan.ts                    # 코스 mock 생성기 + GeneratedPlan 타입 (AI 교체 지점)
  supabase/
    schema.sql               # Supabase DB 설계 (아직 앱에 연결 안 함)
```

## 새 언어 추가 방법 (예: 일본어)

1. `src/i18n/config.ts`의 `locales` 배열에 `"ja"` 추가, `localeNames`에 `ja: "日本語"` 추가
2. `src/i18n/locales/ja.ts` 생성 — `en.ts`의 `Dictionary` 타입을 import해서 같은 구조로 번역
   (키가 하나라도 빠지면 컴파일 에러가 나므로 누락 걱정 없음)
3. `src/i18n/locales/index.ts`의 `dictionaries`에 `ja` 등록

이 세 단계 외에 앱 코드는 수정할 필요가 없다. `zh`, `es`도 동일.

참고: 카테고리는 DB/localStorage에 언어 중립 키(`food`, `cafe`, `date`, ...)로
저장되고, 화면 라벨만 사전에서 번역된다.

## 로컬 실행 방법

```bash
cd hotplace-mvp
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속.

- Node.js 18.18 이상 필요 (18.20.8 이상 권장)
- `npm run build` 로 프로덕션 빌드 확인 가능
- 로컬에서 프로덕션 모드 미리보기: `npm run build && npm start` → http://localhost:3000

## Vercel 배포 (무료)

이 앱은 **환경변수·유료 API·서버 DB가 전혀 필요 없다.** (100% localStorage)
그래서 Vercel 무료 플랜에 그대로 올리면 된다.

1. **GitHub에 올리기** — 이 `hotplace-mvp` 폴더가 git 저장소 루트다.
   ```bash
   cd hotplace-mvp
   git add -A
   git commit -m "HotPlace MVP ready for beta"
   git branch -M main
   git remote add origin https://github.com/<본인계정>/<레포이름>.git
   git push -u origin main
   ```
   (`.next`, `node_modules`, `.env*` 등은 `.gitignore`로 자동 제외된다.)

2. **Vercel에서 Import** — [vercel.com](https://vercel.com) 로그인(GitHub 계정) →
   *Add New… → Project* → 방금 올린 레포 선택.

3. **설정은 전부 기본값 그대로** 두면 된다 (Vercel이 Next.js를 자동 감지):
   - Framework Preset: **Next.js**
   - Build Command: `next build` (기본)
   - Output Directory: `.next` (기본, 건드리지 않음)
   - Install Command: `npm install` (기본)
   - Environment Variables: **없음** (비워둠)

4. **Deploy** 클릭 → 1~2분 후 `https://<프로젝트>.vercel.app` 주소가 나온다.
   이 주소를 지인에게 보내면 된다 (`BETA_TESTING.md` 안내문 참고).

> 나중에 코드를 push 하면 Vercel이 자동으로 재배포한다.
> Supabase 등을 붙일 때가 되면 그때 Vercel 대시보드의 Environment Variables에
> `.env.example`의 값들을 추가하면 된다.

## 피드백 링크 설정

`src/lib/config.ts`의 `FEEDBACK_FORM_URL`에 Google Form 링크를 넣으면,
푸터의 "피드백 남기기" 버튼이 그 폼으로 연결된다. 비워두면 버튼은 그대로
보이되 "준비 중" 안내가 뜬다. (무료 방식만 사용 — Google Form 권장)

## 데모/리셋 (개발용)

- 빈 My Places 화면의 **"샘플 장소 불러오기"** 버튼으로 예시 데이터를 넣을 수 있다.
- 브라우저 콘솔에서:
  - `window.hotplace.seed()` — 샘플 데이터 추가 후 새로고침
  - `window.hotplace.reset()` — 저장한 장소/리스트 전부 삭제 후 새로고침
    (이메일/테마/언어 설정은 유지)

## Beta test checklist (지인 테스트용)

> 지인에게 그대로 복사해 보낼 수 있는 **영어/한국어 초대 메시지**는
> [`BETA_TESTING.md`](./BETA_TESTING.md)에 있다.

지인 3~5명에게 아래 순서로 써보라고 부탁하면 된다. 처음 화면은 비어 있으므로
직접 저장해보는 것이 핵심이다.

1. **장소 저장** — 지도 링크(네이버/카카오/구글)나 장소 이름을 붙여넣어 저장
   (예: 인스타에서 본 카페 이름). 이름/지역/카테고리를 정리해본다.
2. **리스트 만들기** — "서울 데이트 주말" 같은 리스트를 하나 만든다.
3. **리스트에 장소 담기** — 방금 저장한 장소를 리스트에 추가한다.
4. **코스 만들기** — 리스트 상세에서 "코스 짜기"를 눌러 하루 코스를 생성해본다.
5. **공유 링크** — "리스트 공유"로 링크를 복사해본다
   (지금은 같은 기기에서만 열림 — 안내 문구 확인).
6. **언어/테마 전환** — 우상단에서 English↔한국어, 라이트↔다크를 바꿔본다.
7. **피드백** — 화면 하단 "피드백 남기기"로 무엇이 헷갈렸는지 알려준다.

물어볼 것: 첫 화면에서 무슨 앱인지 바로 이해했는지 / 장소 저장이 직관적이었는지 /
어디서 막혔는지 / 실제로 쓸 것 같은지.

## Roadmap / What's next

### 현재 베타 목표

- 사용자가 앱을 바로 이해하고 **save-to-map 플로우를 원하는지** 검증하는 것.
- MVP는 **붙여넣기 → 확인 → 지도에 저장 → 정리**에만 집중한다.

### 아직 만들지 않는 것 (Do not build yet)

- 릴스/틱톡 **영상에서 장소 추측** (video place guessing)
- 분위기/인테리어 기반 **AI 비전·지오로케이션**
- 실시간 협업 (real-time collaboration)
- 선물 추천 (gift recommendation)
- 복잡한 일정/플래닝 기능

### 다음 실제 우선순위

1. **Supabase 영속화 + 실제 공유 링크** — `supabase/schema.sql` 실행 후
   `lib/storage.ts` 내부를 Supabase 호출로 교체. 이 시점에
   `/lists/share/[shareId]`가 기기 간 실제 공유 링크로 동작.
2. **실제 지도 provider + 실좌표** — `MockMap`(MapViewProps 인터페이스)과
   `lib/mockMap.ts`를 Mapbox/Google/MapKit 뷰 + 좌표 투영으로 교체.
3. **URL 메타데이터/이름 자동 채움** — **지도 링크부터** 시작
   (Google/Naver/Kakao 링크는 이름 추출이 안정적), 소셜 링크는 그다음.
4. **실제 장소 검색/지오코딩** — 지도 provider 도입과 함께.
5. **Google/Naver/Kakao 저장 리스트 import** — API 접근이 허용하는 범위에서.
6. **(나중에) 사용자 보조 방식의 릴스/틱톡 장소 후보 추출**:
   - 캡션을 붙여넣거나 스크린샷을 업로드하면
   - 텍스트에서 장소 이름 후보를 추출해
   - **후보 2~3개를 보여주고 사용자가 확정**한다
   - 분위기만으로 확신에 찬 추측은 **절대 하지 않는다**
     (스크래핑 금지, "We found the place" 금지 — 항상 후보 + 수동 입력 폴백)
