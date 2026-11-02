# Tamil Worship Songs & Sanctuary Bible Suite — 5-Year Sustainable Architecture Plan (Firebase Backend + Cloudflare Edge Hosting)

An offline-first, cross-device worship companion and live sanctuary broadcast platform uniting 1,000+ Tamil and English hymns with tri-version Holy Scriptures (English KJV, English NKJV, and Tamil BSI)—powered by a **Firebase Backend (Firestore Real-Time Sync + Firebase Auth)** and engineered for **Cloudflare Edge Hosting (Cloudflare Pages / Workers CDN)** across **Mobile Phones (Primary One-Thumb Build)**, **Tablets**, **Desktops**, **Sanctuary Projectors**, and **OBS Studio Browser Source URLs**.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> This revised plan updates the architecture to use **Firebase as the Backend** and **Cloudflare for Hosting**, while preserving **Mobile-Primary One-Thumb Operation** alongside **Tablet** and **Desktop** layouts.

- **Confirmed Decision 1 — Firebase Backend (Real-Time Firestore `onSnapshot` + Auth)**:
  - **Live OBS & Projector Room Sync (`rooms/{roomId}`)**: Uses Firebase Firestore real-time `onSnapshot` listeners instead of a stateful server socket. When a user taps a song stanza or Bible verse on their **Mobile Phone, Tablet, or Desktop**, Firestore pushes the update in real time to the **OBS Browser Source URL (`?view=obs&room=CODE`)** and **Sanctuary Projector URL (`?view=projector&room=CODE`)** anywhere in the world.
  - **Shared Weekly Setlists & Mistake Reports (`setlists/{id}`, `reports/{id}`)**: Synced via Firestore with hardened Zero-Trust `firestore.rules` and **Firebase Authentication** for tech team and admin management.
- **Confirmed Decision 2 — Cloudflare Edge Hosting Architecture (Zero Error 1102)**:
  - **Static Edge Asset Delivery (`run_worker_first: false`)**: Precompiled application bundles, local `.woff2` fonts (`Noto Sans Tamil`, `Outfit`, `Lora`), and the initial Hymn + Bible seed corpora are served directly from Cloudflare's Edge CDN with **0ms Worker CPU overhead**.
  - **Quota-Safe Hybrid Caching**: Because all 4 Hymn Books and 3 Bibles (KJV, NKJV, Tamil BSI) are cached locally in **IndexedDB**, routine browsing and searching use **0 Firestore reads**, reserving Firebase quota strictly for live OBS room sync, weekly setlists, and admin updates.
- **Confirmed Decision 3 — Mobile-Primary, Tablet & Desktop Adaptive Views**:
  - **Mobile Phone (`< 768px`, Primary One-Thumb Build)**: Bottom 40% thumb navigation, tactile dialpad (`inputMode="none"`), and a docked **One-Thumb Live OBS Remote Bar** (`◀ Prev`, `Pallavi`, `■ Blank`, `Next ▶`).
  - **Tablet / iPad (`768px–1024px`, Pulpit & Sound Booth Touch Deck)**: 2-column split view pairing the Service Cue Sheet / Book Navigator with a touch-friendly Stanza & Verse Live Launchpad Grid.
  - **Desktop / PC (`> 1024px`, Full Media Booth Workstation)**: 3-column command center with Left Library & Setlist Queue, Center Stanza/Verse Live Grid with keyboard hotkeys (`←`, `→`, `Space`, `B`, `C`, `1–9`), and Right Dual Live Monitors (OBS Lower-Third + Sanctuary Projector).

---

### 1. 5-Year Sustainable Technology Stack to Implement

