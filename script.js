(() => {
  "use strict";

  const gallery = document.querySelector("#gallery");
  const count = document.querySelector("#work-count");
  const year = document.querySelector("#current-year");
  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = document.querySelector("#lightbox-image");
  const lightboxTitle = document.querySelector("#lightbox-title");
  const lightboxCounter = document.querySelector("#lightbox-counter");
  const closeButton = document.querySelector(".lightbox-close");
  const previousButton = document.querySelector(".lightbox-prev");
  const nextButton = document.querySelector(".lightbox-next");

  const works = Array.isArray(window.PIRAM_GALLERY)
    ? window.PIRAM_GALLERY.filter((work) => work && work.src)
    : [];

  let activeIndex = 0;
  let lastFocusedItem = null;

  year.textContent = new Date().getFullYear();
  count.textContent = works.length;

  if (works.length === 0) {
    const message = document.createElement("p");
    message.className = "empty-message";
    message.textContent = "아직 등록된 작품이 없습니다.";
    gallery.append(message);
    return;
  }

  const fragment = document.createDocumentFragment();

  works.forEach((work, index) => {
    const item = document.createElement("button");
    const image = document.createElement("img");

    item.className = "gallery-item";
    item.type = "button";
    item.setAttribute("aria-label", `${work.alt || `작품 ${index + 1}`} 크게 보기`);

    image.src = work.src;
    image.alt = work.alt || `Piram GFX 작품 ${index + 1}`;
    image.loading = index < 3 ? "eager" : "lazy";
    image.decoding = "async";

    item.append(image);
    item.addEventListener("click", () => openLightbox(index, item));
    fragment.append(item);
  });

  gallery.append(fragment);

  function renderActiveWork() {
    const work = works[activeIndex];
    lightboxImage.src = work.src;
    lightboxImage.alt = work.alt || `Piram GFX 작품 ${activeIndex + 1}`;
    lightboxTitle.textContent = work.title || "";
    lightboxCounter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(
      works.length,
    ).padStart(2, "0")}`;

    const showNavigation = works.length > 1;
    previousButton.hidden = !showNavigation;
    nextButton.hidden = !showNavigation;
  }

  function openLightbox(index, trigger) {
    activeIndex = index;
    lastFocusedItem = trigger;
    renderActiveWork();
    document.body.classList.add("lightbox-open");
    lightbox.showModal();
    closeButton.focus();
  }

  function closeLightbox() {
    if (lightbox.open) {
      lightbox.close();
    }
  }

  function moveLightbox(direction) {
    activeIndex = (activeIndex + direction + works.length) % works.length;
    renderActiveWork();
  }

  closeButton.addEventListener("click", closeLightbox);
  previousButton.addEventListener("click", () => moveLightbox(-1));
  nextButton.addEventListener("click", () => moveLightbox(1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  lightbox.addEventListener("close", () => {
    document.body.classList.remove("lightbox-open");
    lightboxImage.src = "";
    lastFocusedItem?.focus();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.open) return;

    if (event.key === "ArrowLeft") moveLightbox(-1);
    if (event.key === "ArrowRight") moveLightbox(1);
  });
})();
