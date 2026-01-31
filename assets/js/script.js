// ===== MAIN SCRIPT FILE =====

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== INITIALIZE AOS =====
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 100
    });

    // ===== INITIALIZE HERO SLIDER =====
    const heroSlider = new Swiper('.hero-slider', {
        direction: 'horizontal',
        loop: true,
        speed: 1000,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.hero-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        navigation: {
            nextEl: '.hero-next',
            prevEl: '.hero-prev',
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        on: {
            init: function() {
                updateSlideCounter(this);
                // Definir o background inicial baseado no slide ativo
                updateHeroBackground(this);
            },
            slideChange: function() {
                updateSlideCounter(this);
                // Atualizar o background quando o slide mudar
                updateHeroBackground(this);
            }
        }
    });

    // Update slide counter
    function updateSlideCounter(swiper) {
        const currentSlide = document.querySelector('.current-slide');
        if (currentSlide) {
            currentSlide.textContent = String(swiper.realIndex + 1).padStart(2, '0');
        }
    }

    // Função para atualizar o background do hero baseado no slide ativo
    function updateHeroBackground(swiper) {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;
        
        // Pegar o slide atual (índice real, considerando o loop)
        const currentSlideIndex = swiper.realIndex;
        
        // Definir as imagens de background para cada slide
        const backgroundImages = [
            'linear-gradient(rgba(10, 25, 47, 0.7), rgba(15, 35, 65, 0.75)), url("assets/image/hero1.png")',
            'linear-gradient(rgba(10, 25, 47, 0.7), rgba(15, 35, 65, 0.75)), url("assets/image/hero2.png")'
        ];
        
        // Aplicar a imagem de background correspondente
        heroSection.style.backgroundImage = backgroundImages[currentSlideIndex];
        
        // Adicionar efeito de transição suave
        heroSection.style.transition = 'background-image 0.8s ease-in-out';
    }

    // ===== INITIALIZE TESTIMONIALS SLIDER =====
    const testimonialsSlider = new Swiper('.testimonials-slider', {
        direction: 'horizontal',
        loop: true,
        speed: 800,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 40
            }
        }
    });

    // ===== INITIALIZE CLIENTS SLIDER =====
    const clientsSlider = new Swiper('.clients-slider', {
        direction: 'horizontal',
        loop: true,
        speed: 6000,
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
        },
        slidesPerView: 'auto',
        spaceBetween: 30,
        freeMode: true,
        grabCursor: false,
        allowTouchMove: false,
        breakpoints: {
            320: {
                slidesPerView: 2,
            },
            576: {
                slidesPerView: 3,
            },
            768: {
                slidesPerView: 4,
            },
            992: {
                slidesPerView: 5,
            }
        }
    });

    // ===== PARTICLES INITIALIZATION =====
    const particlesCanvas = document.getElementById('hero-particles');
    if (particlesCanvas) {
        particlesCanvas.width = window.innerWidth;
        particlesCanvas.height = window.innerHeight;
        
        const ctx = particlesCanvas.getContext('2d');
        let particlesArray = [];
        const numberOfParticles = 100;
        
        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * particlesCanvas.width;
                this.y = Math.random() * particlesCanvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Bounce off edges
                if (this.x > particlesCanvas.width) this.x = 0;
                if (this.x < 0) this.x = particlesCanvas.width;
                if (this.y > particlesCanvas.height) this.y = 0;
                if (this.y < 0) this.y = particlesCanvas.height;
            }
            
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Initialize particles
        function initParticles() {
            particlesArray = [];
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }
        
        // Animate particles
        function animateParticles() {
            ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
            
            // Draw gradient overlay
            const gradient = ctx.createRadialGradient(
                particlesCanvas.width * 0.8, particlesCanvas.height * 0.2, 0,
                particlesCanvas.width * 0.8, particlesCanvas.height * 0.2, particlesCanvas.width * 0.5
            );
            gradient.addColorStop(0, 'rgba(100, 200, 255, 0.1)');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, particlesCanvas.width, particlesCanvas.height);
            
            // Update and draw particles
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            
            // Draw connecting lines
            for (let i = 0; i < particlesArray.length; i++) {
                for (let j = i; j < particlesArray.length; j++) {
                    const dx = particlesArray[i].x - particlesArray[j].x;
                    const dy = particlesArray[i].y - particlesArray[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance/100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                        ctx.stroke();
                    }
                }
            }
            
            requestAnimationFrame(animateParticles);
        }
        
        // Handle resize
        function handleResize() {
            particlesCanvas.width = window.innerWidth;
            particlesCanvas.height = window.innerHeight;
            initParticles();
        }
        
        // Initialize
        initParticles();
        animateParticles();
        window.addEventListener('resize', handleResize);
    }

    // ===== NAVBAR SCROLL EFFECT =====
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update scroll progress
        updateScrollProgress();
    });
    
    // ===== SMOOTH SCROLL FOR NAV LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse.show');
                if (navbarCollapse) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            }
        });
    });
    
    // ===== ACTIVE NAV LINK ON SCROLL =====
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNavLink() {
        const scrollY = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    
    // ===== ANIMATED COUNTERS =====
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // Lower is faster
    
    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText.replace('+', '');
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounter(counter), 10);
        } else {
            counter.innerText = target + '+';
        }
    };
    
    // Start counters when in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target.querySelector('.stat-number');
                if (counter) {
                    animateCounter(counter);
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    // Observe stats section
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        observer.observe(statsSection);
    }
    
    // ===== FORM VALIDATION =====
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = this.querySelector('input[type="text"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();
            const subject = this.querySelector('input[type="text"]:nth-child(3)').value.trim();
            const message = this.querySelector('textarea').value.trim();
            
            // Simple validation
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // Email validation function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
                ${message}
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto remove after 5 seconds
        const autoRemove = setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', function() {
            clearTimeout(autoRemove);
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }
    
    // ===== PORTFOLIO LIGHTBOX =====
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const title = this.querySelector('.portfolio-overlay h4').textContent;
            const category = this.querySelector('.portfolio-overlay p').textContent;
            
            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <button class="lightbox-close">
                        <i class="fas fa-times"></i>
                    </button>
                    <img src="${imgSrc}" alt="${title}">
                    <div class="lightbox-info">
                        <h3>${title}</h3>
                        <p>${category}</p>
                    </div>
                </div>
            `;
            
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';
            
            // Add animation class after a delay
            setTimeout(() => {
                lightbox.style.opacity = '1';
            }, 10);
            
            // Close lightbox
            const closeLightbox = function(e) {
                if (e.target === lightbox || e.target.closest('.lightbox-close')) {
                    document.body.style.overflow = '';
                    lightbox.style.opacity = '0';
                    setTimeout(() => {
                        if (lightbox.parentNode) {
                            lightbox.parentNode.removeChild(lightbox);
                        }
                    }, 300);
                }
            };
            
            lightbox.addEventListener('click', closeLightbox);
            
            // Close with Escape key
            document.addEventListener('keydown', function escClose(e) {
                if (e.key === 'Escape') {
                    closeLightbox({target: lightbox});
                    document.removeEventListener('keydown', escClose);
                }
            });
        });
    });
    
    // ===== LAZY LOADING IMAGES =====
    const lazyImages = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
    
    // ===== BACK TO TOP BUTTON =====
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ===== SCROLL PROGRESS INDICATOR =====
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);
    
    function updateScrollProgress() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
    }
    
    // ===== BADGE ITEM HOVER EFFECT =====
    const badgeItems = document.querySelectorAll('.badge-item');
    badgeItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.color = 'rgba(255, 255, 255, 0.9)';
                this.style.background = 'rgba(255, 255, 255, 0.1)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.color = '';
                this.style.background = '';
            }
        });
    });
    
    // ===== SERVICE CARDS INTERACTION =====
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // ===== ANIMATE HERO BUTTONS ON HOVER =====
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // ===== CURRENT YEAR IN FOOTER =====
    const yearElements = document.querySelectorAll('.current-year');
    if (yearElements.length > 0) {
        const currentYear = new Date().getFullYear();
        yearElements.forEach(element => {
            element.textContent = currentYear;
        });
    }
    
    // ===== PRELOADER =====
    const preloader = document.getElementById('preloader');
    let percentElement = document.getElementById('percent');
    let progress = 0;
    
    function updatePreloader() {
        progress += Math.random() * 15 + 5;
        if (progress > 100) progress = 100;
        
        if (percentElement) {
            percentElement.textContent = Math.floor(progress) + '%';
        }
        
        if (progress < 100) {
            setTimeout(updatePreloader, 100);
        } else {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    // Trigger AOS refresh after preloader hides
                    AOS.refresh();
                }, 500);
            }, 300);
        }
    }
    
    // Start preloader animation
    setTimeout(updatePreloader, 500);
    
    // ===== ADD CSS FOR DYNAMIC ELEMENTS =====
    const dynamicStyles = document.createElement('style');
    dynamicStyles.textContent = `
        /* Notification Styles */
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--white);
            color: var(--dark-color);
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 400px;
            z-index: 9999;
            transform: translateX(150%);
            transition: transform 0.3s ease;
            border-left: 4px solid var(--primary-color);
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-success {
            border-left-color: #28a745;
        }
        
        .notification-error {
            border-left-color: #dc3545;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--gray);
            cursor: pointer;
            margin-left: 1rem;
            font-size: 1.2rem;
        }
        
        /* Lightbox Styles */
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        
        .lightbox-content img {
            max-width: 100%;
            max-height: 70vh;
            border-radius: var(--border-radius);
            object-fit: contain;
        }
        
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: var(--white);
            font-size: 1.5rem;
            cursor: pointer;
            padding: 10px;
        }
        
        .lightbox-info {
            color: var(--white);
            text-align: center;
            margin-top: 1rem;
        }
        
        /* Back to Top Button */
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--primary-color);
            color: var(--white);
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: 0 5px 15px rgba(26, 95, 122, 0.3);
        }
        
        .back-to-top.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .back-to-top:hover {
            background: var(--secondary-color);
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(26, 95, 122, 0.4);
        }
        
        /* Scroll Progress */
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, var(--primary-color), #29A68F, #30229D);
            z-index: 1001;
            transition: width 0.1s ease;
        }
        
        /* Loaded image animation */
        img.loaded {
            animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(dynamicStyles);
    
    // ===== RESPONSIVE ADJUSTMENTS =====
    function adjustForMobile() {
        if (window.innerWidth < 768) {
            // Disable autoplay on mobile for better performance
            heroSlider.autoplay.stop();
            testimonialsSlider.autoplay.stop();
            
            // Adjust particles count on mobile
            if (particlesArray) {
                particlesArray = particlesArray.slice(0, 50);
            }
        } else {
            // Re-enable autoplay on desktop
            heroSlider.autoplay.start();
            testimonialsSlider.autoplay.start();
        }
    }
    
    // Initial adjustment
    adjustForMobile();
    
    // Adjust on resize
    window.addEventListener('resize', adjustForMobile);
    
    // ===== TOUCH DEVICE OPTIMIZATIONS =====
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        // Add touch-specific classes
        document.body.classList.add('touch-device');
        
        // Improve touch targets
        const touchElements = document.querySelectorAll('button, .btn, .nav-link, .service-link');
        touchElements.forEach(element => {
            element.classList.add('touch-target');
        });
    }
    
    // ===== INITIALIZATION COMPLETE =====
    console.log('Cronos Solutions website initialized successfully');
    
    // Dispatch custom event for any other scripts
    window.dispatchEvent(new Event('cronosInitialized'));
});

// ===== ADDITIONAL GLOBAL FUNCTIONS =====

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Website error:', e.error);
    
    // Show user-friendly error message
    if (e.error && e.error.message && !e.error.message.includes('ResizeObserver')) {
        showNotification('An error occurred. Please refresh the page.', 'error');
    }
});

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
    window.addEventListener('load', function() {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`Page fully loaded in ${loadTime}ms`);
    })
}