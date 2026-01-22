import React, { useRef, useState, useEffect } from "react";
import { HashRouter, Routes, Route, Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Plus, Minus, Mail, Linkedin, Phone, ArrowUpRight, Sun, Moon, Info } from "lucide-react";

const EMAIL_B64 = "bGFncmFuZ2VkeWxhbkBnbWFpbC5jb20=";

const CONTENT = {
  fr: {
    hero: { hello: "Bonjour je suis Dylan,", after: "UX Republic à Bordeaux." },
    labels: {
      about: "À propos", projects: "Projets", previousWork: "Expériences récentes",
      sayHello: "Dire bonjour", back: "Retour",
      info: "Ce site internet a été éco-conçu par moi à Bordeaux en 2025, et il a été entièrement codé par GPT5.",
      next: "Projet suivant", prev: "Projet précédent"
    },
    about: {
      name: "Dylan Lagrange",
      role: "Product Designer",
      photo: "images/portrait.svg",
      bio: [
        "Actuellement Product Designer chez UX Republic à Bordeaux, en mission à la DSI de la MAIF.",
        "J’accompagne l’évolution des outils métiers avec les équipes projet, contribue au design system et participe aux réflexions sur nos pratiques (accessibilité, éco-conception, intelligence artificielle)."
      ],
      previousWork: ["Kairos Agency (2021–2024) — Product designer en agence digitale"],
      contact: { linkedin: "https://www.linkedin.com/in/dylanlgrng", phone: "06.76.46.21.17" }
    },
    projects: []
  },
  en: {
    hero: { hello: "Hi, I’m Dylan,", after: "UX Republic in Bordeaux." },
    labels: {
      about: "About me", projects: "Projects", previousWork: "Previous work",
      sayHello: "Say hello", back: "Back",
      info: "This website was eco-designed by me in Bordeaux in 2025 and fully coded by GPT5.",
      next: "Next project", prev: "Previous project"
    },
    about: {
      name: "Dylan Lagrange",
      role: "Product Designer",
      photo: "images/portrait.svg",
      bio: [
        "Currently Product Designer at UX Republic in Bordeaux, on assignment with MAIF’s IT department.",
        "I help evolve internal tools with project teams, contribute to the design system, and join discussions on our practices (accessibility, eco-design, AI)."
      ],
      previousWork: ["Kairos Agency (2021–2024) — Product designer in a digital agency"],
      contact: { linkedin: "https://www.linkedin.com/in/dylanlgrng", phone: "+33 6 76 46 21 17" }
    },
    projects: []
  }
};

function seed(lang) {
  const arr = CONTENT[lang].projects;
  arr.push({ id:"maif", title: lang==="fr" ? "MAIF — Outils métiers & design system" : "MAIF — Internal tools & design system",
    subtitle: lang==="fr" ? "Mission en cours (UX Republic → MAIF)" : "Ongoing assignment (UX Republic → MAIF)",
    image:"images/logomaif.svg",
    summary: lang==="fr" ? "Évolution d’outils métiers, design system, accessibilité." : "Internal tools, design system, accessibility.",
    description: lang==="fr"
      ? "Au sein de la DSI de la MAIF, j’accompagne l’évolution des outils métiers. Co-conception avec les équipes projet, contribution au design system, attention continue à l’accessibilité et à l’éco-conception, et participation aux réflexions collectives autour des pratiques et de l’IA."
      : "Within MAIF’s IT department, I help evolve internal tools. Co-design with project teams, design system contributions, continuous focus on accessibility and eco-design, plus collective reflections around practices and AI."
  });
  for (let i=1;i<=11;i++){
    const id = "p"+String(i).padStart(2,"0");
    arr.push({
      id,
      title: lang==="fr" ? `Projet ${i} — Titre provisoire` : `Project ${i} — Working title`,
      subtitle: lang==="fr" ? "Sous-titre / contexte rapide" : "Subtitle / quick context",
      image:`images/projects/${id}.svg`,
      summary: lang==="fr" ? "Courte phrase d’accroche du projet." : "Short one-liner for the card.",
      description: lang==="fr" ?
        "Décrivez ici les objectifs, les contraintes et votre rôle. Ajoutez vos livrables (recherche, maquettes, design system…), les résultats et ce que vous avez appris." :
        "Describe goals, constraints, and your role. Add deliverables (research, wireframes, design system…), outcomes, and what you learned."
    });
  }
}
seed("fr"); seed("en");

