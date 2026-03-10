import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { ArrowRight, Info, BookOpen, ChevronRight } from "lucide-react";
import { fadeInUp, fadeIn } from "@/lib/motion";

type Behavior = "green" | "blue" | "red" | "neutral";

interface Segment {
  text: string;
  behavior: Behavior;
  tooltip?: string;
}

interface Speech {
  id: string;
  title: string;
  speaker: string;
  date: string;
  location: string;
  context: string;
  paragraphs: Segment[][];
}

const BEHAVIOR_CONFIG: Record<Behavior, {
  label: string;
  shortLabel: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  example: string;
}> = {
  green: {
    label: "Green — Empathic Connection",
    shortLabel: "Green",
    color: "#2ECC71",
    bgColor: "rgba(46, 204, 113, 0.13)",
    borderColor: "rgba(46, 204, 113, 0.35)",
    description: "Focusing on the other person's feelings, needs or thoughts. Connected to empathy and building trust.",
    example: "\"I hear that you're frustrated...\" / \"How does that land for you?\""
  },
  blue: {
    label: "Blue — Informing & Expressing",
    shortLabel: "Blue",
    color: "#3498DB",
    bgColor: "rgba(52, 152, 219, 0.13)",
    borderColor: "rgba(52, 152, 219, 0.35)",
    description: "Sharing something that belongs to you — your knowledge, opinions, ideas, or story. Connected to storytelling and tangibility.",
    example: "\"In my experience...\" / \"What I've observed is...\""
  },
  red: {
    label: "Red — Influencing & Uniting",
    shortLabel: "Red",
    color: "#E74C3C",
    bgColor: "rgba(231, 76, 60, 0.13)",
    borderColor: "rgba(231, 76, 60, 0.35)",
    description: "Influencing and uniting around shared action — proposals, decisions, agreements, collective intelligence.",
    example: "\"Let us commit to...\" / \"Together we can...\""
  },
  neutral: {
    label: "Neutral",
    shortLabel: "",
    color: "rgba(255,255,255,0.7)",
    bgColor: "transparent",
    borderColor: "transparent",
    description: "Transition or context — not primarily one behaviour type.",
    example: ""
  }
};

