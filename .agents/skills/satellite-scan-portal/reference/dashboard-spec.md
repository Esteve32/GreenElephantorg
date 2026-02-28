# Satellite Scan Dashboard — Component Specification

This document maps every visual section of the Google Slides dashboard template to the web components needed for the portal. Derived from the uploaded PDF (70+ slides, template version v12).

## Document Structure (Slide Order)

### Cover (Slide 1)
- Client name (FNAME LNAME)
- "Satellite Scan AI-Powered Communication Analysis"
- Date (DD.MM.YYYY)
- Component: Simple branded header card

### Table of Contents (Slide 2)
- Two columns: Orientation / Your Results
- Component: Navigation menu (becomes sidebar/tabs in web version)

---

## Section 1: Summary & Micro-Habits (Slides 3-21)

### Superpowers (Slide 4)
- 5 numbered items with title + paragraph description
- AI-generated text in Finnish (localized per client)
- Component: `SuperpowersList` — numbered cards with icon

### Verbal Advice (Slides 5-8)
- 3 numbered advice items
- Each has: title, description, "Vinkki" (tip) with example phrases, "Ehdotus" (suggestion)
- Component: `CoachingAdviceCard` — collapsible card with sub-sections

### Non-Verbal Advice (Slides 9-12)
- 3 numbered advice items (same structure as verbal)
- Additional bullet-point format for some items
- Component: Reuse `CoachingAdviceCard`

### Values & Intentions Advice (Slides 13-16)
- 3 numbered advice items (same structure)
- Component: Reuse `CoachingAdviceCard`

### Micro-Habits (Slides 17-20)
- Table format: Habit Name | Trigger | Action | Reward
- 5 custom habits (personalized, Finnish) + 5 generic habits (English)
- Component: `MicroHabitsTable` — dark styled table with 4 columns
- Note: Generic habits include Take a Breath, Listen First, Use Positive Language, Use Empathetic Responses, Use Open-Ended Questions

### Self-Reflection Questions (Slide 21)
- 5 numbered questions
- Component: `ReflectionQuestions` — simple styled list

---

## Section 2: Orientation (Slides 22-26)

### Welcome (Slide 22)
- Introductory text about the Satellite Scan
- Component: Text card with branding

### 8 Lenses Overview (Slide 23)
- Grid of 8 lens icons with names and descriptions
- Lenses: Ego, Dynamics, Influence, Attitude, Chaordic, Flow, Alignment, Needs
- Component: `LensOverviewGrid` — 8 cards with lens colors and icons

### 10 Benefits (Slide 24)
- Grid of 10 benefit icons
- Component: Simple icon grid card

### How to Use This Report (Slide 25)
- 3 steps: Print, Video, Note
- Component: Text card with 3 columns

### Your Situations (Slide 26)
- 3 categories: All Situations, Common Situations (3-5), Most Challenging
- Data labels: `<ALL_SITUATIONS>`, `<COMMON_SITUATIONS>`, `<CHALLENGING_SITUATIONS>`
- Component: `SituationsOverview` — 3-column card with tag lists

---

## Section 3: Ego (Slides 27-34)

### Ego Triggers (Slide 28)
- Circular/donut chart showing trigger topics
- Client selected unlimited topics they find challenging
- Data label: `<EGO_TRIGGERS>`
- Component: `CircularChart` (donut)

### Ego Comparison (Slide 28, right side)
- Scale 1-10: how often you compare people
- Data label: `<EGO_COMPARISON>`
- Component: `GaugeMeter`

### Demographics (Slide 29)
- Education level chart: `<EDUCATION>`
- Seniority/time in org: `<TIME_IN_ORG>`
- Generation from year of birth: `<YOB>`
- Component: 3x `GaugeMeter` or `HorizontalBarChart`

### 5 Barriers (Slide 30)
- 5 communication barriers with scores (ability to cross each)
- Barriers: Consciousness (7104), Permission (7105), Sensorial (7106), Language (7107), Tangibility (7108)
- Data labels: `<SELF_AWARENESS>`, `<CHECKING_ASSUMPTIONS>`, `<EXTERNAL_AUTHORITY>`, `<ELEPHANT>`, `<ADAPTING>`, `<LABELLING>`
- Component: `HorizontalBarChart` (5 bars)

### Ego Hats/Roles (Slide 31)
- 10 social ego roles with scores 1-10
- Roles: Interpreter (7110), Interrogator (7111), Judge (7112), Host (3114), Harvester (3111), Devil's Advocate (7113), Hero (7114), Narrator (7115), Hermit (7116), Artisan (7117)
- Data label: `<EGO_ROLES>`
- Component: `EgoRolesChart` (horizontal bar, 10 items)
- Note: Yellow-highlighted roles serve collective intelligence (Chaordic balance)