| Layer | Technology to Implement | Purpose & 5-Year Sustainability Rationale |
| :--- | :--- | :--- |
| **Application Hosting & CDN** | **Cloudflare Workers / Pages Edge CDN (`wrangler.jsonc`)** | Global edge caching with `run_worker_first: false` for static assets, fonts, and binary packs—delivering sub-50ms global TTFB and eliminating Worker CPU timeout limits (Error 1102). |
| **Cloud Backend & Real-Time Sync** | **Firebase Firestore (Enterprise / Spark Tier) + `onSnapshot`** | Serverless real-time document sync for live OBS/Projector rooms (`rooms/{roomId}`), shared weekly service setlists (`setlists`), custom church hymns, and community mistake reports (`reports`). |
| **Authentication & Security** | **Firebase Authentication + Hardened `firestore.rules`** | Google Sign-In & Role-Based Access Control (`admins/{uid}`) protecting live broadcast rooms, hymn edits, and admin mistake report triage. |
| **Core Frontend Framework** | **React 19 + TypeScript 5.8 (Strict Mode) + Vite** | High-velocity SPA/PWA architecture that compiles cleanly to static edge assets for Cloudflare deployment while running natively on port 3000 in AI Studio preview. |
| **Styling & Responsive UI** | **Tailwind CSS v4 (`@tailwindcss/vite`) + CSS Custom Properties** | Zero-runtime styling with Light, Dark, Sanctuary Projector, and Transparent OBS Alpha themes across Mobile (`375px+`), Tablet (`768px+`), and Desktop (`1440px+`). |
| **Offline-First Local Database** | **Browser `IndexedDB` (`hymns-bible-cache-db`)** | Stores all 1,000+ hymns (4 books) and 3 Bible versions (KJV, NKJV, Tamil BSI) on-device for 100% offline reading/search and **99% reduction in Firebase read quota usage**. |
| **Same-Device Offline Sync** | **Web `BroadcastChannel` API** | Instant zero-network fallback alongside Firebase `onSnapshot` when the tech console and projector/OBS run on the same laptop/PC. |
| **Installable PWA Engine** | **`vite-plugin-pwa` (Workbox Service Worker + Web App Manifest)** | Full offline app shell caching, home-screen installation on Android, iOS, iPadOS, Windows, and macOS, plus background data delta updates. |
| **Bilingual Search & Indexing** | **Client-Side Fuzzy Search + Native `Intl.Segmenter`** | Sub-10ms offline search across hymn numbers, Tamil Unicode (`அகரவரிசை`), Tanglish, and English/Tamil Bible scriptures without external search API costs. |
| **Typography & Icons** | **`Noto Sans Tamil`, `Outfit`, `Lora`, `JetBrains Mono` + `lucide-react`** | Proper Tamil ligature spacing, classic serif scripture legibility, tabular numerals (`tabular-nums`), and tactile vector iconography. |

---

### 2. Overview & Cross-Device Experience

- **What It Does**:
  - **For Congregation Members (Mobile & Tablet Self-Use)**: Instant offline-capable access to 4 song books (`Songs of Zion`, `Thirumarai Thirupadal`, `English Chorus`, `Tamil Chorus`) with Tamil & Tanglish lyrics, sheet music lightbox, and zoom controls—plus a complete **Holy Bible Reader** featuring **English KJV**, **English NKJV**, and **Tamil BSI (திருவிவிலியம்)** in single or parallel side-by-side mode.
  - **For Worship Leaders, Pastors & Tech Teams (Mobile, Tablet & Desktop Live Control)**: Any authorized device can join a Firebase Live Room (e.g., `SANCTUARY-1`) and tap any hymn stanza or Bible verse to project it immediately to OBS Studio and the church projector.
  - **For OBS Live Stream & Sanctuary Projectors (URL Link Endpoints)**: Zero-UI URLs (`?view=obs&room=SANCTUARY-1` and `?view=projector&room=SANCTUARY-1`) hosted on Cloudflare and subscribed to Firebase Firestore `onSnapshot` updates—automatically transitioning slides within milliseconds of a mobile, tablet, or desktop tap.

---

### 3. Responsive Multi-Device UI/UX Architecture