function getInitialLang(){ return (localStorage.getItem("lang") === "en") ? "en" : "fr"; }
function getInitialTheme(){ const s = localStorage.getItem("theme"); if (s === "dark" || s === "light") return s; const h = new Date().getHours(); return (h >= 7 && h < 19) ? "light" : "dark"; }

// Scramble (split-flap style) for language change
function Scramble({ text, as = 'span', className = '', trigger }){
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!%#*+?";
    const from = el.textContent || "";
    const to = String(text);
    const len = Math.max(from.length, to.length);
    const queue = [];
    for (let i=0;i<len;i++){
      const start = Math.floor(Math.random()*10);
      const end = start + 10 + Math.floor(Math.random()*20);
      queue.push({ from: from[i] || "", to: to[i] || "", start, end, char: "" });
    }
    let frame = 0, raf;
    const update = () => {
      let output = "";
      let complete = 0;
      for (let i=0;i<len;i++){
        const q = queue[i];
        if (frame >= q.end){ complete++; output += q.to; }
        else if (frame >= q.start){ q.char = chars[Math.floor(Math.random()*chars.length)]; output += q.char; }
        else { output += q.from; }
      }
      el.textContent = output;
      frame++;
      if (complete < len) raf = requestAnimationFrame(update);
    };
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [text, trigger]);
  const Comp = as;
  return <Comp ref={ref} className={"scramble "+className} aria-label={text}>{String(text)}</Comp>;
}

function SectionRow({ label, isOpen, onToggle, children, scrambleTrigger }) {
  const boxRef = useRef(null);
  const innerRef = useRef(null);
  const [height, setHeight] = useState(isOpen ? "auto" : "0px");
  const roRef = useRef(null);

  useEffect(() => {
    const el = boxRef.current, inner = innerRef.current;
    if (!el || !inner) return;

    if (roRef.current) { try { roRef.current.disconnect(); } catch(e){} }
    if (isOpen) {
      const ro = new ResizeObserver(() => {
        if (!boxRef.current || !innerRef.current) return;
        const target = inner.scrollHeight;
        if (el.style.height !== "auto") setHeight(target + "px");
      });
      ro.observe(inner);
      roRef.current = ro;
    }

    function onEnd(e){
      if (e.target !== el || e.propertyName !== "height") return;
      if (isOpen) setHeight("auto");
    }
    el.addEventListener("transitionend", onEnd);
    return () => {
      if (roRef.current) { try { roRef.current.disconnect(); } catch(e){} roRef.current = null; }
      el.removeEventListener("transitionend", onEnd);
    };
  }, [isOpen]);

  useEffect(() => {
    const el = boxRef.current, inner = innerRef.current;
    if (!el || !inner) return;

    if (isOpen) {
      el.classList.add("open");
      requestAnimationFrame(() => {
        el.style.height = "0px";
        requestAnimationFrame(() => { setHeight(inner.scrollHeight + "px"); });
      });
    } else {
      const current = inner.offsetHeight;
      setHeight(current + "px");
      el.classList.remove("open");
      requestAnimationFrame(() => { setHeight("0px"); });
    }
  }, [isOpen]);

  return (
    <section className="border-t border-black/10 dark:border-white/10">
      <header className="flex items-center gap-4 py-3 text-base sm:text-lg">
        <button className="flex-1 text-left font-medium tracking-tight focus:outline-none" aria-expanded={isOpen} onClick={onToggle}>
          <Scramble text={label} trigger={scrambleTrigger} />
        </button>
        <button onClick={onToggle} aria-label={isOpen ? (label + " — réduire") : (label + " — développer")} className="ml-auto inline-flex items-center justify-center p-1 opacity-70 transition hover:opacity-100 focus:outline-none">
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </button>
      </header>
      <div ref={boxRef} className={"accordion" + (isOpen ? " open" : "")} style={{ height }}>
        <div ref={innerRef} className="accordion-inner"><div className="pb-8">{children}</div></div>
      </div>
    </section>
  );
}

