# HotPlace — Beta testing

지인에게 아래 메시지를 그대로 복사해 보내면 된다. (영어 / 한국어 버전)
배포 주소는 https://hotplace-mvp.vercel.app 로 이미 채워져 있다.

---

## 🇬🇧 English version (copy & send)

> Hey! I've been building a little web app called **HotPlace** — your personal
> map for every place you want to try. You paste places you find on
> Instagram/Reels, TikTok, or any map app (Google, Apple, Naver, Kakao), and
> they land as pins on your own map — restaurants, cafes, date spots, travel
> ideas, anywhere from LA to Seoul.
> It's an early beta, so I'd love your honest reaction.
>
> 👉 **https://hotplace-mvp.vercel.app**
>
> No sign-up needed — everything is saved on your own device. Takes about 3 minutes:
>
> 1. **Paste a place link** — from Google Maps, Apple Maps, Naver Map, Kakao Map,
>    Instagram/Reels, or TikTok (or just type a place name, e.g. a cafe in
>    Los Angeles or a restaurant in Seongsu).
> 2. **Save it to your map** and confirm the pin appears.
> 3. **Tap the pin** to see the place details.
> 4. **Try the map controls** — Map/Satellite toggle, zoom, and "Near me"
>    (allow location and you should see a pulsing blue dot + a "Near you ·
>    preview" badge; if you deny it, just pick an area like Orange County,
>    Hongdae, or Jeju).
> 5. **Save a nearby suggestion** — pick an area and hit Save.
> 6. **Create a collection** (e.g. "LA date night" or "Jeju trip") and add places.
> 7. **Generate a plan** — open Plan and make a rough day course.
> 8. **Switch language & theme** — top-right (English/한국어, light/dark).
> 9. **Tell me what felt confusing** via the "Give feedback" button at the bottom
>    (or just text me).
>
> Heads-up: the map is a **preview** for now (pins aren't geographically exact),
> and you save places one by one — bulk import from your saved Google/Naver lists
> isn't built yet. That's exactly the kind of feedback I want to hear about!

---

## 🇰🇷 한국어 버전 (복사해서 보내기)

> 안녕! 내가 **HotPlace**라는 작은 웹앱을 만들고 있어. **가보고 싶은 모든 장소를
> 한 지도에 모아두는 나만의 지도**야. 인스타 릴스·틱톡·지도앱(구글, 애플, 네이버,
> 카카오)에서 본 장소를 붙여넣으면 내 지도에 핀으로 저장돼 — 맛집, 카페, 데이트,
> 여행 장소 전부. LA든 서울이든 상관없어. 아직 초기 베타라 솔직한 반응이 정말
> 도움이 돼.
>
> 👉 **https://hotplace-mvp.vercel.app**
>
> 회원가입 없어 — 데이터는 네 기기에만 저장돼. 3분이면 돼:
>
> 1. **장소 링크 붙여넣기** — 구글 지도, 애플 지도, 네이버 지도, 카카오맵,
>    인스타 릴스, 틱톡 링크 (아니면 그냥 장소 이름 — LA 카페든 성수 맛집이든).
> 2. **지도에 저장**하고 핀이 생기는지 확인해봐.
> 3. **핀을 눌러서** 장소 상세가 보이는지 확인.
> 4. **지도 컨트롤도 눌러봐** — 지도/위성 전환, 확대/축소, 그리고 "내 주변"
>    (위치를 허용하면 파란 점이 깜빡이면서 "내 주변 · 미리보기" 배지가 떠.
>    거부해도 괜찮아 — 오렌지카운티·홍대·제주 같은 지역을 고르면 돼).
> 5. **주변 추천 저장** — 지역을 골라서 Save 눌러봐.
> 6. **컬렉션 만들기** (예: "LA 데이트", "제주 여행") 하고 장소를 담아봐.
> 7. **코스 만들기** — 코스 탭에서 하루 코스를 만들어봐.
> 8. **언어/테마 바꾸기** — 우측 상단에서 (English/한국어, 라이트/다크).
> 9. **헷갈렸던 점 알려주기** — 화면 하단 "피드백 남기기" 버튼으로 (아니면 그냥 나한테 톡).
>
> 참고: 지금 지도는 **미리보기**라 핀 위치가 실제 지리와 정확히 일치하진 않아.
> 그리고 장소는 하나씩 저장하는 방식이야 — 구글/네이버에 저장해둔 리스트를 한 번에
> 가져오는 기능은 아직 없어. 이런 부분이 얼마나 아쉬운지도 알려주면 큰 도움이 돼!

---

## 테스트 전 준비 (배포자용)

- 배포 주소(https://hotplace-mvp.vercel.app)는 위 메시지에 이미 채워져 있다.
- (선택) `src/lib/config.ts`의 `FEEDBACK_FORM_URL`에 Google Form 링크를 넣으면
  "피드백 남기기" 버튼이 폼으로 연결된다. 비워두면 "직접 알려달라" 안내가 뜬다.

## 현재 MVP의 의도된 한계 (테스터가 물어보면)

- **지도는 미리보기(mock)**: 실제 지도 API 연동 전이라 핀 위치가 지리적으로
  정확하지 않다. 지도 우하단에 작은 안내 배지가 떠 있다. 위성 모드도 시각 효과다.
- **하나씩 저장**: 붙여넣은 링크/이름을 한 건씩 저장한다. 구글/네이버/카카오에
  이미 저장해둔 리스트를 통째로 가져오는 기능은 아직 없다 (향후 확장).
- **"내 주변"은 미리보기 상태 전용**: 브라우저 위치 권한은 파란 위치 마커와
  "내 주변 · 미리보기" 배지를 띄우는 데만 쓰인다. 좌표로 실제 장소를 검색하지는
  않는다.
- **주변 추천은 mock**: 실제 라이브 검색 결과가 아니라 지역칩(내 주변/LA/
  오렌지카운티/서울/성수/홍대/강남/제주/부산) 기반 큐레이션 샘플이다.
  실제 지도·장소 검색(Mapbox/Google/Apple 등) 연동은 이후 단계에 추가된다.
- **기기 간 공유 없음**: 데이터는 각자 브라우저 localStorage에만 저장된다.
  공유 링크도 현재는 같은 기기에서만 열린다 (Supabase 연결 전까지의 제약).
