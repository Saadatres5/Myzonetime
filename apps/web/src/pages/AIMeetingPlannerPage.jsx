import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import { Bot, Send, Clock, Globe2, AlertTriangle, Lightbulb, Calendar, Users, ChevronRight, RotateCcw, Copy, Check } from 'lucide-react';

// ─── Structured data ─────────────────────────────────────────────────────────
const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AI Meeting Planner Worldwide',
  url: 'https://myzonetime.com/ai-meeting-planner',
  description: 'AI-powered worldwide meeting planner. Describe your meeting in plain language and get instant best time slots, time zones, DST warnings, and global scheduling advice.',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myzonetime.com/' },
    { '@type': 'ListItem', position: 2, name: 'Meeting Planner', item: 'https://myzonetime.com/meeting-planner' },
    { '@type': 'ListItem', position: 3, name: 'AI Meeting Planner', item: 'https://myzonetime.com/ai-meeting-planner' },
  ],
};

// ─── Example prompts ──────────────────────────────────────────────────────────
const EXAMPLE_PROMPTS = [
  'Schedule a 1-hour meeting between Dubai, London, and New York next Monday',
  'Find the best time for a weekly standup with teams in Abu Dhabi, Singapore, and Paris',
  'I need to schedule a 30-min call between Sydney and San Francisco on a Friday',
  'What is the overlap between Tokyo, Dubai, and Berlin for a global all-hands?',
  'Best time to meet between Riyadh and New York avoiding early mornings?',
  'Plan a 2-hour strategy session with attendees in Toronto, London, and Mumbai',
];

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const AI_FAQS = [
  {
    question: 'What is an AI meeting planner worldwide?',
    answer: 'An AI meeting planner worldwide is a tool that uses artificial intelligence to understand natural language scheduling requests and automatically calculate the best meeting times across multiple global time zones. Instead of manually checking time zone converters, you simply describe your meeting — cities, date, duration, preferences — and the AI returns the optimal slots, local times for every participant, DST warnings, and alternative scenarios.'
  },
  {
    question: 'How does the AI worldwide meeting planner work?',
    answer: 'You type a plain-language request such as "Schedule a 1-hour meeting between Dubai, London, and New York next Tuesday". The AI parses the cities, date, and constraints, calculates overlapping business hours across all time zones with automatic DST adjustment, and returns a structured plan with the best slot, what time it is in each city, warnings about difficult overlaps, and alternative options.'
  },
  {
    question: 'Can the AI meeting planner handle Abu Dhabi and Gulf time zones?',
    answer: 'Yes. The AI meeting planner fully supports Abu Dhabi, Dubai, Riyadh, and all Gulf Standard Time (GST, UTC+4) cities. It correctly notes that Gulf cities do not observe daylight saving time, which means their offset relative to London and New York shifts seasonally even though Abu Dhabi and Dubai stay fixed. The AI explains these nuances in its response.'
  },
  {
    question: 'What makes this different from a regular meeting planner?',
    answer: 'A regular meeting planner shows you a grid and you interpret it yourself. The AI meeting planner understands intent — you can say "avoid early mornings for the London team" or "we need at least a 45-minute window" and it factors those constraints in. It also explains its reasoning, warns you about problematic overlaps, and suggests async alternatives when no good slot exists.'
  },
  {
    question: 'Does the AI planner account for daylight saving time?',
    answer: 'Yes. The AI is aware of DST transitions for all major time zones. If you schedule a meeting near a DST transition date (March or November for most regions), it flags the change and shows you the corrected times. It also notes which cities in your selection do not observe DST — such as Abu Dhabi, Dubai, Riyadh, and most of the Middle East.'
  },
  {
    question: 'Can I ask follow-up questions to refine the meeting plan?',
    answer: 'Yes. The AI meeting planner supports multi-turn conversation. After getting an initial plan, you can follow up with requests like "can we move it one hour earlier?", "what about Thursday instead?", or "add Singapore to the mix" — and the AI will refine the plan based on the full conversation context.'
  },
  {
    question: 'Is the AI worldwide meeting planner free?',
    answer: 'Yes, completely free. No account, signup, or payment required. The AI meeting planner is available directly in your browser on any device.'
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1.5 rounded-lg hover:bg-border/50 transition-colors text-muted-foreground hover:text-foreground"
      title="Copy"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

// ─── Message renderer ─────────────────────────────────────────────────────────
function AIMessageCard({ content }) {
  // Parse the AI's structured JSON response
  let parsed = null;
  try {
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
    if (jsonMatch) parsed = JSON.parse(jsonMatch[1]);
  } catch {}

  // If we have structured data, render beautiful cards
  if (parsed) {
    return (
      <div className="space-y-4">
        {/* Best slot */}
        {parsed.bestSlot && (
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
            <div className="flex items-center gap-2 mb-3 text-green-400 font-semibold text-sm uppercase tracking-wide">
              <Clock className="w-4 h-4" /> Best Meeting Slot
            </div>
            <div className="text-xl font-bold text-foreground mb-1">{parsed.bestSlot.utc}</div>
            <div className="text-sm text-muted-foreground mb-3">{parsed.bestSlot.description}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {parsed.bestSlot.localTimes?.map((lt, i) => (
                <div key={i} className="flex items-center gap-2 text-sm bg-background/40 rounded-xl px-3 py-2">
                  <Globe2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="font-medium text-foreground">{lt.city}</span>
                  <span className="ml-auto text-muted-foreground font-mono">{lt.time}</span>
                  {lt.note && <span className="text-xs text-yellow-400 ml-1">{lt.note}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alternative slots */}
        {parsed.alternatives?.length > 0 && (
          <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
            <div className="flex items-center gap-2 mb-3 text-primary font-semibold text-sm uppercase tracking-wide">
              <Calendar className="w-4 h-4" /> Alternative Slots
            </div>
            <div className="space-y-2">
              {parsed.alternatives.map((alt, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-1 text-sm border border-border/30 rounded-xl px-3 py-2.5 bg-background/30">
                  <span className="font-semibold text-foreground min-w-[120px]">{alt.utc}</span>
                  <span className="text-muted-foreground flex-1">{alt.localSummary}</span>
                  <span className="text-xs text-primary/80 font-medium">{alt.rating}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warnings */}
        {parsed.warnings?.length > 0 && (
          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/8 p-5">
            <div className="flex items-center gap-2 mb-3 text-yellow-400 font-semibold text-sm uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4" /> Things to Watch
            </div>
            <ul className="space-y-1.5">
              {parsed.warnings.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-yellow-400 mt-0.5">•</span>{w}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tips */}
        {parsed.tips?.length > 0 && (
          <div className="rounded-2xl border border-primary/20 bg-primary/8 p-5">
            <div className="flex items-center gap-2 mb-3 text-primary font-semibold text-sm uppercase tracking-wide">
              <Lightbulb className="w-4 h-4" /> Scheduling Tips
            </div>
            <ul className="space-y-1.5">
              {parsed.tips.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5">→</span>{t}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Summary note */}
        {parsed.summary && (
          <p className="text-sm text-muted-foreground leading-relaxed px-1">{parsed.summary}</p>
        )}
      </div>
    );
  }

  // Fallback: render plain text with basic formatting
  return (
    <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{content.replace(/```json[\s\S]*?```/g, '').trim()}</div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AIMeetingPlannerPage() {
  const [messages, setMessages] = useState([]); // { role: 'user'|'assistant', content: string }
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const SYSTEM_PROMPT = `You are an expert worldwide meeting planner AI assistant. Your job is to help users find the best meeting times across global time zones.

When the user describes a meeting scheduling request, respond with a JSON block (inside \`\`\`json ... \`\`\`) containing:
{
  "bestSlot": {
    "utc": "e.g. 14:00 UTC on Monday 9 June 2025",
    "description": "Brief reason why this is the best slot",
    "localTimes": [
      { "city": "Dubai", "time": "6:00 PM GST", "note": "end of business" },
      ...
    ]
  },
  "alternatives": [
    { "utc": "13:00 UTC", "localSummary": "Dubai 5 PM / London 1 PM / NY 8 AM", "rating": "Good" },
    ...
  ],
  "warnings": ["London observes BST in summer — offset shifts to UTC+1", ...],
  "tips": ["Consider recording for async team members in Sydney", ...],
  "summary": "One sentence summary of the scheduling situation."
}

Rules:
- Always account for DST correctly. Abu Dhabi and Dubai are UTC+4 year-round (no DST). London is UTC+0 (GMT) in winter and UTC+1 (BST) in summer. New York is UTC-5 (EST) in winter and UTC-4 (EDT) in summer.
- Business hours are 9 AM–6 PM local. Flag any slot outside this range.
- If no overlap exists, recommend the least painful slot and suggest async alternatives.
- For follow-up questions, maintain context from the full conversation history.
- After the JSON block, optionally add 1-2 sentences of plain text context if helpful.
- Always be specific — give exact times in each city's local time with timezone abbreviation.`;

  const sendMessage = useCallback(async (text) => {
    const userMsg = text.trim();
    if (!userMsg || loading) return;

    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || 'Request failed. Please try again.');
        return;
      }
      const aiContent = data.content?.[0]?.text || 'Sorry, I could not generate a response. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: aiContent }]);
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const resetChat = () => {
    setMessages([]);
    setInput('');
    setError(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const isEmpty = messages.length === 0;

  return (
    <>
      <CanonicalTag path="/ai-meeting-planner" />
      <Helmet>
        <title>AI Meeting Planner Worldwide — Smart Global Time Zone Scheduler | MyZoneTime</title>
        <meta name="description" content="AI meeting planner for global teams. Get instant best time slots across any city — DST-aware, free, no signup required." />
        <meta property="og:title" content="AI Meeting Planner Worldwide | MyZoneTime" />
        <meta property="og:description" content="Tell the AI your cities and date. Get the best meeting time worldwide with local times, DST notes, alternatives, and tips — instantly." />
        <meta property="og:image" content="https://myzonetime.com/og-image.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Meeting Planner Worldwide | MyZoneTime" />
        <meta name="twitter:description" content="AI-powered global meeting scheduler. Describe your meeting, get optimal times across worldwide time zones." />
      </Helmet>
      <StructuredData schemas={[webAppSchema]} breadcrumbSchema={breadcrumbSchema} />

      <main id="main-content" className="min-h-screen bg-background">

        {/* ── Hero ── */}
        <section className="relative py-14 md:py-20 border-b border-border/40 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-3xl bg-primary/15 rounded-full blur-[80px] opacity-40" aria-hidden="true" />
          </div>
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/25 text-sm font-medium text-primary mb-6">
              <Bot className="w-4 h-4" />
              AI-Powered · Worldwide · Free
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
              AI Meeting Planner<br />
              <span className="text-primary">Worldwide</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
              Describe your meeting in plain language. The AI finds the best time worldwide — with local times for every city, DST warnings, alternatives, and scheduling tips.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
              {['500+ cities', 'DST-aware', 'Multi-turn chat', 'Free forever'].map(f => (
                <span key={f} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/40 border border-border/40">
                  <Check className="w-3.5 h-3.5 text-green-400" />{f}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Chat UI ── */}
        <section className="py-10 md:py-14" aria-label="AI meeting planner chat">
          <div className="container max-w-3xl mx-auto px-4 sm:px-6">

            {/* Message thread */}
            <div className="rounded-2xl border border-border/60 bg-card/60 overflow-hidden shadow-xl shadow-black/10 mb-4">

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/40 bg-muted/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">AI Meeting Planner</div>
                    <div className="text-xs text-muted-foreground">Worldwide · DST-aware</div>
                  </div>
                </div>
                {!isEmpty && (
                  <button onClick={resetChat} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-border/40">
                    <RotateCcw className="w-3.5 h-3.5" /> New chat
                  </button>
                )}
              </div>

              {/* Messages */}
              <div className="min-h-[340px] max-h-[560px] overflow-y-auto p-5 space-y-5">
                {isEmpty ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Globe2 className="w-8 h-8 text-primary/60" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">Ask about any worldwide meeting</p>
                      <p className="text-sm text-muted-foreground max-w-sm">Tell me your cities, date, and any preferences — I'll find the best time globally.</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 text-sm' : 'flex-1'}`}>
                        {msg.role === 'assistant' ? (
                          <div className="group relative">
                            <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <CopyButton text={msg.content} />
                            </div>
                            <AIMessageCard content={msg.content} />
                          </div>
                        ) : msg.content}
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-xl bg-muted border border-border/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Users className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))
                )}

                {loading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-muted/40 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                      {[0,1,2].map(i => (
                        <span key={i} className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />{error}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-border/40 p-4">
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={isEmpty ? 'e.g. Schedule a 1-hour meeting between Dubai, London and New York next Monday' : 'Ask a follow-up or refine the plan…'}
                    className="flex-1 bg-muted/40 border border-border/50 rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:bg-muted/60 transition-colors"
                    disabled={loading}
                    maxLength={500}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Plan</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Example prompts */}
            {isEmpty && (
              <div>
                <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">Try an example</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {EXAMPLE_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(p)}
                      className="text-left text-sm text-muted-foreground hover:text-foreground bg-muted/20 hover:bg-muted/40 border border-border/30 hover:border-border/60 rounded-xl px-4 py-3 transition-all flex items-start gap-2 group"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── SEO content ── */}
        <section className="border-t border-border/40 py-12 md:py-16 bg-muted/10">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 space-y-10">

            <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
              <h2 className="text-2xl font-bold text-foreground">AI-powered worldwide meeting planner</h2>
              <p>
                Traditional meeting planners show you a grid — you still have to interpret it. This AI worldwide meeting planner understands natural language. Tell it what you need: the cities, the date, the duration, any preferences ("avoid Mondays", "no early morning for London") and it returns a complete, reasoned meeting plan in seconds.
              </p>
              <p>
                The AI accounts for <strong className="text-foreground">daylight saving time</strong> automatically for every city worldwide. It knows that Abu Dhabi and Dubai stay on Gulf Standard Time (UTC+4) year-round, while London alternates between GMT and BST, and New York between EST and EDT. It flags these transitions when they affect your meeting window and adjusts all times accordingly.
              </p>
              <p>
                For teams with attendees across very different time zones — like a global company with staff in San Francisco, London, Abu Dhabi, and Singapore — the AI doesn't just find the "best" time, it also explains the trade-offs, identifies who is inconvenienced by each slot, and suggests async workflows for situations where no good overlap exists.
              </p>
            </div>

            {/* How it works */}
            <div className="premium-card p-6 md:p-8">
              <h2 className="text-lg font-bold mb-6">How the AI meeting planner works</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { step: '1', title: 'Describe your meeting', desc: 'Type your request in plain English — cities, date, duration, and any constraints. No forms, no dropdowns.' },
                  { step: '2', title: 'AI calculates globally', desc: 'The AI parses your request, looks up time zones, applies DST rules, and finds overlapping business hours worldwide.' },
                  { step: '3', title: 'Get a complete plan', desc: 'Receive best slot, local times per city, alternative options, DST warnings, and scheduling tips — all in one structured response.' },
                ].map(s => (
                  <div key={s.step} className="flex gap-4">
                    <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">{s.step}</div>
                    <div>
                      <div className="font-semibold text-foreground mb-1 text-sm">{s.title}</div>
                      <div className="text-sm text-muted-foreground leading-relaxed">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related tool link */}
            <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-card/50 px-5 py-4">
              <div>
                <div className="font-semibold text-sm text-foreground">Need the visual grid instead?</div>
                <div className="text-xs text-muted-foreground mt-0.5">Use the interactive worldwide meeting planner with colour-coded time grid</div>
              </div>
              <Link to="/meeting-planner" className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex-shrink-0 ml-4">
                Open planner <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </section>

        {/* ── FAQ ── */}
        <FAQSection
          faqs={AI_FAQS}
          title="AI Meeting Planner Worldwide — Frequently Asked Questions"
        />

      </main>
    </>
  );
}
