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

// Interactive Streak Section Animation - Full-screen horizontalStatement
function initStreakAnimation() {
    const streakSection = document.querySelector('.streak-section');
    if (!streakSection) return;

    const streakTitle = streakSection.querySelector('.streak-title');
    const dayCircles = streakSection.querySelectorAll('.day-circle');
    const dayItems = streakSection.querySelectorAll('.day-item');
    const streakDays = streakSection.querySelector('.streak-days');

    // Create progress bar overlay if it doesn't exist
    if (!streakSection.querySelector('.streak-progress-bar')) {
        const progressBar = document.createElement('div');
        progressBar.className = 'streak-progress-bar';
        streakDays.appendChild(progressBar);
    }

    const progressBar = streakSection.querySelector('.streak-progress-bar');
    let currentStreak = 1;

    // Calculate the total horizontal range
    const totalDays = dayItems.length;

    // We want the current day to stay centered, so we need to translate the container
    // Based on the position of the dayItems
    function updateStreakLayout(progress) {
        // Calculate which day should be "active" based on progress (0 to 1)
        const activeIndex = Math.min(totalDays - 1, Math.floor(progress * totalDays));
        const activeItem = dayItems[activeIndex];

        if (!activeItem) return;

        // 1. Move the container to keep activeIndex at the center
        // The container has padding: 0 50vw, so the first item (index 0) is at 0px relative to padding
        const itemWidth = activeItem.offsetWidth;
        const gap = parseInt(window.getComputedStyle(streakDays).gap) || 0;

        // Offset is basically: index * (width + gap)
        const offset = activeIndex * (itemWidth + gap);

        gsap.to(streakDays, {
            x: -offset,
            duration: 0.1,
            ease: 'none'
        });

        // 2. Update Active Classes and Scaling
        dayItems.forEach((item, index) => {
            if (index === activeIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }

            // Also handle completion up to activeIndex
            const circle = item.querySelector('.day-circle');
            if (index <= activeIndex) {
                circle.classList.add('completed');
                circle.textContent = '✓';
            } else {
                circle.classList.remove('completed');
                const originalDayNum = circle.getAttribute('data-day') || (index + 1);
                circle.textContent = originalDayNum;
            }
        });

        // 3. Update Title Count
        const newStreak = activeIndex + 1;
        if (newStreak !== currentStreak) {
            currentStreak = newStreak;
            // Short pulse for title
            gsap.to(streakTitle, {
                scale: 1.05,
                duration: 0.1,
                onComplete: () => {
                    streakTitle.textContent = `${currentStreak} day${currentStreak > 1 ? 's' : ''} streak`;
                    gsap.to(streakTitle, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
                }
            });
        }

        // 4. Update Progress Bar Width
        // Progress bar starts at 50vw (center of screen) and grows to the right
        const progressWidth = offset;
        progressBar.style.width = `${progressWidth}px`;
    }

    // Pin the streak section and scrub the layout update
    ScrollTrigger.create({
        trigger: streakSection,
        start: 'top top',
        end: `+=${totalDays * 150}vmax`, // Make it feel long and immersive
        pin: true,
        scrub: 1, // Smooth scrolling
        onUpdate: (self) => updateStreakLayout(self.progress),
        invalidateOnRefresh: true
    });
}