const MANDELA_1994: Speech = {
  id: "mandela-pretoria-1994",
  speaker: "Nelson Mandela",
  title: "Presidential Inauguration Address",
  date: "10 May 1994",
  location: "Pretoria, South Africa",
  context: "Mandela's first speech as President of South Africa. A masterclass in GBR sequencing: opens with collective Red, moves through sustained Green (naming shared pain and gratitude), then closes with three consecutive Red declarations. Note how little Blue there is — for an inauguration, he chose connection and direction over information.",
  paragraphs: [
    [{ text: "Today, all of us do, by our presence here, and by our celebrations in other parts of our country and the world, confer glory and hope to newborn liberty.", behavior: "red", tooltip: "Red: Opens by framing the crowd as collective actors in a shared event. 'All of us' is the hallmark of Red — uniting around a shared action or agreement." }],
    [{ text: "Out of the experience of an extraordinary human disaster that lasted too long, must be born a society of which all humanity will be proud.", behavior: "red", tooltip: "Red: A collective vision for action. 'Must be born' is an invitation to shared commitment — he doesn't say 'I will build', he says 'must be born', making it everyone's responsibility." }],
    [{ text: "Our daily deeds as ordinary South Africans must produce an actual South African reality that will reinforce humanity's belief in justice, strengthen its confidence in the nobility of the human soul and sustain all our hopes for a glorious life for all.", behavior: "red", tooltip: "Red: A collective call to action grounded in shared deeds. 'Our daily deeds... must produce' — uniting people around shared responsibility and future." }],
    [{ text: "All this we owe both to ourselves and to the peoples of the world who are so well represented here today.", behavior: "green", tooltip: "Green: He acknowledges the international community — a Green move that shifts focus to the needs and presence of others, building connection and gratitude." }],
    [{ text: "To my compatriots, I have no hesitation in saying that each one of us is as intimately attached to the soil of this beautiful country as are the famous jacaranda trees of Pretoria and the mimosa trees of the bushveld.", behavior: "green", tooltip: "Green: Empathic — he connects his audience to a shared emotional bond with the land, naming a feeling they recognise in themselves. Deeply personal and other-focused." }],
    [
      { text: "Each time one of us touches the soil of this land, we feel a sense of personal renewal. ", behavior: "green", tooltip: "Green: Naming a shared emotional experience. Mandela focuses on the audience's inner life — a quintessential Green move, building trust through empathic recognition." },
      { text: "The national mood changes as the seasons change. ", behavior: "blue", tooltip: "Blue: A brief observational statement — he is sharing his own perspective and knowledge, informing the audience about something he has noticed. A Blue move within a Green passage." },
      { text: "We are moved by a sense of joy and exhilaration when the grass turns green and the flowers bloom.", behavior: "green", tooltip: "Green: Returns to shared feeling — naming the joy others feel. Empathic attunement: 'we are moved' acknowledges the collective emotional experience." }
    ],
    [{ text: "That spiritual and physical oneness we all share with this common homeland explains the depth of the pain we all carried in our hearts as we saw our country tear itself apart in a terrible conflict, and as we saw it spurned, outlawed and isolated by the peoples of the world, precisely because it has become the universal base of the pernicious ideology and practice of racism and racial oppression.", behavior: "green", tooltip: "Green: The longest Green passage. Mandela names collective pain, shared grief. This takes enormous courage — naming the wound before celebrating the victory. Classic empathic leadership." }],
    [{ text: "We, the people of South Africa, feel fulfilled that humanity has taken us back into its bosom, that we, who were outlaws not so long ago, have today been given the rare privilege to be host to the nations of the world on our own soil.", behavior: "green", tooltip: "Green: Shared feeling of belonging and being welcomed back. 'Feel fulfilled' continues to name the collective emotional experience, anchoring the speech in human feeling before moving to action." }],
    [
      { text: "We thank all our distinguished international guests for having come to take possession with the people of our country of what is, after all, ", behavior: "green", tooltip: "Green: Explicit acknowledgment and gratitude toward others — a textbook Green move recognising the needs and contribution of others." },
      { text: "a common victory for justice, for peace, for human dignity.", behavior: "red", tooltip: "Red: The framing of the collective outcome — 'a common victory' — shifts from Green gratitude to Red shared achievement." }
    ],
    [{ text: "We trust that you will continue to stand by us as we tackle the challenges of building peace, prosperity, non-sexism, non-racialism and democracy.", behavior: "red", tooltip: "Red: A forward-looking call to collective commitment. 'We trust that you will...' is a soft but powerful Red proposal — inviting the international community into a shared agreement." }],
    [
      { text: "We deeply appreciate the role that the masses of our people and their political mass democratic, religious, women, youth, business, traditional and other leaders have played to bring about this conclusion. ", behavior: "green", tooltip: "Green: Deep, specific appreciation for others' contribution. By naming every segment of society individually, Mandela makes each group feel seen — a sophisticated Green technique." },
      { text: "Not least among them is my Second Deputy President, the Honorable F.W. de Klerk.", behavior: "green", tooltip: "Green: Naming a former adversary in acknowledgment is perhaps the most radical Green move in the speech — it demonstrates conscious communication at its most demanding." }
    ],
    [{ text: "We would also like to pay tribute to our security forces, in all their ranks, for the distinguished role they have played in securing our first democratic elections and the transition to democracy, from blood-thirsty forces which still refuse to see the light.", behavior: "green", tooltip: "Green: Public tribute to another group — Mandela continues to focus outward, acknowledging others before claiming any credit for himself." }],
    [
      { text: "The time for the healing of the wounds has come. ", behavior: "red", tooltip: "Red: A declaration that creates a collective moment of commitment. Short, declarative, no subject — 'the time has come' is a collective agreement disguised as an observation." },
      { text: "The moment to bridge the chasms that divide us has come. ", behavior: "red", tooltip: "Red: The rhythm of these three Red sentences builds momentum. Mandela is using repetition as a Red technique to deepen shared commitment." },
      { text: "The time to build is upon us.", behavior: "red", tooltip: "Red: Three consecutive Red sentences at the close — intentional architecture. He ends in Red to launch action, not reflection." }
    ]
  ]
};

