/* ===============================
   ADVANCED PRESENTATION SYSTEM
================================ */

class PresentationController {
  constructor() {
    this.cursorRing = document.getElementById("cursor-ring");
    this.cursorDot = document.getElementById("cursor-dot");
    this.progressBar = document.querySelector(".progress-fill");
    this.currentSlide = this.getCurrentSlideNumber();
    this.totalSlides = 20;
    this.isAnimating = false;
    this.particles = [];
    this.init();
  }

  init() {
    this.setupCursorEffects();
    this.setupKeyboardNavigation();
    this.setupSmoothTransitions();
    this.setupProgressIndicator();
    this.setupScrollEffects();
    this.setupAccessibility();
    this.createParticles();
    this.animateOnLoad();
  }

  getCurrentSlideNumber() {
    const path = window.location.pathname;
    const filename = path.split("/").pop();

    if (filename === "index.html" || filename === "") return 0;

    const match = filename.match(/slide(\d+)\.html/);
    return match ? parseInt(match[1]) : 0;
  }

  setupCursorEffects() {
    if (!this.cursorRing || !this.cursorDot) {
      this.createCursorElements();
    }

    let mouseX = 0,
      mouseY = 0;
    let currentX = 0,
      currentY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animateCursor = () => {
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;

      if (this.cursorRing) {
        this.cursorRing.style.left = currentX + "px";
        this.cursorRing.style.top = currentY + "px";
      }

      if (this.cursorDot) {
        this.cursorDot.style.left = currentX + "px";
        this.cursorDot.style.top = currentY + "px";
      }

      requestAnimationFrame(animateCursor);
    };

    animateCursor();

    // Hover effects
    document.addEventListener("mouseover", (e) => {
      if (
        e.target.classList.contains("btn") ||
        e.target.tagName === "A" ||
        e.target.tagName === "BUTTON"
      ) {
        this.scaleCursor(1.5);
      }
    });

    document.addEventListener("mouseout", (e) => {
      if (
        e.target.classList.contains("btn") ||
        e.target.tagName === "A" ||
        e.target.tagName === "BUTTON"
      ) {
        this.scaleCursor(1);
      }
    });
  }

  createCursorElements() {
    this.cursorRing = document.createElement("div");
    this.cursorRing.id = "cursor-ring";
    document.body.appendChild(this.cursorRing);

    this.cursorDot = document.createElement("div");
    this.cursorDot.id = "cursor-dot";
    document.body.appendChild(this.cursorDot);
  }

  scaleCursor(scale) {
    if (this.cursorRing) {
      this.cursorRing.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }
  }

