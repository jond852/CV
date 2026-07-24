const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
const sections = Array.from(document.querySelectorAll('main section[id], main #home'));
const revealItems = Array.from(document.querySelectorAll('.reveal'));
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const progressBar = document.querySelector('.progress-bar');
const backToTop = document.querySelector('.back-to-top');
const loadingScreen = document.querySelector('.loading-screen');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const cursorGlow = document.querySelector('.cursor-glow');
const cursorDot = document.querySelector('.cursor-dot');
const portraitCard = document.querySelector('.portrait-card');
const buttons = Array.from(document.querySelectorAll('.magnetic'));
const typingText = document.querySelector('.typing-text');
const typingWords = ['Cybersecurity Student', 'Network Security Enthusiast', 'Web Developer'];
const themeToggle = document.querySelector('.theme-toggle');
const toast = document.getElementById('toast');
const copyButton = document.querySelector('.copy-email');
const faviconLink = document.querySelector('link[rel="icon"]');

let typingIndex = 0;
let charIndex = 0;
let isDeleting = false;
let countersAnimated = false;

function setActiveLink(id) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('active', isActive);
  });
}

function updateActiveSection() {
  const scrollPosition = window.scrollY + 180;
  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollPosition >= top && scrollPosition < bottom) {
      const targetId = section.id || 'home';
      setActiveLink(targetId);
    }
  });
}

function handleSmoothScroll(event) {
  const targetLink = event.currentTarget;
  const targetId = targetLink.getAttribute('href');
  if (!targetId || targetId.startsWith('http')) return;
  const targetSection = document.querySelector(targetId);
  if (!targetSection) return;
  event.preventDefault();
  targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  closeMobileMenu();
}

function updateProgressBar() {
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = height > 0 ? (scrollTop / height) * 100 : 0;
  progressBar.style.width = `${progress}%`;
  backToTop.classList.toggle('is-visible', scrollTop > 650);
}

function typeLoop() {
  const currentWord = typingWords[typingIndex];
  typingText.textContent = currentWord.slice(0, charIndex);
  if (!isDeleting && charIndex < currentWord.length) {
    charIndex += 1;
  } else if (isDeleting && charIndex > 0) {
    charIndex -= 1;
  } else {
    isDeleting = !isDeleting;
    typingIndex = (typingIndex + 1) % typingWords.length;
  }
  const speed = isDeleting ? 70 : 100;
  setTimeout(typeLoop, speed);
}

function observeReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  revealItems.forEach((item) => observer.observe(item));
}

function animateCounters() {
  if (countersAnimated) return;
  countersAnimated = true;
  const counters = Array.from(document.querySelectorAll('.stat-card h3'));
  counters.forEach((counter) => {
    const target = Number(counter.dataset.target || 0);
    const duration = 1100;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const value = Math.floor(progress * target);
      counter.textContent = `${value}${target > 10 ? '+' : ''}`;
      if (progress < 1) requestAnimationFrame(step);
      else counter.textContent = `${target}${target > 10 ? '+' : ''}`;
    };
    requestAnimationFrame(step);
  });
}

function initCounterObserver() {
  const counterSection = document.querySelector('.stats-grid');
  if (!counterSection) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    });
  }, { threshold: 0.35 });
  observer.observe(counterSection);
}

function attachMagneticEffect() {
  buttons.forEach((button) => {
    button.addEventListener('mousemove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const offsetX = (x / rect.width - 0.5) * 8;
      const offsetY = (y / rect.height - 0.5) * 8;
      button.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
    });
  });
}

function showRipple(event) {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  ripple.className = 'ripple-spot';
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.2;
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left}px`;
  ripple.style.top = `${event.clientY - rect.top}px`;
  button.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

function attachRippleEffect() {
  document.querySelectorAll('.ripple').forEach((button) => {
    button.addEventListener('click', (event) => {
      button.classList.remove('is-active');
      void button.offsetWidth;
      button.classList.add('is-active');
      showRipple(event);
    });
  });
}

function updateParallax(event) {
  if (!portraitCard) return;
  const x = (event.clientX / window.innerWidth - 0.5) * 8;
  const y = (event.clientY / window.innerHeight - 0.5) * 8;
  portraitCard.style.transform = `perspective(1200px) rotateX(${-y}deg) rotateY(${x}deg)`;
}

function resetParallax() {
  if (!portraitCard) return;
  portraitCard.style.transform = '';
}

function closeMobileMenu() {
  siteNav.classList.remove('is-open');
  menuToggle.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

function initMenu() {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  siteNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMobileMenu));
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  themeToggle.textContent = theme === 'dark' ? '☀' : '☾';
  themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  if (faviconLink) {
    faviconLink.href = theme === 'dark' ? 'assets/images/favicon.svg' : 'assets/images/favicon-light.svg';
  }
}

function initTheme() {
  const stored = localStorage.getItem('portfolio-theme');
  const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const theme = stored || systemTheme;
  applyTheme(theme);
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    localStorage.setItem('portfolio-theme', nextTheme);
  });
}

function initForm() {
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) {
      formStatus.textContent = 'Please complete the form before sending.';
      return;
    }
    if (!email.includes('@')) {
      formStatus.textContent = 'Please enter a valid email address.';
      return;
    }
    formStatus.textContent = `Thanks, ${name}. Your message is ready to send.`;
    form.reset();
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  setTimeout(() => toast.classList.remove('is-visible'), 1800);
}

function copyEmail() {
  const email = 'galymbek.bekasyl@example.com';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email)
      .then(() => showToast('Email copied to clipboard'))
      .catch(() => fallbackCopy(email));
  } else {
    fallbackCopy(email);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showToast('Email copied to clipboard');
  } catch (error) {
    showToast('Copy failed. Please copy the email manually.');
  }
  document.body.removeChild(textarea);
}

navLinks.forEach((link) => link.addEventListener('click', handleSmoothScroll));
window.addEventListener('scroll', () => { updateActiveSection(); updateProgressBar(); }, { passive: true });
window.addEventListener('mousemove', (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
  cursorDot.style.left = `${event.clientX}px`;
  cursorDot.style.top = `${event.clientY}px`;
  updateParallax(event);
});
window.addEventListener('mouseleave', () => { cursorGlow.style.opacity = '0'; cursorDot.style.opacity = '0'; });
window.addEventListener('mouseenter', () => { cursorGlow.style.opacity = '1'; cursorDot.style.opacity = '1'; });
window.addEventListener('load', () => {
  setTimeout(() => loadingScreen.classList.add('is-hidden'), 650);
  updateActiveSection();
  updateProgressBar();
  typeLoop();
  observeReveal();
  initCounterObserver();
});
window.addEventListener('resize', updateProgressBar);
window.addEventListener('mouseout', resetParallax);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMobileMenu();
  if (event.altKey && event.key.toLowerCase() === 'c') {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

if (copyButton) copyButton.addEventListener('click', copyEmail);
initMenu();
initTheme();
initForm();
attachMagneticEffect();
attachRippleEffect();
