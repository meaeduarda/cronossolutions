// ===== AOS (ANIMATE ON SCROLL) CONFIGURATION =====

document.addEventListener('DOMContentLoaded', function() {
    // Check if AOS is loaded
    if (typeof AOS !== 'undefined') {
        AOS.init({
            // Global settings:
            disable: false,
            startEvent: 'DOMContentLoaded',
            initClassName: 'aos-init',
            animatedClassName: 'aos-animate',
            useClassNames: false,
            disableMutationObserver: false,
            debounceDelay: 50,
            throttleDelay: 99,
            
            // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
            offset: 120,
            delay: 0,
            duration: 800,
            easing: 'ease',
            once: true,
            mirror: false,
            anchorPlacement: 'top-bottom',
            
            // Custom configurations for different screen sizes
            disable: function() {
                return window.innerWidth < 768;
            }
        });
        
        // Refresh AOS on window resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                AOS.refresh();
            }, 250);
        });
        
        // Refresh AOS after images load
        window.addEventListener('load', function() {
            AOS.refresh();
        });
        
        // Add custom animations
        this.addCustomAnimations();
    } else {
        console.warn('AOS library not loaded. Animations will not work.');
        
        // Fallback: Show all elements without animation
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }
    
    // Custom animation definitions
    function addCustomAnimations() {
        // Add custom animation for numbers (counting)
        const numberElements = document.querySelectorAll('[data-count]');
        numberElements.forEach(el => {
            el.setAttribute('data-aos', 'zoom-in');
            el.setAttribute('data-aos-delay', el.getAttribute('data-aos-delay') || '100');
        });
        
        // Add staggered animation for service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', (index * 100).toString());
        });
        
        // Add animation for hero section
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.setAttribute('data-aos', 'fade-right');
            heroTitle.setAttribute('data-aos-duration', '1000');
        }
        
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            heroSubtitle.setAttribute('data-aos', 'fade-right');
            heroSubtitle.setAttribute('data-aos-delay', '200');
            heroSubtitle.setAttribute('data-aos-duration', '1000');
        }
        
        const heroButtons = document.querySelector('.hero-buttons');
        if (heroButtons) {
            heroButtons.setAttribute('data-aos', 'fade-right');
            heroButtons.setAttribute('data-aos-delay', '400');
            heroButtons.setAttribute('data-aos-duration', '1000');
        }
        
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            heroImage.setAttribute('data-aos', 'fade-left');
            heroImage.setAttribute('data-aos-delay', '300');
            heroImage.setAttribute('data-aos-duration', '1000');
        }
        
        // Section headers
        document.querySelectorAll('.section-header').forEach(header => {
            header.setAttribute('data-aos', 'fade-up');
            header.setAttribute('data-aos-duration', '800');
        });
        
        // Portfolio items
        document.querySelectorAll('.portfolio-item').forEach((item, index) => {
            item.setAttribute('data-aos', 'zoom-in');
            item.setAttribute('data-aos-delay', (index * 100).toString());
        });
        
        // Testimonial cards
        document.querySelectorAll('.testimonial-card').forEach((card, index) => {
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', (index * 150).toString());
        });
        
        // Why cards
        document.querySelectorAll('.why-card').forEach((card, index) => {
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', (index * 100).toString());
        });
        
        // Form elements
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.setAttribute('data-aos', 'fade-up');
            contactForm.setAttribute('data-aos-delay', '200');
        }
        
        // CTA section
        const ctaSection = document.querySelector('.cta-section');
        if (ctaSection) {
            ctaSection.querySelectorAll('*').forEach(el => {
                if (!el.getAttribute('data-aos')) {
                    el.setAttribute('data-aos', 'fade-up');
                }
            });
        }
    }
    
    // Reinitialize AOS after preloader completes
    document.addEventListener('preloaderComplete', function() {
        if (typeof AOS !== 'undefined') {
            setTimeout(() => {
                AOS.refreshHard(); // Force refresh
            }, 100);
        }
    });
    
    // Add scroll progress indicator
    addScrollProgress();
    
    function addScrollProgress() {
        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
        
        // Update progress on scroll
        window.addEventListener('scroll', function() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
    
    // Add intersection observer for custom animations
    addIntersectionObserver();
    
    function addIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add visible class for custom CSS animations
                    entry.target.classList.add('visible');
                    
                    // Trigger counting animation for stats
                    if (entry.target.classList.contains('stat-card')) {
                        const number = entry.target.querySelector('.stat-number');
                        if (number && !number.classList.contains('animated')) {
                            animateCounter(number);
                            number.classList.add('animated');
                        }
                    }
                    
                    // Trigger animation for service cards
                    if (entry.target.classList.contains('service-card')) {
                        entry.target.classList.add('animated');
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe elements
        document.querySelectorAll('.service-card, .stat-card, .why-card, .portfolio-item').forEach(el => {
            observer.observe(el);
        });
    }
    
    // Counter animation function
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, duration / steps);
    }
});