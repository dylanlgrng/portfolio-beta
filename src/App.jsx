
import React, { useRef, useState, useEffect } from "react";
import { HashRouter, Routes, Route, Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Plus, Minus, Sun, Moon, Info, ArrowUpRight } from "lucide-react";

const EMAIL_B64 = "bGFncmFuZ2VkeWxhbkBnbWFpbC5jb20="; // lagrangedylan@gmail.com

const GENERIC_BODY = {
  fr: [
    "Texte d’exemple : présentez le contexte (problème, public, objectifs) et votre rôle (recherche, ateliers, prototypage, tests, cadrage technique…).",
    "Expliquez les décisions clés : contraintes rencontrées, arbitrages UX/UI, accessibilité, performance, éco-conception.",
    "Résultats & impact : indicateurs avant/après, retours utilisateurs, apprentissages et suites du projet."
  ],
  en: [
    "Placeholder text: outline the context (problem, audience, goals) and your role (research, workshops, prototyping, testing, technical framing…).",
    "Explain key decisions: constraints, UX/UI trade-offs, accessibility, performance and eco-design considerations.",
    "Outcomes & impact: before/after metrics, user feedback, learnings, and next steps."
  ]
};

const CONTENT = {
  fr: {
    hero: { hello: "Bonjour je suis Dylan,", after: "UX Republic à Bordeaux." },
    labels: {
      about: "À propos", projects: "Projets",
      back: "Retour",
      info: "Conçu en vibe coding en React avec ChatGPT 5.2.",
      next: "Projet suivant", prev: "Projet précédent",
      contactLine: "Vous pouvez me contacter par ",
      email: "mail",
      or: " ou sur ",
      linkedin: "LinkedIn"
    },
    about: {
      headerName: "Dylan Lagrange",
      headerUpdated: "Mis à jour en janvier 2026",
      paragraphs: [
        "Je suis né dans les Landes et je vis aujourd’hui à Bordeaux.",
        "Je travaille actuellement pour UX-Republic, en mission au sein de la DSI de la MAIF. J’y conçois et fais évoluer des outils internes utilisés au quotidien par les collaborateurs, en travaillant main dans la main avec les équipes métiers, produit, tech et design. J’interviens sur des produits complexes comme des logiciels métiers, des design systems, des sujets d’accessibilité ou des outils de communication multicanale, avec l’envie de rendre les parcours plus clairs, plus simples et plus cohérents.",
        "Auparavant, j’ai travaillé chez Kairos Agency, une agence web bordelaise spécialisée dans l’éco-conception. J’y ai conçu des produits très variés, du SaaS B2B à l’e-learning, en passant par des sites à fort impact, des design systems et des interfaces de gestion, pour des organisations publiques et privées.",
        "Mon objectif est d’imaginer des expériences utiles et durables, au service des utilisateurs comme des organisations, en intégrant des valeurs d’inclusivité et d’éco-responsabilité. Mon travail est aussi nourri par un intérêt pour les pratiques artistiques et artisanales, notamment le cinéma, l’architecture et la photographie, ainsi que par une attention constante portée aux évolutions technologiques et à leurs usages."
      ],
      linkedin: "https://www.linkedin.com/in/dylanlgrng/"
    },
    projects: []
  },
  en: {
    hero: { hello: "Hi, I’m Dylan,", after: "UX Republic in Bordeaux." },
    labels: {
      about: "About me", projects: "Projects",
      back: "Back",
      info: "Built in vibe-coding style with React and ChatGPT 5.2.",
      next: "Next project", prev: "Previous project",
      contactLine: "You can reach me by ",
      email: "email",
      or: " or on ",
      linkedin: "LinkedIn"
    },
    about: {
      headerName: "Dylan Lagrange",
      headerUpdated: "Updated January 2026",
      paragraphs: [
        "Born in the Landes, now based in Bordeaux.",
        "I currently work for UX-Republic on assignment within MAIF’s IT department. I design and evolve internal tools used daily by employees, partnering closely with business, product, engineering and design teams. I work on complex products—line-of-business software, design systems, accessibility topics and multichannel communication tools—with the aim of making journeys clearer, simpler and more coherent.",
        "Previously, I worked at Kairos Agency, a Bordeaux-based web agency specializing in eco-design. I designed a wide range of products—from B2B SaaS to e-learning—plus high-impact websites, design systems and admin interfaces for public and private organizations.",
        "My goal is to craft useful, durable experiences that serve both users and organizations, grounded in inclusivity and environmental responsibility. My work is also informed by artistic and craft practices—film, architecture and photography—and by an ongoing attention to technology and its uses."
      ],
      linkedin: "https://www.linkedin.com/in/dylanlgrng/"
    },
    projects: []
  }
};

