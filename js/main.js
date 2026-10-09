/* ============================================================
   MAIN — mobile nav, lightbox, interactive canvas demo
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Mobile navigation ---------- */

  function initNav() {
    const toggle = document.getElementById("nav-toggle");
    const nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    /* Close nav when a link is clicked (mobile) */
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    /* Close nav on Escape */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- Lightbox ---------- */

  function initLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;

    const img = lightbox.querySelector(".lightbox__img");
    const caption = lightbox.querySelector(".lightbox__caption");
    const closeBtn = lightbox.querySelector(".lightbox__close");
    const prevBtn = lightbox.querySelector(".lightbox__prev");
    const nextBtn = lightbox.querySelector(".lightbox__next");

    let items = [];
    let currentIndex = 0;
    let lastFocused = null;

    function open(index) {
      currentIndex = index;
      lastFocused = document.activeElement;
      update();
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      closeBtn.focus();
      document.body.style.overflow = "hidden";
    }

    function close() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    function update() {
      const item = items[currentIndex];
      img.src = item.src;
      img.alt = item.alt || "";
      caption.textContent = item.caption || "";
      prevBtn.style.visibility = items.length > 1 ? "visible" : "hidden";
      nextBtn.style.visibility = items.length > 1 ? "visible" : "hidden";
    }

    function prev() {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      update();
    }

    function next() {
      currentIndex = (currentIndex + 1) % items.length;
      update();
    }

    /* Collect all [data-lightbox] triggers on the page */
    const triggers = Array.prototype.slice.call(
      document.querySelectorAll("[data-lightbox]")
    );

    triggers.forEach(function (trigger, index) {
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        items = triggers.map(function (t) {
          return {
            src: t.getAttribute("href"),
            alt: t.getAttribute("data-alt") || "",
            caption: t.getAttribute("data-caption") || "",
          };
        });
        open(index);
      });
    });

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", prev);
    nextBtn.addEventListener("click", next);

    /* Click backdrop to close */
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });

    /* Keyboard navigation */
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    });
  }

  /* ---------- Interactive canvas demo (homepage) ---------- */

  function initCanvasDemo() {
    const canvas = document.getElementById("demo-canvas");
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let particles = [];
    let rafId = null;
    let running = false;

    const mouse = { x: -9999, y: -9999 };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    }

    function initParticles() {
      const count = Math.min(140, Math.floor((width * height) / 9000));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          r: Math.random() * 1.6 + 0.6,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      /* Background */
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      /* Connections */
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 1;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      /* Particles */
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        /* Mouse interaction */
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 120 && mdist > 0) {
          const force = (120 - mdist) / 120;
          p.vx += (mdx / mdist) * force * 0.15;
          p.vy += (mdy / mdist) * force * 0.15;
        }

        p.vx *= 0.98;
        p.vy *= 0.98;

        p.x += p.vx;
        p.y += p.vy;

        /* Wrap around edges */
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.fill();
      }

      if (running) {
        rafId = requestAnimationFrame(draw);
      }
    }

    function start() {
      if (running) return;
      running = true;
      draw();
    }

    function stop() {
      running = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    /* Mouse / touch interaction */
    canvas.addEventListener("mousemove", function (e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener("mouseleave", function () {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    canvas.addEventListener("touchmove", function (e) {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      mouse.x = touch.clientX - rect.left;
      mouse.y = touch.clientY - rect.top;
    });

    canvas.addEventListener("touchend", function () {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    /* Visibility handling */
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stop();
      } else if (!prefersReducedMotion) {
        start();
      }
    });

    window.addEventListener("resize", resize);

    if (prefersReducedMotion) {
      /* Static frame only */
      resize();
      draw();
    } else {
      resize();
      start();
    }
  }

  /* ---------- Init ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initLightbox();
    initCanvasDemo();
  });
})();