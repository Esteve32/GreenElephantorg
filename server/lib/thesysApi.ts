import OpenAI from 'openai';
import { isConnectorEnabled } from './connectorGuard';

const thesysClient = new OpenAI({
  apiKey: process.env.THESYS_API_KEY,
  baseURL: 'https://api.thesys.dev/v1/embed'
});

export async function generateDashboardUI(prompt: string, data?: any) {
  if (!(await isConnectorEnabled("thesys"))) {
    console.log('⏸️ Thesys connector disabled — skipping dashboard UI generation');
    return 'Thesys connector is currently disabled. Enable it in Admin > Connected Tools.';
  }
  const systemPrompt = `You are a UI generator for GreenElephant's Conscious Communication dashboard. 
Generate clean, modern UI components that display communication lens data.
Use soft, muted colors appropriate for the communication lenses:
- Influence: #cc3333 (red)
- Attitude: #ff9933 (orange)  
- Chaordic: #ffcc00 (yellow)
- Flow: #cccc33 (green-yellow)
- Alignment: #669966 (sage green)
- Needs: #009999 (teal)
- Ego: #3399cc (blue)
- Wisdom: #663399 (purple)

When showing data, use cards, charts, or tables as appropriate.
Keep the design clean and professional with good spacing.`;

  const userMessage = data 
    ? `${prompt}\n\nHere is the data to visualize:\n${JSON.stringify(data, null, 2)}`
    : prompt;

  try {
    const response = await thesysClient.chat.completions.create({
      model: 'c1/anthropic/claude-sonnet-4/v-20250930',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Thesys API error:', error);
    throw error;
  }
}

export async function generateSocialCopy(): Promise<string> {
  if (!(await isConnectorEnabled("thesys"))) {
    console.log('⏸️ Thesys connector disabled — skipping social copy generation');
    throw new Error('Thesys connector is currently disabled. Enable it in Admin > Connected Tools.');
  }
  const systemPrompt = `You are a brand copywriter for GreenElephant.org — a Conscious Communication platform.

Write a LinkedIn "About" section for the GreenElephant.org company/organization page. It must:
- Write from the organization's perspective ("We" / "At GreenElephant"), NOT from any individual's perspective
- Position GreenElephant as a coaching, facilitation, and research platform for conscious communication
- Reference the Periodic Table of Conscious Communication with its 8 lenses: Influence (red), Attitude (orange), Chaordic (yellow), Flow (green-yellow), Alignment (sage green), Needs (teal), Ego (blue), and Dynamics (purple)
- Mention the Satellite Scan (communication profiling tool), Check-my-FLOW assessment, and Speech Lab (decoding hub)
- Reference the three core audiences: Executive Assistants, TEAL startup founders, and Design & Innovation students
- Include a call-to-action pointing to greenelephant.org
- Use first-person plural ("we"), warm and approachable tone — no buzzwords, no corporate clichés
- Hard limit: the ENTIRE response must be 2000 characters or fewer (this is the LinkedIn About section character limit)
- Do NOT include any markdown, headers, or formatting — just plain text paragraphs
- Do NOT wrap the text in quotes
- Do NOT mention any individual names (no Estève, no Anu) — speak as the organization`;

  try {
    const response = await thesysClient.chat.completions.create({
      model: 'c1/anthropic/claude-sonnet-4/v-20250930',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Write a fresh LinkedIn About section for the GreenElephant.org organization page. Keep it under 2000 characters total.' }
      ]
    });

    let content = response.choices[0]?.message?.content || '';

    const decodeEntities = (s: string) =>
      s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

    if (content.includes('<content thesys=')) {
      let inner = content.replace(/<content thesys="true">/g, '').replace(/<\/content>/g, '');
      inner = decodeEntities(inner);

      try {
        const parsed = JSON.parse(inner);
        const extractText = (obj: any): string => {
          if (typeof obj === 'string') return obj;
          if (!obj || typeof obj !== 'object') return '';
          if (obj.textMarkdown) return obj.textMarkdown;
          if (obj.text) return obj.text;
          if (obj.props) return extractText(obj.props);
          if (obj.children) {
            if (Array.isArray(obj.children)) return obj.children.map(extractText).filter(Boolean).join('\n\n');
            return extractText(obj.children);
          }
          if (obj.component) return extractText(obj);
          return Object.values(obj).map(v => extractText(v)).filter(Boolean).join('\n\n');
        };
        content = extractText(parsed);
      } catch {
        const mdMatch = inner.match(/"textMarkdown"\s*:\s*"((?:[^"\\]|\\.)*)"/);
        if (mdMatch) {
          content = mdMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\'/g, "'");
        } else {
          const textMatch = inner.match(/"text"\s*:\s*"((?:[^"\\]|\\.)*)"/);
          if (textMatch) {
            content = textMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\'/g, "'");
          }
        }
      }
    }

    content = content.replace(/\\n/g, '\n').trim();

    if (content.length > 2000) {
      content = content.substring(0, 1997) + '...';
    }
    return content;
  } catch (error) {
    console.error('Thesys API error (social copy):', error);
    throw error;
  }
}

