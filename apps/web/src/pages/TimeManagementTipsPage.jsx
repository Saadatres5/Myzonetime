/**
 * TimeManagementTipsPage.jsx — Route: /time-management-tips
 * Targets: "time management tips", "effective time management tips"
 */
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, Target, Calendar, ListChecks, Zap, Brain, Coffee, ChevronRight } from 'lucide-react';
import CanonicalTag from '@/components/CanonicalTag.jsx';
import StructuredData from '@/components/StructuredData.jsx';
import FAQSection from '@/components/FAQSection.jsx';
import AdSenseAd, { AD_SLOTS } from '@/components/AdSenseAd.jsx';

const BASE = 'https://myzonetime.com';

const TIPS = [
  {
    icon: Target,
    title: '1. Prioritize with the Eisenhower Matrix',
    body: 'Sort every task into one of four quadrants: urgent and important, important but not urgent, urgent but not important, and neither. Tasks in the first quadrant get done immediately. Tasks in the second quadrant — the ones that build long-term value — should be scheduled deliberately, since they are the easiest to keep postponing.',
  },
  {
    icon: Clock,
    title: '2. Use Time Blocking, Not Just To-Do Lists',
    body: 'A to-do list tells you what to do but not when. Time blocking assigns each task a specific slot on your calendar, turning intentions into commitments. Block focused work in the morning when energy is highest, and batch meetings or admin tasks into a single afternoon window.',
  },
  {
    icon: Zap,
    title: '3. Apply the Two-Minute Rule',
    body: 'If a task takes less than two minutes, do it immediately instead of adding it to a list. Replying to a quick email, filing a document, or sending a one-line confirmation — these tiny tasks create more mental overhead by being deferred than by being done on the spot.',
  },
  {
    icon: Brain,
    title: '4. Protect Your Peak Energy Hours',
    body: 'Most people have 2-4 hours per day of genuinely high-focus capacity. Identify when yours occurs — often mid-morning — and guard that window fiercely for your most demanding work. Save low-energy periods for routine tasks like email triage or scheduling.',
  },
  {
    icon: ListChecks,
    title: '5. Batch Similar Tasks Together',
    body: 'Context-switching has a real cost — studies suggest it can take over 20 minutes to fully refocus after an interruption. Group similar tasks (all emails, all calls, all reviews) into dedicated batches rather than scattering them throughout the day.',
  },
  {
    icon: Coffee,
    title: '6. Build In Real Breaks',
    body: 'The Pomodoro Technique — 25 minutes of focused work followed by a 5-minute break — works because sustained attention degrades without recovery. Breaks are not wasted time; they are what makes the following work block productive.',
  },
  {
    icon: Calendar,
    title: '7. Plan Tomorrow at the End of Today',
    body: 'Spend the last 10 minutes of your workday planning the next one. Deciding your top 3 priorities the night before removes the friction of figuring out where to start, and research shows people who plan ahead report lower anxiety and better follow-through.',
  },
  {
    icon: CheckCircle2,
    title: '8. Say No to Protect Your Calendar',
    body: 'Every yes to a low-value request is an invisible no to something that matters more. Effective time management often comes down to being selectively unavailable — politely declining or delegating requests that do not align with your actual priorities.',
  },
];

const TM_FAQS = [
  {
    question: 'What are the most effective time management tips?',
    answer: 'The most effective time management tips combine prioritization (deciding what matters most), time blocking (scheduling specific slots for specific tasks), and protecting your peak energy hours for your most demanding work. Combined with regular breaks and end-of-day planning for tomorrow, these form a complete system rather than isolated tricks.',
  },
  {
    question: 'What is the Eisenhower Matrix?',
    answer: 'The Eisenhower Matrix is a prioritization framework that sorts tasks into four quadrants based on urgency and importance: urgent+important (do now), important+not urgent (schedule), urgent+not important (delegate), and neither (eliminate). It helps prevent spending all your time on urgent-but-low-value tasks.',
  },
  {
    question: 'What is time blocking and does it actually work?',
    answer: 'Time blocking means assigning specific calendar slots to specific tasks rather than keeping an open-ended to-do list. It works because it forces realistic estimation of how long tasks take and creates accountability — an unscheduled task is easy to postpone indefinitely, while a scheduled block creates a concrete commitment.',
  },
  {
    question: 'How can I manage time better when working across different time zones?',
    answer: 'For global teams, time management extends beyond personal scheduling into coordinating across time zones. Tools like a meeting planner that shows overlapping business hours across multiple cities help avoid the time waste of back-and-forth scheduling emails and missed meeting windows.',
  },
  {
    question: 'What is the two-minute rule for productivity?',
    answer: 'The two-minute rule states that if a task takes less than two minutes to complete, you should do it immediately rather than adding it to a list. The mental overhead of tracking, remembering, and revisiting a tiny task often costs more time than simply finishing it on the spot.',
  },
  {
    question: 'Why do breaks improve time management instead of wasting time?',
    answer: 'Sustained focus naturally degrades over time — typically after 25-50 minutes for most people. Structured breaks, such as those used in the Pomodoro Technique, allow attention to reset, making the following work period more productive than if you had pushed through fatigue without pausing.',
  },
];

