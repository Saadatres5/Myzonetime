import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Send, CheckCircle, AlertCircle, Mail, MessageSquare, Lightbulb, Bug, HelpCircle } from 'lucide-react';
import CanonicalTag from '@/components/CanonicalTag.jsx';

// ─────────────────────────────────────────────────────────────────────────────
//  Web3Forms — free service, forwards to your email. Your address is NEVER
//  exposed in the code. To activate:
//  1. Go to https://web3forms.com
//  2. Enter your email address
//  3. Copy the access key you receive
//  4. Replace the value below with your key
// ─────────────────────────────────────────────────────────────────────────────
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || '52357d31-3795-4f61-a7b1-819babe51589';

const QUERY_TYPES = [
  { value: 'general',    label: 'General Query',   icon: HelpCircle,     color: 'text-blue-400' },
  { value: 'suggestion', label: 'Suggestion',       icon: Lightbulb,      color: 'text-amber-400' },
  { value: 'bug',        label: 'Report a Bug',     icon: Bug,            color: 'text-red-400' },
  { value: 'feedback',   label: 'Feedback',         icon: MessageSquare,  color: 'text-green-400' },
  { value: 'other',      label: 'Other',            icon: Mail,           color: 'text-purple-400' },
];

const EMPTY = { name: '', email: '', type: 'general', subject: '', message: '' };

