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

  /* ---- hero cycling headline: filled and outlined alternate ---- */
  const words = [
    ["BACKEND", "ENGINEER", "fill"],
    ["CLOUD", "NATIVE DEV", "outline"],
    ["AI-FIRST", "BUILDER", "fill"],
    ["EVENT", "DRIVEN DEV", "outline"],
  ];
  const wordEl = document.getElementById("hero-word");
  let index = 0;
  if (wordEl) {
    setInterval(() => {
      wordEl.classList.add("swap-out");
      setTimeout(() => {
        index = (index + 1) % words.length;
        const [a, b, mode] = words[index];
        wordEl.innerHTML = a + "<br>" + b;
        wordEl.classList.remove("fill", "outline", "swap-out");
        wordEl.classList.add(mode);
      }, 260);
    }, 2800);
  }

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