const LENS_ROTATION: Record<number, { name: string; hexColor: string; code: number; description: string }> = {
  1: { name: "Influence", hexColor: "#cc3333", code: 1100, description: "How you exert influence with integrity" },
  2: { name: "Attitude", hexColor: "#ff9933", code: 2100, description: "Your stance toward change and growth" },
  3: { name: "Chaordic", hexColor: "#ffcc00", code: 3100, description: "Order in creative chaos" },
  4: { name: "Flow", hexColor: "#cccc33", code: 4100, description: "Sensing flow in conversations" },
  5: { name: "Alignment", hexColor: "#669966", code: 5100, description: "Building empathy and shared understanding" },
  6: { name: "Energy & Needs", hexColor: "#009999", code: 6100, description: "Honoring your energy and core needs" },
  7: { name: "Ego", hexColor: "#3399cc", code: 7100, description: "Recognizing and loosening ego patterns" },
  8: { name: "Dynamics", hexColor: "#663399", code: 8100, description: "Understanding relationship dynamics" },
  9: { name: "Influence", hexColor: "#cc3333", code: 1100, description: "How you exert influence with integrity" },
  10: { name: "Attitude", hexColor: "#ff9933", code: 2100, description: "Your stance toward change and growth" },
  11: { name: "Chaordic", hexColor: "#ffcc00", code: 3100, description: "Order in creative chaos" },
  12: { name: "Flow", hexColor: "#cccc33", code: 4100, description: "Sensing flow in conversations" },
};

export function getCurrentLens() {
  const month = new Date().getMonth() + 1;
  return LENS_ROTATION[month] || LENS_ROTATION[1];
}

const GBR_FRAMEWORK = `The GreenBlueRed (GBR) Framework:
- GREEN = Other-focused: empathy, naming feelings/needs, building trust, asking about the other person
- BLUE = Self-focused: informing, sharing knowledge/opinions/ideas/stories, expressing your perspective  
- RED = Shared-focused: influencing, uniting, proposing agreements, collective action, shared decisions

The Periodic Table of Conscious Communication has 146 elements across 8 lenses:
1. Influence (#cc3333) — exerting influence with integrity
2. Attitude (#ff9933) — stance toward change and growth
3. Chaordic (#ffcc00) — order in creative chaos
4. Flow (#cccc33) — sensing flow in conversations
5. Alignment (#669966) — building empathy and shared understanding
6. Energy & Needs (#009999) — honoring energy and core needs
7. Ego (#3399cc) — recognizing and loosening ego patterns
8. Dynamics (#663399) — understanding relationship dynamics`;

const BRAND_CONTEXT = `GreenElephant.org is a Conscious Communication platform. 
Target audiences: Executive Assistants (EAs), TEAL startup founders, Design & Innovation students.
Tools: Satellite Scan (communication profiling), Check-my-FLOW (flow-state diagnostic), Speech Lab (GBR decode hub).
Tone: warm, grounded, evidence-based, never preachy. Academic roots but accessible language.`;

function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^\s*[-*+]\s/gm, '- ')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
    .trim();
}