function seed(lang) {
  const arr = CONTENT[lang].projects;
  arr.push({ id:"maif",
    title: lang==="fr" ? "MAIF — Outils métiers & design system" : "MAIF — Internal tools & design system",
    subtitle: lang==="fr" ? "Mission en cours (UX-Republic → MAIF)" : "Ongoing assignment (UX-Republic → MAIF)",
    summary: lang==="fr" ? "Évolution d’outils métiers, design system, accessibilité." : "Internal tools, design system, accessibility.",
    image:"/images/projects/maif.svg", hero:"/images/projects/maif.svg"
  });
  for (let i=1;i<=11;i++){
    const id = "p"+String(i).padStart(2,"0");
    arr.push({
      id,
      title: lang==="fr" ? `Projet ${i} — Titre provisoire` : `Project ${i} — Working title`,
      subtitle: lang==="fr" ? "Sous-titre / contexte rapide" : "Subtitle / quick context",
      summary: lang==="fr" ? "Courte phrase d’accroche du projet." : "Short one-liner for the card.",
      image:`/images/projects/${id}.svg`,
      hero:`/images/projects/${id}.svg`
    });
  }
}
seed("fr"); seed("en");

// Theme helpers
function getInitialTheme(){
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}
function getThemeOverride(){ return localStorage.getItem("theme_override") === "1"; }

// Query helper (to reopen section on back)
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

function SectionRow({ label, rightAdornment, isOpen, onToggle, children }) {
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
        <button className="flex-1 text-left font-normal tracking-tight focus:outline-none" aria-expanded={isOpen} onClick={onToggle}>
          {label}
        </button>
        <div className="mr-2 hidden sm:block">{rightAdornment}</div>
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
    <h1 ref={heroRef} className="text-[1.45rem] sm:text-[1.7rem] md:text-[2rem] font-normal leading-[1.14] tracking-tight">
      {t.hero.hello}
      <br />
      <span className="inline-block align-baseline relative" style={{ width: maxWidth ? (maxWidth + "px") : undefined, height: maxHeight ? (maxHeight + "px") : undefined, lineHeight: "inherit" }}>
        <span className="invisible whitespace-nowrap" style={{ lineHeight: "inherit" }}>Product Designer {lang === "fr" ? "chez" : "at"}</span>
        <span className="absolute left-0 top-0 whitespace-nowrap" style={{ lineHeight: "inherit" }}>
          <span className={hovering ? "gradient-text" : ""} style={hovering ? { backgroundPosition: (bgX + "% 50%") } : { color: "currentColor" }}>Product Designer</span>
          <span style={{ marginLeft: (typeof spacePx === "number") ? (spacePx + "px") : undefined }}>{lang === "fr" ? "chez" : "at"}</span>
        </span>
      </span>
      <br />
      {t.hero.after}
    </h1>
  );
}

