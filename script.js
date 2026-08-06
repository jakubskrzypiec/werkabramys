(() => {
  const body = document.body;
  const header = document.getElementById("siteHeader");
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.getElementById("mainNav");

  const setMenu = (open) => {
    body.classList.toggle("menu-open", open);
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
    }
  };

  menuToggle?.addEventListener("click", () => setMenu(!body.classList.contains("menu-open")));
  mainNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && body.classList.contains("menu-open")) setMenu(false);
  });

  const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const currentPage = body.dataset.page;
  document.querySelector(`[data-nav="${currentPage}"]`)?.setAttribute("aria-current", "page");

  body.classList.add("reveal-ready");
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, revealObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px" });
    reveals.forEach((element) => observer.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add("visible"));
  }

  const groups = [
    {
      key: "przesuwne",
      label: "Brama przesuwna",
      files: ["przesuwna-01.webp", "przesuwna-03.webp", "przesuwna-06.webp", "przesuwna-07.webp", "przesuwna-08.webp", "przesuwna-10.webp", "przesuwna-12.webp", "przesuwna-13.webp", "przesuwna-14.webp", "przesuwna-15.webp", "przesuwna-16.webp", "przesuwna-19.webp", "przesuwna-20.webp", "przesuwna-21.webp", "przesuwna-22.webp", "przesuwna-24.webp"]
    },
    {
      key: "dwuskrzydlowe",
      label: "Brama dwuskrzydłowa",
      files: ["dwuskrzydlowa-01.webp", "dwuskrzydlowa-02.webp", "dwuskrzydlowa-03.webp", "dwuskrzydlowa-04.webp", "dwuskrzydlowa-05.webp", "dwuskrzydlowa-06.webp", "dwuskrzydlowa-07.webp", "dwuskrzydlowa-08.webp", "dwuskrzydlowa-10.webp", "dwuskrzydlowa-12.webp", "dwuskrzydlowa-13.webp", "dwuskrzydlowa-16.webp", "dwuskrzydlowa-17.webp", "dwuskrzydlowa-18.webp", "dwuskrzydlowa-20.webp", "dwuskrzydlowa-21.webp", "dwuskrzydlowa-22.webp", "dwuskrzydlowa-23.webp", "dwuskrzydlowa-25.webp", "dwuskrzydlowa-27.webp", "dwuskrzydlowa-28.webp", "dwuskrzydlowa-29.webp", "dwuskrzydlowa-30.webp", "dwuskrzydlowa-31.webp", "dwuskrzydlowa-32.webp", "dwuskrzydlowa-33.webp", "dwuskrzydlowa-34.webp", "dwuskrzydlowa-35.webp", "dwuskrzydlowa-36.webp", "dwuskrzydlowa-38.webp", "dwuskrzydlowa-39.webp", "dwuskrzydlowa-40.webp"]
    },
    {
      key: "furtki",
      label: "Furtka i ogrodzenie",
      files: ["furtka-01.webp", "furtka-02.webp", "furtka-03.webp", "furtka-04.webp", "furtka-06.webp", "furtka-07.webp", "furtka-08.webp", "furtka-09.webp", "furtka-10.webp", "furtka-11.webp", "furtka-13.webp", "furtka-14.webp"]
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

  const groupItems = groups.map((group) => group.files.map((src, index) => ({
    src,
    category: group.key,
    label: group.label,
    alt: `${group.label} — realizacja ${index + 1}`
  })));

  const interleavedItems = [];
  const longestGroup = Math.max(...groupItems.map((items) => items.length));
  for (let index = 0; index < longestGroup; index += 1) {
    groupItems.forEach((items) => {
      if (items[index]) interleavedItems.push(items[index]);
    });
  }

  const getFilteredItems = () => {
    if (activeFilter === "all") return interleavedItems;
    return interleavedItems.filter((item) => item.category === activeFilter);
  };

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

  loadMoreButton?.addEventListener("click", () => {
    visibleCount += 15;
    renderGallery();
  });

  const showLightboxItem = (index) => {
    if (!lightboxImage || !lightboxCaption || currentItems.length === 0) return;
    lightboxIndex = (index + currentItems.length) % currentItems.length;
    const item = currentItems[lightboxIndex];
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;
    lightboxCaption.textContent = item.label;
  };

  const openLightbox = (index) => {
    if (!lightbox) return;
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
  };

  galleryGrid?.addEventListener("click", (event) => {
    const item = event.target.closest(".portfolio-item");
    if (!item) return;
    openLightbox(Number(item.dataset.index));
  });

  lightbox?.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
  lightbox?.querySelector(".lightbox-prev")?.addEventListener("click", () => showLightboxItem(lightboxIndex - 1));
  lightbox?.querySelector(".lightbox-next")?.addEventListener("click", () => showLightboxItem(lightboxIndex + 1));
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (!lightbox?.classList.contains("open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showLightboxItem(lightboxIndex - 1);
    if (event.key === "ArrowRight") showLightboxItem(lightboxIndex + 1);
  });

  renderGallery();
})();
