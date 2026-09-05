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
      const scale = 0.92 + 0.2 * Math.sin(p * Math.PI);
      avatar.style.transform = "rotate(" + (p * 360).toFixed(1) + "deg) scale(" + scale.toFixed(3) + ")";
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
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
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

  /* ---- scroll reveal ---- */
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    }),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();