### Blue Intentions (Slide 32)
- Score 1-10
- Data label: `<BLUE_INTENTIONS>`
- Component: `GaugeMeter`

### Blue Verbal Competences (Slide 33)
- Score 1-10
- Data label: `<BLUE_VERBAL_COMPETENCE>`
- Component: `GaugeMeter`

---

## Section 4: Dynamics (Slides 35-37)

### Relationship Competence (Slide 35)
- Scale 1-10: competence to manage relationships
- Data label: `<RELATIONSHIP_BUILDING>`
- Component: `GaugeMeter`

### Lead-Follow Polarity (Slide 36)
- 4-axis display: Lead, Follow, Freedom, Love
- Scale 1-10 each
- Data labels: `<LEAD_COMPETENCE>`, `<FOLLOW_COMPETENCE>`
- Component: `PolarityChart` (diamond/quad layout)

### Relationship Dynamics (Slide 37)
- Vertical, horizontal, dynamic communication types
- Data label: `<CONVERSATION_POLARITY>`
- Component: `GroupedBarChart` or custom polarity visual

---

## Section 5: Influence (Slides 39-44)

### Influence Type (Slide 39)
- 3-way: Dominative / Manipulative / Intentional
- Focus in Challenging Situations: `<%GBRFOCUS_CHALLENGING_SITUATION>`
- Influence Efficacy: `<EFFICACY_COMMUNICATION>`
- Component: `SpectrumChart` (3-way) + `GaugeMeter`

### Key Behaviours (Slide 40)
- GBR scores: Expressing (blue), Hosting (red), Presencing (green)
- Data labels: `<EXPRESSING_COMPETENCE>`, `<HOSTING_COMPETENCE>`, `<PRESENCING_COMPETENCE>`
- Component: `GroupedBarChart` (3 bars, GBR colors)

### Non-Verbal Competences (Slide 41)
- 5 categories × 3 colors (GBR): Timing, Rhythm, Body-Language, Silence, Intonation
- Data label: `<GBR_NV_AGGREGATED>`
- Component: `GroupedBarChart` (5 groups × 3 bars each, GBR colors)

### Red Intentions (Slide 42)
- Score 1-10
- Data label: `<RED_INTENTIONS>`
- Component: `GaugeMeter`

### Red Verbal Competences (Slide 43)
- Score 1-10
- Data label: `<RED_VERBAL_COMPETENCE>`
- Component: `GaugeMeter`

---

## Section 6: Attitude (Slides 45-48)

### Growth Focus (Slide 45)
- Scale 1-10: growth mindset indication
- Data label: `<GROWTH_FOCUS>`
- Component: `GaugeMeter`

### Overall Attitude to Change (Slide 45, right)
- 4 typical attitudes to change
- Data label: `<ATTITUDE_SCORE>`
- Component: `HorizontalBarChart` or segmented display

### Attitude to Change Detail (Slide 46)
- Detailed breakdown
- Component: Additional chart/card view

### Learning Needs (Slide 47)
- Activation learning needs type
- Data label: `<ACTIVATION_LEARNING_NEEDS>`
- Component: `CircularChart` or `HorizontalBarChart`

### Action Learning (Slide 48)
- Learning hours per week: `<LEARNING_HOURS>`
- Face-to-face learning done: `<PRACTICAL_EXPERIENCE_GE>`
- Online learning done: `<THEORY_WATCHED_GE>`
- Component: `ScoreCard` (hours) + 2x `GaugeMeter`

---

## Section 7: Chaordic (Slides 49-54)

### Freedom to Communicate (Slide 50)
- Scale 1-10: creative freedom score
- Spectrum: Kaamos → Chaos → Order → Control
- Data label: `<CHAORDIC_SCORE>`
- Component: `SpectrumChart` (4-zone horizontal)

### Wasted Time (Slide 50, bottom)
- Perceived wasted time from disruptive chaos
- Data label: `<WASTED_TIME>`
- Component: `GaugeMeter`

### Chaordic Balance (Slide 51)
- Order/structure scores per activity/topic
- Scale 1-10 per item
- Data label: `<ORDER>`
- Component: `HorizontalBarChart` (multiple items)

### Chaordic Roles (Slide 52)
- Roles used for collective intelligence
- Data label: `<COLLECTIVE_INTELLIGENCE>`
- Component: `HorizontalBarChart` or `CircularChart`

### Conversation Levels (Slide 53)
- 4 levels of conversation competence (scale 1-10 each)
- Data label: `<QUALITY_COMMUNICATION>`
- Component: `ConversationLevelsChart` (4-level display)

