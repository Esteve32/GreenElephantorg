# GREENPRINT — GreenElephant.org Upgrade Master Plan

> **Code name: GREENPRINT**
> Living strategy document. Add ideas here instead of scattering them across chat sessions.
> Organised by theme. Each section has a status, enough detail to brief a developer cold, and is GitHub-push ready.
> Related docs: `docs/AGENTOPS_FLOWS.md` (automation pipelines), `.agents/skills/satellite-scan-portal/SKILL.md` (portal build plan)

---

## Status Legend
- ✅ **Live** — built and deployed
- 🔧 **In progress** — actively being worked on
- 📋 **Specced** — ready to build, detailed plan exists
- 💡 **Idea** — concept logged, not yet specced

---

## 1. Lottie Animations
**Status**: 💡 Waiting on Lottie Pro account purchase

### Shopping list — what to find on LottieFiles.com

How to search: Use lottiefiles.com/featured, filter by style "Minimal" or "Line art" and background "Transparent". Avoid white backgrounds, cartoon style, or childlike colour palettes. Brand test: "Would this look at home in the Fuzu Dashboard screenshots?"

#### Priority 1 — Functional UI animations (high value, use immediately)

| Slot | What it replaces | Search terms | Style notes |
|---|---|---|---|
| **Form success checkmark** | Static "submitted" text on all forms | "checkmark minimal", "success tick line" | White or teal line-draw on transparent bg. No colour fill. Under 2 sec loop. |
| **Loading/scanning ring** | Static spinner on scan/flow-check submissions | "radar scan", "HUD loading ring", "sonar sweep" | Dark bg compatible. Circular. Teal or white. |
| **HUD compass spin** | Static compass icon in the header/hero | "compass spin", "navigation HUD", "direction minimal" | Should look like the 8-lens HUD rings already in the brand assets |

#### Priority 2 — Hero/section accent animations (medium value)

| Slot | Where | Search terms | Style notes |
|---|---|---|---|
| **Signal pulse / radar ping** | Scan page hero | "signal pulse", "radar wave", "sonar ping" | Radial wave expanding outward. Teal or white. Dark bg. |
| **Flow zone glow** | Flow Check results page | "data glow", "neon pulse", "HUD ring fill" | A ring that fills/glows in the zone colour (teal/orange/blue/red). |
| **Star field / particles** | Homepage hero background accent | "particle field", "space particles", "dots float" | Very subtle. Dark bg. Should not distract from text. |

#### Priority 3 — Nice to have (low urgency)

| Slot | Where | Search terms |
|---|---|---|
| **Audio waveform** | Webinar page, coaching page | "audio wave", "sound waveform", "voice signal" |
| **Globe / network** | Homepage or /periodic-table | "network globe", "connection dots" |

#### What NOT to buy
- Anything with a white background
- Cartoon/flat illustration style
- Built-in colours that clash (hot pink, candy purple)
- Animations over 3 seconds unless looping

#### Implementation notes
- Install `lottie-react` npm package
- Drop `.json` file into `client/src/assets/lotties/`
- `<Lottie animationData={...} loop={true} autoplay={true} />`
- For the checkmark: `loop={false}`, trigger on form success state

---

## 2. Micro-Habit TAR Builder (AI-powered)
**Status**: 💡 Idea stage — ready to spec and build

### Concept
Instead of a generic AI chat interface, output micro-habits in structured Trigger/Action/Reward (TAR) format, revealed as animated cards arriving one by one.

### User flow
1. User provides context: situation (from Flow Check or quick form), role, communication challenge
2. AI generates 3 fields: TRIGGER ("When..."), ACTION ("I will..."), REWARD ("In order to...")
3. Cards animate in sequentially with Framer Motion: card 1 slides from left, card 2 from below, card 3 from right — 0.4s apart
4. User can regenerate or save to PDF

### Visual reference
See `attached_assets/2103_Micro-Habit.png` — HUD slide with three panels (TRIGGER/ACTION/REWARD). Web version replaces illustrated characters with a dark background per card + HUD ring frame.

### Where to build
- New page `/micro-habit` or tab on `/resources`
- Or: bottom of Flow Check results page ("Generate your first micro-habit")

### Technical approach
- Use Thesys.dev AI integration (already on site) or OpenAI API
- System prompt: output JSON `{ trigger: string, action: string, reward: string }`
- Each card coloured by dominant behaviour lens (Green/Blue/Red tint)