function IntroTitle({ dims, spacePx, heroRef, bgX, hovering, lang }) {
  const t = CONTENT[lang];
  const maxWidth = dims && dims.maxWidth; const maxHeight = dims && dims.maxHeight;
  return (
    <h1 ref={heroRef} className="text-2xl sm:text-3xl md:text-4xl font-medium leading-[1.12] tracking-tight">
      <Scramble text={t.hero.hello} trigger={lang} as="span" />{"\n"}
      <span className="inline-block align-baseline relative" style={{ width: maxWidth ? (maxWidth + "px") : undefined, height: maxHeight ? (maxHeight + "px") : undefined, lineHeight: "inherit" }}>
        <span className="invisible whitespace-nowrap" style={{ lineHeight: "inherit" }}>
          Product Designer {lang === "fr" ? "chez" : "at"}
        </span>
        <span className="absolute left-0 top-0 whitespace-nowrap" style={{ lineHeight: "inherit" }}>
          <span className={hovering ? "gradient-text" : ""} style={hovering ? { backgroundPosition: (bgX + "% 50%") } : { color: "currentColor" }}>Product Designer</span>
          <span style={{ marginLeft: (typeof spacePx === "number") ? (spacePx + "px") : undefined }}>{lang === "fr" ? "chez" : "at"}</span>
        </span>
      </span>{"\n"}
      <Scramble text={t.hero.after} trigger={lang} as="span" />
    </h1>
  );
}

