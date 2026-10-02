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


  /* ---- chakra orbit: wheel spins and skills fill in around it ---- */
  const TECH_LOGOS = [
    ["java","Java"],["spring","Spring Boot"],["hibernate","Hibernate"],["python","Python"],
    ["docker","Docker"],["kubernetes","Kubernetes"],["kafka","Apache Kafka"],["mysql","MySQL"],
    ["postgres","PostgreSQL"],["jenkins","Jenkins"],["prometheus","Prometheus"],["grafana","Grafana"],
    ["git","Git"],["github","GitHub"],["linux","Linux"],["maven","Maven"],["bash","Bash"],
    ["eclipse","Eclipse IDE"],["postman","Postman"],["html","HTML"],["css","CSS"],["js","JavaScript"],
    ["aws","AWS"],
  ].map(function (pair) { return { icon: pair[0], name: pair[1] }; });
  const TECH_TEXT = ["Helm","Strimzi","SonarQube","Gerrit","Swagger","REST APIs",
    "AWS Kiro","Claude","MCP","Spring AI","LangChain4j"].map(function (n) { return { icon: null, name: n }; });

  const RING_INNER = TECH_LOGOS.slice(0, 8).concat(TECH_TEXT.slice(0, 2));
  const RING_MIDDLE = TECH_LOGOS.slice(8, 18).concat(TECH_TEXT.slice(2, 4));
  const RING_OUTER = TECH_LOGOS.slice(18, 23).concat(TECH_TEXT.slice(4));
  const SKILLS = RING_INNER.concat(RING_MIDDLE, RING_OUTER);
  const RING_SIZES = [RING_INNER.length, RING_MIDDLE.length, RING_OUTER.length];

  const orbitEl = document.getElementById("orbit");
  const orbitCount = document.getElementById("orbit-count");
  const stackSection = document.getElementById("stack");

  if (orbitEl && stackSection) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tiles = [];

    SKILLS.forEach(function (skill) {
      const tile = document.createElement("div");
      tile.className = "orb-skill";
      tile.setAttribute("data-name", skill.name);
      tile.setAttribute("aria-label", skill.name);
      tile.title = skill.name;
      if (skill.icon) {
        const img = document.createElement("img");
        img.src = "https://skillicons.dev/icons?i=" + skill.icon + "&theme=dark";
        img.alt = skill.name;
        img.loading = "lazy";
        tile.appendChild(img);
      } else {
        const abbr = document.createElement("span");
        abbr.className = "abbr";
        abbr.textContent = skill.name.split(" ")[0];
        tile.appendChild(abbr);
      }
      orbitEl.appendChild(tile);
      tiles.push(tile);
    });

    function layoutOrbit() {
      const w = orbitEl.offsetWidth || 1;
      const h = orbitEl.offsetHeight || 1;
      const minHalf = Math.min(w, h) / 2;
      // Solve tile width so three rings + guaranteed radial gaps fit the circle:
      // r1 = 1.846*tw (10 tiles), r3 = r1 + 2 gaps, gap = 1.14*(tw+12).
      let tw = 104;
      while (tw > 44) {
        const gap = 1.16 * (tw * 0.92 + 10);
        const r3 = 1.846 * tw + 2 * gap;
        if (r3 + (tw * 0.92 + 10) / 2 + 8 <= minHalf) break;
        tw -= 2;
      }
      const gap = 1.16 * (tw * 0.92 + 10);
      const r1 = 1.846 * tw;
      const r2 = Math.max((RING_SIZES[1] * 1.16 * tw) / (2 * Math.PI), r1 + gap);
      const r3 = Math.max((RING_SIZES[2] * 1.16 * tw) / (2 * Math.PI), r2 + gap);
      const radii = [r1, r2, r3];
      const imgH = Math.min(56, tw * 0.62);
      orbitEl.style.setProperty("--tw", tw + "px");
      orbitEl.style.setProperty("--ih", imgH + "px");
      let idx = 0;
      RING_SIZES.forEach(function (count, ringNo) {
        const r = radii[ringNo];
        for (let k = 0; k < count; k++, idx++) {
          const angle = (k / count) * Math.PI * 2 - Math.PI / 2 + ringNo * 0.26;
          tiles[idx].style.left = (w / 2 + Math.cos(angle) * r - tw / 2) + "px";
          tiles[idx].style.top = (h / 2 + Math.sin(angle) * r - (tw * 0.92 + 10) / 2) + "px";
        }
      });
      if (reduceMotion) tiles.forEach(function (t2) { t2.classList.add("on"); });
    }
    layoutOrbit();
    window.addEventListener("resize", layoutOrbit);

    function fillChakra() {
      orbitEl.classList.add("spun");           // wheel spins 210 deg and settles
      let shown = 0;
      const timer = setInterval(function () {
        shown += 1;
        if (shown <= SKILLS.length && tiles[shown - 1]) tiles[shown - 1].classList.add("on");
        if (orbitCount) orbitCount.textContent = String(Math.min(shown, SKILLS.length));
        if (shown >= SKILLS.length) clearInterval(timer);
      }, 62);
    }

    if (reduceMotion) {
      if (orbitCount) orbitCount.textContent = String(SKILLS.length);
    } else {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            fillChakra();
            observer.disconnect();
          }
        });
      }, { threshold: 0.25 });
      observer.observe(orbitEl);
    }
  }
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
  const wordEl = document.getElementById("hero-word-inner");
  let lastIndex = -1;

  function scrub() {
    if (!heroSection) return;
    const total = heroSection.offsetHeight - window.innerHeight;
    const p = Math.min(1, Math.max(0, -heroSection.getBoundingClientRect().top / Math.max(1, total)));

    if (avatar) {
      const swing = Math.sin(p * Math.PI);           // 0 -> 1 -> 0
      const turn = -40 + 80 * p;                     // rotateY: deep left-to-right 3D turn
      const scale = 0.88 + 0.3 * swing;              // photo enlarges, clamped
      const lift = -14 * swing;                      // gentle float, stays below the nav
      avatar.style.transform =
        "perspective(1100px) rotateY(" + turn.toFixed(1) + "deg) rotateX(" + (-8 * swing).toFixed(1) + "deg) "
        + "translateY(" + lift.toFixed(1) + "px) scale(" + scale.toFixed(3) + ")";
    }

    const wrap = document.getElementById("hero-word-wrap");
    const wide = window.matchMedia("(min-width: 761px)").matches;
    if (wrap && wide) {
      wrap.style.transform =
        "perspective(800px) rotateX(" + (12 - p * 24).toFixed(1) + "deg) translateY(" + (p * -30).toFixed(1) + "px) scale(" + (1 + p * 0.1).toFixed(3) + ")";
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

  /* ---- Kview mockup interactive tab switcher ---- */
  const mockupTabs = document.querySelectorAll(".mockup-tab");
  const mockupSlides = document.querySelectorAll(".mockup-slide");
  if (mockupTabs.length && mockupSlides.length) {
    mockupTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const targetId = "slide-" + tab.getAttribute("data-target");
        mockupTabs.forEach((t) => t.classList.remove("active"));
        mockupSlides.forEach((s) => s.classList.remove("active"));
        tab.classList.add("active");
        const targetSlide = document.getElementById(targetId);
        if (targetSlide) targetSlide.classList.add("active");
      });
    });
  }

  /* ---- mobile menu drawer auto-collapse on link click ---- */
  const navToggle = document.getElementById("nav-toggle");
  if (navToggle) {
    document.querySelectorAll("nav ul a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.checked = false;
      });
    });
  }
})();

