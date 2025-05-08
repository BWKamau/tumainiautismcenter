// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    // Helper to check prefers-reduced-motion
    const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Header collapse toggle
    const initHeaderCollapse = () => {
        const toggleButton = document.querySelector('.toggle-header-btn');
        const header = document.querySelector('.header-area');
        if (!toggleButton || !header) return;

        toggleButton.addEventListener('click', () => {
            header.classList.toggle('collapsed');
        });

        // Optional: Collapse header on scroll
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScrollTop > 100 && currentScrollTop > lastScrollTop) {
                header.classList.add('collapsed');
            } else if (currentScrollTop < 100) {
                header.classList.remove('collapsed');
            }
            lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
        });
    };

    // Smooth scrolling for anchor links
    const initSmoothScrolling = () => {
        const links = document.querySelectorAll('a[href^="#"]');
        if (!links.length) return;

        links.forEach((link) => {
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

    // Gallery modal functionality with focus trapping
    const initGalleryModal = () => {
        const galleryImages = document.querySelectorAll('.gallery-img');
        const modalImage = document.getElementById('modalImage');
        const imageModalElement = document.getElementById('imageModal');
        if (!galleryImages.length || !modalImage || !imageModalElement) return;

        const imageModal = new bootstrap.Modal(imageModalElement, {
            keyboard: true,
            backdrop: 'static'
        });

        const focusableElements = imageModalElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        imageModalElement.addEventListener('keydown', (e) => {
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

        galleryImages.forEach((image) => {
            image.addEventListener('click', (e) => {
                e.preventDefault();
                modalImage.src = image.src;
                modalImage.alt = image.alt;
                imageModal.show();
                firstFocusable.focus();
            });
        });

        let triggeringElement = null;
        imageModalElement.addEventListener('show.bs.modal', (e) => {
            triggeringElement = e.relatedTarget;
        });
        imageModalElement.addEventListener('hidden.bs.modal', () => {
            if (triggeringElement) triggeringElement.focus();
        });
    };

    // Lazy-load Google Maps iframe
    const initLazyMap = () => {
        const mapContainer = document.querySelector('.map-container[data-lazy-load]');
        if (!mapContainer) return;

        const mapIframe = mapContainer.querySelector('iframe');
        if (!mapIframe) return;

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

    // Form submission feedback
    const initFormFeedback = () => {
        const form = document.querySelector('.contact-form');
        const feedback = document.querySelector('.form-feedback');
        if (!form || !feedback) return;

        form.addEventListener('submit', async (e) => {
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
    initHeaderCollapse();
    initSmoothScrolling();
    initBackToTop();
    initGalleryModal();
    initLazyMap();
    initFormFeedback();
});