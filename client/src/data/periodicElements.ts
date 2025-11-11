import type { LensType } from "@/constants/lenses";

export interface PeriodicElement {
  code: number;
  symbol: string;
  name: string;
  lens: LensType;
  category?: string;
  description?: string;
  examplePrompt?: string;
}

// INFLUENCE LENS (🔴 RED #cc3333) - Code 1100
export const influenceElements: PeriodicElement[] = [
  { code: 1101, symbol: "IS", name: "Influence Strategies", lens: "influence", examplePrompt: "I'd like to share a perspective that might shift how we approach this. Would you be open to hearing it?" },
  { code: 1102, symbol: "QC", name: "Quantum Conversations", lens: "influence", examplePrompt: "What if we held space for all possibilities here—both the solution we see and the ones we haven't imagined yet?" },
  { code: 1103, symbol: "GBR", name: "GreenBlueRed™", lens: "influence", examplePrompt: "I notice I'm moving into Red (directing) energy. Let me pause and check: does Green (aligning) serve us better right now?" },
  { code: 1104, symbol: "PT", name: "Periodic Table", lens: "influence", examplePrompt: "Looking at our conversation through the Periodic Table, I see we're strong in Needs but missing Alignment. What would help us bridge that?" },
  { code: 1105, symbol: "HUD", name: "Head-Up Display", lens: "influence", examplePrompt: "Can we step back for a moment and look at the bigger picture? What patterns are we missing while we're in the details?" },
  { code: 1106, symbol: "FH", name: "Facilitating & Hosting", lens: "influence", examplePrompt: "I want to hold space for everyone's voice here. Who hasn't spoken yet that might have insight we need?" },
  { code: 1201, symbol: "Ad", name: "Advising", lens: "influence", category: "SAY & WRITE", examplePrompt: "Based on what I've seen work before, here's what I'd recommend: [specific advice]. Does this resonate with your situation?" },
  { code: 1202, symbol: "RQ", name: "Red Question", lens: "influence", category: "SAY & WRITE", examplePrompt: "What specific action will you take by [deadline] to move this forward?" },
  { code: 1203, symbol: "Sg", name: "Suggesting", lens: "influence", category: "SAY & WRITE", examplePrompt: "I have a suggestion that might help. Would it be useful if we tried [specific suggestion]?" },
  { code: 1204, symbol: "Sp", name: "Supporting", lens: "influence", category: "SAY & WRITE", examplePrompt: "I believe in your capacity to handle this. What support would help you feel most confident moving forward?" },
  { code: 1205, symbol: "Or", name: "Ordering", lens: "influence", category: "SAY & WRITE", examplePrompt: "For everyone's safety, I need you to [specific action] immediately. Can you confirm you'll do this?" },
  { code: 1206, symbol: "Ag", name: "Agreeing", lens: "influence", category: "SAY & WRITE", examplePrompt: "Yes, I'm fully aligned with this direction. Here's how I'll contribute: [specific commitment]." },
  { code: 1301, symbol: "RS", name: "Red Silence", lens: "influence", category: "DO & MOVE", examplePrompt: "[Pause deliberately before responding to create space for reflection and signal importance]" },
  { code: 1302, symbol: "RI", name: "Red Intonation", lens: "influence", category: "DO & MOVE", examplePrompt: "[Lower your voice and slow your pace]: This is the most important thing I'll say today. Please hear me." },
  { code: 1303, symbol: "RBL", name: "Red Body-Language", lens: "influence", category: "DO & MOVE", examplePrompt: "[Stand, make eye contact, open palms]: I'm fully present and committed to finding a way through this together." },
  { code: 1304, symbol: "RR", name: "Red Rhythm", lens: "influence", category: "DO & MOVE", examplePrompt: "[Match their energy level first, then gradually shift the pace]: Let's take this one step at a time. First... then... finally..." },
  { code: 1305, symbol: "RT", name: "Red Timing", lens: "influence", category: "DO & MOVE", examplePrompt: "I see this is important to you. Can we schedule 30 minutes tomorrow when we're both fresh to give it our full attention?" },
  { code: 1401, symbol: "Un", name: "Uniting", lens: "influence", category: "FEEL & INTEND", examplePrompt: "Despite our different approaches, we both care deeply about [shared value]. Can we build from that common ground?" },
  { code: 1402, symbol: "Sd", name: "Seducing", lens: "influence", category: "FEEL & INTEND", examplePrompt: "Imagine what becomes possible when we bring this to life. Can you feel the potential?" },
  { code: 1403, symbol: "FP", name: "Fixing Problems", lens: "influence", category: "FEEL & INTEND", examplePrompt: "I notice I'm jumping to solutions. Let me first understand: what does this problem mean to you?" },
  { code: 1404, symbol: "CO", name: "Changing Others", lens: "influence", category: "FEEL & INTEND", examplePrompt: "I realize I've been trying to change you rather than understand you. What do you need from me instead?" },
  { code: 1405, symbol: "TO", name: "Taking Over", lens: "influence", category: "FEEL & INTEND", examplePrompt: "I notice I'm taking over. Would it serve us better if I stepped back and let you lead this part?" },
  { code: 1406, symbol: "If", name: "Influencing", lens: "influence", category: "FEEL & INTEND", examplePrompt: "My intention is to influence, not manipulate. Here's my authentic hope for this conversation: [state clearly]." },
];

