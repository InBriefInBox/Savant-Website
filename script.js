// Smooth scroll for navigation links and active state
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Remove active class from all nav links
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            // Add active class to clicked link
            this.classList.add('active');

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

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

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards and testimonials
document.querySelectorAll('.feature-card, .testimonial-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Button interactions
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function (e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
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
    const progressBar = document.createElement('div');
    progressBar.className = 'streak-progress-bar';
    streakDays.appendChild(progressBar);

    let currentStreak = 1;

    function updateStreak(scrollProgress) {
        // Calculate streak based on scroll progress (1 to 7)
        const newStreak = Math.min(7, Math.max(1, Math.floor(scrollProgress * 7) + 1));

        if (newStreak !== currentStreak) {
            currentStreak = newStreak;

            // Update title with animation
            streakTitle.style.transform = 'scale(1.1)';
            setTimeout(() => {
                streakTitle.textContent = `${currentStreak} day${currentStreak > 1 ? 's' : ''} streak`;
                streakTitle.style.transform = 'scale(1)';
            }, 100);
        }

        // Update circles
        dayCircles.forEach((circle, index) => {
            if (index < currentStreak) {
                circle.classList.add('completed');
                circle.textContent = '✓';
            } else {
                circle.classList.remove('completed');
                circle.textContent = index + 1;
            }
        });

        // Update progress bar width
        const progressWidth = (currentStreak / 7) * 100;
        progressBar.style.width = `${progressWidth}%`;
    }

    // Scroll listener for streak section
    function handleStreakScroll() {
        const rect = streakSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate scroll progress through the section
        // Section is "active" when it's in the middle third of viewport
        const sectionMiddle = rect.top + (rect.height / 2);
        const viewportMiddle = windowHeight / 2;

        // Progress from 0 to 1 as section scrolls through viewport
        let progress = 0;

        if (rect.top < windowHeight && rect.bottom > 0) {
            // Section is visible
            const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
            const totalScrollDistance = windowHeight + rect.height;
            const scrolled = windowHeight - rect.top;
            progress = Math.max(0, Math.min(1, scrolled / totalScrollDistance));
        }

        updateStreak(progress);
    }

    // Initial state
    updateStreak(0);

    // Add scroll listener
    window.addEventListener('scroll', handleStreakScroll);
    handleStreakScroll(); // Initial check
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStreakAnimation);
} else {
    initStreakAnimation();
}


// Typewriter Effect for Distraction Input
function initTypewriterEffect() {
    const input = document.querySelector('.distraction-input');
    if (!input) return;

    const fullText = input.getAttribute('data-typewriter');
    if (!fullText) return;

    const timerSection = document.querySelector('.timer-section');
    if (!timerSection) return;

    let currentText = '';
    let hasTyped = false;

    function updateTypewriter(progress) {
        // Calculate how many characters to show based on scroll progress
        const charCount = Math.floor(progress * fullText.length);
        const newText = fullText.substring(0, charCount);

        if (newText !== currentText) {
            currentText = newText;
            input.value = currentText;

            // Add cursor blink effect when typing
            if (progress > 0 && progress < 1) {
                input.style.caretColor = 'white';
            }
        }
    }

    function handleScroll() {
        const rect = timerSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Start typing when section is in middle of viewport
        if (rect.top < windowHeight * 0.6 && rect.bottom > windowHeight * 0.4) {
            const sectionHeight = rect.height;
            const scrolled = windowHeight * 0.6 - rect.top;
            const progress = Math.max(0, Math.min(1, scrolled / (sectionHeight * 0.5)));

            updateTypewriter(progress);
            hasTyped = true;
        } else if (!hasTyped && rect.top > windowHeight * 0.6) {
            // Reset if scrolled back up before typing started
            currentText = '';
            input.value = '';
        }
    }

    // Initial state
    input.value = '';

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
}

// Initialize typewriter when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTypewriterEffect);
} else {
    initTypewriterEffect();
}
