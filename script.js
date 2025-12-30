// Smooth scroll for navigation links
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
    });
});

// Add subtle parallax effect to distractions
const distractionIcons = document.querySelectorAll('.distraction-icon');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    distractionIcons.forEach((icon, index) => {
        const speed = 0.5 + (index * 0.1);
        icon.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
    });
});

// Testimonials carousel - ensure seamless loop
const carousel = document.querySelector('.testimonials-carousel');
if (carousel) {
    // Reset animation when it completes to create seamless loop
    carousel.addEventListener('animationiteration', () => {
        // The duplicate cards ensure seamless scrolling
    });
}