// ATTITUDE LENS (🟠 ORANGE #ff9933) - Code 2100
export const attitudeElements: PeriodicElement[] = [
  { code: 2101, symbol: "AC", name: "Attitude to Change", lens: "attitude", examplePrompt: "I notice I'm resisting this change. What am I protecting, and is there a way to honor that need while still moving forward?" },
  { code: 2102, symbol: "LR", name: "Learning Retention", lens: "attitude", examplePrompt: "What's one small practice I can commit to daily that will help this new skill become second nature?" },
  { code: 2103, symbol: "MH", name: "Micro-Habits", lens: "attitude", examplePrompt: "After I [existing habit], I will [new tiny behavior] to build my communication practice." },
  { code: 2104, symbol: "SR", name: "Self-Reflection", lens: "attitude", examplePrompt: "Looking back at that conversation, what did I do well? What would I do differently next time?" },
  { code: 2401, symbol: "A0", name: "Attitude 0", lens: "attitude", category: "FEEL & INTEND", examplePrompt: "I'm feeling defensive and closed. Before responding, let me take three breaths and return to openness." },
  { code: 2402, symbol: "AI", name: "Attitude I", lens: "attitude", category: "FEEL & INTEND", examplePrompt: "I'm curious about your perspective, even though it challenges mine. Help me understand what you're seeing." },
  { code: 2403, symbol: "AII", name: "Attitude II", lens: "attitude", category: "FEEL & INTEND", examplePrompt: "I genuinely want to learn from this. What wisdom are you offering that I might be missing?" },
  { code: 2404, symbol: "AIII", name: "Attitude III", lens: "attitude", category: "FEEL & INTEND", examplePrompt: "I'm approaching this with beginner's mind—ready to be surprised and transformed by what emerges." },
];