const JFK_1963: Speech = {
  id: "jfk-berlin-1963",
  speaker: "John F. Kennedy",
  title: "\"Ich bin ein Berliner\"",
  date: "26 June 1963",
  location: "West Berlin, Germany",
  context: "JFK's Berlin address is a study in Red rhetoric built on a Green foundation. He opens with sustained Green (honouring individuals by name), then unleashes one of the most powerful Red refrains in speech history — 'Let them come to Berlin.' The structural comparison with Mandela and Obama reveals a common architecture: great leaders earn the right to Red by doing the Green work first.",
  paragraphs: [
    [
      { text: "I am proud to come to this city as the guest of your distinguished Mayor, who has symbolized throughout the world the fighting spirit of West Berlin. ", behavior: "green", tooltip: "Green: JFK opens by naming and honouring the Mayor. He centres another person, not himself — a confident Green move that builds trust before authority." },
      { text: "And I am proud to visit the Federal Republic with your distinguished Chancellor who for so many years has committed Germany to democracy and freedom and progress, and to come here in the company of my fellow American, General Clay, who has been in this city during its great moments of crisis and will come again if ever needed.", behavior: "green", tooltip: "Green: Continues the Green opening by acknowledging three individuals by name: Mayor, Chancellor, and General Clay. He distributes the credit before making any claim for himself." }
    ],
    [
      { text: "Two thousand years ago, the proudest boast was 'civis Romanus sum.' ", behavior: "blue", tooltip: "Blue: Historical reference — sharing his own knowledge and perspective, informing the audience about a context that belongs to his intellectual frame." },
      { text: "Today, in the world of freedom, the proudest boast is 'Ich bin ein Berliner.'", behavior: "red", tooltip: "Red: The pivot from historical Blue to collective Red declaration. He connects the Roman identity to a new Berlin identity — a masterful collective unity statement." }
    ],
    [
      { text: "(I appreciate my interpreter translating my German.)", behavior: "green", tooltip: "Green: A small, warm acknowledgment. This humanising aside names the interpreter — another person — and breaks the formality with humour. Builds connection through Green." }
    ],
    [
      { text: "There are many people in the world who really don't understand, or say they don't, what is the great issue between the free world and the Communist world. ", behavior: "blue", tooltip: "Blue: JFK states his own perspective and context — informing the audience, sharing his view of the geopolitical landscape." },
      { text: "Let them come to Berlin.", behavior: "red", tooltip: "Red: The refrain arrives. Short, declarative, collective. 'Let them come' is an invitation to collective understanding — and a challenge." }
    ],
    [
      { text: "There are some who say that communism is the wave of the future. ", behavior: "blue", tooltip: "Blue: JFK continues to state opposing views — this is Blue (he's informing, representing others' positions before rebutting them)." },
      { text: "Let them come to Berlin.", behavior: "red", tooltip: "Red: The refrain repeated. Each repetition deepens the collective commitment. Rhetorical Red at its most powerful." }
    ],
    [
      { text: "And there are some who say, in Europe and elsewhere, we can work with the Communists. ", behavior: "blue", tooltip: "Blue: Another Blue statement of opposing views — using the Blue mode to set up the Red refrain." },
      { text: "Let them come to Berlin.", behavior: "red", tooltip: "Red: Third repetition. By now the crowd finishes it with him — the audience has been united into a single collective voice. This is Red communication as ritual." }
    ],
    [
      { text: "And there are even a few who say that it is true that communism is an evil system, but it permits us to make economic progress. ", behavior: "blue", tooltip: "Blue: The final Blue counter-argument — and the most uncomfortable one, addressing those who accept communism's economic case." },
      { text: "Lass' sie nach Berlin kommen. Let them come to Berlin.", behavior: "red", tooltip: "Red: JFK switches to German for the refrain — a supremely conscious choice. By delivering Red in the audience's own language, he becomes one of them. Cross-cultural unity." }
    ],
    [
      { text: "Freedom has many difficulties and democracy is not perfect. But we have never had to put a wall up to keep our people in — to prevent them from leaving us. ", behavior: "blue", tooltip: "Blue: JFK shares his own perspective on freedom and democracy — he is not just praising, he is being honest. This Blue frankness ('democracy is not perfect') builds credibility." },
      { text: "I want to say on behalf of my countrymen who live many miles away on the other side of the Atlantic, who are far distant from you, that they take the greatest pride, that they have been able to share with you, even from a distance, the story of the last 18 years.", behavior: "green", tooltip: "Green: Speaking on behalf of his countrymen to the Berliners — connecting two groups, bridging the Atlantic through empathic representation. Green at its most diplomatic." }
    ],
    [
      { text: "I know of no town, no city, that has been besieged for 18 years that still lives with the vitality and the force, and the hope, and the determination of the city of West Berlin.", behavior: "green", tooltip: "Green: An explicit and specific tribute to the resilience of the Berliners. By naming their qualities (vitality, force, hope, determination), he makes each person in the crowd feel seen." }
    ],
    [
      { text: "While the wall is the most obvious and vivid demonstration of the failures of the Communist system — for all the world to see — we take no satisfaction in it; for it is, as your Mayor has said, an offense not only against history but ", behavior: "blue", tooltip: "Blue: JFK states the political reality and his own interpretation — informing, sharing his perspective on the wall's meaning." },
      { text: "an offense against humanity, separating families, dividing husbands and wives and brothers and sisters, and dividing a people who wish to be joined together.", behavior: "green", tooltip: "Green: The pivot to Green — naming the human cost of the wall. Families, spouses, siblings. He moves from political Blue to human Green, making the abstract concrete through empathic listing." }
    ],
    [
      { text: "What is true of this city is true of Germany: Real, lasting peace in Europe can never be assured as long as one German out of four is denied the elementary right of free men, and that is to make a free choice. ", behavior: "blue", tooltip: "Blue: A political statement grounded in his own reasoning — JFK is informing, making an argument that belongs to his own intellectual frame." },
      { text: "In 18 years of peace and good faith, this generation of Germans has earned the right to be free, including the right to unite their families and their nation in lasting peace, with good will to all people.", behavior: "green", tooltip: "Green: Acknowledging what Germans have endured and earned — 18 years of effort. This Green affirmation validates the audience's sacrifice before the closing Red call." }
    ],
    [
      { text: "You live in a defended island of freedom, but your life is part of the main. So let me ask you, as I close, to lift your eyes beyond the dangers of today, to the hopes of tomorrow, beyond the freedom merely of this city of Berlin, or your country of Germany, to the advance of freedom everywhere, beyond the wall to the day of peace with justice, beyond yourselves and ourselves to all mankind.", behavior: "red", tooltip: "Red: The closing call begins. 'Let me ask you... to lift your eyes' is a collective invitation — JFK is proposing a shared direction and shared vision. The word 'beyond' repeated five times creates momentum." }
    ],
    [
      { text: "Freedom is indivisible, and when one man is enslaved, all are not free. ", behavior: "blue", tooltip: "Blue: JFK states a principle — his own philosophical position on freedom. This Blue statement gives intellectual grounding to the Red conclusion that follows." },
      { text: "When all are free, then we can look forward to that day when this city will be joined as one and this country and this great Continent of Europe in a peaceful and hopeful globe.", behavior: "red", tooltip: "Red: Collective vision — a future all present are invited into. 'We can look forward' is a shared act of imagination. Classic Red closing." }
    ],
    [
      { text: "When that day finally comes, as it will, the people of West Berlin can take sober satisfaction in the fact that they were in the front lines for almost two decades.", behavior: "green", tooltip: "Green: Before the final Red line, JFK returns to Green — acknowledging what the Berliners specifically will have achieved. He validates their sacrifice before the collective declaration. This Green pause makes the final Red hit harder." }
    ],
    [
      { text: "All free men, wherever they may live, are citizens of Berlin.", behavior: "red", tooltip: "Red: A universal collective identity declaration — the echo of 'Ich bin ein Berliner' at scale. JFK expands Berlin's identity to encompass all of humanity. The most powerful Red line in the speech." }
    ],
    [
      { text: "And, therefore, as a free man, I take pride in the words ", behavior: "blue", tooltip: "Blue: A brief personal declaration — 'as a free man, I...' — Blue before the final Red." },
      { text: "\"Ich bin ein Berliner.\"", behavior: "red", tooltip: "Red: The personal becomes collective. JFK ends by claiming the Berlin identity for himself — but in doing so, he confirms it for everyone. A perfect Green→Blue→Red sequence compressed into one sentence." }
    ]
  ]
};

