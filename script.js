// ========================================
// MOBILE MENU FUNCTIONALITY
// ========================================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
const body = document.body;

if (mobileMenuToggle && mobileNavDrawer) {
    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        mobileNavDrawer.classList.toggle('active');
        body.style.overflow = mobileNavDrawer.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a nav link
    const mobileNavLinks = mobileNavDrawer.querySelectorAll('.nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            mobileNavDrawer.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    mobileNavDrawer.addEventListener('click', (e) => {
        if (e.target === mobileNavDrawer) {
            mobileMenuToggle.classList.remove('active');
            mobileNavDrawer.classList.remove('active');
            body.style.overflow = '';
        }
    });
}

// ========================================
// DEVICE DETECTION UTILITIES
// ========================================
function isMobileDevice() {
    return window.innerWidth <= 768;
}

function isSmallMobile() {
    return window.innerWidth <= 480;
}

function isTablet() {
    return window.innerWidth <= 1024 && window.innerWidth > 768;
}

// ========================================
// VIDEO LAZY LOADING
// ========================================
function initVideoLazyLoading() {
    const videos = document.querySelectorAll('.master-video');

    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    const source = video.querySelector('source');

                    // Only load if not already loaded
                    if (source && !video.hasAttribute('data-loaded')) {
                        video.setAttribute('data-loaded', 'true');
                        video.load();
                    }

                    // Play video when in viewport
                    video.play().catch(() => {
                        // Autoplay prevented, that's okay
                    });
                } else {
                    // Pause video when out of viewport to save performance
                    entry.target.pause();
                }
            });
        }, {
            rootMargin: '50px' // Start loading slightly before entering viewport
        });

        videos.forEach(video => {
            videoObserver.observe(video);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        videos.forEach(video => {
            video.load();
        });
    }
}

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Update active nav link based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// GSAP Animations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize video lazy loading
    initVideoLazyLoading();

    // Hero Stagger
    const heroTl = gsap.timeline();
    heroTl.from('.hero-title', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out'
    })
        .from('.hero-subtitle', {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'expo.out'
        }, "-=0.8");

    // Background Parallax - disabled on mobile for performance
    if (!isMobileDevice()) {
        gsap.to('.sunset-bg', {
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1
            },
            y: 150,
            ease: 'none'
        });
    }

    // Reveal animations for sections
    const reveals = document.querySelectorAll('.max-feature-card, .testimonial-carousel-card, .premium-phone-mockup, .timer-circle');
    reveals.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: isMobileDevice() ? 30 : 60, // Reduced movement on mobile
            opacity: 0,
            duration: isMobileDevice() ? 0.8 : 1.2, // Faster animations on mobile
            ease: 'expo.out'
        });
    });

    // Premium Phone Parallax/Floating Effect - simplified on mobile
    if (!isMobileDevice()) {
        document.querySelectorAll('.premium-phone-mockup .phone-frame').forEach(phone => {
            gsap.to(phone, {
                scrollTrigger: {
                    trigger: phone,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                y: -50,
                rotateX: 10,
                ease: 'none'
            });
        });
    }

    // Initialize custom effects
    initStreakAnimation();
    initTypewriterEffect();

    // Deep Refresh to ensure all layout calculations are correct
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 500);
});

// Smooth scroll with passive event listeners for better mobile performance
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, { passive: false });
});

// Interactive Streak Section Animation
function initStreakAnimation() {
    const streakSection = document.querySelector('.streak-section');
    if (!streakSection) return;

    const streakTitle = streakSection.querySelector('.streak-title');
    const dayCircles = streakSection.querySelectorAll('.day-circle');
    const streakDays = streakSection.querySelector('.streak-days');

    // Create progress bar overlay
    if (!streakSection.querySelector('.streak-progress-bar')) {
        const progressBar = document.createElement('div');
        progressBar.className = 'streak-progress-bar';
        streakDays.appendChild(progressBar);
    }

    const progressBar = streakSection.querySelector('.streak-progress-bar');
    let currentStreak = 1;

    function updateStreak(scrollProgress) {
        const totalDays = dayCircles.length;
        // Map scroll percentage to day index (0 to totalDays)
        const newStreak = Math.min(totalDays, Math.max(1, Math.floor(scrollProgress * (totalDays + 0.5)) + 1));

        if (newStreak !== currentStreak) {
            currentStreak = newStreak;
            gsap.to(streakTitle, {
                scale: 1.05,
                duration: 0.1,
                onComplete: () => {
                    streakTitle.textContent = `${currentStreak} day${currentStreak > 1 ? 's' : ''} streak`;
                    gsap.to(streakTitle, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
                }
            });
        }

        dayCircles.forEach((circle, index) => {
            if (index < currentStreak) {
                circle.classList.add('completed');
                circle.textContent = '✓';
            } else {
                circle.classList.remove('completed');
                // Restore original day number if present, or just leave it
                const originalDayNum = circle.getAttribute('data-day') || (index + 1);
                circle.textContent = originalDayNum;
            }
        });

        const progressPercent = (currentStreak / totalDays) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }

    ScrollTrigger.create({
        trigger: streakSection,
        start: 'top 75%',
        end: 'bottom 25%',
        scrub: true,
        onUpdate: (self) => updateStreak(self.progress)
    });
}

// Typewriter Effect for Distraction Input
function initTypewriterEffect() {
    const input = document.querySelector('.distraction-input');
    if (!input) return;

    const fullText = input.getAttribute('data-typewriter');
    if (!fullText) return;

    const timerSection = document.querySelector('.timer-section');
    if (!timerSection) return;

    function updateTypewriter(progress) {
        const charCount = Math.floor(progress * fullText.length);
        input.value = fullText.substring(0, charCount);
    }

    ScrollTrigger.create({
        trigger: timerSection,
        start: 'top 60%',
        end: 'bottom 40%',
        onUpdate: (self) => updateTypewriter(self.progress)
    });
}