// CHAORDIC LENS (🟡 YELLOW #ffcc00) - Code 3100
export const chaordicElements: PeriodicElement[] = [
  { code: 3101, symbol: "CB", name: "Chaordic Balance", lens: "chaordic", examplePrompt: "This conversation needs both structure and flow. How can we honor the agenda while staying open to emergence?" },
  { code: 3102, symbol: "AC", name: "Algorithm Canvas", lens: "chaordic", examplePrompt: "Let's map the pattern: When [trigger] happens, we tend to [behavior]. What serves us better?" },
  { code: 3103, symbol: "TC", name: "Types of Conversation", lens: "chaordic", examplePrompt: "I notice we're in debate mode. Would dialogue—where we explore together—serve us better right now?" },
  { code: 3104, symbol: "ST", name: "Small Talk", lens: "chaordic", examplePrompt: "How's your week unfolding? I'm genuinely curious what's alive for you right now." },
  { code: 3105, symbol: "Fr", name: "Framing", lens: "chaordic", examplePrompt: "Let me frame this conversation: my hope is that we [desired outcome]. Does that work for you?" },
  { code: 3106, symbol: "CI", name: "Check-In/Out", lens: "chaordic", examplePrompt: "Before we dive in, how are you arriving to this conversation? What do you need to be fully present?" },
  { code: 3107, symbol: "DD", name: "Debate & Discussion", lens: "chaordic", examplePrompt: "I hear your position. Here's mine, and I'm curious where they might converge: [state clearly]." },
  { code: 3108, symbol: "ND", name: "Negotiation & Dialogue", lens: "chaordic", examplePrompt: "Rather than compromise, what if we search for the solution that honors both our needs fully?" },
  { code: 3109, symbol: "Cc", name: "Co-creation", lens: "chaordic", examplePrompt: "What wants to emerge here that neither of us could create alone?" },
  { code: 3110, symbol: "Mp", name: "Marketplace", lens: "chaordic", examplePrompt: "Let's create a marketplace of ideas—everyone share what you're working on, and see what connections emerge organically." },
  { code: 3111, symbol: "CR", name: "Chaordic Roles", lens: "chaordic", category: "COLLECTIVELY INTELLIGENT ROLES", examplePrompt: "In this conversation, what role would serve the collective best? Host? Participant? Harvester?" },
  { code: 3112, symbol: "Pt", name: "Participant", lens: "chaordic", category: "COLLECTIVELY INTELLIGENT ROLES", examplePrompt: "As a participant, I commit to showing up fully—listening deeply, speaking authentically, and trusting the process." },
  { code: 3113, symbol: "Hv", name: "Harvester", lens: "chaordic", category: "COLLECTIVELY INTELLIGENT ROLES", examplePrompt: "Let me harvest what I'm hearing: [key themes]. Did I capture the essence, or is something missing?" },
  { code: 3114, symbol: "Ht", name: "Host", lens: "chaordic", category: "COLLECTIVELY INTELLIGENT ROLES", examplePrompt: "As host, I'm here to hold space for all voices. What needs to be said that hasn't been spoken yet?" },
  { code: 3115, symbol: "Sw", name: "Steward", lens: "chaordic", category: "COLLECTIVELY INTELLIGENT ROLES", examplePrompt: "I'm stewarding our shared purpose here. If we drift, I'll gently guide us back to what matters most." },
];

// FLOW LENS (🟢 GREEN #cccc33) - Code 4100
export const flowElements: PeriodicElement[] = [
  { code: 4101, symbol: "MF", name: "Measuring Flow", lens: "flow", examplePrompt: "On a scale of 1-10, how much flow do you feel in our collaboration right now? What would move us closer to 10?" },
  { code: 4102, symbol: "CF", name: "Conscious Feedback", lens: "flow", examplePrompt: "I want to offer feedback in a way that energizes rather than deflates. When would be the best time, and how would you like to receive it?" },
  { code: 4103, symbol: "Mt", name: "Motivation", lens: "flow", examplePrompt: "What makes this work meaningful to you? How can we connect today's tasks to that deeper purpose?" },
  { code: 4104, symbol: "Ch", name: "Challenge", lens: "flow", examplePrompt: "This challenge is stretching you. What support or resources would help you grow through it rather than drown in it?" },
  { code: 4105, symbol: "Sk", name: "Skill", lens: "flow", examplePrompt: "You have the skills for this—I've seen you demonstrate them. What's getting in the way of accessing them right now?" },
];

