// Smooth scrolling for navigation and hero button
function setupSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"], .js-scroll-to-pricing, .js-scroll-to-contact');

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      let targetId;
      
      if (link.classList.contains("js-scroll-to-pricing") && !link.getAttribute("href")) {
        targetId = "pricing";
      } else if (link.classList.contains("js-scroll-to-contact") && !link.getAttribute("href")) {
        targetId = "contact";
      } else {
        targetId = link.getAttribute("href")?.slice(1);
      }

      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      // Update active state after scroll
      setTimeout(() => {
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        navLinks.forEach((navLink) => {
          navLink.classList.remove('is-active');
          const href = navLink.getAttribute('href');
          if (href && href.slice(1) === targetId) {
            navLink.classList.add('is-active');
          }
        });
      }, 300); // Delay to account for smooth scroll
    });
  });
}

// Mobile navigation toggle
function setupNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (!toggle || !navLinks) return;

  toggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("nav-links--open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLElement && event.target.tagName === "A") {
      // Don't close if clicking on dropdown toggle
      if (!event.target.classList.contains("nav-dropdown-toggle")) {
        navLinks.classList.remove("nav-links--open");
        toggle.setAttribute("aria-expanded", "false");
      }
    }
  });
}

// Account dropdown menu
function setupAccountDropdown() {
  const dropdownToggle = document.querySelector(".nav-dropdown-toggle");
  const dropdownItem = document.querySelector(".nav-item-dropdown");

  if (!dropdownToggle || !dropdownItem) return;

  dropdownToggle.addEventListener("click", (event) => {
    event.preventDefault();
    const isExpanded = dropdownItem.getAttribute("aria-expanded") === "true";
    dropdownItem.setAttribute("aria-expanded", String(!isExpanded));
    dropdownToggle.setAttribute("aria-expanded", String(!isExpanded));
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (event) => {
    if (!dropdownItem.contains(event.target)) {
      dropdownItem.setAttribute("aria-expanded", "false");
      dropdownToggle.setAttribute("aria-expanded", "false");
    }
  });

  // Close dropdown when clicking on a dropdown link
  const dropdownLinks = dropdownItem.querySelectorAll(".nav-dropdown-menu a");
  dropdownLinks.forEach((link) => {
    link.addEventListener("click", () => {
      dropdownItem.setAttribute("aria-expanded", "false");
      dropdownToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Back to top button
function setupBackToTop() {
  const btn = document.querySelector(".back-to-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY || window.pageYOffset;
    if (scrolled > 450) {
      btn.classList.add("back-to-top--visible");
    } else {
      btn.classList.remove("back-to-top--visible");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Simple modal for article previews
const articleContent = {
  "protein-breakfast":
    "Discover five satisfying breakfast ideas that prioritize protein without complicated recipes—from Greek yogurt bowls to savory egg bakes.",
  "nutrition-labels":
    "Learn how to quickly scan calories, serving sizes, and ingredients so you can compare products with confidence in just a few seconds.",
  "healthy-snacking":
    "Set yourself up with grab-and-go options that pair fiber and protein, support steady energy, and fit into a realistic schedule.",
};

function setupArticleModal() {
  const modal = document.getElementById("article-modal");
  if (!modal) return;

  const backdrop = modal.querySelector(".modal-backdrop");
  const closeButtons = modal.querySelectorAll("[data-close-modal]");
  const titleEl = document.getElementById("article-modal-title");
  const contentEl = document.getElementById("article-modal-content");

  function openModal(key) {
    modal.classList.add("modal--open");
    modal.setAttribute("aria-hidden", "false");

    const text = articleContent[key] || contentEl?.textContent;
    if (contentEl && text) {
      contentEl.textContent = text;
    }

    if (titleEl) {
      titleEl.focus?.();
    }
  }

  function closeModal() {
    modal.classList.remove("modal--open");
    modal.setAttribute("aria-hidden", "true");
  }

  document.querySelectorAll(".js-read-more").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-article") || "";
      openModal(key);
    });
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

  backdrop?.addEventListener("click", closeModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}


// Active state menu highlighting
function setupActiveNavHighlight() {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id], main[id]');
  
  if (navLinks.length === 0 || sections.length === 0) return;

  function updateActiveNav() {
    const scrollPosition = window.scrollY + 150; // Offset for better detection
    
    let currentSection = '';
    
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('is-active');
      const href = link.getAttribute('href');
      if (href && href.slice(1) === currentSection) {
        link.classList.add('is-active');
      }
    });

    // Handle home section when at top of page
    if (window.scrollY < 100 && !window.location.hash) {
      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href === '#home' || href === '#') {
          link.classList.add('is-active');
        } else {
          link.classList.remove('is-active');
        }
      });
    }
  }

  // Set initial active state based on URL hash if present
  if (window.location.hash) {
    const hash = window.location.hash.slice(1);
    navLinks.forEach((link) => {
      link.classList.remove('is-active');
      const href = link.getAttribute('href');
      if (href && href.slice(1) === hash) {
        link.classList.add('is-active');
      }
    });
    // Scroll to section after a brief delay to ensure page is loaded
    setTimeout(() => {
      const target = document.getElementById(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  } else {
    // Set initial active state
    updateActiveNav();
  }

  // Update on scroll
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  });
}

// Dashboard navigation active state
function setupDashboardNavHighlight() {
  const dashboardNavItems = document.querySelectorAll('.dashboard-nav-item');
  
  if (dashboardNavItems.length === 0) return;

  function updateDashboardNav() {
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    const currentFile = currentPath.split('/').pop() || currentPath;

    dashboardNavItems.forEach((item) => {
      item.classList.remove('is-active');
      const href = item.getAttribute('href');
      
      if (!href) return;

      const hrefPath = href.split('#')[0];
      const hrefHash = href.includes('#') ? href.split('#')[1] : '';
      const hrefFile = hrefPath.split('/').pop() || hrefPath;

      // Check if it's the current page file
      const isCurrentPage = hrefFile === currentFile || (currentFile.includes(hrefFile) && hrefFile !== '');

      if (isCurrentPage) {
        // If both have hash or both don't have hash, or current hash matches
        if ((!hrefHash && !currentHash) || (hrefHash && currentHash && hrefHash === currentHash.slice(1))) {
          item.classList.add('is-active');
        }
        // If current page has no hash and this item has no hash (Overview)
        else if (!currentHash && !hrefHash) {
          item.classList.add('is-active');
        }
        // If current hash matches this item's hash
        else if (currentHash && hrefHash && currentHash.slice(1) === hrefHash) {
          item.classList.add('is-active');
        }
      }
    });
  }

  // Set initial active state
  updateDashboardNav();

  // Update on hash change (for same-page navigation)
  window.addEventListener('hashchange', updateDashboardNav);
}

// Set current year in footer
function setCurrentYear() {
  const el = document.getElementById("year");
  if (!el) return;
  el.textContent = String(new Date().getFullYear());
}

// Contact form validation
function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const messageEl = document.getElementById("contact-form-message");

  function setFieldError(fieldName, message) {
    const field = form.querySelector(`[name="${fieldName}"]`);
    const wrapper = field?.closest(".form-field");
    const errorEl = form.querySelector(`.field-error[data-for="${fieldName}"]`);

    if (!wrapper || !errorEl || !(field instanceof HTMLElement)) return;

    if (message) {
      wrapper.classList.add("form-field--error");
      errorEl.textContent = message;
    } else {
      wrapper.classList.remove("form-field--error");
      errorEl.textContent = "";
    }
  }

  function validateEmail(value) {
    if (!value) return "Email is required.";
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(value)) return "Please enter a valid email address.";
    return "";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (messageEl) {
      messageEl.textContent = "";
      messageEl.classList.remove("form-message--success", "form-message--error");
    }

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    let isValid = true;

    if (!name) {
      setFieldError("name", "Please enter your name.");
      isValid = false;
    } else {
      setFieldError("name", "");
    }

    const emailError = validateEmail(email);
    if (emailError) {
      setFieldError("email", emailError);
      isValid = false;
    } else {
      setFieldError("email", "");
    }

    if (!subject) {
      setFieldError("subject", "Please enter a subject.");
      isValid = false;
    } else {
      setFieldError("subject", "");
    }

    if (!message) {
      setFieldError("message", "Please enter your message.");
      isValid = false;
    } else if (message.length < 10) {
      setFieldError("message", "Message must be at least 10 characters.");
      isValid = false;
    } else {
      setFieldError("message", "");
    }

    if (!isValid) {
      if (messageEl) {
        messageEl.textContent = "Please fix the highlighted fields and try again.";
        messageEl.classList.add("form-message--error");
      }
      return;
    }

    // Simulated successful submission
    form.reset();

    if (messageEl) {
      messageEl.textContent =
        "Thank you for your message! We'll get back to you within 24 hours.";
      messageEl.classList.add("form-message--success");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupSmoothScroll();
  setupNavToggle();
  setupBackToTop();
  setupArticleModal();
  setupAccountDropdown();
  setupContactForm();
  setCurrentYear();
  setupActiveNavHighlight();
  setupDashboardNavHighlight();
});