function TopRightControls({ lang, setLang, theme, setTheme, onLangFX, onThemeFX }) {
  const t = CONTENT[lang];
  const [open, setOpen] = useState(false);
  const tooltipRef = useRef(null);
  useEffect(() => {
    function onDocClick(e){ if (!tooltipRef.current) return; if (!tooltipRef.current.contains(e.target)) setOpen(false); }
    document.addEventListener("click", onDocClick);
    return () => { document.removeEventListener("click", onDocClick); };
  }, []);
  return (
    <div className="relative flex items-center justify-end gap-3 text-xs opacity-80 hover:opacity-100 transition">
      <button onClick={() => { setLang(lang === "fr" ? "en" : "fr"); onLangFX(); }} className="rounded-full border border-black/10 dark:border-white/10 px-2 py-1 bg-white/70 dark:bg-white/10 backdrop-blur-sm">
        <Scramble text={lang === "fr" ? "EN" : "FR"} trigger={lang} />
      </button>
      <button onClick={() => { onThemeFX(); setTheme(theme === "dark" ? "light" : "dark"); }} className="rounded-full border border-black/10 dark:border-white/10 p-1.5 bg-white/70 dark:bg-white/10 backdrop-blur-sm">
        {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
      </button>
      <div ref={tooltipRef} className="relative">
        <button onClick={() => setOpen(!open)} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} aria-label="Info" className="rounded-full border border-black/10 dark:border-white/10 p-1.5 bg-white/70 dark:bg-white/10 backdrop-blur-sm">
          <Info size={14} />
        </button>
        {open ? (
          <div className="absolute right-0 z-50 mt-2 rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 px-3 py-2 text-[11px] shadow-lg ring-1 ring-black/5 dark:ring-white/5 whitespace-nowrap">
            <Scramble text={t.labels.info} trigger={lang} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function useQueryState() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const get = (key) => params.get(key);
  const set = (obj) => {
    const p = new URLSearchParams(location.search);
    Object.entries(obj).forEach(([k,v]) => { if (v === null || v === undefined) p.delete(k); else p.set(k, String(v)); });
    navigate({ pathname: "/", search: `?${p.toString()}` }, { replace: true });
  };
  return { get, set };
}

function Home({ lang, setLang, theme, setTheme }) {
  const t = CONTENT[lang];
  const q = useQueryState();
  const initialOpen = q.get("open") || null;
  const [open, setOpen] = useState(initialOpen);
  useEffect(() => { setOpen(q.get("open")); }, [q.get("open")]);

  const [langFx, setLangFx] = useState(false);
  const [themeFx, setThemeFx] = useState(false);
  function triggerLangFX(){ setLangFx(true); setTimeout(() => setLangFx(false), 280); }
  function triggerThemeFX(){ setThemeFx(true); setTimeout(() => setThemeFx(false), 280); }

  const heroWrapRef = useRef(null);
  const heroTextRef = useRef(null);
  const [bgX, setBgX] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [dims, setDims] = useState({ maxWidth: null, maxHeight: null });
  const [spacePx, setSpacePx] = useState(0);

  useEffect(() => {
    const phrasePD = "Product Designer";
    const word = lang === "fr" ? "chez" : "at";
    function measure(){
      const system = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Noto Sans', sans-serif";
      const h = heroTextRef.current;
      const cs = h ? window.getComputedStyle(h) : null;
      const sizePx = cs ? Math.round(parseFloat(cs.fontSize) || 40) : 40;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      ctx.font = "500 " + sizePx + "px " + system;
      const wPD = ctx.measureText(phrasePD).width;
      const mAA = ctx.measureText("AA");
      const mA_A = ctx.measureText("A A");
      const space = Math.max(0, Math.round(mA_A.width - mAA.width));
      setSpacePx(space);
      const ascent = ctx.measureText(phrasePD).actualBoundingBoxAscent || sizePx * 0.8;
      const descent = ctx.measureText(phrasePD).actualBoundingBoxDescent || sizePx * 0.2;
      setDims({ maxWidth: Math.ceil(wPD + space + ctx.measureText(word).width), maxHeight: Math.ceil(ascent + descent) });
    }
    measure(); window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [lang]);

  function onMouseMoveHero(e){
    const rect = heroWrapRef.current && heroWrapRef.current.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const clamped = Math.max(0, Math.min(1, x));
    setBgX(Math.round(clamped * 100));
  }

  function openSection(name){
    const next = (open === name) ? null : name;
    setOpen(next);
    q.set({ open: next || null });
  }

  // Prepare scroller reveal effect
  const scrollerRef = useRef(null);
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const cards = el.querySelectorAll(".card");
    cards.forEach((c, i) => c.style.setProperty("--d", (i*50)+"ms"));
    requestAnimationFrame(() => el.classList.add("ready"));
  }, [lang]);

  return (
    <main className={"theme-shell flex min-h-dvh flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 " + ((langFx||themeFx) ? "fx-fade" : "")} style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Noto Sans', sans-serif" }}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-4">
        <TopRightControls lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} onLangFX={triggerLangFX} onThemeFX={triggerThemeFX} />
      </div>

      <div className="mx-auto mt-auto w-full max-w-6xl px-4 sm:px-6">
        <div ref={heroWrapRef} className={"pb-4 select-none"} onMouseEnter={() => setHovering(true)} onMouseMove={onMouseMoveHero} onMouseLeave={() => setHovering(false)}>
          <div ref={heroTextRef}>
            <IntroTitle lang={lang} hovering={hovering} bgX={bgX} dims={dims} spacePx={spacePx} heroRef={heroTextRef} />
          </div>
        </div>

        <SectionRow label={t.labels.about} scrambleTrigger={lang} isOpen={open === "about"} onToggle={() => openSection("about")}>
          <div className="grid grid-cols-1 items-start gap-10 sm:grid-cols-[minmax(150px,180px)_1fr]">
            <div className="pr-4">
              <img src={CONTENT[lang].about.photo} alt={"Portrait de " + CONTENT[lang].about.name} className="photo-square ring-1 ring-black/10 dark:ring-white/10" />
            </div>
            <div className="space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight"><Scramble text={CONTENT[lang].about.name} trigger={lang} /></h2>
                <p className="mt-1 text-sm sm:text-base text-black/60 dark:text-white/60"><Scramble text={CONTENT[lang].about.role} trigger={lang} /></p>
              </div>
              <div className="space-y-4">
                {CONTENT[lang].about.bio.map((p, i) => (
                  <p key={i} className="max-w-prose text-sm sm:text-[1.02rem] leading-relaxed text-black/80 dark:text-white/80"><Scramble text={p} trigger={lang} /></p>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => { try { var a = atob(EMAIL_B64); window.location.href = "mailto:" + a; } catch(e){} }} className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md transition bg-white/90 dark:bg-white/5 backdrop-blur">
                  <Mail size={16} /> <Scramble text={t.labels.sayHello} trigger={lang} />
                </button>
                <a href={CONTENT[lang].about.contact.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md transition bg-white/90 dark:bg-white/5 backdrop-blur">
                  <Linkedin size={16} /> <Scramble text={"LinkedIn"} trigger={lang} />
                </a>
                <a href={"tel:+33" + (CONTENT[lang].about.contact.phone || "").replace(/\D/g,'')} className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md transition bg-white/90 dark:bg-white/5 backdrop-blur">
                  <Phone size={16} /> <span>{CONTENT[lang].about.contact.phone}</span>
                </a>
              </div>
              <div>
                <h3 className="mb-2 text-base font-medium"><Scramble text={t.labels.previousWork} trigger={lang} /></h3>
                <ul className="space-y-1 text-sm text-black/70 dark:text-white/70">
                  {CONTENT[lang].about.previousWork.map((line, idx) => (<li key={idx}>• <Scramble text={line} trigger={lang} /></li>))}
                </ul>
              </div>
            </div>
          </div>
        </SectionRow>

        <SectionRow label={t.labels.projects} scrambleTrigger={lang} isOpen={open === "projects"} onToggle={() => openSection("projects")}>
          <div className="space-y-3 bleed bleed-mask">
            <div ref={scrollerRef} className="hscroller">
              {(CONTENT[lang].projects || []).map((p, i) => (
                <div key={p.id} className="card">
                  <Link to={"/projects/" + p.id} className="group block overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 shadow-sm ring-1 ring-black/5 dark:ring-white/5 transition bg-white dark:bg-neutral-900">
                    <img src={p.image} alt={"aperçu " + p.title} className="aspect-[4/3] w-full object-cover" />
                    <div className="flex items-center justify-between p-3">
                      <span className="text-sm font-medium"><Scramble text={p.title} trigger={lang} /></span>
                      <ArrowUpRight className="opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" size={16} />
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </SectionRow>
      </div>
    </main>
  );
}

function ProjectPage({ lang }) {
  const t = CONTENT[lang];
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const list = (t.projects || []);
  const index = Math.max(0, list.findIndex(p => p.id === id));
  const project = list[index];

  if (!project) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <button onClick={() => navigate('/?open=projects')} className="mb-6 inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline">
          <ChevronLeft size={16} /> <Scramble text={t.labels.back} trigger={lang} />
        </button>
        <p>Not found.</p>
      </div>
    );
  }

  const prev = index > 0 ? list[index-1] : null;
  const next = index < list.length-1 ? list[index+1] : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <button onClick={() => navigate('/?open=projects')} className="mb-6 inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline">
        <ChevronLeft size={16} /> <Scramble text={t.labels.back} trigger={lang} />
      </button>

      <h1 className="text-3xl font-semibold tracking-tight"><Scramble text={project.title} trigger={lang} /></h1>
      {project.subtitle ? <h2 className="mt-2 text-lg text-black/70 dark:text-white/70"><Scramble text={project.subtitle} trigger={lang} /></h2> : null}
      {project.summary ? <p className="mt-2 text-black/60 dark:text-white/60"><Scramble text={project.summary} trigger={lang} /></p> : null}
      {project.image ? <img src={project.image} alt="aperçu" className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover ring-1 ring-black/10 dark:ring-white/10" /> : null}
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {Array.isArray(project.description) ? project.description.map((para, idx) => <p key={idx}><Scramble text={para} trigger={lang} /></p>) : <p><Scramble text={project.description || ""} trigger={lang} /></p>}
      </div>

      <div className="mt-10 flex items-center justify-between gap-3">
        <div>
          {prev ? (
            <Link to={"/projects/" + prev.id} className="inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline">
              ← <Scramble text={t.labels.prev} trigger={lang} />
            </Link>
          ) : <span></span>}
        </div>
        <div>
          {next ? (
            <Link to={"/projects/" + next.id} className="inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline">
              <Scramble text={t.labels.next} trigger={lang} /> →
            </Link>
          ) : <span></span>}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState(getInitialLang());
  const [theme, setTheme] = useState(getInitialTheme());
  useEffect(() => { localStorage.setItem("lang", lang); }, [lang]);
  useEffect(() => {
    localStorage.setItem("theme", theme);
    const r = document.documentElement;
    if (theme === "dark") r.classList.add("dark"); else r.classList.remove("dark");
  }, [theme]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />} />
        <Route path="/projects/:id" element={<ProjectPage lang={lang} />} />
        <Route path="*" element={<Home lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />} />
      </Routes>
    </HashRouter>
  );
}