// ALIGNMENT LENS (🟢 GREEN #669966) - Code 5100
export const alignmentElements: PeriodicElement[] = [
  { code: 5101, symbol: "Al", name: "Alignment", lens: "alignment", examplePrompt: "I hear what you're saying, and I want to find where our values overlap. What matters most to you in this situation?" },
  { code: 5102, symbol: "Cg", name: "Congruence", lens: "alignment", examplePrompt: "I notice my words and my tone aren't matching. Let me pause and speak from a more authentic place." },
  { code: 5103, symbol: "Mn", name: "Meaning", lens: "alignment", examplePrompt: "What makes this meaningful to you? When I understand the significance, I can show up more fully." },
  { code: 5104, symbol: "Ik", name: "Ikigai", lens: "alignment", examplePrompt: "How does this work connect to your sense of purpose—what you love, what you're good at, what the world needs?" },
  { code: 5105, symbol: "Pr", name: "Presencing", lens: "alignment", examplePrompt: "Let me set aside my agenda for a moment and simply be present to what's emerging right now." },
  { code: 5201, symbol: "PP", name: "Positive Phrases", lens: "alignment", category: "SAY & WRITE", examplePrompt: "Instead of saying what we don't want, let's name what we do want: I'd love to see us [positive vision]." },
  { code: 5202, symbol: "GQ", name: "Green Questions", lens: "alignment", category: "SAY & WRITE", examplePrompt: "What would it look like if this went beautifully? How would you feel if we solved this together?" },
  { code: 5203, symbol: "Mi", name: "Mirroring", lens: "alignment", category: "SAY & WRITE", examplePrompt: "So what I'm hearing is [reflect back their words]. Is that right?" },
  { code: 5204, symbol: "Su", name: "Summarising", lens: "alignment", category: "SAY & WRITE", examplePrompt: "Let me summarize to make sure I understand: You're saying [main points]. Have I captured it?" },
  { code: 5205, symbol: "AA", name: "Accusation Audit", lens: "alignment", category: "SAY & WRITE", examplePrompt: "You might be thinking I'm [potential criticism]. And you'd have good reason—let me address that directly." },
  { code: 5206, symbol: "Uk", name: "Unlocking", lens: "alignment", category: "SAY & WRITE", examplePrompt: "It seems like something's holding you back from saying yes. What would need to shift for this to feel right?" },
  { code: 5207, symbol: "Lb", name: "Labelling", lens: "alignment", category: "SAY & WRITE", examplePrompt: "It seems like you're feeling [emotion]. Is that what's present for you right now?" },
  { code: 5208, symbol: "El", name: "Elephant", lens: "alignment", category: "SAY & WRITE", examplePrompt: "There's something we're not talking about that I think needs air. Can we name the elephant in the room?" },
  { code: 5301, symbol: "GS", name: "Green Silence", lens: "alignment", category: "DO & MOVE", examplePrompt: "[Hold compassionate silence, maintaining soft eye contact, to create space for them to go deeper]" },
  { code: 5302, symbol: "GI", name: "Green Intonation", lens: "alignment", category: "DO & MOVE", examplePrompt: "[Soften your voice, slow your pace]: Take your time. I'm here, fully listening." },
  { code: 5303, symbol: "GBL", name: "Green Body-Language", lens: "alignment", category: "DO & MOVE", examplePrompt: "[Open posture, slight lean forward, soft nod]: I'm with you. Please continue." },
  { code: 5304, symbol: "GR", name: "Green Rhythm", lens: "alignment", category: "DO & MOVE", examplePrompt: "[Match their breathing pace, create natural pauses]: Let's take this at whatever pace feels right for you." },
  { code: 5305, symbol: "GT", name: "Green Timing", lens: "alignment", category: "DO & MOVE", examplePrompt: "I want to give this the time it deserves. Is now the right moment, or should we find a time when we can both be fully present?" },
  { code: 5401, symbol: "Kd", name: "Kindness", lens: "alignment", category: "FEEL & INTEND", examplePrompt: "Even when this is hard, I choose kindness—toward you and toward myself. We're both doing our best." },
  { code: 5402, symbol: "Rs", name: "Respect", lens: "alignment", category: "FEEL & INTEND", examplePrompt: "I deeply respect your perspective, even where we differ. Your experience and wisdom matter to me." },
  { code: 5403, symbol: "BT", name: "Building Trust", lens: "alignment", category: "FEEL & INTEND", examplePrompt: "I want to earn your trust through consistent actions, not just words. What would help you feel safer with me?" },
  { code: 5404, symbol: "Em", name: "Empathy", lens: "alignment", category: "FEEL & INTEND", examplePrompt: "When you describe that, I sense how [emotion] that must be. Am I understanding what you're experiencing?" },
  { code: 5405, symbol: "Cr", name: "Curiosity", lens: "alignment", category: "FEEL & INTEND", examplePrompt: "I'm genuinely curious—what led you to see it that way? Help me understand your thought process." },
  { code: 5406, symbol: "Ap", name: "Agape", lens: "alignment", category: "FEEL & INTEND", examplePrompt: "I'm holding you in unconditional positive regard—whatever you share, you're worthy of respect and belonging." },
];