export default function TimeManagementTipsPage() {
  const TODAY = new Date().toISOString().split('T')[0];

  const articleSchema = {
    '@type': 'Article',
    '@id': `${BASE}/time-management-tips#article`,
    headline: 'Effective Time Management Tips: 8 Proven Strategies',
    description: 'Practical, evidence-based time management tips including prioritization frameworks, time blocking, and energy management for better productivity.',
    author: { '@id': `${BASE}/#organization` },
    publisher: { '@id': `${BASE}/#organization` },
    datePublished: TODAY,
    dateModified: TODAY,
    mainEntityOfPage: { '@id': `${BASE}/time-management-tips#webpage` },
    image: `${BASE}/og-image.svg`,
  };

  const webPageSchema = {
    '@type': 'WebPage',
    '@id': `${BASE}/time-management-tips#webpage`,
    url: `${BASE}/time-management-tips`,
    name: 'Effective Time Management Tips — 8 Proven Strategies | MyZoneTime',
    isPartOf: { '@id': `${BASE}/#website` },
    publisher: { '@id': `${BASE}/#organization` },
    dateModified: TODAY,
    inLanguage: 'en',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'Time Management Tips', item: `${BASE}/time-management-tips` },
      ],
    },
  };

  return (
    <>
      <CanonicalTag pathname="/time-management-tips" />
      <Helmet>
        <title>Effective Time Management Tips — 8 Proven Strategies | MyZoneTime</title>
        <meta name="description" content="8 research-backed time management tips: prioritization, time blocking, energy management, and practical strategies for today." />
        <meta property="og:title" content="Effective Time Management Tips | MyZoneTime" />
        <meta property="og:description" content="8 proven time management strategies — Eisenhower Matrix, time blocking, the two-minute rule, and more." />
        <meta property="og:image" content="https://myzonetime.com/og-image.svg" />
      </Helmet>
      <StructuredData schemas={[webPageSchema, articleSchema]} />

      <main id="main-content" className="min-h-screen bg-background">

        <section className="relative py-14 md:py-20 border-b border-border/40 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-3xl bg-primary/15 rounded-full blur-[80px] opacity-40" />
          </div>
          <div className="container max-w-3xl mx-auto px-4 sm:px-6 text-center relative">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Effective Time Management Tips
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              8 practical, research-backed strategies to take control of your day — not just theory, but tactics you can apply today.
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="container max-w-3xl mx-auto px-4 sm:px-6">
            <AdSenseAd slot={AD_SLOTS.HOME_BANNER} format="horizontal" minHeight={90} />
          </div>
        </section>

        <section className="py-12">
          <div className="container max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
            {TIPS.map((tip, i) => {
              const Icon = tip.icon;
              return (
                <div key={i} className="premium-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg mb-2">{tip.title}</h2>
                      <p className="text-muted-foreground leading-relaxed">{tip.body}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Cross-sell: meeting planner for global teams */}
        <section className="py-10">
          <div className="container max-w-3xl mx-auto px-4 sm:px-6">
            <div className="premium-card p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-foreground mb-1">Managing time across global teams?</h2>
                <p className="text-sm text-muted-foreground">
                  Stop wasting time on scheduling back-and-forth. Find the best meeting slot across multiple time zones instantly.
                </p>
              </div>
              <Link to="/meeting-planner" className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors flex-shrink-0">
                Try Meeting Planner <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <FAQSection faqs={TM_FAQS} title="Time Management Tips — Frequently Asked Questions" />

</main>
    </>
  );
}