function normalizePollOutput(raw: string): string {
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (parsed && parsed.question && Array.isArray(parsed.options)) {
      const lines = [
        `QUESTION: ${parsed.question}`,
        '',
        ...parsed.options.map((opt: string, i: number) => `${String.fromCharCode(65 + i)}) ${opt}`),
        '',
        `CONTEXT: ${parsed.context || ''}`,
      ];
      return lines.join('\n');
    }
  } catch {
    // not JSON — try to parse nested JSON from string
    const nestedJson = raw.match(/\{[\s\S]*"question"[\s\S]*"options"[\s\S]*\}/);
    if (nestedJson) {
      try {
        const parsed = JSON.parse(nestedJson[0]);
        if (parsed.question && Array.isArray(parsed.options)) {
          const lines = [
            `QUESTION: ${parsed.question}`,
            '',
            ...parsed.options.map((opt: string, i: number) => `${String.fromCharCode(65 + i)}) ${opt}`),
            '',
            `CONTEXT: ${parsed.context || ''}`,
          ];
          return lines.join('\n');
        }
      } catch { /* fall through */ }
    }
  }

  if (raw.includes('QUESTION:') || raw.match(/[A-D]\)/)) {
    return stripMarkdown(raw);
  }

  return stripMarkdown(raw);
}

