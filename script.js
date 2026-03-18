// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navLinksAll = document.querySelectorAll('.nav-links a');
const testimonialsTrack = document.getElementById('testimonialsTrack');
const sliderPrev = document.getElementById('sliderPrev');
const sliderNext = document.getElementById('sliderNext');
const sliderDots = document.querySelectorAll('.slider-dot');
const bookingForm = document.getElementById('bookingForm');

// ===== Navbar Scroll Effect =====
let lastScrollY = 0;
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScrollY = window.scrollY;
});

// ===== Mobile Menu Toggle =====
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
  document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu on link click
navLinksAll.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ===== Active Nav Link on Scroll =====
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);

    if (link) {
      if (scrollPos >= top && scrollPos < top + height) {
        navLinksAll.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

window.addEventListener('scroll', updateActiveLink);

// ===== Scroll Animations (Intersection Observer) =====
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.12
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});

// ===== Testimonials Slider =====
let currentSlide = 0;
const totalSlides = document.querySelectorAll('.testimonial-card').length;

function goToSlide(index) {
  if (index < 0) index = totalSlides - 1;
  if (index >= totalSlides) index = 0;
  currentSlide = index;
  testimonialsTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

  // Update dots
  sliderDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

sliderPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
sliderNext.addEventListener('click', () => goToSlide(currentSlide + 1));

sliderDots.forEach((dot, index) => {
  dot.addEventListener('click', () => goToSlide(index));
});

// Auto-advance testimonials
let autoSlideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);

// Pause on hover
const sliderContainer = document.querySelector('.testimonials-slider');
sliderContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
sliderContainer.addEventListener('mouseleave', () => {
  autoSlideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
});

// ===== Touch/Swipe Support for Slider =====
let touchStartX = 0;
let touchEndX = 0;

sliderContainer.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

sliderContainer.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) goToSlide(currentSlide + 1);
    else goToSlide(currentSlide - 1);
  }
});

// ===== Booking Form Handler =====
bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(bookingForm);
  const name = formData.get('name');
  const phone = formData.get('phone');
  const email = formData.get('email');
  const vehicle = formData.get('vehicle');
  const rentalPeriod = formData.get('rental-period');
  const pickup = formData.get('pickup');
  const message = formData.get('message');

  // Build WhatsApp message
  const waMessage = `Hello CeylonFleet! I'd like to request a quote.\n\n` +
    `*Name:* ${name}\n` +
    `*Phone:* ${phone}\n` +
    `*Email:* ${email}\n` +
    `*Vehicle:* ${vehicle}\n` +
    `*Rental Period:* ${rentalPeriod}\n` +
    `*Pickup Location:* ${pickup}\n` +
    `*Message:* ${message || 'N/A'}`;

  const waUrl = `https://wa.me/94769610377?text=${encodeURIComponent(waMessage)}`;
  window.open(waUrl, '_blank');

  // Show success feedback
  const btn = bookingForm.querySelector('.btn-submit');
  const originalText = btn.innerHTML;
  btn.innerHTML = '✅ Sent! Opening WhatsApp...';
  btn.style.background = '#06d6a0';
  btn.style.color = '#fff';

  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.background = '';
    btn.style.color = '';
    bookingForm.reset();
  }, 3000);
});

// ===== Smooth Staggered Animations for Grid Items =====
document.querySelectorAll('.services-grid .service-card').forEach((card, index) => {
  card.style.transitionDelay = `${index * 0.08}s`;
});

document.querySelectorAll('.fleet-grid .fleet-card').forEach((card, index) => {
  card.style.transitionDelay = `${index * 0.1}s`;
});

document.querySelectorAll('.why-item').forEach((item, index) => {
  item.style.transitionDelay = `${index * 0.07}s`;
});

// ===== Counter Animation for Stat Numbers =====
function animateCounter(element, target) {
  let current = 0;
  const increment = Math.ceil(target / 50);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = current + '+';
  }, 30);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statCards = entry.target.querySelectorAll('.stat-number');
      statCards.forEach(stat => {
        const value = parseInt(stat.textContent);
        if (!isNaN(value)) {
          animateCounter(stat, value);
        }
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statObserver.observe(heroStats);