  setupKeyboardNavigation() {
    document.addEventListener("keydown", (e) => {
      if (this.isAnimating) return;

      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          this.navigateToNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          this.navigateToPrevious();
          break;
        case "Home":
          e.preventDefault();
          this.navigateToSlide(0);
          break;
        case "End":
          e.preventDefault();
          this.navigateToSlide(this.totalSlides);
          break;
        case "Escape":
          this.toggleFullscreen();
          break;
      }
    });
  }

  setupSmoothTransitions() {
    document.querySelectorAll('a[href$=".html"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        this.navigateToPage(link.href);
      });
    });
  }

  navigateToPage(href) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    // Fade out effect
    document.body.style.opacity = "0";
    document.body.style.transform = "scale(0.95)";

    setTimeout(() => {
      window.location.href = href;
    }, 300);
  }

  navigateToNext() {
    const nextSlide = this.currentSlide + 1;
    if (nextSlide <= this.totalSlides) {
      const href = nextSlide === 0 ? "index.html" : `slide${nextSlide}.html`;
      this.navigateToPage(href);
    }
  }

  navigateToPrevious() {
    const prevSlide = this.currentSlide - 1;
    if (prevSlide >= 0) {
      const href = prevSlide === 0 ? "index.html" : `slide${prevSlide}.html`;
      this.navigateToPage(href);
    }
  }

  navigateToSlide(slideNumber) {
    if (slideNumber >= 0 && slideNumber <= this.totalSlides) {
      const href =
        slideNumber === 0 ? "index.html" : `slide${slideNumber}.html`;
      this.navigateToPage(href);
    }
  }

  setupProgressIndicator() {
    if (this.progressBar) {
      const progress = (this.currentSlide / this.totalSlides) * 100;
      this.progressBar.style.width = `${progress}%`;
    }
  }

  setupScrollEffects() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    document
      .querySelectorAll(".card, .feature-list li, table")
      .forEach((el) => {
        observer.observe(el);
      });
  }

  setupAccessibility() {
    // Add ARIA labels
    document.querySelectorAll(".btn").forEach((btn, index) => {
      if (!btn.getAttribute("aria-label")) {
        const text = btn.textContent.trim();
        btn.setAttribute("aria-label", text);
      }
    });

    // Focus management
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        document.body.classList.add("keyboard-navigation");
      }
    });

    document.addEventListener("mousedown", () => {
      document.body.classList.remove("keyboard-navigation");
    });
  }

  createParticles() {
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.cssText = `
        position: fixed;
        pointer-events: none;
        width: 2px;
        height: 2px;
        background: rgba(6, 182, 212, 0.6);
        border-radius: 50%;
        z-index: 1;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float ${5 + Math.random() * 10}s linear infinite;
      `;
      document.body.appendChild(particle);
      this.particles.push(particle);
    }
  }

  animateOnLoad() {
    // Animate elements on page load
    const elements = document.querySelectorAll(".slide-container > *");
    elements.forEach((el, index) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";

      setTimeout(() => {
        el.style.transition = "all 0.6s ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, index * 100);
    });

    // Animate progress bar
    if (this.progressBar) {
      const targetWidth = this.progressBar.style.width;
      this.progressBar.style.width = "0%";

      setTimeout(() => {
        this.progressBar.style.transition = "width 1s ease";
        this.progressBar.style.width = targetWidth;
      }, 500);
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  // Touch gestures for mobile
  setupTouchGestures() {
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });

    const handleSwipe = () => {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          this.navigateToNext();
        } else {
          this.navigateToPrevious();
        }
      }
    };
  }
}

/* ===============================
   UTILITY FUNCTIONS
================================ */

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/* ===============================
   TEXT ANIMATIONS
================================ */

class TextAnimator {
  static typewriter(element, text, speed = 50) {
    element.textContent = "";
    let i = 0;

    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    };

    type();
  }

  static highlightText(element) {
    element.classList.add("highlight");
  }

  static fadeInText(element, delay = 0) {
    element.style.opacity = "0";
    setTimeout(() => {
      element.style.transition = "opacity 0.8s ease";
      element.style.opacity = "1";
    }, delay);
  }
}

/* ===============================
   PRESENTATION MODE
================================ */

class PresentationMode {
  constructor() {
    this.isActive = false;
    this.setup();
  }

  setup() {
    // Add presentation mode toggle
    const toggle = document.createElement("button");
    toggle.innerHTML = "🎯";
    toggle.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--gradient-primary);
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      z-index: 1000;
      box-shadow: var(--shadow-lg);
      transition: all 0.3s ease;
    `;

    toggle.addEventListener("click", () => this.toggle());
    document.body.appendChild(toggle);
  }

  toggle() {
    this.isActive = !this.isActive;
    document.body.classList.toggle("presentation-mode");

    if (this.isActive) {
      this.enterPresentationMode();
    } else {
      this.exitPresentationMode();
    }
  }

  enterPresentationMode() {
    document.body.requestFullscreen();
    document.body.style.cursor = "none";
  }

  exitPresentationMode() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    document.body.style.cursor = "auto";
  }
}

/* ===============================
   INITIALIZATION
================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize presentation controller
  window.presentationController = new PresentationController();

  // Initialize presentation mode
  window.presentationMode = new PresentationMode();

  // Add loading animation
  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 100);

  // Performance optimization
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }
});

// Add CSS for animations
const style = document.createElement("style");
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
  }
  
  .animate-in {
    animation: fadeInUp 0.6s ease forwards;
  }
  
  .loaded {
    overflow-x: hidden;
  }
  
  .keyboard-navigation *:focus {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  
  .presentation-mode .navigation,
  .presentation-mode .header-bar {
    opacity: 0.1;
    transition: opacity 0.3s ease;
  }
  
  .presentation-mode:hover .navigation,
  .presentation-mode:hover .header-bar {
    opacity: 1;
  }
`;
document.head.appendChild(style);
