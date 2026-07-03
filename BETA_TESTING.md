# HotPlace — Beta testing

지인에게 아래 메시지를 그대로 복사해 보내면 된다. (영어 / 한국어 버전)
링크의 `YOUR-VERCEL-URL` 부분만 실제 Vercel 배포 주소로 바꿔서 보낸다.

---

## 🇬🇧 English version (copy & send)

> Hey! I've been building a little web app called **HotPlace** — one personal map
> for every place you want to try in Korea. You paste places you find on
> Instagram/Reels, TikTok, or map apps, and they land on your own Korea map.
> It's an early beta, so I'd love your honest reaction.
>
> 👉 **https://YOUR-VERCEL-URL**
>
> No sign-up needed — everything is saved on your own device. Takes about 3 minutes:
>
> 1. **Paste a place link** — from Naver Map, Kakao Map, Google Maps,
>    Instagram/Reels, or TikTok (or just type a place name).
> 2. **Save it to your map** and confirm the pin appears.
> 3. **Tap the pin** to see the place details.
> 4. **Save a nearby suggestion** — pick an area like Seongsu or Jeju and hit Save.
> 5. **Create a collection** (e.g. "Seoul date night") and add your places.
> 6. **Generate a plan** — open Plan and make a rough day course.
> 7. **Switch language & theme** — top-right (English/한국어, light/dark).
> 8. **Tell me what felt confusing** via the "Give feedback" button at the bottom
>    (or just text me).
>
> Heads-up: the map is a **preview** for now (pins aren't geographically exact),
> and you save places one by one — bulk import from your saved Google/Naver lists
> isn't built yet. That's exactly the kind of feedback I want to hear about!

---

## 🇰🇷 한국어 버전 (복사해서 보내기)

> 안녕! 내가 **HotPlace**라는 작은 웹앱을 만들고 있어. 한국에서 가보고 싶은 장소를
> 전부 모아두는 **나만의 한국 지도**야. 인스타 릴스·틱톡·지도앱에서 본 장소를
> 붙여넣으면 내 지도에 핀으로 저장돼. 아직 초기 베타라 솔직한 반응이 정말 도움이 돼.
>
> 👉 **https://YOUR-VERCEL-URL**
>
> 회원가입 없어 — 데이터는 네 기기에만 저장돼. 3분이면 돼:
>
> 1. **장소 링크 붙여넣기** — 네이버 지도, 카카오맵, 구글 지도, 인스타 릴스,
>    틱톡 링크 (아니면 그냥 장소 이름).
> 2. **지도에 저장**하고 핀이 생기는지 확인해봐.
> 3. **핀을 눌러서** 장소 상세가 보이는지 확인.
> 4. **주변 추천 저장** — 성수나 제주 같은 지역을 골라서 Save 눌러봐.
> 5. **컬렉션 만들기** (예: "서울 데이트") 하고 장소를 담아봐.
> 6. **코스 만들기** — 코스 탭에서 하루 코스를 만들어봐.
> 7. **언어/테마 바꾸기** — 우측 상단에서 (English/한국어, 라이트/다크).
> 8. **헷갈렸던 점 알려주기** — 화면 하단 "피드백 남기기" 버튼으로 (아니면 그냥 나한테 톡).
>
> 참고: 지금 지도는 **미리보기**라 핀 위치가 실제 지리와 정확히 일치하진 않아.
> 그리고 장소는 하나씩 저장하는 방식이야 — 구글/네이버에 저장해둔 리스트를 한 번에
> 가져오는 기능은 아직 없어. 이런 부분이 얼마나 아쉬운지도 알려주면 큰 도움이 돼!

---

## 테스트 전 준비 (배포자용)

- Vercel 배포 주소를 위 `YOUR-VERCEL-URL`에 넣는다.
- (선택) `src/lib/config.ts`의 `FEEDBACK_FORM_URL`에 Google Form 링크를 넣으면
  "피드백 남기기" 버튼이 폼으로 연결된다. 비워두면 "직접 알려달라" 안내가 뜬다.

## 현재 MVP의 의도된 한계 (테스터가 물어보면)

- **지도는 미리보기(mock)**: 실제 지도 API 연동 전이라 핀 위치가 지리적으로
  정확하지 않다. 지도 우하단에 작은 안내 배지가 떠 있다.
- **하나씩 저장**: 붙여넣은 링크/이름을 한 건씩 저장한다. 구글/네이버/카카오에
  이미 저장해둔 리스트를 통째로 가져오는 기능은 아직 없다 (향후 확장).
- **기기 간 공유 없음**: 데이터는 각자 브라우저 localStorage에만 저장된다.
  공유 링크도 현재는 같은 기기에서만 열린다 (Supabase 연결 전까지의 제약).
