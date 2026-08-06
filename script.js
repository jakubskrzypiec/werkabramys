(() => {
  const body = document.body;
  const header = document.getElementById("siteHeader");
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.getElementById("mainNav");
  const progressBar = document.querySelector(".scroll-progress span");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const setMenu = (open) => {
    body.classList.toggle("menu-open", open);
    menuToggle?.setAttribute("aria-expanded", String(open));
    menuToggle?.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
  };

  menuToggle?.addEventListener("click", () => setMenu(!body.classList.contains("menu-open")));
  mainNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && body.classList.contains("menu-open")) setMenu(false);
  });

  const updateChrome = () => {
    header?.classList.toggle("scrolled", window.scrollY > 24);
    if (progressBar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    }
  };
  updateChrome();
  window.addEventListener("scroll", updateChrome, { passive: true });

  const currentPage = body.dataset.page;
  document.querySelector(`[data-nav="${currentPage}"]`)?.setAttribute("aria-current", "page");
  requestAnimationFrame(() => body.classList.add("page-ready"));

  body.classList.add("reveal-ready");
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries, revealObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -45px" });
    reveals.forEach((element) => observer.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add("visible"));
  }

  const parallaxItems = [...document.querySelectorAll("[data-parallax]")];
  if (parallaxItems.length && !reducedMotion) {
    let ticking = false;
    const renderParallax = () => {
      parallaxItems.forEach((item) => {
        const factor = Number(item.dataset.parallax || 0.1);
        const rect = item.parentElement?.getBoundingClientRect();
        if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) return;
        item.style.transform = `translate3d(0, ${window.scrollY * factor}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(renderParallax);
        ticking = true;
      }
    }, { passive: true });
    renderParallax();
  }

  if (window.matchMedia("(pointer: fine)").matches && !reducedMotion) {
    document.querySelectorAll(".magnetic").forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.16;
        element.style.transform = `translate(${x}px, ${y}px)`;
      });
      element.addEventListener("pointerleave", () => { element.style.transform = ""; });
    });

    document.querySelectorAll(".tilt-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const rx = ((event.clientY - rect.top) / rect.height - 0.5) * -5;
        const ry = ((event.clientX - rect.left) / rect.width - 0.5) * 5;
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }

  document.querySelectorAll(".faq-list details").forEach((detail) => {
    detail.addEventListener("toggle", () => {
      if (!detail.open) return;
      document.querySelectorAll(".faq-list details[open]").forEach((other) => {
        if (other !== detail) other.open = false;
      });
    });
  });

  const quoteForm = document.querySelector("[data-whatsapp-form]");
  const formStatus = document.getElementById("formStatus");
  quoteForm?.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", () => field.closest(".field")?.classList.remove("invalid"));
    field.addEventListener("change", () => field.closest(".field")?.classList.remove("invalid"));
  });

  quoteForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const requiredFields = [...quoteForm.querySelectorAll("[required]")];
    requiredFields.forEach((field) => field.closest(".field")?.classList.toggle("invalid", !field.checkValidity()));
    if (!quoteForm.checkValidity()) {
      if (formStatus) formStatus.textContent = "Uzupełnij wymagane pola i zaznacz zgodę na kontakt.";
      quoteForm.querySelector(":invalid")?.focus();
      return;
    }

    const data = new FormData(quoteForm);
    const value = (name) => String(data.get(name) || "").trim();
    const lines = [
      "Dzień dobry, proszę o wstępną wycenę realizacji Werka Bramy.",
      "",
      `Imię i nazwisko: ${value("name")}`,
      `Telefon: ${value("phone")}`,
      `Miejscowość: ${value("city")}`,
      `Zakres: ${value("service")}`,
      `Szerokość wjazdu: ${value("width") || "nie podano"}`,
      `Preferowany kontakt: ${value("contact")}`,
      `Opis: ${value("message") || "do ustalenia"}`,
      "",
      "Za chwilę dołączę zdjęcia miejsca realizacji."
    ];
    if (formStatus) formStatus.textContent = "Gotowe — otwieramy WhatsApp z uzupełnioną wiadomością.";
    window.open(`https://wa.me/48531686393?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener,noreferrer");
  });

  const groups = [
    {
      key: "przesuwne",
      label: "Brama przesuwna",
      files: ["hero-premium.webp", "przesuwna-01.webp", "przesuwna-03.webp", "przesuwna-06.webp", "przesuwna-07.webp", "przesuwna-08.webp", "przesuwna-10.webp", "przesuwna-12.webp", "przesuwna-13.webp", "przesuwna-14.webp", "przesuwna-15.webp", "przesuwna-16.webp", "przesuwna-19.webp", "przesuwna-20.webp", "przesuwna-21.webp", "przesuwna-22.webp", "przesuwna-24.webp"]
    },
    {
      key: "dwuskrzydlowe",
      label: "Brama dwuskrzydłowa",
      files: ["brama-premium.webp", "dwuskrzydlowa-01.webp", "dwuskrzydlowa-02.webp", "dwuskrzydlowa-03.webp", "dwuskrzydlowa-04.webp", "dwuskrzydlowa-05.webp", "dwuskrzydlowa-06.webp", "dwuskrzydlowa-07.webp", "dwuskrzydlowa-08.webp", "dwuskrzydlowa-10.webp", "dwuskrzydlowa-12.webp", "dwuskrzydlowa-13.webp", "dwuskrzydlowa-16.webp", "dwuskrzydlowa-17.webp", "dwuskrzydlowa-18.webp", "dwuskrzydlowa-20.webp", "dwuskrzydlowa-21.webp", "dwuskrzydlowa-22.webp", "dwuskrzydlowa-23.webp", "dwuskrzydlowa-25.webp", "dwuskrzydlowa-27.webp", "dwuskrzydlowa-28.webp", "dwuskrzydlowa-29.webp", "dwuskrzydlowa-30.webp", "dwuskrzydlowa-31.webp", "dwuskrzydlowa-32.webp", "dwuskrzydlowa-33.webp", "dwuskrzydlowa-34.webp", "dwuskrzydlowa-35.webp", "dwuskrzydlowa-36.webp", "dwuskrzydlowa-38.webp", "dwuskrzydlowa-39.webp", "dwuskrzydlowa-40.webp"]
    },
    {
      key: "furtki",
      label: "Furtka i ogrodzenie",
      files: ["furtka-premium.webp", "furtka-01.webp", "furtka-02.webp", "furtka-03.webp", "furtka-04.webp", "furtka-06.webp", "furtka-07.webp", "furtka-08.webp", "furtka-09.webp", "furtka-10.webp", "furtka-11.webp", "furtka-13.webp", "furtka-14.webp"]
    },
    {
      key: "inne",
      label: "Elementy stalowe",
      files: ["inne-01.webp", "inne-03.webp", "inne-04.webp", "inne-05.webp", "inne-07.webp", "inne-08.webp", "inne-09.webp", "inne-10.webp", "inne-11.webp", "inne-12.webp", "inne-13.webp", "inne-14.webp", "inne-16.webp", "inne-18.webp", "inne-19.webp", "inne-21.webp"]
    }
  ];

  const galleryGrid = document.getElementById("portfolioGrid");
  const filterButtons = document.querySelectorAll(".filter-button");
  const loadMoreButton = document.getElementById("loadMoreButton");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  let activeFilter = "all";
  let visibleCount = 18;
  let currentItems = [];
  let lightboxIndex = 0;
  let lastFocusedElement = null;

  const groupItems = groups.map((group) => group.files.map((src, index) => ({
    src,
    category: group.key,
    label: group.label,
    alt: `${group.label} — realizacja ${index + 1}`
  })));

  const interleavedItems = [];
  const longestGroup = Math.max(...groupItems.map((items) => items.length));
  for (let index = 0; index < longestGroup; index += 1) {
    groupItems.forEach((items) => { if (items[index]) interleavedItems.push(items[index]); });
  }

  const getFilteredItems = () => activeFilter === "all" ? interleavedItems : interleavedItems.filter((item) => item.category === activeFilter);

  const renderGallery = () => {
    if (!galleryGrid) return;
    currentItems = getFilteredItems();
    galleryGrid.innerHTML = "";
    currentItems.slice(0, visibleCount).forEach((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "portfolio-item";
      button.dataset.index = String(index);
      button.setAttribute("aria-label", `Otwórz zdjęcie: ${item.alt}`);
      button.innerHTML = `<img src="${item.src}" alt="${item.alt}" loading="lazy"><span>${item.label}</span>`;
      galleryGrid.appendChild(button);
    });
    if (loadMoreButton) loadMoreButton.hidden = visibleCount >= currentItems.length;
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";
      visibleCount = 18;
      filterButtons.forEach((item) => item.classList.toggle("active", item === button));
      renderGallery();
    });
  });
  loadMoreButton?.addEventListener("click", () => { visibleCount += 15; renderGallery(); });

  const showLightboxItem = (index) => {
    if (!lightboxImage || !lightboxCaption || currentItems.length === 0) return;
    lightboxIndex = (index + currentItems.length) % currentItems.length;
    const item = currentItems[lightboxIndex];
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;
    lightboxCaption.textContent = `${item.label} — ${lightboxIndex + 1} / ${currentItems.length}`;
  };
  const openLightbox = (index) => {
    if (!lightbox) return;
    lastFocusedElement = document.activeElement;
    showLightboxItem(index);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    body.classList.add("lightbox-open");
    lightbox.querySelector(".lightbox-close")?.focus();
  };
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    body.classList.remove("lightbox-open");
    lastFocusedElement?.focus?.();
  };

  galleryGrid?.addEventListener("click", (event) => {
    const item = event.target.closest(".portfolio-item");
    if (item) openLightbox(Number(item.dataset.index));
  });
  lightbox?.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
  lightbox?.querySelector(".lightbox-prev")?.addEventListener("click", () => showLightboxItem(lightboxIndex - 1));
  lightbox?.querySelector(".lightbox-next")?.addEventListener("click", () => showLightboxItem(lightboxIndex + 1));
  lightbox?.addEventListener("click", (event) => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (event) => {
    if (!lightbox?.classList.contains("open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showLightboxItem(lightboxIndex - 1);
    if (event.key === "ArrowRight") showLightboxItem(lightboxIndex + 1);
  });

  renderGallery();
})();
