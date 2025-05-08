// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    // Helper to check prefers-reduced-motion
    const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Sticky navbar functionality
    const initStickyNavbar = () => {
        const navbar = document.querySelector('#navbar');
        const body = document.body;
        if (!navbar) return;

        const toggleSticky = () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition > 100) {
                navbar.classList.add('is-sticky');
                body.classList.add('navbar-fixed');
            } else {
                navbar.classList.remove('is-sticky');
                body.classList.remove('navbar-fixed');
            }
        };

        window.addEventListener('scroll', toggleSticky);

        // Close navbar collapse on nav link click (mobile)
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse?.classList.contains('show')) {
                    new bootstrap.Collapse(navbarCollapse).hide();
                }
            });
        });

        toggleSticky(); // Initial check
    };

    // Smooth scrolling for anchor links
    const initSmoothScrolling = () => {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            link.addEventListener('click', e => {
                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;

                e.preventDefault();
                const navbar = document.querySelector('#navbar');
                const navbarHeight = navbar?.offsetHeight || 0;
                const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;

                window.scrollTo({
                    top: offsetTop,
                    behavior: prefersReducedMotion() ? 'auto' : 'smooth'
                });
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
                behavior: prefersReducedMotion() ? 'auto' : 'smooth'
            });
        });
    };

    // Gallery modal functionality with focus trapping
    const initGalleryModal = () => {
        const galleryLinks = document.querySelectorAll('.gallery-img-link');
        const modalImage = document.getElementById('modalImage');
        const imageModalElement = document.getElementById('imageModal');
        if (!galleryLinks.length || !modalImage || !imageModalElement) return;

        const imageModal = new bootstrap.Modal(imageModalElement, {
            keyboard: true,
            backdrop: 'static'
        });

        const focusableElements = imageModalElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        imageModalElement.addEventListener('keydown', e => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });

        galleryLinks.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                modalImage.src = link.getAttribute('href');
                modalImage.alt = link.querySelector('img').alt;
                imageModal.show();
                firstFocusable.focus();
            });
        });

        let triggeringElement = null;
        imageModalElement.addEventListener('show.bs.modal', e => {
            triggeringElement = e.relatedTarget;
        });
        imageModalElement.addEventListener('hidden.bs.modal', () => {
            if (triggeringElement) triggeringElement.focus();
        });
    };

    // Lazy-load Google Maps iframe
    const initLazyMap = () => {
        const mapContainer = document.querySelector('.map-container[data-lazy-load]');
        const mapIframe = mapContainer?.querySelector('iframe');
        if (!mapContainer || !mapIframe) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    mapIframe.src = mapIframe.dataset.src;
                    observer.unobserve(mapContainer);
                }
            });
        });
        observer.observe(mapContainer);
    };

    // Form submission feedback
    const initFormFeedback = () => {
        const form = document.querySelector('.contact-form');
        const feedback = document.querySelector('.form-feedback');
        if (!form || !feedback) return;

        form.addEventListener('submit', async e => {
            e.preventDefault();
            feedback.style.display = 'none';
            feedback.classList.remove('success', 'error');

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    feedback.textContent = 'Message sent successfully!';
                    feedback.classList.add('success');
                    form.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                feedback.textContent = 'Error sending message. Please try again.';
                feedback.classList.add('error');
            }
            feedback.style.display = 'block';
        });
    };

    // Initialize features
    initStickyNavbar();
    initSmoothScrolling();
    initBackToTop();
    initGalleryModal();
    initLazyMap();
    initFormFeedback();
});