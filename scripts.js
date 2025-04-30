// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    // Bounce-in animation for cards
    const bounceElements = document.querySelectorAll('.what-we-do-card, .team-member');
    if (bounceElements.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const bounceObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('bounce-in');
                        bounceObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        bounceElements.forEach((element) => bounceObserver.observe(element));
    }

    // Fade-in-up animation for sections
    const fadeSections = document.querySelectorAll('section');
    if (fadeSections.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const fadeObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in-up');
                        fadeObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        fadeSections.forEach((section) => fadeObserver.observe(section));
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                const header = document.querySelector('.header-area');
                const headerHeight = header ? header.offsetHeight : 0;
                const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Parallax effect for hero image
    const heroImage = document.querySelector('.hero-img');
    if (heroImage) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollPosition = window.scrollY;
                    heroImage.style.transform = `translateY(${scrollPosition * 0.5}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // Confetti explosion for CTA button
    const ctaButtonWrapper = document.querySelector('.cta-button-wrapper');
    const ctaButton = document.querySelector('.cta-btn');
    if (ctaButtonWrapper && ctaButton) {
        // Mouse-following tilt effect
        ctaButtonWrapper.addEventListener('mousemove', (e) => {
            const rect = ctaButtonWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const tiltX = (y / rect.height) * 10;
            const tiltY = -(x / rect.width) * 10;
            ctaButton.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });

        ctaButtonWrapper.addEventListener('mouseleave', () => {
            ctaButton.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });

        // Confetti on click
        ctaButton.addEventListener('click', () => {
            const existingConfetti = ctaButtonWrapper.querySelectorAll('.confetti');
            existingConfetti.forEach((confetti) => confetti.remove());

            const positions = [
                { class: 'cta-confetti-1', top: '-20px', left: '-20px' },
                { class: 'cta-confetti-2', top: '-20px', right: '-20px' },
                { class: 'cta-confetti-3', bottom: '-20px', left: '-20px' },
                { class: 'cta-confetti-4', bottom: '-20px', right: '-20px' }
            ];

            positions.forEach((pos) => {
                const confetti = document.createElement('span');
                confetti.classList.add('confetti', pos.class);
                Object.assign(confetti.style, {
                    top: pos.top || '',
                    left: pos.left || '',
                    right: pos.right || '',
                    bottom: pos.bottom || ''
                });
                ctaButtonWrapper.appendChild(confetti);
            });
        });
    }

    // Back to Top functionality
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Gallery Modal Functionality
document.addEventListener('DOMContentLoaded', function () {
    const galleryImages = document.querySelectorAll('.gallery-img');
    const modalImage = document.getElementById('modalImage');
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));

    galleryImages.forEach(image => {
        image.addEventListener('click', function () {
            modalImage.src = this.src;
            modalImage.alt = this.alt;
            imageModal.show();
        });
    });
});