const OBAMA_2008: Speech = {
  id: "obama-berlin-2008",
  speaker: "Barack Obama",
  title: "\"A World That Stands as One\"",
  date: "24 July 2008",
  location: "Berlin, Germany",
  context: "Obama spoke here 45 years after JFK — and deliberately echoed him. The GBR analysis reveals what changed: Obama uses far more Blue (historical context, personal narrative) in the middle than JFK did. He earns Red at the end through a longer Blue journey. Where JFK used a repeating Red refrain ('Let them come to Berlin'), Obama builds through history before arriving at his collective call. Same city. Same structure. Different generation's Blue.",
  paragraphs: [
    [
      { text: "Thank you to the citizens of Berlin and to the people of Germany. Let me thank Chancellor Merkel and Foreign Minister Steinmeier for welcoming me earlier today. Thank you, Mayor Wowereit, the Berlin Senate, the police, and most of all thank you for this welcome.", behavior: "green", tooltip: "Green: Obama mirrors JFK's opening exactly — he begins by acknowledging and thanking others by name. Three named individuals (Merkel, Steinmeier, Wowereit) before he says a word about himself. Green as the foundation of authority." }
    ],
    [
      { text: "I come to Berlin as so many of my countrymen have come before. Tonight, I speak to you not as a candidate for President, but as a citizen — a proud citizen of the United States, and a fellow citizen of the world.", behavior: "blue", tooltip: "Blue: Obama introduces himself — sharing who he is, how he frames his identity. 'Not as a candidate... but as a citizen' is a personal framing choice. This belongs to him — classic Blue." }
    ],
    [
      { text: "I know that I don't look like the Americans who previously have spoken in this great city. The journey that led me here is improbable. My mother was born in the heartland of America, but my father grew up herding goats in Kenya. His mother — my grandmother — was a cook, a domestic servant to the British.", behavior: "blue", tooltip: "Blue: Personal narrative — this entire passage belongs to Obama's own story. His family history, his improbable journey. Blue used as vulnerability and credibility-building before connecting to a larger Green theme." }
    ],
    [
      { text: "At the height of the Cold War, my father decided, like so many others in the forgotten corners of the world, that his yearning — his dream — required the freedom and opportunity promised by the West. And so he wrote letter after letter to universities all across America until somebody, somewhere answered his prayer for a better life.", behavior: "blue", tooltip: "Blue: Continues the father's story. This Blue passage is strategic — by narrating his father's journey to freedom, Obama connects his personal story to Berlin's own history of seeking freedom. Blue as a bridge to Green." }
    ],
    [
      { text: "That is why I'm here. And you are here because you know that your countries have more to offer the world. This city, of all cities, knows the dream of freedom.", behavior: "green", tooltip: "Green: The pivot from Blue (my story) to Green (your story). 'You are here because you know...' shifts from self to other — classic Green empathic connection that acknowledges the audience's own motivation." },
      { text: " And you know that the only reason we stand here tonight is because men and women from both of our nations came together to work, and struggle, and sacrifice for that better life.", behavior: "red", tooltip: "Red: The first collective framing — 'both of our nations came together' unites Americans and Germans in a shared historical act. Red building the ground for what follows." }
    ],
    [
      { text: "Ours is a partnership that has endured for more than six decades. After the war, the Germans and Americans make a pact — that they would stand together, and they would stand for the values that had allowed a remarkable place, full of energy, full of hope, and full of life, to arise from the rubble.", behavior: "blue", tooltip: "Blue: Historical context — Obama informs the audience about the post-war pact. This is his perspective on history, shared as knowledge. Blue used to establish shared context before the Red calls to action later." }
    ],
    [
      { text: "Look at Berlin, where Germans and Americans learned to work together and trust each other less than three years after facing each other on the field of battle.", behavior: "green", tooltip: "Green: 'Look at Berlin' as an invitation to acknowledge what Berliners achieved. Obama is honouring the city and its people — their reconciliation, their trust-building. Green as tribute." }
    ],
    [
      { text: "Look at Berlin, where the determination of a people met the generosity of the Marshall Plan and created a German miracle; where a victory over tyranny gave rise to NATO, the greatest alliance ever formed to defend our common security.", behavior: "red", tooltip: "Red: The same 'Look at Berlin' refrain shifts from Green tribute to Red collective achievement. 'Our common security' — this is collective framing. The repetition of 'Look at Berlin' consciously echoes JFK's 'Let them come to Berlin.'" }
    ],
    [
      { text: "Look at Berlin, where the bullet holes in the buildings and the somber stones near the Brandenburg Gate insist that we never forget our common humanity.", behavior: "green", tooltip: "Green: The most empathic 'Look at Berlin' — naming physical reminders of suffering, insisting on shared grief. Green as memory and moral witness." }
    ],
    [
      { text: "People of the world — look at Berlin! People of Berlin — look at the world!", behavior: "red", tooltip: "Red: The crescendo of the Berlin refrains — Obama expands the frame from city to world. 'People of the world' is a universal collective call, echoing JFK's 'All free men, wherever they may live, are citizens of Berlin.'" }
    ],
    [
      { text: "The terrorists of September 11th plotted in Hamburg and trained in Kandahar and Karachi before killing thousands from all over the globe on American soil. ", behavior: "blue", tooltip: "Blue: A factual, informational statement about the 9/11 attacks — Obama shares knowledge, his perspective on the interconnectedness of the threat. Blue as evidence." },
      { text: "As we speak, cars in Boston and factories in Beijing are melting the ice caps in the Arctic, shrinking coastlines in the Maldives and bringing drought to farms from Kansas to Kenya.", behavior: "blue", tooltip: "Blue: Scientific information — a Blue list of climate consequences grounded in his knowledge of the global situation. He is informing before inviting action." }
    ],
    [
      { text: "This is the moment when we must come together to save this planet. ", behavior: "red", tooltip: "Red: The first of Obama's closing Red calls. 'We must come together' is a collective call to action — proposing shared direction. The 'this is the moment' framing creates urgency." },
      { text: "Let us resolve that we will not leave our children a world where the oceans rise and famine spreads and terrible storms devastate our lands.", behavior: "red", tooltip: "Red: A collective resolution — 'let us resolve' is a quintessential Red proposal, inviting the audience into a shared commitment." }
    ],
    [
      { text: "Yes, there have been differences between America and Europe. No doubt, there will be differences in the future. But the burdens of global citizenship continue to bind us together.", behavior: "blue", tooltip: "Blue: Obama acknowledges the tensions honestly — this belongs to his own perspective. 'I know there are differences' is Blue candour, building credibility for the Red that follows." }
    ],
    [
      { text: "The walls between old allies on either side of the Atlantic cannot stand. The walls between the countries with the most and those with the least cannot stand. The walls between races and tribes, natives and immigrants, Christian and Muslim and Jew cannot stand.", behavior: "red", tooltip: "Red: Obama's most powerful Red sequence — a tripling of 'cannot stand' that directly echoes the Berlin Wall and JFK. Collective declaration of what must change. Red as shared refusal." }
    ],
    [
      { text: "These now are the walls we must tear down.", behavior: "red", tooltip: "Red: The simplest and most powerful line. One sentence. Collective imperative. The audience know exactly what walls he means — both literal and metaphorical. This is Red at its most distilled." }
    ],
    [
      { text: "People of Berlin, and people of the world, the scale of our challenge is great. The road ahead will be long. But I come before you to say that we are heirs to a struggle for freedom. We are a people of improbable hope. With an eye toward the future, with resolve in our hearts, let us remember this history, and answer our destiny, and remake the world once again.", behavior: "red", tooltip: "Red: The closing call — a cascade of Red propositions ('let us remember', 'answer our destiny', 'remake the world'). Note how Obama circles back to 'improbable hope' — connecting to his personal Blue narrative at the start. The speech has a complete GBR architecture." }
    ]
  ]
};

