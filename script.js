// ===== DOM ELEMENTS =====
const menuToggle = document.getElementById('menuToggle');
const offcanvasMenu = document.getElementById('offcanvasMenu');
const closeOffcanvas = document.getElementById('closeOffcanvas');
const menuOverlay = document.getElementById('menuOverlay');
const mainContent = document.getElementById('mainContent');
const faqList = document.getElementById('faqList');
const sliderTrack = document.querySelector('.slider-track');
const sliderPrev = document.getElementById('sliderPrev');
const sliderNext = document.getElementById('sliderNext');
const tripAdvisorSlider = document.getElementById('tripAdvisorSlider');

// ===== OFF-CANVAS MENU =====
function openOffcanvas() {
    offcanvasMenu.classList.add('active');
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeOffcanvasMenu() {
    offcanvasMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (menuToggle) {
    menuToggle.addEventListener('click', openOffcanvas);
}

if (closeOffcanvas) {
    closeOffcanvas.addEventListener('click', closeOffcanvasMenu);
}

if (menuOverlay) {
    menuOverlay.addEventListener('click', closeOffcanvasMenu);
}

// Close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && offcanvasMenu.classList.contains('active')) {
        closeOffcanvasMenu();
    }
});

// Close on swipe right (mobile)
let touchStartX = 0;
let touchEndX = 0;

if (mainContent) {
    mainContent.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    mainContent.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX - touchStartX > 100 && offcanvasMenu.classList.contains('active')) {
            closeOffcanvasMenu();
        }
    });
}

// ===== FAQ ACCORDION =====
function toggleFaqItem(item) {
    const isActive = item.classList.contains('active');

    // Close all items
    const allItems = faqList.querySelectorAll('.faq-item');
    allItems.forEach(i => i.classList.remove('active'));

    // Open clicked item if it wasn't active
    if (!isActive) {
        item.classList.add('active');
    }
}

if (faqList) {
    const faqItems = faqList.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => toggleFaqItem(item));
        }
    });
}

// ===== TRIPADVISOR SLIDER =====
let currentSlide = 0;
const sliderSpeed = 750;

function getSlideWidth() {
    const card = document.querySelector('.tripadvisor-card');
    if (card) {
        const style = window.getComputedStyle(document.querySelector('.slider-track'));
        const gap = parseInt(style.gap) || 20;
        return card.offsetWidth + gap;
    }
    return 300;
}

function getMaxSlides() {
    const cards = document.querySelectorAll('.tripadvisor-card');
    return Math.max(0, cards.length - 3);
}

function updateSlider() {
    if (sliderTrack) {
        const slideWidth = getSlideWidth();
        sliderTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    }
}

function slideNext() {
    const maxSlides = getMaxSlides();
    if (currentSlide < maxSlides) {
        currentSlide++;
        updateSlider();
    } else {
        currentSlide = 0;
        updateSlider();
    }
}

function slidePrev() {
    const maxSlides = getMaxSlides();
    if (currentSlide > 0) {
        currentSlide--;
        updateSlider();
    } else {
        currentSlide = maxSlides;
        updateSlider();
    }
}

if (sliderNext) {
    sliderNext.addEventListener('click', () => {
        slideNext();
    });
}

if (sliderPrev) {
    sliderPrev.addEventListener('click', () => {
        slidePrev();
    });
}

// Touch support for slider
if (tripAdvisorSlider) {
    let touchStartX = 0;
    let touchEndX = 0;

    tripAdvisorSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    tripAdvisorSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                slideNext();
            } else {
                slidePrev();
            }
        }
    });
}

// Auto-resize slider on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        updateSlider();
    }, 250);
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.querySelector('.mobile-header')?.offsetHeight || 0;
                const offsetTop = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===== HEADER SCROLL BEHAVIOR =====
let lastScroll = 0;
const mobileHeader = document.querySelector('.mobile-header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (mobileHeader) {
        if (currentScroll > lastScroll && currentScroll > 100) {
            mobileHeader.style.transform = 'translateY(-100%)';
        } else {
            mobileHeader.style.transform = 'translateY(0)';
        }
    }

    lastScroll = currentScroll;
});

// ===== ANIMATE ON SCROLL =====
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .review-card, .faq-item, .grid-item, .gallery-item');

    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;

        if (isVisible && !el.classList.contains('animated')) {
            el.classList.add('animated');
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
};

// Initialize animated elements
document.querySelectorAll('.feature-card, .review-card, .faq-item, .grid-item, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// ===== MOBILE NAV ACTIVE STATE =====
const currentPath = window.location.pathname;
const navLinks = document.querySelectorAll('.offcanvas-nav a');

navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (currentPath.includes(href) && href !== '#') {
        link.classList.add('active');
    }
});

// ===== LAZY LOAD IMAGES =====
const lazyImages = document.querySelectorAll('img[loading="lazy"]');

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// ===== RESIZE HANDLER =====
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Re-check off-canvas state
        if (window.innerWidth > 960 && offcanvasMenu.classList.contains('active')) {
            closeOffcanvasMenu();
        }
    }, 250);
});

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('S&L Diner website loaded successfully');

    // Initial animation trigger
    setTimeout(() => {
        animateOnScroll();
    }, 100);
});