---

## Section 8: Flow (Slides 55-56)

### Flow Metrics (Slide 55)
- Motivation (1-10): `<MOTIVATION>`
- Competence (1-10): `<COMPETENCE>`
- Challenge (1-10): `<CHALLENGE>`
- Component: 3x `GaugeMeter`

### Flow Quadrant (Slide 55, center)
- 2D plot: Challenge (y-axis) vs Competence (x-axis)
- Zones: Flow, Anxiety, Boredom, Apathy
- Component: `QuadrantPlot` (scatter with zone overlay)

### Perceived Feeling (Slide 55, right)
- 8 feeling circles showing common communication experience
- Data label: `<FLOW_FEELING>`
- Component: `CircularChart` or bubble display

### Feedback Quality (Slide 56)
- Give vs receive: praise, opinions, advice
- Data labels: `<GIVE_FEEDBACK>`, `<RECEIVE_FEEDBACK>`
- Component: `StackedComparisonChart` (give/receive side by side)

### Feedback Quantity (Slide 56, bottom)
- Scale 1-10: enough helpful feedback
- Data label: `<FEEDBACK_QTY>`
- Component: `GaugeMeter`

---

## Section 9: Alignment (Slides 58-64)

### Green Intentions & Verbal (Slides 58-59)
- Green verbal competence score 1-10
- Data label: `<GREEN_VERBAL_COMPETENCE>`
- Component: `GaugeMeter`

### GBR Congruence (Slide 60)
- 3×3 grid: Green/Blue/Red × Verbal/Behaviours/Intentions
- Average competence scores
- Data label: `<GBR_AVERAGE_V_NV_I>`
- Component: `CongruenceChart` (3×3 grid with color coding)

### Alignment Radar (Slide 61)
- Spider/radar chart with 6 axes: Ego Comparison, Ego Triggers, Influence, GBR in Challenging Situations, Perceived Feeling, Motivation
- Center grid: Think/Say/Feel/Do
- Component: `RadarChart` (6-axis spider)

---

## Section 10: Needs (Slides 63-66)

### Conflicts (Slide 63)
- Dysfunctional (-) to Functional (+) spectrum
- Data label: `<CONFLICT_BEHAVIOUR>`
- Component: `ConflictSpectrumChart`

### Assumptions (Slide 64)
- Self-awareness score: `<SELF_AWARENESS_COMPETENCE>`
- Checking assumptions score: `<CHECKING_ASSUMPTIONS_COMPETENCE>`
- NVC ladder: Observation → Feelings → Needs → Requests (6 steps)
- Component: 2x `GaugeMeter` + `StepLadder` visual

### Individual Needs (Slide 65)
- 7 categories: Strategy, Goals, Expression, Respect, Autonomy, Resources, Safety
- Scale 1-10 each (satisfaction)
- Data label: `<AGGREGATED_NEEDS>`
- Component: `HorizontalBarChart` (7 bars)

### Team Needs (Slide 66)
- 5 stages: Inclusion, Conflict, Process, Productivity, Development
- Each with host role label
- Data label: `<GROUP_NEEDS>`
- Component: `StageChart` (5-stage horizontal with labels)

---

## Section 11: Printables (Slides 67-70)

### Summary Notes (Slide 68)
- 8 lens columns with blank lines
- Component: Printable template (PDF only)

### Elements Notes (Slide 69)
- Periodic table element grid with reference numbers
- Component: Element grid (PDF only, or interactive hover view)

### Micro-Habit Template (Slide 70)
- 5-section template: Trigger, Intention, Behaviour, Words, Reward
- Component: Printable template (PDF only)

---

## Total Component Count

| Component Type | Count | Reuse Potential |
|---------------|-------|----------------|
| GaugeMeter | Used ~15 times | High (single component) |
| HorizontalBarChart | Used ~6 times | High |
| CircularChart | Used ~3 times | High |
| GroupedBarChart | Used ~3 times | High |
| RadarChart | Used ~2 times | High |
| QuadrantPlot | Used 1 time | Low |
| SpectrumChart | Used ~2 times | Medium |
| PolarityChart | Used 1 time | Low |
| CongruenceChart | Used 1 time | Low |
| ConflictSpectrumChart | Used 1 time | Low |
| StageChart | Used 1 time | Low |
| ScoreCard | Used ~5 times | High |
| CoachingAdviceCard | Used ~9 times | High |
| MicroHabitsTable | Used 1 time | Low |
| SuperpowersList | Used 1 time | Low |
| **Unique components** | **~15** | |