### Why this is differentiated
The structure IS the product. Free-form AI text = generic. TAR card format = uniquely GreenElephant.

---

## 3. Decode Speech Lab — Additional Speeches
**Status**: ✅ `/decode` built with Mandela, JFK, Obama. Ready to extend.

### How to add a new speech
Edit `client/src/pages/DecodePage.tsx` and extend the `ALL_SPEECHES` array. Each speech has: `id`, `speaker`, `title`, `date`, `location`, `context`, and `paragraphs` (array of annotated segments with `behavior: "green" | "blue" | "red" | "neutral"` and `tooltip` explanation).

### Speeches in queue

| Speaker | Speech | Why interesting |
|---|---|---|
| **MLK** | "I Have a Dream" (1963) | Almost entirely Green + Red, minimal Blue — pure empathy and vision. |
| **Brené Brown** | TED "The Power of Vulnerability" (2010) | Very high Blue with Green — modern contrast to political speeches. |
| **Steve Jobs** | Stanford commencement (2005) | Three-story structure. Blue-dominant mid-section. Ends with the most famous Red closing. |
| **Greta Thunberg** | UN Climate Speech (2019) | Very high Red, very high Green, almost no Blue — raw emotional architecture. |
| **Donald Trump** | Any rally speech | High Red, low Green, specific Blue. Genuinely viral comparison content. The GBR model is neutral — the data speaks. |

### SEO note
Each speech is its own searchable query: "Mandela speech analysis", "Obama Berlin speech decoded". High-intent, low-competition search terms.

---

## 4. Brand & Visual Refinements
**Status**: 🔧 Logged — apply gradually

### Colour corrections
- `--needs` CSS: shift from pure cyan `hsl(180, 100%, 35%)` toward blue-teal `hsl(184, 88%, 35%)` to match brand swatch
- `--dynamics` CSS: darken slightly to match brand indigo
- Page backgrounds: warm from pure black toward deep navy `#0A0C14`

### Photography guidance (for Anu and future shoots)
- Always dark background: deep space/aurora/HUD aesthetic. Never bright studio or white wall.
- Person warmly lit from the front (face glowing) against dark — "astronaut in space" feel
- Bold white caps for headline, subtitle in regular weight
- Always include greenelephant.org logo bottom-right
- Warm accent colour on the person against cool dark background — this contrast is the brand signature
- For cut-outs: slightly feathered edge at hair/background boundary

### 8 Lens HUD icons (circular icons with coloured rings)
The lens icon set is not yet on the website in interactive form. Could become hover-able elements on `/periodic-table` or the homepage. Priority: medium.

---

## 5. Periodic Table — Web Adaptation
**Status**: ✅ Zoom viewer built, full web table exists. Further work possible.

### Ideas for deeper web adaptation
- **Hover-expand elements**: clicking a card shows full-screen detail: element name, lens, category, behaviour description, example prompt, related elements
- **Lens deep-dives**: each lens has its own sub-page (`/lens/influence`, `/lens/needs` etc.)
- **"Element of the day"**: daily rotating element on homepage or resources page
- **Search**: filter elements by keyword (name, description, or prompt text)

---

## 6. Satellite Scan Portal (Client Login)
**Status**: 📋 Full spec saved as skill at `.agents/skills/satellite-scan-portal/SKILL.md`

### When to build
Say "let's work on the Satellite Scan Portal." Full build plan is in the skill file. Estimated 76–119 agent-hours across 6 phases.

### Key facts
- Source spreadsheet: `11dKNeCJcKizW63dmFxggO1-D5K3wGLKZ8sMKRTZAKVo`
- Dashboard template: Google Slides `129c1JmY5kqBfTAtUMnTYXFeCcZf52Gj_84vlG8InOAM`
- ~15 chart types using Recharts
- Client login + coach admin panel
- This is also the core interoperability layer for future AgentOps (see Section 9)

---

## 7. SEO Content Pipeline
**Status**: ✅ Infrastructure built. Content to add.

### High-value pages to create
- `/decode/mandela-pretoria-1994` — individual speech URLs for SEO (currently all on `/decode`)
- `/lens/[name]` — one page per lens (8 pages, each targeting "[lens] communication" keywords)
- `/blog` or `/articles` — thought leadership. First article: "Why JFK, Mandela and Obama all use the same communication structure"