export async function generateLinkedInPoll(
  topicContext: string,
): Promise<{ question: string; options: string[]; context: string }> {
  if (!(await isConnectorEnabled("thesys"))) {
    throw new Error('Thesys connector is currently disabled. Enable it in Admin > Connected Tools.');
  }

  const lens = getCurrentLens();
  const monthName = new Date().toLocaleString('en', { month: 'long' });

  const systemPrompt = `You are a LinkedIn engagement strategist for GreenElephant.org, a Conscious Communication platform.

${GBR_FRAMEWORK}

${BRAND_CONTEXT}

Your job is to create a LinkedIn poll that sparks professional conversation about communication, leadership, and human connection — tied to the current lens and current global events.`;

  const userMessage = `Create a LinkedIn poll for the GreenElephant company page.

Current month: ${monthName} 2026
Current lens: ${lens.name} — "${lens.description}"

Additional context: ${topicContext}

Think about current news, geopolitical trends, workplace shifts, and how they connect to the ${lens.name} lens and conscious communication themes from the GreenElephant webinars.

IMPORTANT: Respond with ONLY this JSON and nothing else — no markdown, no code fences:
{
  "question": "The poll question (max 140 characters)",
  "options": ["Option A (max 30 chars)", "Option B (max 30 chars)", "Option C (max 30 chars)", "Option D (max 30 chars)"],
  "context": "2-3 sentences to post above the poll that provide context, spark curiosity, and tie back to the ${lens.name} lens. Plain text, no markdown."
}`;

  try {
    const response = await thesysClient.chat.completions.create({
      model: 'c1/anthropic/claude-sonnet-4/v-20250930',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    });

    let content = response.choices[0]?.message?.content || '';

    if (content.includes('<content thesys=')) {
      content = content.replace(/<content thesys="true">/g, '').replace(/<\/content>/g, '');
      content = content.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    }

    const jsonMatch = content.match(/\{[\s\S]*"question"[\s\S]*"options"[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        question: String(parsed.question || '').slice(0, 140),
        options: (parsed.options || []).slice(0, 4).map((o: string) => String(o).slice(0, 30)),
        context: stripMarkdown(String(parsed.context || '')),
      };
    }

    throw new Error('Could not parse poll response from AI');
  } catch (error) {
    console.error('Thesys API error (poll):', error);
    throw error;
  }
}

export async function generateElementPrompt(
  elementCode: number,
  elementName: string,
  elementSymbol: string,
  elementLens: string,
  elementCategory: string,
  elementDescription: string,
  existingPrompt: string,
  roleCategory: string,
  customInstructions: string
): Promise<{
  title: string;
  description: string;
  whatItDoes: string[];
  perfectFor: string;
  promptContent: string;
}> {
  if (!(await isConnectorEnabled("thesys"))) {
    throw new Error('Thesys connector is currently disabled. Enable it in Admin > Connected Tools.');
  }

  const lens = getCurrentLens();

  const systemPrompt = `You are a prompt engineer and communication coach for GreenElephant.org's Periodic Table of Conscious Communication.

${GBR_FRAMEWORK}

${BRAND_CONTEXT}

Your job is to create a high-quality prompt library entry for a specific element from the Periodic Table. Each prompt should help users (EAs, TEAL founders, Design students) practice conscious communication using this element.

The prompt you create will be added to the Prompt Library on greenelephant.org, where users can copy-paste it into AI tools (like ChatGPT) to get personalised communication coaching.`;

  const userMessage = `Create a prompt library entry for this Periodic Table element:

ELEMENT: ${elementName} (${elementSymbol}, code ${elementCode})
LENS: ${elementLens}
CATEGORY: ${elementCategory || 'General'}
DESCRIPTION: ${elementDescription || 'No description available'}
EXISTING EXAMPLE PROMPT: ${existingPrompt || 'None'}
TARGET AUDIENCE: ${roleCategory === 'all' ? 'All audiences' : roleCategory === 'EA' ? 'Executive Assistants' : roleCategory === 'ACX' ? 'ACX Prompt Engineers' : 'Teal Organization Leaders'}
CURRENT MONTH LENS: ${lens.name} — "${lens.description}"

${customInstructions ? `CUSTOM INSTRUCTIONS FROM ADMIN:\n${customInstructions}\n` : ''}

IMPORTANT: Respond with EXACTLY this JSON and nothing else — no markdown, no code fences:
{
  "title": "A compelling title for this prompt (e.g., 'Deep Influence Pattern Analysis', 'Flow State Communication Audit'). Keep it specific to this element.",
  "description": "A 1-2 sentence description of what this prompt helps users do. Written in plain language for the website.",
  "whatItDoes": ["First thing this prompt does", "Second thing", "Third thing", "Fourth thing (optional)", "Fifth thing (optional)"],
  "perfectFor": "Describe the ideal scenario when someone would use this prompt. Be specific about the user's situation.",
  "promptContent": "The full AI prompt template (200-400 words). This is what users will copy into ChatGPT or similar. It should:\\n- Reference the ${elementName} element and its concepts\\n- Include [[DATA_START]] and [[DATA_END]] markers where users paste their Satellite Scan data\\n- Ask the AI to analyse communication patterns through the ${elementLens} lens\\n- Provide specific, actionable coaching advice\\n- Use warm, grounded, evidence-based language (never preachy)\\n- End with a micro-habit suggestion tied to the element"
}`;

  try {
    const response = await thesysClient.chat.completions.create({
      model: 'c1/anthropic/claude-sonnet-4/v-20250930',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    });

    let content = response.choices[0]?.message?.content || '';

    if (content.includes('<content thesys=')) {
      content = content.replace(/<content thesys="true">/g, '').replace(/<\/content>/g, '');
      content = content.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    }

    const jsonMatch = content.match(/\{[\s\S]*"title"[\s\S]*"promptContent"[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        title: stripMarkdown(String(parsed.title || elementName)),
        description: stripMarkdown(String(parsed.description || '')),
        whatItDoes: Array.isArray(parsed.whatItDoes) ? parsed.whatItDoes.map((s: string) => stripMarkdown(s)) : ['Analyses communication patterns'],
        perfectFor: stripMarkdown(String(parsed.perfectFor || '')),
        promptContent: String(parsed.promptContent || ''),
      };
    }

    throw new Error('Could not parse prompt response from AI');
  } catch (error) {
    console.error('Thesys API error (element prompt):', error);
    throw error;
  }
}

export async function generateFlywheelContent(
  generatorType: 'headlines' | 'ai-gap' | 'workplace' | 'case-study',
  customPrompt: string,
  pipelineContext: string
): Promise<{ article: string; poll: string; artDirection: string }> {
  if (!(await isConnectorEnabled("thesys"))) {
    throw new Error('Thesys connector is currently disabled. Enable it in Admin > Connected Tools.');
  }

  const lens = getCurrentLens();
  const monthName = new Date().toLocaleString('en', { month: 'long' });

  const generatorPrompts: Record<string, string> = {
    headlines: `You are a communication analyst for GreenElephant.org. Your task is to find a CURRENT, trending speech, press conference, CEO statement, or political address from the news and decode it through the GBR (Green-Blue-Red) framework.

This month's lens is ${lens.name} (${lens.hexColor}, code ${lens.code}): "${lens.description}". Weave this lens angle into your analysis.

${GBR_FRAMEWORK}

${BRAND_CONTEXT}

${pipelineContext ? `Current priorities from the GreenElephant Pipeline OS:\n${pipelineContext}\n\nWeave relevant priorities into the content angle where natural.` : ''}

The user may have customised the prompt below. Follow their instructions but always produce the required output format.`,

    'ai-gap': `You are a thought-leadership writer for GreenElephant.org. Your task is to write about what humans can do in communication that AI cannot — tied to the current month's lens.

This month's lens is ${lens.name} (${lens.hexColor}, code ${lens.code}): "${lens.description}". The piece should demonstrate why this specific human communication skill matters MORE in an AI-saturated world.

${GBR_FRAMEWORK}

${BRAND_CONTEXT}

${pipelineContext ? `Current priorities from the GreenElephant Pipeline OS:\n${pipelineContext}\n\nWeave relevant priorities into the content angle where natural.` : ''}

The user may have customised the prompt below. Follow their instructions but always produce the required output format.`,

    workplace: `You are a workplace communication coach for GreenElephant.org. Your task is to create a practical, real-world workplace scenario that EAs, VAs, and team leads face — decode it through GBR, and provide a conscious rewrite.

This month's lens is ${lens.name} (${lens.hexColor}, code ${lens.code}): "${lens.description}". Tie the scenario to a current workplace trend (return-to-office, async communication, generational tension, AI-augmented teams, etc.).

${GBR_FRAMEWORK}

${BRAND_CONTEXT}

${pipelineContext ? `Current priorities from the GreenElephant Pipeline OS:\n${pipelineContext}\n\nWeave relevant priorities into the content angle where natural.` : ''}

The user may have customised the prompt below. Follow their instructions but always produce the required output format.`,

    'case-study': `You are a case study writer for GreenElephant.org. Your task is to create a compelling client transformation narrative from a Satellite Scan coaching journey — showing before/after communication patterns, key breakthroughs, and quotable outcomes.

This month's lens is ${lens.name} (${lens.hexColor}, code ${lens.code}): "${lens.description}". The case study should highlight transformation through this specific lens.

${GBR_FRAMEWORK}

${BRAND_CONTEXT}

${pipelineContext ? `Current priorities from the GreenElephant Pipeline OS:\n${pipelineContext}\n\nWeave relevant priorities into the narrative where natural.` : ''}

IMPORTANT: All client names must be fictional but realistic. The case study should feel authentic — include specific metrics (team feedback scores, meeting efficiency improvements, conflict reduction percentages), direct quotes from the "client", and a clear before→intervention→after arc. Output should work as both a LinkedIn article and website testimonial page copy.

The user may have customised the prompt below. Follow their instructions but always produce the required output format.`
  };

  const systemPrompt = generatorPrompts[generatorType] || generatorPrompts.headlines;

  const userMessage = `${customPrompt}

IMPORTANT: You MUST respond with EXACTLY this JSON structure and nothing else. No markdown, no code fences, just raw JSON:
{
  "article": "A LinkedIn article draft (800-1200 words) for Esteve Pannetier's personal LinkedIn profile. CRITICAL FORMATTING RULES: Do NOT use markdown. No #, ##, **, *, or backticks. Use PLAIN TEXT only — LinkedIn does not render markdown. Use ALL CAPS or line breaks for emphasis instead. Use line breaks between paragraphs. Include a compelling hook on the first line, GBR analysis with specific element references, and end with a call-to-action pointing to greenelephant.org. Month: ${monthName}. Lens: ${lens.name}.",
  "poll": "A LinkedIn poll for the GreenElephant company page. Return a JSON object (nested inside this string as valid JSON) with exactly these keys: {question: string (max 140 chars), options: [string, string, string, string] (each max 30 chars), context: string (2-3 sentences to post above the poll)}. The poll must relate to the article topic and the ${lens.name} lens.",
  "artDirection": "Two Canva visual suggestions in PLAIN TEXT (no markdown). Separate with a blank line.\\n\\nFOR ANU (photo composite): Describe a professional photo concept using Anu's face/portrait with a situational background that fits the content topic. Be specific about mood, colors, overlays.\\n\\nFOR ESTEVE (hand-sketch): Describe a whiteboard/hand-drawn style diagram, framework visualization, or 'How Might We' design question. Reference specific GBR elements or lens concepts. Think theoretical, academic, visual."
}`;

  try {
    const response = await thesysClient.chat.completions.create({
      model: 'c1/anthropic/claude-sonnet-4/v-20250930',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    });

    let content = response.choices[0]?.message?.content || '';

    if (content.includes('<content thesys=')) {
      content = content.replace(/<content thesys="true">/g, '').replace(/<\/content>/g, '');
      content = content.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    }

    const jsonMatch = content.match(/\{[\s\S]*"article"[\s\S]*"poll"[\s\S]*"artDirection"[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        const article = stripMarkdown(parsed.article || '');
        const artDirection = stripMarkdown(parsed.artDirection || '');
        const poll = normalizePollOutput(parsed.poll || '');
        return { article, poll, artDirection };
      } catch {
        // fall through
      }
    }

    return {
      article: stripMarkdown(content),
      poll: 'Could not parse poll — see article for full output.',
      artDirection: 'Could not parse art direction — see article for full output.'
    };
  } catch (error) {
    console.error('Thesys API error (flywheel):', error);
    throw error;
  }
}

export async function generateSeoSuggestions(
  generatorType: string,
  contentSummary: string
): Promise<{ keywords: string[]; faqItems: Array<{ question: string; answer: string }>; internalLinks: string[]; targetPage: string }> {
  if (!(await isConnectorEnabled("thesys"))) {
    throw new Error('Thesys connector is currently disabled.');
  }

  const lens = getCurrentLens();

  const systemPrompt = `You are an SEO/GEO specialist for GreenElephant.org — a Conscious Communication platform.
Your job is to analyse content that was just generated and suggest SEO improvements for the website.

${GBR_FRAMEWORK}

The site has these key pages:
- /scan — Satellite Scan (communication profiling tool)
- /flow-check — Check-my-FLOW assessment
- /decode — Speech Lab / Decoding Hub
- /periodic-table — Periodic Table of Conscious Communication
- /coaching — Coaching services
- /webinar — Monthly lens webinars
- /connect — Contact page

Current month's lens: ${lens.name} (${lens.description})`;

  const userMessage = `Analyse this content and suggest SEO improvements:

${contentSummary}

Respond with EXACTLY this JSON structure, no markdown, no code fences:
{
  "keywords": ["keyword1", "keyword2", "long-tail phrase 1", "long-tail phrase 2"],
  "faqItems": [
    {"question": "A natural question someone might search", "answer": "A concise, informative answer (2-3 sentences)"}
  ],
  "internalLinks": ["Brief suggestion for which pages should cross-link to this topic"],
  "targetPage": "/decode"
}

Provide 6-10 keywords (mix of short and long-tail), 2-3 FAQ items, and 2-3 internal linking suggestions. The targetPage should be the most relevant existing page.`;

  try {
    const response = await thesysClient.chat.completions.create({
      model: 'c1/anthropic/claude-sonnet-4/v-20250930',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    });

    let content = response.choices[0]?.message?.content || '';
    if (content.includes('<content thesys=')) {
      content = content.replace(/<content thesys="true">/g, '').replace(/<\/content>/g, '');
      content = content.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    }

    const jsonMatch = content.match(/\{[\s\S]*"keywords"[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch { /* fall through */ }
    }

    return { keywords: [], faqItems: [], internalLinks: [], targetPage: '/decode' };
  } catch (error) {
    console.error('Thesys API error (SEO):', error);
    throw error;
  }
}

export async function generatePMFAssumptions(
  targetingCategories: Record<string, string>,
  customContext: string
): Promise<{
  assumptions: Array<{
    id: string;
    hypothesis: string;
    targetSegment: string;
    painPoint: string;
    linkedinFilters: Record<string, string>;
    confidence: string;
    testMethod: string;
  }>;
  pmfIndicators: {
    painsWorthSolving: string[];
    tensionsUnresolved: string[];
    trends: string[];
  };
}> {
  if (!(await isConnectorEnabled("thesys"))) {
    throw new Error('Thesys connector is currently disabled. Enable it in Admin > Connected Tools.');
  }

  const lens = getCurrentLens();

  const systemPrompt = `You are a Product-Market Fit strategist for GreenElephant.org — a Conscious Communication coaching platform.

${BRAND_CONTEXT}

Your job is to generate PMF hypotheses that can be immediately tested using LinkedIn targeting. Each hypothesis should map to specific LinkedIn filter categories.

LinkedIn Free Plan filters: Location, Industry, Company Size, Job Title, School, Connection degree
LinkedIn Sales Navigator filters: Seniority Level, Years in Position, Function, Company Headcount, Revenue, Technologies Used, Groups, Posted on LinkedIn in last 30 days

Current month lens: ${lens.name} — "${lens.description}"`;

  const userMessage = `Generate 4-6 PMF assumptions for GreenElephant's Conscious Communication services.

Targeting criteria provided:
${Object.entries(targetingCategories).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

Additional context: ${customContext || 'None provided'}

IMPORTANT: Respond with ONLY this JSON and nothing else — no markdown, no code fences:
{
  "assumptions": [
    {
      "id": "PMF-001",
      "hypothesis": "A clear PMF hypothesis statement",
      "targetSegment": "Who this targets",
      "painPoint": "The specific pain this addresses",
      "linkedinFilters": {"Location": "value", "Industry": "value", "Job Title": "value"},
      "confidence": "High/Medium/Low",
      "testMethod": "How to validate this assumption"
    }
  ],
  "pmfIndicators": {
    "painsWorthSolving": ["pain 1", "pain 2", "pain 3"],
    "tensionsUnresolved": ["tension 1", "tension 2"],
    "trends": ["trend 1", "trend 2", "trend 3"]
  }
}`;

  try {
    const response = await thesysClient.chat.completions.create({
      model: 'c1/anthropic/claude-sonnet-4/v-20250930',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    });

    let content = response.choices[0]?.message?.content || '';

    if (content.includes('<content thesys=')) {
      content = content.replace(/<content thesys="true">/g, '').replace(/<\/content>/g, '');
      content = content.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    }

    const jsonMatch = content.match(/\{[\s\S]*"assumptions"[\s\S]*"pmfIndicators"[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Could not parse PMF assumptions from AI response');
  } catch (error) {
    console.error('Thesys API error (PMF):', error);
    throw error;
  }
}

export async function generateLeadListSuggestions(
  calibration: { why: string; what: string; how: string },
  filters: Record<string, string>
): Promise<{
  leads: Array<{
    name: string;
    title: string;
    company: string;
    linkedinProfile: string;
    email: string;
    source: string;
    fitScore: string;
  }>;
  dataSources: string[];
  refinementTips: string[];
}> {
  if (!(await isConnectorEnabled("thesys"))) {
    throw new Error('Thesys connector is currently disabled. Enable it in Admin > Connected Tools.');
  }

  const lens = getCurrentLens();

  const systemPrompt = `You are a B2B lead research strategist for GreenElephant.org — a Conscious Communication platform.

${BRAND_CONTEXT}

Your job is to generate a qualified prospecting list based on calibration inputs and LinkedIn targeting filters. For each lead entry, provide:
1. A specific, real company name that matches the targeting criteria (use publicly known companies)
2. The exact job title to search for at that company
3. A working LinkedIn search URL that will find this role at this company
4. The recommended prospecting tool to find the contact's email
5. A fit score based on how closely the company/role matches the calibration inputs

Use your knowledge of real companies, industries, and organizational structures to generate actionable leads. Recommend the best real data source for each lead:
- LinkedIn Free Search: boolean search URL for the specific company + title
- LinkedIn Sales Navigator: for advanced lead filters
- Apollo.io: for verified B2B email lookup
- ZoomInfo: for org chart and direct dial lookup
- Hunter.io: for domain-based email discovery
- Crunchbase: for startup funding stage verification

Current month lens: ${lens.name} — "${lens.description}"`;

  const userMessage = `Generate a qualified prospecting list based on these calibration inputs:

WHY (purpose of outreach): ${calibration.why}
WHAT (what we're offering): ${calibration.what}
HOW (outreach channel/method): ${calibration.how}

LinkedIn targeting filters:
${Object.entries(filters).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

IMPORTANT: Use REAL company names that match the filters. Generate actionable entries the user can immediately search. Respond with ONLY this JSON and nothing else:
{
  "leads": [
    {
      "name": "Head of L&D at Siemens",
      "title": "Head of Learning & Development",
      "company": "Siemens AG",
      "linkedinProfile": "https://www.linkedin.com/search/results/people/?keywords=Head%20of%20Learning%20Siemens",
      "email": "Use Hunter.io with domain siemens.com",
      "source": "LinkedIn Free Search + Hunter.io",
      "fitScore": "High"
    }
  ],
  "dataSources": ["Apollo.io — verified B2B emails, filter by title + industry", "LinkedIn Sales Navigator — saved lead searches with seniority filters", "Hunter.io — find emails by company domain"],
  "refinementTips": ["Tip for improving targeting accuracy using the recommended sources"]
}`;

  try {
    const response = await thesysClient.chat.completions.create({
      model: 'c1/anthropic/claude-sonnet-4/v-20250930',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    });

    let content = response.choices[0]?.message?.content || '';

    if (content.includes('<content thesys=')) {
      content = content.replace(/<content thesys="true">/g, '').replace(/<\/content>/g, '');
      content = content.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    }

    const jsonMatch = content.match(/\{[\s\S]*"leads"[\s\S]*"dataSources"[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Could not parse lead list from AI response');
  } catch (error) {
    console.error('Thesys API error (leads):', error);
    throw error;
  }
}

export async function generateJourneyAIResponse(
  journeyStage: string,
  stageData: any,
  userQuestion: string
): Promise<string> {
  if (!(await isConnectorEnabled("thesys"))) {
    throw new Error('Thesys connector is currently disabled. Enable it in Admin > Connected Tools.');
  }

  const systemPrompt = `You are a growth analytics advisor for GreenElephant.org — a Conscious Communication platform.

${BRAND_CONTEXT}

You help the admin ("steward") understand their customer journey funnel metrics, validate data, spot anomalies, and suggest improvements. You have access to data from Notion CRM, Google Sheets, Stripe, Typeform, and the internal database.

Be concise, actionable, and data-driven. Use plain language. Reference specific numbers from the data provided. If you don't have enough data to answer confidently, say so.`;

  const userMessage = `The steward is asking about the "${journeyStage}" stage of the customer journey funnel.

Here is the current data for this stage:
${JSON.stringify(stageData, null, 2)}

Steward's question: ${userQuestion}

Provide a helpful, concise answer (2-4 paragraphs max). Reference specific metrics. If relevant, suggest what to track or improve.`;

  try {
    const response = await thesysClient.chat.completions.create({
      model: 'c1/anthropic/claude-sonnet-4/v-20250930',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    });

    let content = response.choices[0]?.message?.content || '';

    if (content.includes('<content thesys=')) {
      content = content.replace(/<content thesys="true">/g, '').replace(/<\/content>/g, '');
      content = content.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    }

    return stripMarkdown(content);
  } catch (error) {
    console.error('Thesys API error (journey AI):', error);
    throw error;
  }
}

export async function streamDashboardUI(prompt: string, data?: any) {
  if (!(await isConnectorEnabled("thesys"))) {
    throw new Error('Thesys connector is currently disabled. Enable it in Admin > Connected Tools.');
  }
  const systemPrompt = `You are a UI generator for GreenElephant's Conscious Communication dashboard.
Generate clean, modern UI components that display communication lens data.`;

  const userMessage = data 
    ? `${prompt}\n\nData:\n${JSON.stringify(data, null, 2)}`
    : prompt;

  const stream = await thesysClient.chat.completions.create({
    model: 'c1/anthropic/claude-sonnet-4/v-20250930',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    stream: true
  });

  return stream;
}

export async function portalAiChat(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  if (!(await isConnectorEnabled("thesys"))) {
    throw new Error('AI features are currently unavailable. Please try again later.');
  }

  const response = await thesysClient.chat.completions.create({
    model: 'c1/anthropic/claude-sonnet-4/v-20250930',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ]
  });

  let content = response.choices[0]?.message?.content || '';

  if (content.includes('<content thesys=')) {
    content = content.replace(/<content thesys="true">/g, '').replace(/<\/content>/g, '');
    content = content.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

    try {
      const parsed = JSON.parse(content);
      const extractText = (obj: any): string => {
        if (typeof obj === 'string') return obj;
        if (!obj || typeof obj !== 'object') return '';
        if (obj.textMarkdown) return obj.textMarkdown;
        if (obj.text) return obj.text;
        if (obj.children) {
          if (Array.isArray(obj.children)) return obj.children.map(extractText).filter(Boolean).join('\n\n');
          return extractText(obj.children);
        }
        return Object.values(obj).map(v => extractText(v)).filter(Boolean).join('\n\n');
      };
      content = extractText(parsed);
    } catch {
      const textMatch = content.match(/"textMarkdown"\s*:\s*"((?:[^"\\]|\\.)*)"/);
      if (textMatch) {
        content = textMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
      }
    }
  }

  return stripMarkdown(content.replace(/\\n/g, '\n').trim());
}
