// Theme Toggle
(function ThemeToggle() {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("theme") || "light";
  root.setAttribute("data-theme", savedTheme);

  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
})();

// Burger menu
const btn = document.querySelector(".burger");
const nav = document.getElementById("site-nav");

btn.addEventListener("click", () => {
  const isOpen = btn.classList.toggle("is-open");
  nav.dataset.state = isOpen ? "open" : "closed";
  btn.setAttribute("aria-expanded", String(isOpen));
});

// Parallax
(function ParallaxHero() {
  const hero = document.querySelector(".hero");
  const items = Array.from(document.querySelectorAll(".parallax-item"));
  if (!hero || !items.length) return;

  const MAX_Y = 320;
  const SCROLL_RANGE = 600;
  const CENTER_FACTOR = 0.4;

  let ticking = false;
  let inited = false;
  let states = [];

  function initStates() {
    if (inited) return;
    const heroRect = hero.getBoundingClientRect();
    const heroCenterX = heroRect.left + heroRect.width / 2 + window.scrollX;

    states = items.map((el) => {
      const r = el.getBoundingClientRect();
      const elCenterX = r.left + r.width / 2 + window.scrollX;
      const startDx = elCenterX - heroCenterX;
      return { el, startDx };
    });

    inited = true;
  }

  function update() {
    initStates();

    const scrolledInto = Math.max(0, -hero.getBoundingClientRect().top);
    const t = Math.min(1, scrolledInto / SCROLL_RANGE);

    states.forEach(({ el, startDx }) => {
      const translateX = -startDx * t * CENTER_FACTOR;
      const translateY = MAX_Y * t;
      const rot = el.classList.contains("tile--right")
        ? "rotate(10deg)"
        : "rotate(-10deg)";
      el.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) ${rot}`;
    });

    ticking = false;
  }

  function requestUpdate() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  // Activate only when hero is visible
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) requestUpdate();
      },
      { threshold: 0 }
    );
    io.observe(hero);

    window.addEventListener("scroll", requestUpdate, { passive: true });
  } else {
    window.addEventListener("scroll", requestUpdate, { passive: true });
  }

  window.addEventListener("resize", () => {
    inited = false;
    requestUpdate();
  });

  update();
})();

// Loop swiper with counter
(function SwiperWithMeta() {
  document.addEventListener("DOMContentLoaded", () => {
    const currentEl = document.getElementById("currentPage");
    const totalEl = document.getElementById("totalPages");
    const progressEl = document.getElementById("progressBar");

    if (!currentEl || !totalEl || !progressEl) return;

    const swiper = new Swiper(".swiper", {
      loop: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      spaceBetween: 24,
      slidesPerView: 1,
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1280: { slidesPerView: 4 },
      },
      on: {
        init(s) {
          setTotal(s);
          updateMeta(s);
        },
        slideChange: updateMeta,
        resize: updateMeta,
      },
    });

    function setTotal(s) {
      const realSlides = s.wrapperEl.querySelectorAll(
        ".swiper-slide:not(.swiper-slide-duplicate)"
      );
      totalEl.textContent = realSlides.length;
      s.realTotal = realSlides.length;
    }

    function updateMeta(s) {
      const total = s.realTotal || 0;
      const current = (s.realIndex ?? 0) + 1;
      currentEl.textContent = String(current);
      progressEl.style.width = (current / total) * 100 + "%";
    }
  });
})();