### Link building opportunities
- `/decode` is highly shareable — especially the JFK/Obama/Mandela comparison
- `/flow-check` free tool builds email list and drives return traffic
- Guest posts: EA professional blogs, leadership coaching sites

---

## 8. Webinar Infrastructure
**Status**: ✅ Built. Settings managed via admin panel "Webinar" tab.

### Ideas for next webinar series
- Record each session → add to `/decode` as a colour-coded webinar excerpt (Anu's speech, not just historical figures)
- Add replay page with VideoObject structured data for each past session
- "Bring a colleague" referral incentive on the webinar waitlist page

---

## 9. AI Agent Readiness & AgentOps Strategy
**Status**: 🔧 Foundation live. Upgrades prioritised below.

**Source**: "How AI agents will reshape every part of marketing in 2026" — martech.org, February 2026
**Key quote**: *"Ultimately, brands must be interpretable by the digital agents that will soon dominate the consumer journey."*

### Why this matters for GreenElephant now
Conscious communication is literally about the human–AI interface as a topic — the platform should model what it preaches. AI agents (shopping, researching, scheduling on behalf of humans) will soon discover coaching and retreat services. Brands not structured for agent parsing become invisible. The window to build interoperability before it becomes table stakes is now.

### What we already have (head start)

| Asset | Notes |
|---|---|
| JSON-LD structured data on 26+ pages | FAQPage, BreadcrumbList, Event, VideoObject schemas already live |
| `/api/services` | Schema.org ItemList: all 6 services with pricing, description, audience, format |
| `/api/coaches` | Schema.org Person: Esteve and Anu with knowsAbout, languages, contact |
| `/llms.txt` | Plain-prose brand description for LLM context windows (like robots.txt for AI) |
| Machine-readable assessment APIs | `/api/flow-check`, `/api/signals-quiz`, `/api/scan-interest` accept and return structured data |
| Notion CRM sync | Every touchpoint is logged — proto-AgentOps workflow |
| `docs/AGENTOPS_FLOWS.md` | All 8 automation pipelines documented as named flows |
| Sitemap.xml + robots.txt | Agent-navigable already |

### Prioritised upgrades to build next

**Priority 1 — Extend JSON-LD: Service schema on Scan and Coaching pages**
- Add `@type: ["Product", "Service"]` to the existing Product schemas
- Add `provider`, `serviceType`, `audience`, `url`, `areaServed` properties
- This makes Google (and agents trained on it) understand GreenElephant as a service provider, not just a product listing
- Files: `client/src/components/SEO.tsx` (PRODUCT_STRUCTURED_DATA)

**Priority 2 — Organization JSON-LD on every page**
- Add a single `Organization` schema to the site root (via the base SEO component)
- Include: `name`, `url`, `logo`, `sameAs` (LinkedIn, etc.), `founder`, `description`, `knowsAbout`
- This is what AI agents use to understand who GreenElephant is when they encounter a page

**Priority 3 — AgentOps pipeline formalisation**
- Current: pipelines run as Express middleware in a single process
- Future: move to a proper trigger/orchestration layer (Temporal, n8n, or Trigger.dev)
- All pipelines are now documented in `docs/AGENTOPS_FLOWS.md` — this is the spec for migration
- Timeline: when Satellite Scan Portal build begins (Phase 6 of portal plan)

**Priority 4 — AI-interpretable Periodic Table API**
- The 146-element taxonomy is a structured knowledge graph — perfect for agent traversal
- Add `/api/elements` endpoint returning all elements with lens, category, behaviour description, and example prompt
- This would allow AI agents to recommend specific micro-habits to users based on their profile

**Priority 5 — Check-my-FLOW as an agentic diagnostic step**
- The Flow Check → Signals Quiz → Satellite Scan funnel is a *diagnostic pipeline*
- Future: expose this as an agent-callable sequence so AI assistants can walk a user through it
- Would require an API-first redesign of the quiz and scan intake (not the full page, just the API)

### Strategic framing
- The Periodic Table is a taxonomy — a structured knowledge graph AI agents can traverse and cite
- The diagnostic funnel (Flow Check → Quiz → Scan) is something an AI agent could guide a human through
- The Satellite Scan Portal is the interoperable SaaS layer the martech.org article calls for — every hour there is an hour of AI-readiness
- Long-term goal: GreenElephant should be to conscious communication what a structured API is to data — machine-readable, composable, trustworthy