// NEEDS LENS (🟢 GREEN #009999) - Code 6100
export const needsElements: PeriodicElement[] = [
  { code: 6101, symbol: "CN", name: "Chakra Needs", lens: "needs", examplePrompt: "Looking at our needs holistically—are we addressing safety, belonging, and purpose? What layer needs attention right now?" },
  { code: 6102, symbol: "HN", name: "Hierarchy of Needs", lens: "needs", examplePrompt: "Before we focus on growth, let's check: are your basic needs for safety and stability met? What's most urgent?" },
  { code: 6103, symbol: "As", name: "Assumptions", lens: "needs", examplePrompt: "I realize I'm making an assumption. Let me check: is it true that [state assumption], or am I missing something?" },
  { code: 6104, symbol: "FC", name: "Functional Conflicts", lens: "needs", examplePrompt: "This conflict is pointing us to unmet needs. What need is alive for you that I haven't acknowledged yet?" },
  { code: 6105, symbol: "TL", name: "Types of Love", lens: "needs", examplePrompt: "What kind of support do you need right now—practical help, emotional connection, or playful presence?" },
  { code: 6106, symbol: "ST", name: "Stages of Team", lens: "needs", examplePrompt: "Our team is in [forming/storming/norming/performing]. What do we need to move through this stage together?" },
  { code: 6201, symbol: "CR", name: "Conscious Request", lens: "needs", category: "SAY & WRITE", examplePrompt: "Here's my specific request: Would you be willing to [concrete action] by [time]? It would meet my need for [need]." },
  { code: 6401, symbol: "PS", name: "Psychological Safety", lens: "needs", category: "FEEL & INTEND", examplePrompt: "I want you to feel safe being vulnerable here. Nothing you share will be used against you—I'm committed to that." },
  { code: 6402, symbol: "St", name: "Storge", lens: "needs", category: "FEEL & INTEND", examplePrompt: "I care about you like family. Your wellbeing matters to me beyond this work we're doing together." },
  { code: 6403, symbol: "Ma", name: "Mania", lens: "needs", category: "FEEL & INTEND", examplePrompt: "I notice intense feelings arising. Let me step back and check: are these feelings serving our connection or hijacking it?" },
  { code: 6404, symbol: "Er", name: "Eros", lens: "needs", category: "FEEL & INTEND", examplePrompt: "There's creative passion in this collaboration. How can we channel that energy into our shared vision?" },
  { code: 6405, symbol: "Ph", name: "Philia", lens: "needs", category: "FEEL & INTEND", examplePrompt: "I genuinely enjoy working with you. Our friendship makes this collaboration richer and more meaningful." },
  { code: 6406, symbol: "Lu", name: "Ludus", lens: "needs", category: "FEEL & INTEND", examplePrompt: "Can we approach this with more lightness and play? What would make this feel less heavy and more joyful?" },
];

