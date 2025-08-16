document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const header = document.querySelector(".header");
  const logo = document.querySelector(".navbar .logo");

  if (navbar && header && logo) {
    const darkLogoSrc = "assets/electrolux-dark.png";
    const whiteLogoSrc = "assets/electrolux-white.png";

    const handleNavScroll = () => {
      const scrollThreshold = header.offsetHeight - navbar.offsetHeight;

      if (window.scrollY > scrollThreshold) {
        if (!navbar.classList.contains("navbar-scrolled")) {
          navbar.classList.add("navbar-scrolled");
          logo.src = whiteLogoSrc;
        }
      } else {
        if (navbar.classList.contains("navbar-scrolled")) {
          navbar.classList.remove("navbar-scrolled");
          logo.src = darkLogoSrc;
        }
      }
    };

    window.addEventListener("scroll", handleNavScroll);
    handleNavScroll();
  }

  const hamburger = document.querySelector(".hamburger");
  const mobileNavOverlay = document.querySelector(".mobile-nav-overlay");
  const body = document.body;
  let testimonialsData;
  let galleryData;

  function toggleMenu() {
    hamburger.classList.toggle("active");
    mobileNavOverlay.classList.toggle("active");
    body.classList.toggle("menu-open");
  }
  hamburger.addEventListener("click", toggleMenu);
  document.querySelectorAll(".mobile-nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileNavOverlay.classList.contains("active")) {
        toggleMenu();
      }
    });
  });

  const animatedElements = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  animatedElements.forEach((el) => {
    observer.observe(el);
  });

  async function getTetsimonialsData() {
    try {
      testimonialsData = await fetch("./src/referance.json").then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok " + res.statusText);
        }
        return res.json();
      });
    } catch (error) {
      console.error("Referans verisi alınamadı | ", error);
      testimonialsData = [];
    }
  }

  async function getGalleryData() {
    try {
      galleryData = await fetch("./src/gallery.json").then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok " + res.statusText);
        }
        return res.json();
      });
    } catch (error) {
      console.error("Galeri verisi alınamadı | ", error);
      galleryData = [];
    }
  }

  async function populateTestimonials() {
    await getTetsimonialsData();
    const grid = document.querySelector(".testimonials-grid");
    if (!grid) return;
    grid.innerHTML = "";
    if (testimonialsData.length === 0) {
      grid.innerHTML = "<p>Yorum bulunamadı.</p>";
      handleScrollableContainer(
        ".testimonials-grid",
        "#referanslar .swipe-indicator"
      );
      return;
    }
    testimonialsData.forEach((review) => {
      let starsHTML = "";
      for (let i = 0; i < review.stars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
      }
      const characterLimit = 190;
      let displayText = review.text;
      let readMoreHintHTML = "";
      if (review.text.length > characterLimit && review.url) {
        displayText = review.text.substring(0, characterLimit) + "...";
        readMoreHintHTML = `<span class="read-more-hint">Devamını okumak için,</span>`;
      }
      const reviewLinkHTML = review.url
        ? `<a href="${review.url}" class="review-link" target="_blank" rel="noopener">Yoruma Git &rarr;</a>`
        : "";
      const cardHTML = `
      <div class="reference-card">
        <div class="card-content">
            <div class="stars">${starsHTML}</div>
            <p>"${displayText}"</p> <!-- Kısaltılmış veya tam metin burada -->
            ${readMoreHintHTML} <!-- İpucu metni buraya gelecek (gerekliyse) -->
            ${reviewLinkHTML}
        </div>
        <div class="author">
            <i class="fab fa-google google-icon"></i>
            <div class="author-info">
                <h4>${review.userName}</h4>
                <span>${review.source}</span>
            </div>
        </div>
      </div>
      `;
      grid.innerHTML += cardHTML;
    });

    handleScrollableContainer(
      ".testimonials-grid",
      "#referanslar .swipe-indicator"
    );

    setupCarouselControls(
      ".testimonials-grid",
      ".reference-card",
      "#referanslar .fa-circle-chevron-left",
      "#referanslar .fa-circle-chevron-right"
    );
  }

  async function populateGallery() {
    await getGalleryData();
    const grid = document.querySelector(".gallery-grid");
    if (!grid) return;
    if (galleryData.length === 0) {
      grid.innerHTML = "<p>Resim bulunamadı.</p>";
      handleScrollableContainer(".gallery-grid", "#galeri .swipe-indicator");
      return;
    }
    galleryData.forEach((imageName, index) => {
      const imagePath = `assets/gallery/${imageName}`;
      const altText = `Galeri Resmi ${index + 1}`;

      const galleryItemHTML = `
              <div class="gallery-item">
                <img src="${imagePath}" alt="${altText}" draggable="false"/>
              </div>
              `;
      grid.innerHTML += galleryItemHTML;
    });
    handleScrollableContainer(".gallery-grid", "#galeri .swipe-indicator");
    setupCarouselControls(
      ".gallery-grid",
      ".gallery-item",
      "#galeri .fa-circle-chevron-left",
      "#galeri .fa-circle-chevron-right"
    );
  }

  function handleScrollableContainer(containerSelector, indicatorSelector) {
    const container = document.querySelector(containerSelector);
    const indicator = document.querySelector(indicatorSelector);
    if (!container || !indicator) return;
    const isOverflowing = container.scrollWidth > container.clientWidth;
    if (isOverflowing) {
      container.classList.remove("is-centered");
      indicator.classList.add("visible");
    } else {
      container.classList.add("is-centered");
      indicator.classList.remove("visible");
    }
  }

  const accordionHeader = document.querySelector(".working-hours-header");
  const accordionContent = document.querySelector(".working-hours-content");
  if (accordionHeader) {
    accordionHeader.addEventListener("click", () => {
      accordionHeader.classList.toggle("active");
      accordionContent.classList.toggle("active");
    });
  }

  function handleClickToCenter(containerSelector, itemSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    container.addEventListener("click", (e) => {
      const item = e.target.closest(itemSelector);
      if (!item) return;
      item.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    });
  }

  function setupCarouselControls(
    containerSelector,
    itemSelector,
    leftBtnSelector,
    rightBtnSelector
  ) {
    const container = document.querySelector(containerSelector);
    const leftBtn = document.querySelector(leftBtnSelector);
    const rightBtn = document.querySelector(rightBtnSelector);
    if (!container || !leftBtn || !rightBtn) {
      console.warn("Carousel elemanları bulunamadı: ", containerSelector);
      return;
    }
    const getCenterMostItemIndex = () => {
      const items = Array.from(container.querySelectorAll(itemSelector));
      if (items.length === 0) return -1;
      const containerCenter =
        container.getBoundingClientRect().left + container.clientWidth / 2;
      let closestIndex = -1;
      let minDistance = Infinity;

      items.forEach((item, index) => {
        const itemCenter =
          item.getBoundingClientRect().left + item.clientWidth / 2;
        const distance = Math.abs(containerCenter - itemCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });
      return closestIndex;
    };

    rightBtn.addEventListener("click", () => {
      const items = container.querySelectorAll(itemSelector);
      if (items.length === 0) return;
      let currentIndex = getCenterMostItemIndex();
      if (currentIndex === -1) currentIndex = 0;
      const nextIndex = Math.min(currentIndex + 1, items.length - 1);
      items[nextIndex].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    });

    leftBtn.addEventListener("click", () => {
      const items = container.querySelectorAll(itemSelector);
      if (items.length === 0) return;
      let currentIndex = getCenterMostItemIndex();
      if (currentIndex === -1) currentIndex = 0;
      const prevIndex = Math.max(currentIndex - 1, 0);
      items[prevIndex].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    });
  }

  populateTestimonials();
  populateGallery();
  handleClickToCenter(".gallery-grid", ".gallery-item");
  handleClickToCenter(".testimonials-grid", ".reference-card");

  window.addEventListener("resize", () => {
    handleScrollableContainer(".gallery-grid", "#galeri .swipe-indicator");
    handleScrollableContainer(
      ".testimonials-grid",
      "#referanslar .swipe-indicator"
    );
  });
});
