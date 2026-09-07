document.addEventListener('DOMContentLoaded', async () => {
  // Mapping of container IDs to section HTML files
  const sections = [
    { id: 'navbar-container', file: 'sections/navbar.html' },
    { id: 'hero-container', file: 'sections/hero.html' },
    { id: 'about-container', file: 'sections/about.html' },
    { id: 'education-container', file: 'sections/education.html' },
    { id: 'skills-container', file: 'sections/skills.html' },
    { id: 'projects-container', file: 'sections/projects.html' },
    { id: 'certificates-container', file: 'sections/certificates.html' },
    { id: 'contact-container', file: 'sections/contact.html' }
  ];

  // Load all sections asynchronously
  await Promise.all(
    sections.map(async (section) => {
      try {
        const response = await fetch(section.file);
        if (response.ok) {
          const content = await response.text();
          document.getElementById(section.id).innerHTML = content;
        } else {
          console.error(`Failed to load ${section.file}: ${response.statusText}`);
        }
      } catch (error) {
        console.error(`Error loading ${section.file}:`, error);
      }
    })
  );

  // Initialize interactive features after templates are loaded
  initMobileMenu();
  initTimelineObserver();
});

// Mobile Menu Toggle Logic
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isOpen);

      const icon = menuToggle.querySelector('i');
      if (icon) {
        if (isOpen) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });
  }
}

// Add theme switcher initializer inside the loaded DOM block
function initThemeToggle() {
  const themeBtn = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('selected-theme');

  // Load previous user preference if available
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    updateThemeIcon(true);
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-theme');
      localStorage.setItem('selected-theme', isLight ? 'light' : 'dark');
      updateThemeIcon(isLight);
    });
  }
}

function updateThemeIcon(isLight) {
  const icon = document.querySelector('#themeToggle i');
  if (icon) {
    icon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-gear';
  }
}

// Ensure initThemeToggle() runs in DOMContentLoaded right after fetching sections:
document.addEventListener('DOMContentLoaded', async () => {
  /* ... fetch dynamic sections code ... */
  
  // Call function after templates are injected
  initThemeToggle();
});

// Scroll Intersection Observer for Academic Timeline Animation
function initTimelineObserver() {
  const observerOptions = { threshold: 0.2 };

  const timelineObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.timeline-entry').forEach((item) => {
    timelineObserver.observe(item);
  });
}

// Global Tab Switcher for Skills Section
function switchSkillTab(event, tabId) {
  const panes = document.querySelectorAll('.tab-pane');
  panes.forEach((pane) => pane.classList.remove('active'));

  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach((btn) => {
    btn.classList.remove('active');
    btn.setAttribute('aria-selected', 'false');
  });

  const selectedPane = document.getElementById(tabId);
  if (selectedPane) {
    selectedPane.classList.add('active');
  }

  event.currentTarget.classList.add('active');
  event.currentTarget.setAttribute('aria-selected', 'true');
}

gsap.registerPlugin(ScrollTrigger);

// Pin the intro text section
ScrollTrigger.create({
  trigger: ".intro-wrapper",
  start: "top top",
  end: "bottom top",
  pin: ".text-align-center",
  pinSpacing: false
});

// Handling the scroll for the tabs
document.addEventListener("scroll", function () {
  let scrollPosition = window.scrollY;
  let windowHeight = window.innerHeight + 550; // +550 = increasing the scroll distance before each class changes
  let sections = document.querySelectorAll('.tabs_let-content');
  let videos = document.querySelectorAll('.tabs_video');
  let lastSectionIndex = sections.length - 1;

  sections.forEach((section, index) => {
    if (scrollPosition >= (index * windowHeight) && scrollPosition < ((index + 1) * windowHeight)) {
      section.classList.add('is-1');
      videos[index].classList.add('is-1');
    } else {
      // Remove is-1 class from all sections except the last one
      if (index !== lastSectionIndex) {
        section.classList.remove('is-1');
        videos[index].classList.remove('is-1');
      }
    }
  });

  // Keep is-1 class on the last section until user scrolls past it
  if (scrollPosition > (lastSectionIndex * windowHeight)) {
    sections[lastSectionIndex].classList.add('is-1');
    videos[lastSectionIndex].classList.add('is-1');
  } else {
    sections[lastSectionIndex].classList.remove('is-1');
    videos[lastSectionIndex].classList.remove('is-1');
  }
});