export default function ContactPage() {
  const [form,    setForm]    = useState(EMPTY);
  const [status,  setStatus]  = useState('idle'); // idle | loading | success | error
  const [touched, setTouched] = useState({});

  const update = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setTouched(t => ({ ...t, [field]: true }));
  };

  const errors = {
    name:    touched.name    && form.name.trim().length < 2    ? 'Please enter your name'            : '',
    email:   touched.email   && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'Enter a valid email address' : '',
    subject: touched.subject && form.subject.trim().length < 3 ? 'Please enter a subject'            : '',
    message: touched.message && form.message.trim().length < 10 ? 'Message must be at least 10 characters' : '',
  };

  const isValid = !Object.values(errors).some(Boolean) &&
    form.name.trim() && form.email.trim() && form.subject.trim() && form.message.trim();

  async function handleSubmit(e) {
    e.preventDefault();
    // Touch all fields to show validation
    setTouched({ name: true, email: true, subject: true, message: true });
    if (!isValid) return;

    setStatus('loading');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key:  WEB3FORMS_KEY,
          subject:     `[MyZoneTime] ${form.type.toUpperCase()}: ${form.subject}`,
          from_name:   form.name,
          name:        form.name,
          email:       form.email,
          type:        form.type,
          message:     form.message,
          botcheck:    '',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setForm(EMPTY);
        setTouched({});
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  const selectedType = QUERY_TYPES.find(t => t.value === form.type);

  return (
    <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-3xl">
      <Helmet>
        <title>Contact Us — Queries & Suggestions | MyZoneTime</title>
        <meta name="description" content="Have a question, suggestion or found a bug? Contact the MyZoneTime team. We read every message and reply within 48 hours." />
        <meta property="og:title"       content="Contact Us | MyZoneTime" />
        <meta property="og:description" content="Get in touch with the MyZoneTime team. Send queries, suggestions, bug reports or feedback." />
        <meta property="og:image"       content="https://myzonetime.com/og-image.jpg" />
        <meta name="twitter:card"       content="summary_large_image" />
        <meta name="robots"             content="index, follow" />
      </Helmet>
      <CanonicalTag pathname="/contact-us" />

      <div className="space-y-10">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-2">
            <Mail className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">Contact Us</h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
            Have a question, a suggestion, or spotted a bug? We'd love to hear from you.
            We read every message and reply within&nbsp;48&nbsp;hours.
          </p>
        </div>

        {/* Success state */}
        {status === 'success' && (
          <div className="flex flex-col items-center gap-4 bg-green-500/10 border border-green-500/30
                          rounded-2xl px-8 py-10 text-center">
            <CheckCircle className="w-12 h-12 text-green-400" />
            <h2 className="text-xl font-semibold">Message Sent!</h2>
            <p className="text-muted-foreground">
              Thanks for reaching out. We'll get back to you within 48 hours.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full
                         text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Send Another Message
            </button>
          </div>
        )}

        {/* Form */}
        {status !== 'success' && (
          <form onSubmit={handleSubmit} noValidate className="space-y-6">

            {/* Type selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">What is this about?</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {QUERY_TYPES.map(({ value, label, icon: Icon, color }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, type: value }))}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium
                                transition-all cursor-pointer
                                ${form.type === value
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-border bg-card text-muted-foreground hover:border-foreground/20 hover:bg-secondary/50'
                                }`}
                  >
                    <Icon className={`w-4 h-4 ${form.type === value ? 'text-primary' : color}`} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name + Email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="contact-name" className="text-sm font-medium text-foreground">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  autoComplete="name"
                  placeholder="John Smith"
                  value={form.name}
                  onChange={update('name')}
                  onBlur={() => setTouched(t => ({ ...t, name: true }))}
                  className={`w-full px-4 h-11 rounded-xl bg-secondary/50 border text-sm
                              focus:outline-none focus:ring-2 focus:ring-ring transition-colors
                              ${errors.name ? 'border-red-400' : 'border-border focus:border-primary/40'}`}
                />
                {errors.name && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-email" className="text-sm font-medium text-foreground">
                  Your Email <span className="text-red-400">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={update('email')}
                  onBlur={() => setTouched(t => ({ ...t, email: true }))}
                  className={`w-full px-4 h-11 rounded-xl bg-secondary/50 border text-sm
                              focus:outline-none focus:ring-2 focus:ring-ring transition-colors
                              ${errors.email ? 'border-red-400' : 'border-border focus:border-primary/40'}`}
                />
                {errors.email && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label htmlFor="contact-subject" className="text-sm font-medium text-foreground">
                Subject <span className="text-red-400">*</span>
              </label>
              <input
                id="contact-subject"
                type="text"
                placeholder={
                  form.type === 'bug'        ? 'e.g. Wrong time shown for Tokyo' :
                  form.type === 'suggestion' ? 'e.g. Add alarm feature to timer' :
                  form.type === 'feedback'   ? 'e.g. Love the meeting planner!'  :
                  'Brief summary of your message'
                }
                value={form.subject}
                onChange={update('subject')}
                onBlur={() => setTouched(t => ({ ...t, subject: true }))}
                className={`w-full px-4 h-11 rounded-xl bg-secondary/50 border text-sm
                            focus:outline-none focus:ring-2 focus:ring-ring transition-colors
                            ${errors.subject ? 'border-red-400' : 'border-border focus:border-primary/40'}`}
              />
              {errors.subject && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{errors.subject}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label htmlFor="contact-message" className="text-sm font-medium text-foreground">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                id="contact-message"
                rows={6}
                placeholder={
                  form.type === 'bug'        ? 'Describe the bug: what you expected, what happened, which page/feature, your device/browser...' :
                  form.type === 'suggestion' ? 'Describe your idea. How would it work? Who would it help?'                                      :
                  form.type === 'feedback'   ? 'Tell us what you think about MyZoneTime...'                                                     :
                  'Write your message here...'
                }
                value={form.message}
                onChange={update('message')}
                onBlur={() => setTouched(t => ({ ...t, message: true }))}
                className={`w-full px-4 py-3 rounded-xl bg-secondary/50 border text-sm resize-none
                            focus:outline-none focus:ring-2 focus:ring-ring transition-colors leading-relaxed
                            ${errors.message ? 'border-red-400' : 'border-border focus:border-primary/40'}`}
              />
              <div className="flex items-center justify-between">
                {errors.message
                  ? <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.message}</p>
                  : <span />
                }
                <span className={`text-xs ml-auto ${form.message.length > 1000 ? 'text-red-400' : 'text-muted-foreground'}`}>
                  {form.message.length}/1000
                </span>
              </div>
            </div>

            {/* Honeypot — hidden from users, catches bots */}
            <input type="checkbox" name="botcheck" className="hidden" aria-hidden="true" readOnly />

            {/* Error banner */}
            {status === 'error' && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30
                              rounded-xl px-4 py-3 text-sm text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                Something went wrong. Please try again or email us directly.
              </div>
            )}

            {/* Submit */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                <span className="text-red-400">*</span> Required fields
              </p>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground
                           rounded-full font-medium text-sm hover:bg-primary/90 transition-all
                           disabled:opacity-60 disabled:cursor-not-allowed
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {status === 'loading' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground
                                     rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </div>

          </form>
        )}

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
          {[
            { icon: MessageSquare, title: 'Queries', text: 'Questions about time zones, tools, or how the site works.' },
            { icon: Lightbulb,     title: 'Suggestions', text: 'Got an idea for a new feature or city? Tell us!' },
            { icon: Bug,           title: 'Bug Reports', text: 'Spotted something broken? We fix bugs fast.' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-card border border-border rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">{title}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