// EGO LENS (🔵 BLUE #3399cc) - Code 7100
export const egoElements: PeriodicElement[] = [
  { code: 7101, symbol: "ET", name: "Ego Triggers", lens: "ego", examplePrompt: "I notice I'm triggered. Before I respond, let me name what's happening: I'm feeling [emotion] because my need for [need] isn't met." },
  { code: 7102, symbol: "DT", name: "Drama Triangle", lens: "ego", examplePrompt: "I see I'm playing [Victim/Persecutor/Rescuer]. Let me step out of this triangle and speak from authentic responsibility." },
  { code: 7103, symbol: "Ex", name: "Expressing", lens: "ego", examplePrompt: "I need to express something important. When you [behavior], I feel [emotion] because I need [need]. Would you hear me?" },
  { code: 7104, symbol: "CB", name: "Consciousness Barrier", lens: "ego", examplePrompt: "I'm aware there are perspectives I'm not seeing. What am I missing from where you stand?" },
  { code: 7105, symbol: "PB", name: "Permission Barrier", lens: "ego", examplePrompt: "I notice I'm waiting for permission to [action]. What would it take for me to give myself that permission?" },
  { code: 7106, symbol: "SB", name: "Sensorial Barrier", lens: "ego", examplePrompt: "We're experiencing this so differently. Can you describe what you're sensing that I might not be perceiving?" },
  { code: 7107, symbol: "LB", name: "Language Barrier", lens: "ego", examplePrompt: "I think we're using the same words but meaning different things. When you say [word], what do you mean?" },
  { code: 7108, symbol: "TB", name: "Tangibility Barrier", lens: "ego", examplePrompt: "This feels abstract to me. Can you give me a concrete example that would make it more tangible?" },
  { code: 7109, symbol: "EH", name: "Ego Hats", lens: "ego", category: "EGO ROLES", examplePrompt: "I notice I'm wearing my [Judge/Hero/Interpreter] hat. Would a different role serve us better right now?" },
  { code: 7110, symbol: "Ip", name: "Interpretor", lens: "ego", category: "EGO ROLES", examplePrompt: "Let me interpret what I think I'm hearing: you're saying [interpretation]. Did I get that right?" },
  { code: 7111, symbol: "Ig", name: "Interrogator", lens: "ego", category: "EGO ROLES", examplePrompt: "I'm going to ask some direct questions to understand this fully. Are you ready for that?" },
  { code: 7112, symbol: "Jd", name: "Judge", lens: "ego", category: "EGO ROLES", examplePrompt: "I notice I'm judging. Let me step back from evaluation and return to curiosity about your experience." },
  { code: 7113, symbol: "DA", name: "Devil's Advocate", lens: "ego", category: "EGO ROLES", examplePrompt: "Let me play devil's advocate for a moment—what if the opposite were true? How would that change things?" },
  { code: 7114, symbol: "Hr", name: "Hero", lens: "ego", category: "EGO ROLES", examplePrompt: "I notice I'm trying to rescue you. What if I trusted your capacity to solve this yourself? What support would actually help?" },
  { code: 7115, symbol: "Nr", name: "Narrator", lens: "ego", category: "EGO ROLES", examplePrompt: "Let me narrate what I'm observing: We started with [A], then moved to [B]. Now we're at [C]. Is that tracking with your experience?" },
  { code: 7116, symbol: "Hm", name: "Hermit", lens: "ego", category: "EGO ROLES", examplePrompt: "I need to withdraw and reflect before I can respond meaningfully. Can we return to this tomorrow?" },
  { code: 7117, symbol: "At", name: "Artisan", lens: "ego", category: "EGO ROLES", examplePrompt: "What if we crafted this conversation like art—paying attention to beauty, flow, and meaning as we build something together?" },
  { code: 7201, symbol: "In", name: "Informing", lens: "ego", category: "SAY & WRITE", examplePrompt: "Here's what I know about the situation: [facts]. Does this information help clarify things?" },
  { code: 7202, symbol: "BQ", name: "Blue Question", lens: "ego", category: "SAY & WRITE", examplePrompt: "Why did you decide to approach it that way? I'm trying to understand your reasoning." },
  { code: 7203, symbol: "Jg", name: "Judging", lens: "ego", category: "SAY & WRITE", examplePrompt: "I notice I'm about to judge. Instead, let me ask: what was important to you about that choice?" },
  { code: 7204, symbol: "Pj", name: "Projecting", lens: "ego", category: "SAY & WRITE", examplePrompt: "I realize I'm projecting my own [fear/assumption] onto you. Let me check: is this actually true for you?" },
  { code: 7205, symbol: "Ap", name: "Apologising", lens: "ego", category: "SAY & WRITE", examplePrompt: "I apologize for [specific behavior]. That didn't honor you, and I'll work to do better. What would help repair this?" },
  { code: 7206, symbol: "Sy", name: "Storytelling", lens: "ego", category: "SAY & WRITE", examplePrompt: "Let me share a story that illustrates this: [relevant narrative]. Does that resonate with your experience?" },
  { code: 7301, symbol: "BS", name: "Blue Silence", lens: "ego", category: "DO & MOVE", examplePrompt: "[Withdraw into reflective silence, perhaps looking away, to process internally before responding]" },
  { code: 7302, symbol: "BI", name: "Blue Intonation", lens: "ego", category: "DO & MOVE", examplePrompt: "[Speak in measured, analytical tone]: Let me think this through logically. First... second... third..." },
  { code: 7303, symbol: "BBL", name: "Blue Body-Language", lens: "ego", category: "DO & MOVE", examplePrompt: "[Cross arms thoughtfully, look upward]: I'm processing what you've said. Give me a moment to formulate my response." },
  { code: 7304, symbol: "BR", name: "Blue Rhythm", lens: "ego", category: "DO & MOVE", examplePrompt: "[Create deliberate pauses between thoughts]: Let's... take this... point by point... so we don't miss anything." },
  { code: 7305, symbol: "BT", name: "Blue Timing", lens: "ego", category: "DO & MOVE", examplePrompt: "I need time to process this before responding. Can I share my thoughts with you [specific time] after I've reflected?" },
  { code: 7401, symbol: "Ln", name: "Learning", lens: "ego", category: "FEEL & INTEND", examplePrompt: "What's the learning edge for me here? What is this situation trying to teach me that I've been resisting?" },
  { code: 7402, symbol: "Pg", name: "Pragmatism", lens: "ego", category: "FEEL & INTEND", examplePrompt: "Let's be pragmatic: given our constraints, what's the most practical path forward that still honors our values?" },
  { code: 7403, symbol: "Pl", name: "Philautia", lens: "ego", category: "FEEL & INTEND", examplePrompt: "I need to practice self-compassion here. What would I say to a dear friend in this situation?" },
  { code: 7404, symbol: "Eg", name: "Ego", lens: "ego", category: "FEEL & INTEND", examplePrompt: "I notice my ego is activated—wanting to be right, look good, or stay in control. What if I let that go?" },
  { code: 7405, symbol: "Gt", name: "Gratitude", lens: "ego", category: "FEEL & INTEND", examplePrompt: "Even in this difficulty, what can I appreciate? What am I grateful for in you, in me, in this moment?" },
  { code: 7406, symbol: "Rb", name: "Responsibilities", lens: "ego", category: "FEEL & INTEND", examplePrompt: "Let me own my part in this. I'm responsible for [specific actions/impact]. What are you responsible for?" },
];

