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
        }, "-=0.8")
        .from('.btn-hero-download', {
            y: 20,
            opacity: 0,
            duration: 1,
            ease: 'expo.out'
        }, "-=0.6");

    // Background Parallax
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

    // Reveal animations for sections
    const reveals = document.querySelectorAll('.max-feature-card, .testimonial-carousel-card, .premium-phone-mockup, .timer-circle');
    reveals.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 60,
            opacity: 0,
            duration: 1.2,
            ease: 'expo.out'
        });
    });

    // Premium Phone Parallax/Floating Effect
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

    // Initialize custom effects
    initStreakAnimation();
    initTypewriterEffect();
});

// Smooth scroll (Native CSS is usually enough, but here's the JS version for better control)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
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
        const newStreak = Math.min(7, Math.max(1, Math.floor(scrollProgress * 7) + 1));
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
                circle.textContent = index + 1;
            }
        });

        const progressWidth = (currentStreak / 7) * 100;
        progressBar.style.width = `${progressWidth}%`;
    }

    ScrollTrigger.create({
        trigger: streakSection,
        start: 'top 80%',
        end: 'bottom 20%',
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

