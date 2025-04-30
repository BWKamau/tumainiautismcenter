// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    // Helper to check prefers-reduced-motion
    const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Bounce-in animation for cards
    const initBounceAnimations = () => {
        const bounceElements = document.querySelectorAll('.what-we-do-card, .team-member');
        if (!bounceElements.length || prefersReducedMotion()) return;

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
    };

    // Fade-in-up animation for sections
    const initFadeAnimations = () => {
        const fadeSections = document.querySelectorAll('section');
        if (!fadeSections.length || prefersReducedMotion()) return;

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
    };

    // Smooth scrolling for anchor links
    const initSmoothScrolling = () => {
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;

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
    };

    // Parallax effect for hero image
    const initParallax = () => {
        const heroImage = document.querySelector('.hero-img');
        if (!heroImage || window.innerWidth <= 768) return;

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollPosition = window.scrollY;
                    heroImage.style.transform = `translateY(${scrollPosition * 0.3}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        });
    };

    // CTA button interactivity (tilt and confetti)
    const initCtaButton = () => {
        const ctaButtonWrapper = document.querySelector('.cta-button-wrapper');
        const ctaButton = document.querySelector('.cta-btn');
        if (!ctaButtonWrapper || !ctaButton) return;

        const handleTilt = (e) => {
            const rect = ctaButtonWrapper.getBoundingClientRect();
            const x = e.clientX ? e.clientX - rect.left - rect.width / 2 : 0;
            const y = e.clientY ? e.clientY - rect.top - rect.height / 2 : 0;
            const tiltX = (y / rect.height) * 10;
            const tiltY = -(x / rect.width) * 10;
            ctaButton.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        };

        ctaButtonWrapper.addEventListener('mousemove', handleTilt);
        ctaButtonWrapper.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            handleTilt(touch);
        });

        ctaButtonWrapper.addEventListener('mouseleave', () => {
            ctaButton.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
        ctaButtonWrapper.addEventListener('touchend', () => {
            ctaButton.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });

        ctaButton.addEventListener('click', () => {
            const existingConfetti = ctaButtonWrapper.querySelectorAll('.confetti');
            existingConfetti.forEach((confetti) => confetti.remove());

            const positions = [
                { class: 'cta-confetti-1', top: '-20px', left: '-20px', backgroundColor: 'var(--soft-coral)' },
                { class: 'cta-confetti-2', top: '-20px', right: '-20px', backgroundColor: 'var(--light-blue)' },
                { class: 'cta-confetti-3', bottom: '-20px', left: '-20px', backgroundColor: 'var(--muted-teal)' },
                { class: 'cta-confetti-4', bottom: '-20px', right: '-20px', backgroundColor: '#FFCC99' }
            ];

            positions.forEach((pos) => {
                const confetti = document.createElement('span');
                confetti.classList.add('confetti', pos.class);
                Object.assign(confetti.style, {
                    top: pos.top || '',
                    left: pos.left || '',
                    right: pos.right || '',
                    bottom: pos.bottom || '',
                    backgroundColor: pos.backgroundColor
                });
                ctaButtonWrapper.appendChild(confetti);
                confetti.addEventListener('animationend', () => confetti.remove());
            });
        });
    };

    // Back to top functionality
    const initBackToTop = () => {
        const backToTopButton = document.querySelector('.back-to-top');
        if (!backToTopButton) return;

        window.addEventListener('scroll', () => {
            backToTopButton.classList.toggle('visible', window.scrollY > 300);
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    // Gallery modal functionality
    const initGalleryModal = () => {
        const galleryImages = document.querySelectorAll('.gallery-img');
        const modalImage = document.getElementById('modalImage');
        if (!galleryImages.length || !modalImage) return;

        const imageModal = new bootstrap.Modal(document.getElementById('imageModal'), {
            keyboard: true,
            backdrop: 'static'
        });

        galleryImages.forEach((image) => {
            image.addEventListener('click', (e) => {
                e.preventDefault();
                modalImage.src = image.src;
                modalImage.alt = image.alt;
                imageModal.show();
            });
        });
    };

    // Lazy-load Google Maps iframe
    const initLazyMap = () => {
        const mapContainer = document.querySelector('.map-container[data-lazy-load]');
        if (!mapContainer) return;

        const mapIframe = mapContainer.querySelector('iframe');
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    mapIframe.src = mapIframe.dataset.src;
                    observer.unobserve(mapContainer);
                }
            });
        });
        observer.observe(mapContainer);
    };

    // Initialize all features
    initBounceAnimations();
    initFadeAnimations();
    initSmoothScrolling();
    initParallax();
    initCtaButton();
    initBackToTop();
    initGalleryModal();
    initLazyMap();
});