function TopRightControls({ lang, setLang, theme, setTheme, onLangFX }) {
  const [open, setOpen] = useState(false);
  const tooltipRef = useRef(null);
  useEffect(() => {
    function onDocClick(e){ if (!tooltipRef.current) return; if (!tooltipRef.current.contains(e.target)) setOpen(false); }
    document.addEventListener("click", onDocClick);
    return () => { document.removeEventListener("click", onDocClick); };
  }, []);
  const t = CONTENT[lang];
  return (
    <div className="relative flex items-center justify-end gap-3 text-xs opacity-80 hover:opacity-100 transition">
      <button onClick={() => { setLang(lang === "fr" ? "en" : "fr"); onLangFX && onLangFX(); }} className="rounded-full border border-black/10 dark:border-white/10 px-2 py-1 bg-white/70 dark:bg-white/10 backdrop-blur-sm">
        {lang === "fr" ? "EN" : "FR"}
      </button>
      <button onClick={() => { setTheme(theme === "dark" ? "light" : "dark"); localStorage.setItem("theme_override","1"); }} className="rounded-full border border-black/10 dark:border-white/10 p-1.5 bg-white/70 dark:bg-white/10 backdrop-blur-sm">
        {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
      </button>
      <div ref={tooltipRef} className="relative">
        <button onClick={() => setOpen(!open)} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} aria-label="Info" className="rounded-full border border-black/10 dark:border-white/10 p-1.5 bg-white/70 dark:bg-white/10 backdrop-blur-sm">
          <Info size={14} />
        </button>
        {open ? (
          <div className="absolute right-0 z-50 mt-2 rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 px-3 py-2 text-[11px] shadow-lg ring-1 ring-black/5 dark:ring-white/5 whitespace-nowrap">
            {t.labels.info}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ProjectCards({ items, animateKey }){
  const listRef = useRef(null);
  useEffect(() => {
    const el = listRef.current; if (!el) return;
    el.classList.remove("ready");
    const cards = el.querySelectorAll(".p-card");
    cards.forEach((c, i) => c.style.setProperty("--d", (i*45)+"ms"));
    requestAnimationFrame(() => el.classList.add("ready"));
  }, [items && items.length, animateKey]);
  return (
    <div ref={listRef} className="p-list">
      {items.map((p) => (
        <Link key={p.id} to={"/projects/" + p.id} className="p-card group">
          <div className="flex-1 min-w-0">
            <div className="p-line">
              <span className="p-title">{p.title}</span>
              {p.subtitle ? <span className="p-sep">—</span> : null}
              {p.subtitle ? <span className="p-sub">{p.subtitle}</span> : null}
            </div>
          </div>
          <ArrowUpRight className="opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" size={16} />
        </Link>
      ))}
    </div>
  );
}

function useSystemThemeSync(enabled){
  useEffect(() => {
    if (!enabled) return;
    const mm = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
    if (!mm) return;
    function onChange(e){
      const next = e.matches ? "dark" : "light";
      document.documentElement.classList.toggle("dark", next === "dark");
      localStorage.setItem("theme", next);
    }
    mm.addEventListener ? mm.addEventListener("change", onChange) : mm.addListener(onChange);
    return () => {
      mm.removeEventListener ? mm.removeEventListener("change", onChange) : mm.removeListener(onChange);
    };
  }, [enabled]);
}

function Home({ lang, setLang, theme, setTheme }) {
  const t = CONTENT[lang];
  const q = useQueryState();
  const initialOpen = q.get("open") || null;
  const [open, setOpen] = useState(initialOpen);
  useEffect(() => { setOpen(q.get("open")); }, [q.get("open")]);

  // First-load intro: show hero immediately, rest fades in once
  const [restVisible, setRestVisible] = useState(true);
  useEffect(() => {
    const seen = sessionStorage.getItem("intro_seen") === "1";
    if (!seen) {
      setRestVisible(false);
      const t = setTimeout(() => {
        setRestVisible(true);
        sessionStorage.setItem("intro_seen","1");
      }, 450); // subtle delay
      return () => clearTimeout(t);
    }
  }, []);

  // Hero hover gradient
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
      const sizePx = cs ? Math.round(parseFloat(cs.fontSize) || 48) : 48;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      ctx.font = "400 " + sizePx + "px " + system;
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

  const ContactLine = () => (
    <p className="text-[0.98rem] leading-relaxed text-black/80 dark:text-white/80">
      {t.labels.contactLine}
      <a href="#" onClick={(e)=>{e.preventDefault(); try { const addr = atob(EMAIL_B64); window.location.href = "mailto:" + addr; } catch(_) {} }} className="underline underline-offset-2 hover:no-underline">
        {t.labels.email}
      </a>
      {t.labels.or}
      <a href={CONTENT[lang].about.linkedin} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:no-underline">
        {t.labels.linkedin}
      </a>
      .
    </p>
  );

  return (
    <main className={"theme-shell flex min-h-dvh flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100"} style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Noto Sans', sans-serif" }}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-4">
        <TopRightControls lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} onLangFX={()=>{}} />
      </div>

      <div className="mx-auto mt-auto w-full max-w-6xl px-4 sm:px-6">
        <div ref={heroWrapRef} className={"pb-4 select-none"} onMouseEnter={() => setHovering(true)} onMouseMove={onMouseMoveHero} onMouseLeave={() => setHovering(false)}>
          <div ref={heroTextRef} className="opacity-0 animate-[fadein_.45s_ease_forwards] [@keyframes_fadein]{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}">
            <IntroTitle lang={lang} hovering={hovering} bgX={bgX} dims={dims} spacePx={spacePx} heroRef={heroTextRef} />
          </div>
        </div>

        <div className={"intro-rest " + (restVisible ? "visible" : "")}>
          <SectionRow label={t.labels.about} isOpen={open === "about"} onToggle={() => openSection("about")}>
            <div className="space-y-3 max-w-[500px]">
              <div className="text-[0.98rem] leading-tight">
                <div className="text-neutral-800 dark:text-neutral-200">{CONTENT[lang].about.headerName}</div>
                <div className="text-neutral-500 dark:text-neutral-400">{CONTENT[lang].about.headerUpdated}</div>
              </div>
              {CONTENT[lang].about.paragraphs.map((p, i) => (
                <p key={i} className="text-[0.98rem] leading-relaxed text-black/80 dark:text-white/80">{p}</p>
              ))}
              <ContactLine />
            </div>
          </SectionRow>

          <SectionRow label={t.labels.projects} isOpen={open === "projects"} onToggle={() => openSection("projects")}>
            <ProjectCards items={CONTENT[lang].projects || []} animateKey={open === "projects" ? "open" : "closed"} />
          </SectionRow>
        </div>
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
          <ChevronLeft size={16} /> {t.labels.back}
        </button>
        <p>Not found.</p>
      </div>
    );
  }

  const prev = index > 0 ? list[index-1] : null;
  const next = index < list.length-1 ? list[index+1] : null;

  const body = GENERIC_BODY[lang];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <button onClick={() => navigate('/?open=projects')} className="mb-6 inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline">
        <ChevronLeft size={16} /> {t.labels.back}
      </button>

      <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>
      {project.subtitle ? <h2 className="mt-2 text-lg text-black/70 dark:text-white/70">{project.subtitle}</h2> : null}
      {project.summary ? <p className="mt-2 text-black/60 dark:text-white/60">{project.summary}</p> : null}

      <img src={project.hero || project.image} alt="aperçu" className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover ring-1 ring-black/10 dark:ring-white/10" />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-8">
        {body.map((p,i)=>(<p key={i}>{p}</p>))}
      </div>

      <div className="mt-10 flex items-center justify-between gap-3">
        <div>
          {prev ? (
            <Link to={"/projects/" + prev.id} className="inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline">
              ← {t.labels.prev}
            </Link>
          ) : <span></span>}
        </div>
        <div>
          {next ? (
            <Link to={"/projects/" + next.id} className="inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline">
              {t.labels.next} →
            </Link>
          ) : <span></span>}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState(localStorage.getItem("lang") === "en" ? "en" : "fr");
  const [theme, setTheme] = useState(getInitialTheme());
  const [override, setOverride] = useState(getThemeOverride());

  useEffect(() => { localStorage.setItem("lang", lang); }, [lang]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const r = document.documentElement;
    r.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Sync with system when there is no manual override
  useSystemThemeSync(!override);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home lang={lang} setLang={setLang} theme={theme} setTheme={(t)=>{ setTheme(t); setOverride(true); localStorage.setItem("theme_override","1"); }} />} />
        <Route path="/projects/:id" element={<ProjectPage lang={lang} />} />
        <Route path="*" element={<Home lang={lang} setLang={setLang} theme={theme} setTheme={(t)=>{ setTheme(t); setOverride(true); localStorage.setItem("theme_override","1"); }} />} />
      </Routes>
    </HashRouter>
  );
}
