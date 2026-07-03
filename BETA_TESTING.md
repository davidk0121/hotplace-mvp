# HotPlace — Beta testing

지인에게 아래 메시지를 그대로 복사해 보내면 된다. (영어 / 한국어 버전)
링크의 `YOUR-VERCEL-URL` 부분만 실제 Vercel 배포 주소로 바꿔서 보낸다.

---

## 🇬🇧 English version (copy & send)

> Hey! I've been building a little web app called **HotPlace** — it helps people
> who live abroad save the Korea spots they find on Instagram/TikTok, organize
> them, and turn them into a rough day plan. It's an early beta, so I'd love your
> honest reaction.
>
> 👉 **https://YOUR-VERCEL-URL**
>
> No sign-up needed — everything is saved on your own device. Takes about 3 minutes:
>
> 1. **Save a place** — tap "Start saving places", then paste a map link
>    (Naver/Kakao/Google) or just type a place name.
> 2. **Create a list** — go to "My Lists" and make one (e.g. "Seoul date weekend").
> 3. **Add the place to your list.**
> 4. **Make a plan** — open the list and tap "Plan this list" to get a day course.
> 5. **Try the share button** on a list.
> 6. **Switch language & theme** — top-right (English/한국어, light/dark).
> 7. **Tell me what was confusing** via the "Give feedback" button at the bottom
>    (or just text me).
>
> Questions I care about: Did you instantly get what the app is for? Was saving a
> place easy? Where did you get stuck? Would you actually use this before a Korea trip?

---

## 🇰🇷 한국어 버전 (복사해서 보내기)

> 안녕! 내가 **HotPlace**라는 작은 웹앱을 만들고 있어. 해외에 살면서 인스타·틱톡에서
> 본 한국 핫플을 저장하고, 정리하고, 하루 코스로 만들어주는 앱이야. 아직 초기 베타라
> 솔직한 반응이 정말 도움이 돼.
>
> 👉 **https://YOUR-VERCEL-URL**
>
> 회원가입 없어 — 데이터는 네 기기에만 저장돼. 3분이면 돼:
>
> 1. **장소 저장** — "장소 저장 시작하기" 누르고, 지도 링크(네이버/카카오/구글)나
>    그냥 장소 이름을 붙여넣어 봐.
> 2. **리스트 만들기** — "내 리스트"에서 하나 만들어봐 (예: "서울 데이트 주말").
> 3. **리스트에 장소 추가하기.**
> 4. **코스 만들기** — 리스트를 열고 "코스 짜기"를 누르면 하루 코스가 나와.
> 5. 리스트에서 **공유 버튼**도 눌러봐.
> 6. **언어/테마 바꾸기** — 우측 상단에서 (English/한국어, 라이트/다크).
> 7. **헷갈렸던 점 알려주기** — 화면 하단 "피드백 남기기" 버튼으로 (아니면 그냥 나한테 톡).
>
> 궁금한 것: 첫 화면에서 무슨 앱인지 바로 이해됐어? 장소 저장이 쉬웠어? 어디서 막혔어?
> 한국 여행 갈 때 실제로 쓸 것 같아?

---

## 테스트 전 준비 (배포자용)

- Vercel 배포 주소를 위 `YOUR-VERCEL-URL`에 넣는다.
- (선택) `src/lib/config.ts`의 `FEEDBACK_FORM_URL`에 Google Form 링크를 넣으면
  "피드백 남기기" 버튼이 폼으로 연결된다. 비워두면 "직접 알려달라" 안내가 뜬다.
- 데이터는 각자 브라우저 localStorage에만 저장되므로, 테스터끼리 데이터는 공유되지
  않는다. 공유 링크도 현재는 같은 기기에서만 열린다 (Supabase 연결 전까지의 제약).