const ALL_SPEECHES: Speech[] = [MANDELA_1994, JFK_1963, OBAMA_2008];

function countBehaviors(speech: Speech) {
  let green = 0, blue = 0, red = 0, total = 0;
  speech.paragraphs.forEach(para => {
    para.forEach(seg => {
      const words = seg.text.trim().split(/\s+/).length;
      if (seg.behavior !== "neutral") {
        total += words;
        if (seg.behavior === "green") green += words;
        if (seg.behavior === "blue") blue += words;
        if (seg.behavior === "red") red += words;
      }
    });
  });
  return {
    green: total > 0 ? Math.round((green / total) * 100) : 0,
    blue: total > 0 ? Math.round((blue / total) * 100) : 0,
    red: total > 0 ? Math.round((red / total) * 100) : 0,
  };
}

function AnnotatedSegment({ segment, index }: { segment: Segment; index: number }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const config = BEHAVIOR_CONFIG[segment.behavior];

  if (segment.behavior === "neutral") {
    return <span>{segment.text}</span>;
  }

  return (
    <span className="relative inline">
      <span
        className="rounded px-0.5 cursor-help transition-colors duration-150"
        style={{
          color: config.color,
          backgroundColor: showTooltip ? config.bgColor : "transparent",
          borderBottom: `1.5px solid ${config.borderColor}`,
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        tabIndex={0}
        data-testid={`segment-${segment.behavior}-${index}`}
        aria-label={`${config.shortLabel} behaviour`}
      >
        {segment.text}
      </span>
      {showTooltip && segment.tooltip && (
        <span
          className="absolute z-50 left-0 top-full mt-1 w-72 max-w-[90vw] rounded-lg border p-3 text-sm shadow-xl pointer-events-none"
          style={{
            backgroundColor: "#111827",
            borderColor: config.borderColor,
            color: "#e5e7eb",
          }}
          role="tooltip"
        >
          <span className="block font-semibold mb-1" style={{ color: config.color }}>
            {config.shortLabel} behaviour
          </span>
          {segment.tooltip}
        </span>
      )}
    </span>
  );
}

function SpeechStats({ speech }: { speech: Speech }) {
  const stats = countBehaviors(speech);
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4" data-testid="stats-gbr-distribution">
      <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Behaviour distribution</p>
      <div className="space-y-2.5">
        {(["green", "blue", "red"] as const).map(b => (
          <div key={b} className="flex items-center gap-3">
            <span className="text-xs font-semibold w-10 shrink-0" style={{ color: BEHAVIOR_CONFIG[b].color }} data-testid={`stat-label-${b}`}>
              {BEHAVIOR_CONFIG[b].shortLabel}
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stats[b]}%` }}
                transition={{ duration: 0.7, delay: 0.1 }}
                style={{ backgroundColor: BEHAVIOR_CONFIG[b].color, opacity: 0.85 }}
                data-testid={`stat-bar-${b}`}
              />
            </div>
            <span className="text-white/65 text-xs w-8 text-right" data-testid={`stat-pct-${b}`}>{stats[b]}%</span>
          </div>
        ))}
      </div>
      <p className="text-white/60 text-xs mt-3 italic">Word-count weighted across annotated segments</p>
    </div>
  );
}

function BehaviorLegend() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4" data-testid="legend-gbr">
      <p className="text-white/50 text-xs uppercase tracking-widest mb-3">The GreenBlueRed model</p>
      <div className="space-y-4">
        {(["green", "blue", "red"] as const).map(b => {
          const c = BEHAVIOR_CONFIG[b];
          return (
            <div key={b}>
              <p className="font-semibold text-sm mb-0.5" style={{ color: c.color }}>{c.label}</p>
              <p className="text-white/55 text-xs leading-relaxed">{c.description}</p>
              {c.example && <p className="text-white/60 text-xs mt-1 italic">{c.example}</p>}
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-white/60 text-xs leading-relaxed">
          GreenBlueRed is a <span className="text-white/60">behavioural</span> model — it maps what you <em>say</em> and <em>do</em>, not who you <em>are</em>. The same person can move between all three.
        </p>
      </div>
    </div>
  );
}

function ComparisonBar() {
  const speeches = ALL_SPEECHES.map(s => ({ ...countBehaviors(s), label: s.speaker.split(" ").pop(), id: s.id }));
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4" data-testid="comparison-bar">
      <p className="text-white/50 text-xs uppercase tracking-widest mb-3">GBR comparison</p>
      <div className="space-y-3">
        {speeches.map(s => (
          <div key={s.id}>
            <p className="text-white/50 text-xs mb-1.5">{s.label}</p>
            <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
              <div style={{ width: `${s.green}%`, backgroundColor: BEHAVIOR_CONFIG.green.color, opacity: 0.8 }} />
              <div style={{ width: `${s.blue}%`, backgroundColor: BEHAVIOR_CONFIG.blue.color, opacity: 0.8 }} />
              <div style={{ width: `${s.red}%`, backgroundColor: BEHAVIOR_CONFIG.red.color, opacity: 0.8 }} />
            </div>
          </div>
        ))}
        <div className="flex gap-3 pt-1">
          {(["green", "blue", "red"] as const).map(b => (
            <div key={b} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: BEHAVIOR_CONFIG[b].color }} />
              <span className="text-white/60 text-xs">{BEHAVIOR_CONFIG[b].shortLabel}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DecodePage() {
  const [activeSpeechId, setActiveSpeechId] = useState<string>(MANDELA_1994.id);
  const activeSpeech = ALL_SPEECHES.find(s => s.id === activeSpeechId) || MANDELA_1994;

  return (
    <div
      className="min-h-screen pt-24 pb-16 relative"
      style={{ background: "linear-gradient(180deg, #060810 0%, #020305 40%, #000000 100%)" }}
    >
      <SEO
        title="Colour-Decode Famous Speeches | GreenBlueRed Communication Analysis | GreenElephant"
        description="See how the GreenBlueRed communication model maps onto Mandela, JFK, and Obama's most famous speeches. Discover which sentences build empathy, which inform, and which unite around action — and what that tells us about conscious communication."
        canonicalPath="/decode"
        keywords="GreenBlueRed model, communication behaviour analysis, Mandela speech decoded, JFK Berlin speech analysis, Obama communication style, green blue red communication, conscious communication examples, behaviour vs personality"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Speech Lab", url: "/decode" }
        ]}
        faqItems={[
          {
            question: "What is the GreenBlueRed communication model?",
            answer: "GreenBlueRed is a behavioural model of interpersonal communication. It identifies three communication behaviours: Green (empathic connection — focusing on others' feelings and needs), Blue (informing and expressing — sharing your own knowledge and opinions), and Red (influencing and uniting — proposals, decisions, and collective action). It is not a personality model."
          },
          {
            question: "Why analyse famous speeches this way?",
            answer: "Famous speeches are studied for what they say, but rarely for how they structure communication behaviours. The GreenBlueRed model reveals the invisible architecture behind great speeches — why they feel empathic, credible, and inspiring all at once."
          },
          {
            question: "What do the JFK and Obama Berlin speeches have in common?",
            answer: "Both were delivered in Berlin, both open with Green (acknowledging others), both build through Blue (historical context), and both close with Red (collective vision). The GBR analysis shows that great speakers across generations use the same structural architecture — even when they don't know the model."
          }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-10" initial="hidden" animate="visible" variants={fadeInUp}>
          <Badge className="mb-4 bg-white/10 backdrop-blur-sm border-white/20 text-white">Speech Lab</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
            Colour-Decoded Speeches
          </h1>
          <p className="text-lg text-white/65 max-w-2xl mx-auto">
            The GreenBlueRed model maps three communication behaviours in real speech.
            Hover over any coloured passage for the analysis.
            This proves the model is about <em>behaviour</em>, not personality.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          data-testid="speech-selector"
        >
          {ALL_SPEECHES.map(speech => (
            <button
              key={speech.id}
              onClick={() => setActiveSpeechId(speech.id)}
              className="px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200"
              style={activeSpeechId === speech.id ? {
                backgroundColor: "rgba(255,255,255,0.12)",
                borderColor: "rgba(255,255,255,0.3)",
                color: "#ffffff"
              } : {
                backgroundColor: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.5)"
              }}
              data-testid={`button-speech-${speech.id}`}
            >
              <span className="block font-semibold">{speech.speaker}</span>
              <span className="block text-xs opacity-70">{speech.date} · {speech.location.split(",")[0]}</span>
            </button>
          ))}
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSpeechId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <div
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8 mb-6"
                  data-testid="speech-header"
                >
                  <div className="flex flex-wrap items-start gap-3 mb-4">
                    <Badge className="bg-white/10 border-white/20 text-white/80 text-xs" data-testid="badge-speech-date">
                      {activeSpeech.date}
                    </Badge>
                    <Badge className="bg-white/10 border-white/20 text-white/80 text-xs" data-testid="badge-speech-location">
                      {activeSpeech.location}
                    </Badge>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-1" data-testid="text-speech-title">
                    {activeSpeech.speaker}
                  </h2>
                  <p className="text-white/55 text-base mb-4" data-testid="text-speech-subtitle">
                    {activeSpeech.title}
                  </p>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
                    <Info className="w-4 h-4 text-white/60 shrink-0 mt-0.5" />
                    <p className="text-white/65 text-sm leading-relaxed" data-testid="text-speech-context">
                      {activeSpeech.context}
                    </p>
                  </div>
                </div>

                <div
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8"
                  data-testid="speech-transcript"
                >
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
                    <BookOpen className="w-4 h-4 text-white/40" />
                    <span className="text-white/65 text-sm">Hover any coloured passage for the analysis</span>
                  </div>
                  <div className="text-white/80 leading-[1.95] text-[1.05rem] space-y-5" data-testid="speech-text">
                    {activeSpeech.paragraphs.map((para, pIdx) => (
                      <p key={pIdx} data-testid={`paragraph-${pIdx}`}>
                        {para.map((seg, sIdx) => (
                          <AnnotatedSegment key={sIdx} segment={seg} index={pIdx * 100 + sIdx} />
                        ))}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <aside className="w-full lg:w-72 shrink-0 space-y-4 lg:sticky lg:top-28" data-testid="sidebar-analysis">
            <SpeechStats speech={activeSpeech} />
            <ComparisonBar />
            <BehaviorLegend />
            <div className="rounded-xl border border-white/10 bg-white/5 p-4" data-testid="sidebar-cta">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Map your own style</p>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                These leaders use all three behaviours fluently. The Satellite Scan reveals your natural proportion across all 8 communication lenses.
              </p>
              <Link href="/scan">
                <Button className="w-full bg-needs text-white text-sm" data-testid="button-cta-scan">
                  Get your Satellite Scan
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/flow-check">
                <Button variant="outline" className="w-full mt-2 border-white/15 text-white/70 text-sm" data-testid="button-cta-flow-check">
                  Free Flow Check — 2 min
                </Button>
              </Link>
            </div>
          </aside>
        </div>

        <motion.div
          className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          data-testid="section-more-speeches"
        >
          <Badge className="mb-4 bg-white/10 border-white/20 text-white/70 text-xs">Coming soon</Badge>
          <h3 className="text-2xl font-bold text-white mb-3">More speeches in the lab</h3>
          <p className="text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
            MLK — "I Have a Dream" (1963) · Brené Brown TED talk · Steve Jobs Stanford commencement · Greta Thunberg at the UN.
            Each reveals a different GBR signature — and why that signature worked in that context.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