#### Device Breakpoint Matrix (Mobile-Primary → Tablet → Desktop)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. MOBILE PHONE (< 768px) — Primary One-Thumb Build                                     │
│ ┌───────────────────────────────────────┐  • Top Compact Header (52px, Book/Version)    │
│ │ [Zion #142]          [BSI+NKJV] [Live]│  • Scrollable Stanza / Bible Verse Cards      │
│ ├───────────────────────────────────────┤    (Single tap updates Firebase Room → OBS)   │
│ │  Stanza 1 (Tamil + Tanglish)          │  • Docked One-Thumb Live OBS Remote Bar       │
│ │  [LIVE ON OBS] Stanza 2               │    (◀ Prev | Pallavi | ■ Blank | Next ▶)      │
│ ├───────────────────────────────────────┤  • 5-Tab Bottom Navigation Bar:               │
│ │ LIVE: Zion #142 · Stanza 2            │    [Home] [Hymns] [Dialpad] [Bible] [Booth]   │
│ │ [◀ Prev]  [Pallavi]  [■ Blank] [Next▶]│                                               │
│ ├───────────────────────────────────────┤                                               │
│ │  Home  │ Hymns │ (Dial) │ Bible │ Live│                                               │
│ └───────────────────────────────────────┘                                               │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. TABLET / iPAD (768px – 1024px) — 2-Column Worship Leader & Sound Booth Touch Deck    │
│ ┌──────────────────────┬──────────────────────────────────────────────────────────────┐ │
│ │ LEFT: QUEUE & INDEX  │ RIGHT: LIVE TOUCH LAUNCHPAD & MINI OBS MONITOR               │ │
│ │ • This Week Setlist  │ • 2-Column Touch Grid of Stanzas / Bible Verses              │ │
│ │ • 4 Song Books       │ • Instant Parallel Toggle (Tamil BSI + KJV / NKJV)           │ │
│ │ • 66 Bible Books     │ • Docked Live Output Bar + OBS Lower-Third Preview           │ │
│ └──────────────────────┴──────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ 3. DESKTOP / LAPTOP (> 1024px) — 3-Column Sanctuary & OBS Broadcast Workstation         │
│ ┌──────────────────┬───────────────────────────────────┬──────────────────────────────┐ │
│ │ COL 1: NAV & CUE │ COL 2: LIVE STANZA / VERSE GRID   │ COL 3: DUAL LIVE MONITORS    │ │
│ │ • Service Plan   │ • High-Density Clickable Slides   │ • Live 16:9 OBS Lower-Third  │ │
│ │ • Quick Number & │ • Keyboard Hotkeys:               │   Preview + Copy URL Button  │ │
│ │   Bible Search   │   [←/→] Prev/Next [Space] Advance │ • Live 16:9 Sanctuary Screen │ │
│ │ • Book/Translation│   [B] Blank [C] Chorus [1-9] Jump│   Preview + Open Window      │ │
│ │   Filters        │ • Bilingual Split View            │ • Theme & Font Scale Sliders │ │
│ └──────────────────┴───────────────────────────────────┴──────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Key User Flows Across Devices

1. **Change OBS Song, Stanza, or Bible Verse from Mobile, Tablet, or Desktop (via Firebase Live Room)**:
   - **Step 1 — Paste URL into OBS Once**: Add `https://<cloudflare-domain>/?view=obs&room=SANCTUARY-1` as an OBS Studio **Browser Source** (`1920×1080`). It attaches a real-time Firestore `onSnapshot` listener to `rooms/SANCTUARY-1`.
   - **Step 2 — Control from Mobile Phone (One-Thumb)**: Open the app on your phone and activate **Live Remote (`SANCTUARY-1`)**. Tap any hymn stanza or Bible verse (or use the docked bottom thumb buttons `◀ Prev`, `Pallavi`, `■ Blank`, `Next ▶`) to update the Firestore room document and transition OBS and the Sanctuary Projector immediately.
   - **Step 3 — Control from Tablet or Desktop Simultaneously**: Because state lives in Firestore (`rooms/SANCTUARY-1`), a pastor on a tablet at the pulpit and a tech operator on a desktop PC in the sound booth both see the active `"LIVE ON OBS"` tally highlight in real time and can co-control slides seamlessly.

2. **One-Thumb Quick Dialpad (Songs & Scriptures in < 2 Seconds)**:
   - Tapping the center **Quick Dial** button opens a bottom-sheet tactile numeric keypad (`1–9`, `CLEAR`, `0`, `⌫`) with `inputMode="none"` so the mobile OS keyboard never pops up.
   - **Song Mode**: Matches digits across *Songs of Zion*, *Thirumarai Thirupadal*, *English Chorus*, and *Tamil Chorus* simultaneously, with one-tap **Read** or **Project to OBS** actions.
   - **Bible Mode**: Fast 3-tap thumb selector (**Book → Chapter → Verse**) across all 66 books in Tamil and English, switching effortlessly between **Tamil BSI**, **KJV**, **NKJV**, or **Parallel Bilingual** mode.

3. **Cloud-Synced Weekly Service Setlists & Community Mistake Reports**:
   - **This Week Setlist (`setlists` in Firestore)**: Curate Sunday's worship songs and Bible readings on desktop or mobile, share via formatted WhatsApp message, or sync live to the sound booth.
   - **Community Mistake Reports (`reports` in Firestore)**: Congregation members can report lyrical typos or chord corrections on any hymn; if offline, reports queue in IndexedDB and sync to Firestore automatically when back online.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

#### Cloudflare Edge + Firebase Backend Architecture Diagram

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                   CLOUDFLARE EDGE CDN (Pages / Workers Host)                      │
│   • Serves App Shell, WOFF2 Fonts, & Seed Hymn/Bible Packs (0ms Worker CPU)       │
└──────────────────────┬─────────────────────────────────────────┬──────────────────┘
                       │                                         │
                       ▼                                         ▼
┌──────────────────────────────────────────┐     ┌──────────────────────────────────┐
│  CONTROLLERS & READERS                   │     │  LIVE DISPLAY ENDPOINTS (URLs)   │
│  (Mobile Phone · Tablet · Desktop)       │     │                                  │
│                                          │     │  1. OBS Browser Source URL       │
│  • Local IndexedDB Cache (0 Read Cost):  │     │     (?view=obs&room=CODE)        │
│    - 4 Hymnals (Tamil + Tanglish)        │     │     Transparent Lower-Third 16:9 │
│    - 3 Bibles (Tamil BSI, KJV, NKJV)     │     │                                  │
│  • One-Thumb Mobile Remote Bar           │     │  2. Sanctuary Projector URL      │
│  • Tablet 2-Col Deck / Desktop 3-Col     │     │     (?view=projector&room=CODE)  │
└──────────────────────┬───────────────────┘     └───────────────▲──────────────────┘
                       │                                         │
                       │ Firestore Write (<50ms)                 │ Firestore onSnapshot
                       ▼                                         │ + BroadcastChannel
┌────────────────────────────────────────────────────────────────┴──────────────────┐
│                     FIREBASE BACKEND (Firestore + Firebase Auth)                  │
│                                                                                   │
│  • /rooms/{roomId}      ──▶ Real-Time Active Slide, Stanza/Verse Index, & Theme   │
│  • /setlists/{listId}   ──▶ Shared Weekly Church Service Cue Sheets (Songs+Bible) │
│  • /hymns/{hymnId}      ──▶ Cloud Hymn Additions & Admin Updates                  │
│  • /reports/{reportId}  ──▶ Community Typo Reports (Queued Offline → Synced)      │
│  • /admins/{userId}     ──▶ Role-Verified Tech Team & Church Administrators       │
└───────────────────────────────────────────────────────────────────────────────────┘
```

#### Firestore Schema (`firebase-blueprint.json`) & Data Entities

- **Local IndexedDB Seed + Cloud Delta Entities**:
  - **Hymn (`Hymn`)**: `id`, `bookId` (`zion` | `thirumarai` | `chorus` | `tamilchorus`), `number`, `titleTamil`, `titleTanglish`, `category`, `keySignature`, `stanzas` (`{ id, label, type: 'verse' | 'chorus', tamil: string[], tanglish: string[], english?: string[] }[]`), `sheetMusicUrls`, `youtubeId`, `scriptureRef`.
  - **Bible (`BibleVerse`)**: `translation` (`TAMIL_BSI` | `KJV` | `NKJV`), `bookId` (66 canonical books with Tamil & English names), `chapter`, `verse`, `text`.
- **Firestore Collections**:
  1. **`/rooms/{roomId}` (`BroadcastRoom`)**:
     - Fields: `roomId`, `sourceType` (`'hymn'` | `'bible'` | `'announcement'`), `sourceId`, `currentIndex`, `chorusIndex`, `isBlanked`, `bilingualMode` (`'tamil-only'` | `'english-only'` | `'tamil-tanglish'` | `'tamil-english'`), `primaryText`, `secondaryText`, `referenceTitle`, `subReference`, `slideBadge`, `obsStyle` (`'dark-glass'` | `'royal-gold'` | `'minimal-clean'`), `fontScale`, `updatedBy`, `updatedAt`.
     - Real-Time Sync: Any controller updating `/rooms/{roomId}` triggers immediate `onSnapshot` re-renders on all connected OBS Browser Source URLs and Sanctuary Projectors.
  2. **`/setlists/{setlistId}` (`ServiceSetlist`)**:
     - Fields: `title`, `serviceDate`, `roomId`, `items` (bounded list of song & scripture cues `{ id, type: 'hymn' | 'bible', refId, title, subtitle, version }`), `ownerId`, `updatedAt`.
  3. **`/reports/{reportId}` (`MistakeReport`)**:
     - Fields: `hymnId`, `hymnTitle`, `issueType` (`'typo'` | `'missing-stanza'` | `'chords'` | `'other'`), `description`, `status` (`'pending'` | `'resolved'`), `authorId`, `createdAt`.
  4. **`/admins/{userId}` (`AdminRole`)**:
     - Role lookup document for hardened security rules verification.
- **Cloudflare Deployment Config (`wrangler.jsonc`)**:
  - Preconfigured static asset routing (`run_worker_first: false`) so the compiled `dist/` bundle deploys directly to Cloudflare Workers / Pages with zero server CPU bottlenecks.