// DYNAMICS LENS (🟣 PURPLE #666699) - Code 8100
export const dynamicsElements: PeriodicElement[] = [
  { code: 8101, symbol: "RD", name: "Relationship Dynamics", lens: "dynamics", examplePrompt: "What pattern keeps showing up between us? When I do [X], you tend to do [Y]. How can we shift this dynamic?" },
  { code: 8102, symbol: "CC", name: "Conscious Consent", lens: "dynamics", examplePrompt: "I want to make sure you're genuinely choosing this, not just complying. Do you feel a clear yes, or is there hesitation?" },
  { code: 8103, symbol: "YYP", name: "Yin Yang Polarity", lens: "dynamics", examplePrompt: "I notice when I bring more [assertive/receptive] energy, you mirror that or balance it. What serves our dynamic right now?" },
  { code: 8104, symbol: "RM", name: "Relationship Map", lens: "dynamics", examplePrompt: "Let's map out our relationship: What roles do we each play? What's working? What wants to evolve?" },
  { code: 8105, symbol: "RR", name: "Relationship Ritual", lens: "dynamics", examplePrompt: "What if we created a ritual for [check-ins/conflicts/celebrations]? What would help us stay connected through transitions?" },
  { code: 8201, symbol: "SN", name: "Saying No", lens: "dynamics", category: "SAY & WRITE", examplePrompt: "I need to say no to [request]. It's not aligned with my capacity right now, and I want to honor both of us by being honest." },
  { code: 8401, symbol: "Fg", name: "Forgiveness", lens: "dynamics", category: "FEEL & INTEND", examplePrompt: "I'm choosing to release my resentment about [situation]. Not because you earned it, but because holding it hurts me more than you." },
];

export const ALL_ELEMENTS: PeriodicElement[] = [
  ...influenceElements,
  ...attitudeElements,
  ...chaordicElements,
  ...flowElements,
  ...alignmentElements,
  ...needsElements,
  ...egoElements,
  ...dynamicsElements,
].sort((a, b) => a.code - b.code);

export const getElementByCode = (code: number): PeriodicElement | undefined => 
  ALL_ELEMENTS.find(el => el.code === code);

export const getElementsByLens = (lens: LensType): PeriodicElement[] => 
  ALL_ELEMENTS.filter(el => el.lens === lens);

export const getElementsByCategory = (category: string): PeriodicElement[] => 
  ALL_ELEMENTS.filter(el => el.category === category);
