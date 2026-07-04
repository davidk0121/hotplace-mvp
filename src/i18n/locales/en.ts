/**
 * 기본 언어(English) 사전.
 * 이 객체의 구조가 Dictionary 타입의 기준이 되므로,
 * 다른 언어 파일(ko.ts 등)은 반드시 같은 구조를 따라야 한다.
 */
export const en = {
  nav: {
    home: "Home",
    myPlaces: "Places",
    myLists: "Collections",
    plan: "Plan",
  },
  landing: {
    badge: "For Koreans abroad heading home",
    heroLine1: "That spot you saw on Reels —",
    heroLine2: "save it before you lose it",
    heroDesc:
      "Living abroad makes it hard to know what's trending in Korea right now. Save the places you discover on Instagram and TikTok, organize them, and build your own Korea hot-place list to share with your partner and friends.",
    tryDemo: "Start saving places →",
    notifyMe: "Get launch updates",
    targetsTitle: "Who we built this for",
    targets: [
      {
        emoji: "✈️",
        title: "Visiting Korea after a while",
        desc: "You live overseas and feel out of the loop on what's hot right now.",
      },
      {
        emoji: "🎓",
        title: "International students",
        desc: "You want to plan what to do in Korea before the next break.",
      },
      {
        emoji: "💑",
        title: "Long-distance couples",
        desc: "You want to plan Korea trips and date courses together.",
      },
    ],
    featuresTitle: "What can you do?",
    features: [
      {
        emoji: "🔗",
        title: "Save with a link or text",
        desc: "Paste places you found on Instagram or TikTok as a link or note.",
      },
      {
        emoji: "🗂️",
        title: "Organize by category & area",
        desc: "Food, cafes, date spots, travel — everything sorted at a glance.",
      },
      {
        emoji: "👯",
        title: "Share as lists",
        desc: "Create lists like \"Jeju trip\" or \"Dates with my girlfriend\" and browse them together.",
      },
      {
        emoji: "🗺️",
        title: "Open in your map app",
        desc: "Jump straight to Google, Naver, or Kakao Maps.",
      },
    ],
    waitlistTitle: "Be the first to hear about launch",
    waitlistDesc:
      "This is an early test version. Leave your email and we'll let you know when new features ship.",
  },
  waitlist: {
    placeholder: "Enter your email",
    submit: "Join Waitlist",
    successTitle: "You're on the list 🎉",
    success: "We'll email you the moment we launch — no spam, ever.",
    duplicateTitle: "You're already on the list 🎉",
    duplicate: "We've got your email — hang tight, launch news is coming.",
    emailedTo: "Signed up as",
    invalid: "Please enter a valid email address.",
  },
  places: {
    title: "Places",
    subtitle: "Every place on your map, by category.",
    add: "+ Add place",
    addFirst: "+ Add your first place",
    all: "All",
    emptyNone:
      "Nothing saved yet. Paste an Instagram or TikTok link — or just type a place name — to save your first spot.",
    emptyCategory: "No places in this category yet.",
    deleteConfirm: "Delete this place?",
  },
  card: {
    edit: "Edit",
    delete: "Delete",
    originalLink: "Original link",
  },
  form: {
    pasteLabel: "Paste a reel, map link, or place name",
    pastePlaceholder:
      'e.g. an Instagram reel link, https://naver.me/xxxx, or "Seongsu cafe to try"',
    pasteHint:
      "Paste a reel/TikTok link, a map link, or just type a place name. You can tidy up the name, area, and category below.",
    nameLabel: "Place name",
    namePlaceholder: "e.g. Onion Seongsu",
    regionLabel: "Area",
    regionPlaceholder: "e.g. Seongsu",
    categoryLabel: "Category",
    memoLabel: "Notes",
    memoPlaceholder: "e.g. Great brunch, expect a queue",
    sourceLabel: "Source link",
    sourcePlaceholder: "https://…",
    moreDetails: "＋ Add area, link & notes",
    lessDetails: "− Hide extra details",
    nameRequired: "Just add a place name to save.",
  },
  newPlace: {
    back: "← Back to list",
    title: "Add a place",
    subtitle:
      "Paste a link or text, then tidy up the name, area, and category if needed.",
    submit: "Save",
  },
  editPlace: {
    back: "← Back to list",
    title: "Edit place",
    notFound: "We couldn't find this place.",
    backToList: "Back to list",
    submit: "Save changes",
  },
  categories: {
    food: "Food",
    cafe: "Cafe",
    date: "Date spot",
    family: "Family",
    travel: "Travel",
    shopping: "Gifts & Shopping",
    other: "Other",
  },
  listTags: {
    date: "Date",
    family: "Family",
    trip: "Trip",
    food: "Food",
    cafe: "Cafe",
    shopping: "Shopping",
    other: "Other",
  },
  lists: {
    title: "Collections",
    subtitle: "Your saved places, grouped into map collections.",
    create: "+ New collection",
    createFirst: "+ Create your first collection",
    empty:
      'No collections yet. Group your places into a "Seoul date night", "Jeju trip", or "Cafes to try".',
    placeCount: (n: number) => (n === 1 ? "1 place" : `${n} places`),
    deleteConfirm:
      "Delete this collection? Your saved places won't be deleted.",
  },
  listForm: {
    createTitle: "New collection",
    editTitle: "Edit collection",
    createSubtitle:
      'Name it — like "Seoul date night", "Jeju trip", or "Cafes to try".',
    nameLabel: "Collection name",
    namePlaceholder: "e.g. Seoul date night",
    descLabel: "Description (optional)",
    descPlaceholder: "e.g. 2-day date course for our December trip",
    tagsLabel: "Purpose",
    tagsHint: "Pick one or more tags for this collection.",
    create: "Create collection",
    save: "Save changes",
    cancel: "Cancel",
  },
  listDetail: {
    back: "← Collections",
    addPlaces: "+ Add places",
    share: "🔗 Share",
    copied: "Link copied!",
    shareHint:
      "For now this link only works on this device — public sharing is coming soon.",
    aiPlan: "✨ Plan this collection",
    aiPlanSoon: "AI planning is coming soon — we're on it!",
    empty: "No places in this collection yet. Add some from your saved places!",
    remove: "Remove",
    edit: "Edit",
    delete: "Delete",
    notFound: "We couldn't find this collection.",
    backToLists: "Back to collections",
    sharedBadge: "Shared collection · view only",
    sharedHint: "This is a preview of a shared collection.",
  },
  addPlaces: {
    title: "Add places to this collection",
    subtitle: "Tap a place to add it — tap again to remove.",
    empty: "You haven't saved any places yet.",
    goSave: "Save a place first",
    added: "Added ✓",
    done: "Done",
  },
  home: {
    title: "Build your places map",
    subtitle:
      "Save restaurants, cafes, date spots, and travel ideas from anywhere.",
    mapTitle: "Your saved places, on one map",
    mapEmpty: "Places you save show up here as pins on your map.",
    recentTitle: "Recently saved",
    recentSeeAll: "See all",
    listsTitle: "Your collections",
    listsSeeAll: "See all",
    listsEmpty:
      "Group your places into collections — a trip, date spots, cafes to try.",
    makeList: "+ New collection",
  },
  quickSave: {
    placeholder: "Paste any map link, Reel, TikTok, or place name",
    hint: "Found a place? Paste it here — from any map app or social.",
    start: "Save",
    detectedFrom: "From",
    savedTitle: "Saved to your map",
    savedBody: (name: string) => `${name} was added to your map.`,
    viewOnMap: "View on map",
    addToList: "Add to a collection",
    makeList: "Make a collection",
    saveAnother: "Save another",
    viewPlaces: "View all places",
  },
  source: {
    google: "Google Maps",
    apple: "Apple Maps",
    naver: "Naver Map",
    kakao: "Kakao Map",
    instagram: "Instagram / Reels",
    tiktok: "TikTok",
    link: "Web link",
    text: "Note",
  },
  saveFromAnywhere: {
    title: "Save from anywhere",
    steps: [
      "Open Instagram, TikTok, or a map app",
      "Tap Share, then Copy link",
      "Paste it into HotPlace",
    ],
  },
  map: {
    tapHint: "Tap a pin to see the place.",
    empty: "No pins yet — paste a place above to start your map.",
    openIn: "Open in",
    remove: "Remove",
    preview: "Preview map — real map coming soon",
    mapMode: "Map",
    satellite: "Satellite",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    recenter: "Recenter",
    locate: "Use my location",
  },
  nearby: {
    title: "Explore around you",
    subtitle: "Nearby ideas — tap Save to pin them to your map.",
    useLocation: "📍 Use my location",
    locating: "Getting your location…",
    denied: "Location off — pick an area instead.",
    nearYou: "Popular near you",
    chooseArea: "Pick an area",
    save: "Save",
    saved: "Saved ✓",
  },
  areas: {
    nearme: "Near me",
    la: "Los Angeles",
    oc: "Orange County",
    seoul: "Seoul",
    seongsu: "Seongsu",
    hongdae: "Hongdae",
    gangnam: "Gangnam",
    jeju: "Jeju",
    busan: "Busan",
  },
  onboarding: {
    title: "One map for every place you want to try",
    steps: [
      {
        emoji: "🔗",
        title: "Paste",
        desc: "Any map link, Reel, TikTok — or just a place name.",
      },
      {
        emoji: "📍",
        title: "Map it",
        desc: "Every place lands on your personal map.",
      },
      {
        emoji: "🗂️",
        title: "Collect",
        desc: "Group them into collections for your trip or dates.",
      },
    ],
  },
  demo: {
    load: "Load sample places",
  },
  footer: {
    beta: "Early beta — everything is saved on this device only.",
    feedback: "💬 Give feedback",
    feedbackComingSoon:
      "Feedback form is coming — for now, just message me directly. 🙏",
  },
  plan: {
    title: "Plan helper",
    subtitle:
      "Turn your saved places into a rough day plan you can rearrange. No accounts, no AI magic yet — just a quick starting point.",
    back: "← Back",
    fromListLabel: "Planning from",
    promptLabel: "What are you planning?",
    promptPlaceholder: "e.g. Plan a one-day date in Seoul",
    examplesLabel: "Need ideas? Try one:",
    examples: [
      "Plan a one-day date in Seoul",
      "Make a family-friendly route",
      "Create a 2-day Jeju itinerary",
    ],
    generate: "Make a plan",
    regenerate: "🔀 Shuffle",
    generating: "Planning…",
    resultTitle: "Your suggested day",
    resultIntro: (n: number) =>
      `A rough flow using ${n} of your saved ${
        n === 1 ? "place" : "places"
      }. Drag it around in your head — it's just a starting point.`,
    slots: {
      morning: "Morning",
      lunch: "Lunch",
      afternoon: "Afternoon",
      evening: "Evening",
    },
    tooFew: "Add more places for a fuller plan.",
    emptyContext:
      "Save a few places first, then come back to build a plan from them.",
    goSavePlaces: "Save places",
    viewList: "View the full collection →",
    disclaimer:
      "This is a locally-built suggestion, not a live AI recommendation.",
  },
};

/** 모든 언어 사전이 따라야 하는 구조 */
export type Dictionary = typeof en;
