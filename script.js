/* Ritik Bansod · portfolio interactions */
(function () {
  "use strict";

  /* ---- boot overlay: progress to 100%, then fade out ---- */
  const boot = document.getElementById("boot");
  const fill = document.getElementById("boot-fill");
  const pct = document.getElementById("boot-pct");
  let progress = 0;
  const timer = setInterval(() => {
    progress = Math.min(100, progress + Math.random() * 14 + 5);
    if (fill) fill.style.width = progress + "%";
    if (pct) pct.textContent = Math.floor(progress) + "%";
    if (progress >= 100) {
      clearInterval(timer);
      setTimeout(dismissBoot, 350);
    }
  }, 130);

  function dismissBoot() {
    if (!boot) return;
    boot.classList.add("done");
    setTimeout(() => boot.remove(), 600);
  }
  if (boot) boot.addEventListener("click", dismissBoot);

  /* ---- scroll-driven color system: each section paints its own theme ---- */
  const THEMES = {
    home:      { accent: "#F0B27A", soft: "rgba(240, 178, 122, 0.13)", bg: "#0A0C12" },
    about:     { accent: "#A78BFA", soft: "rgba(167, 139, 250, 0.12)", bg: "#0C0A16" },
    expertise: { accent: "#67E8F9", soft: "rgba(103, 232, 249, 0.11)", bg: "#071018" },
    projects:  { accent: "#6EE7B7", soft: "rgba(110, 231, 183, 0.11)", bg: "#081210" },
    contact:   { accent: "#93A7FD", soft: "rgba(147, 167, 253, 0.12)", bg: "#090D18" },
  };
  const rootStyle = document.documentElement.style;
  let activeTheme = "";
  function applyTheme(name) {
    if (name === activeTheme) return;
    const t = THEMES[name];
    if (!t) return;
    rootStyle.setProperty("--accent", t.accent);
    rootStyle.setProperty("--accent-soft", t.soft);
    rootStyle.setProperty("--bg", t.bg);
    activeTheme = name;
  }
  function themeByScroll() {
    const mid = window.innerHeight * 0.5;
    let current = "home";
    for (const id of Object.keys(THEMES)) {
      const el = document.getElementById(id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) { current = id; break; }
    }
    applyTheme(current);
  }
  window.addEventListener("scroll", themeByScroll, { passive: true });
  themeByScroll();


  /* ---- hero: scroll scrubs the photo through a 360 rotation ---- */
  const words = [
    ["BACKEND", "ENGINEER", "fill"],
    ["CLOUD", "NATIVE DEV", "outline"],
    ["AI-FIRST", "BUILDER", "fill"],
    ["EVENT", "DRIVEN DEV", "outline"],
  ];
  const heroSection = document.getElementById("home");
  const avatar = document.getElementById("hero-avatar");
  const hint = document.getElementById("scroll-hint");
  const wordEl = document.getElementById("hero-word");
  let lastIndex = -1;

  function scrub() {
    if (!heroSection) return;
    const total = heroSection.offsetHeight - window.innerHeight;
    const p = Math.min(1, Math.max(0, -heroSection.getBoundingClientRect().top / Math.max(1, total)));

    if (avatar) {
      const swing = Math.sin(p * Math.PI);           // 0 -> 1 -> 0
      const turn = -40 + 80 * p;                     // rotateY: deep left-to-right 3D turn
      const scale = 0.86 + 0.5 * swing;              // photo enlarges mid-scroll
      const lift = -26 * swing;                      // floats up at the center
      avatar.style.transform =
        "perspective(1100px) rotateY(" + turn.toFixed(1) + "deg) rotateX(" + (-8 * swing).toFixed(1) + "deg) "
        + "translateY(" + lift.toFixed(1) + "px) scale(" + scale.toFixed(3) + ")";
    }

    const wrap = document.getElementById("hero-word-wrap");
    if (wrap) {
      wrap.style.transform =
        "perspective(800px) rotateX(" + (12 - p * 30).toFixed(1) + "deg) translateY(" + (p * -70).toFixed(1) + "px) scale(" + (1 + p * 0.14).toFixed(3) + ")";
    }

    const idx = Math.min(words.length - 1, Math.floor(p * words.length));
    if (idx !== lastIndex && wordEl) {
      const parts = words[idx];
      wordEl.classList.remove("fill", "outline");
      wordEl.classList.add(parts[2]);
      wordEl.innerHTML = parts[0] + "<br>" + parts[1];
      lastIndex = idx;
    }

    if (hint) hint.style.opacity = String(Math.max(0, 1 - p * 4));
  }
  window.addEventListener("scroll", scrub, { passive: true });
  window.addEventListener("resize", scrub);
  scrub();

  /* ---- cursor spotlight follows the mouse ---- */
  const glow = document.getElementById("cursor-glow");
  if (window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener("mousemove", (e) => {
      if (!glow) return;
      glow.style.transform = "translate3d(" + (e.clientX - 280) + "px, " + (e.clientY - 280) + "px, 0)";
    });
  } else if (glow) {
    glow.remove();
  }

  /* ---- spotlight that follows the cursor inside root cards ---- */
  document.querySelectorAll(".root-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - rect.left) + "px");
      card.style.setProperty("--my", (e.clientY - rect.top) + "px");
    });
  });


  /* ---- moving cards: 3D tilt that follows the cursor ---- */
  document.querySelectorAll(".tilt, .cube").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      const isCube = card.classList.contains("cube");
      const ry = isCube ? x * 10 : x * 16;
      const rx = isCube ? -y * 8 : -y * 12;
      const lift = isCube ? 26 : 5;
      card.style.transform =
        "perspective(850px) rotateY(" + ry.toFixed(2) + "deg) rotateX(" + rx.toFixed(2) + "deg) translateZ(" + lift + "px) translateY(-5px)";
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });

  /* ---- scroll reveal ---- */
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    }),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();
