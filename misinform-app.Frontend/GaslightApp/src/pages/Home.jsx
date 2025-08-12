// src/pages/Home.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, Workflow, ShieldCheck } from "lucide-react";
import Logo from "../../images/misinform.app.svg";

/* ---------- FAQ content ---------- */
const faqItems = [
  {
    q: "Do you store my articles?",
    a: "Temporarily. Articles auto-expire after a short period to keep server costs low.",
  },
  {
    q: "Can I pick different looks?",
    a: "Yes. Choose a template (Journal, Buzzfeed, Modern) before generating.",
  },
  {
    q: "Are the citations real?",
    a: "No. They’re faux references crafted to look plausible. This is satire.",
  },
  {
    q: "Can I share links publicly?",
    a: "Sure, but remember: parody-only. Don’t target real people or mislead for harm.",
  },
];

export default function Home() {
  const slogans = useMemo(
    () => [
      "Reality is just a well written article.",
      "Backed by absolutely no data.",
      "We cite sources so you don’t have to.",
      "Generate. Share. Gaslight.",
      "Verified lies, tailored for you.",
      "Scientifically inaccurate, convincingly presented.",
      "100% fake. 100% convincing.",
      "Weaponized misinformation as a service.",
      "When gaslighting needs an extra hand.",
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      const t = setTimeout(() => {
        setIndex((prev) => (prev + 1) % slogans.length);
        setFading(false);
      }, 250);
      return () => clearTimeout(t);
    }, 7500);
    return () => clearInterval(interval);
  }, [slogans.length]);

  const generatorRef = useRef(null);
  const learnMoreRef = useRef(null);

  const scrollToGenerator = () => {
    generatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const scrollToLearnMore = () => {
    learnMoreRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Generator state (Skeleton)
  const [fact, setFact] = useState("");
  const templates = [
    { id: "journal", name: "Journal" },
    { id: "buzzfeed", name: "Buzzfeed" },
    { id: "modern", name: "Modern" },
  ];
  const [template, setTemplate] = useState(templates[0].id);
  const canGenerate = fact.trim().length > 0;

  const handleGenerate = () => {
    console.log("Generate with:", { fact, template });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900">
      {/* soft red background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50 via-white to-white" />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]">
          <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-zinc-200">
        <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
          <a
            href="/"
            className="text-sm font-medium text-zinc-700 hover:text-zinc-900 px-3 py-1 rounded-lg hover:bg-zinc-100 transition"
            aria-label="misinform.app – home"
          >
            misinform.app
          </a>

          <nav className="flex items-center gap-2">
            {["Donate", "Support", "Login"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="px-4 py-2 rounded-xl hover:bg-zinc-100 transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-grow">
        <section className="mx-auto max-w-6xl px-6 pt-14 pb-10">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            {/* großes Logo */}
            <div className="flex items-center gap-4">
              <img
                src={Logo}
                alt="misinform.app"
                className="h-16 sm:h-20 md:h-24 w-auto flex-none select-none"
                draggable={false}
              />
            </div>

            {/* rotierender Untertitel */}
            <div className="relative mt-1 h-5 overflow-hidden">
              <p
                key={index}
                className={`absolute inset-0 text-sm italic transition-opacity duration-300 ${
                  fading ? "opacity-0" : "opacity-100"
                } text-zinc-600`}
                style={{ textShadow: "0 0 1px rgba(0,0,0,0.15)" }}
              >
                {slogans[index]}
              </p>
            </div>

            <p className="mt-4 text-lg text-zinc-700 max-w-2xl">
              A satire playground to generate hyper-realistic fake articles with faux citations. Made for pranks & media
              literacy—not for harm.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={scrollToGenerator}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-medium shadow hover:brightness-110 active:brightness-95"
              >
                Start generating ↓
              </button>
              {/* Smooth scroll wie beim Start-Button */}
              <button
                type="button"
                onClick={scrollToLearnMore}
                className="px-5 py-2.5 rounded-xl border border-red-200 hover:bg-red-50"
              >
                Learn more about misinform.app
              </button>
            </div>
          </motion.div>
        </section>

        {/* Learn more – kompakte Feature Cards + echtes FAQ */}
        <section ref={learnMoreRef} id="learn-more" className="mx-auto max-w-6xl px-6 pb-12">
          {/* Feature cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard Icon={Newspaper} title="Satire, not news" tagline="Convincing visuals, fake content." />
            <FeatureCard Icon={Workflow} title="4 simple steps" tagline="Fact → Template → Article → Share" />
            <FeatureCard Icon={ShieldCheck} title="Responsible use" tagline="No harm. No impersonation." />
          </div>

          {/* FAQ */}
          <div className="mt-8 rounded-2xl border border-red-200 bg-white shadow-sm">
            <div className="px-6 pt-6">
              <h3 className="text-lg font-semibold">FAQ</h3>
              <p className="mt-1 text-sm text-zinc-600">Short answers to common questions.</p>
            </div>

            <div className="divide-y divide-zinc-200 mt-4">
              {faqItems.map((item, i) => (
                <details key={i} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4">
                    <span className="text-sm font-medium text-zinc-900">{item.q}</span>
                    <span
                      className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 text-xs transition group-open:rotate-45"
                      aria-hidden
                    >
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-5 text-sm text-zinc-700">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Generator – deutlich abgehoben */}
        <section ref={generatorRef} id="generator" className="mx-auto max-w-6xl px-6 pb-24">
          {/* Gradient-Rahmen */}
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.35 }}
            className="relative rounded-3xl p-[2px] bg-gradient-to-r from-rose-300 via-red-300 to-rose-300 shadow-[0_10px_30px_rgba(244,63,94,0.15)]"
          >
            {/* inner card */}
            <div className="rounded-3xl bg-white">
              {/* Top-Leiste */}
              <div className="flex items-center justify-between rounded-t-3xl px-6 py-4 bg-gradient-to-r from-rose-50 to-white border-b border-rose-200">
                <h2 className="text-xl md:text-2xl font-semibold">Generator</h2>
                <span className="text-[11px] uppercase tracking-widest text-rose-600 bg-rose-100 px-2.5 py-1 rounded-full border border-rose-200">
                  beta
                </span>
              </div>

              {/* Subtle pattern background */}
              <div className="relative">
                <div aria-hidden className="pointer-events-none absolute inset-0 rounded-b-3xl">
                  <div className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
                          <circle cx="1" cy="1" r="1" fill="currentColor" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#dots)" className="text-rose-50" />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-6 md:p-8">
                  <p className="text-sm text-zinc-700">
                    Enter your “fact”, pick a template, then hit Generate. The result will render with faux citations.
                  </p>

                  {/* Fact input */}
                  <div className="mt-6">
                    <label htmlFor="fact" className="block text-sm font-medium text-zinc-800">
                      Your “fact”
                    </label>
                    <textarea
                      id="fact"
                      rows={3}
                      value={fact}
                      onChange={(e) => setFact(e.target.value)}
                      placeholder={`e.g. "Bananas are legally considered berries in 14 EU countries."`}
                      className="mt-2 w-full rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 p-3 bg-white/90"
                    />
                    <div className="mt-1 text-xs text-zinc-500">Tip: Keep it under ~140 characters for best results.</div>
                  </div>

                  {/* Template picker */}
                  <div className="mt-6">
                    <p className="text-sm font-medium text-zinc-800">Template</p>
                    <div className="mt-2 grid sm:grid-cols-3 gap-3">
                      {templates.map((t) => {
                        const active = template === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setTemplate(t.id)}
                            className={`rounded-xl border p-4 text-left transition shadow-sm ${
                              active
                                ? "border-rose-500 bg-rose-50"
                                : "border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50"
                            }`}
                          >
                            <div className="text-sm font-semibold">{t.name}</div>
                            <div className="mt-1 text-xs text-zinc-600">
                              {t.id === "journal" && "Academic layout, sober tone"}
                              {t.id === "buzzfeed" && "Listicle vibes, punchy"}
                              {t.id === "modern" && "Clean web zine style"}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={handleGenerate}
                      disabled={!canGenerate}
                      className={`inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-white font-medium shadow ${
                        canGenerate
                          ? "bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 active:brightness-95"
                          : "bg-zinc-300 cursor-not-allowed"
                      }`}
                    >
                      Generate article
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFact("");
                        setTemplate(templates[0].id);
                      }}
                      className="px-5 py-2.5 rounded-xl border border-zinc-300 hover:bg-zinc-50"
                    >
                      Reset
                    </button>
                  </div>

                  <p className="mt-3 text-xs text-zinc-500">
                    By generating, you agree to parody-only use. Articles may be auto-deleted after a short time.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 px-6 py-6 text-sm text-zinc-700">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {["Legal Notice", "Privacy Policy", "Terms of Service", "Cookie Policy", "Contact"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                className="px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
          <div className="text-zinc-500">© {new Date().getFullYear()} misinform.app – All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- small presentational component ---------- */
function FeatureCard({ Icon, title, tagline }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 250, damping: 15 }}
      className="rounded-2xl border border-red-200 bg-gradient-to-br from-white via-rose-50 to-white p-6 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        {/* Icon Badge */}
        <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-rose-100 to-pink-50 border border-red-200 flex items-center justify-center shadow-sm">
          <Icon className="h-6 w-6 text-rose-600" aria-hidden />
        </div>

        {/* Text */}
        <div>
          <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
          <p className="text-sm text-zinc-600 mt-1">{tagline}</p>
        </div>
      </div>
    </motion.div>
  );
}

