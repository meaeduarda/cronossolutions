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
                updateHeroBackground(this);
            },
            slideChange: function() {
                updateSlideCounter(this);
                updateHeroBackground(this);
            }
        }
    });

    function updateSlideCounter(swiper) {
        const currentSlide = document.querySelector('.current-slide');
        if (currentSlide) {
            currentSlide.textContent = String(swiper.realIndex + 1).padStart(2, '0');
        }
    }

    function updateHeroBackground(swiper) {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;
        
        const currentSlideIndex = swiper.realIndex;
        
        const backgroundImages = [
            'linear-gradient(rgba(10, 25, 47, 0.7), rgba(15, 35, 65, 0.75)), url("assets/image/hero1.png")',
            'linear-gradient(rgba(10, 25, 47, 0.7), rgba(15, 35, 65, 0.75)), url("assets/image/hero2.png")'
        ];
        
        heroSection.style.backgroundImage = backgroundImages[currentSlideIndex];
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
        let particlesArray = []; // Mover para fora do bloco if

        const particlesCanvas = document.getElementById('hero-particles');
        if (particlesCanvas) {
        particlesCanvas.width = window.innerWidth;
        particlesCanvas.height = window.innerHeight;
    
        const ctx = particlesCanvas.getContext('2d');
        const numberOfParticles = 100;
        
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
        
        function initParticles() {
            particlesArray = [];
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }
        
        function animateParticles() {
            ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
            
            const gradient = ctx.createRadialGradient(
                particlesCanvas.width * 0.8, particlesCanvas.height * 0.2, 0,
                particlesCanvas.width * 0.8, particlesCanvas.height * 0.2, particlesCanvas.width * 0.5
            );
            gradient.addColorStop(0, 'rgba(100, 200, 255, 0.1)');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, particlesCanvas.width, particlesCanvas.height);
            
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            
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
        
        function handleResize() {
            particlesCanvas.width = window.innerWidth;
            particlesCanvas.height = window.innerHeight;
            initParticles();
        }
        
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
    const speed = 200;
    
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
    
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        observer.observe(statsSection);
    }
    
    // ===== FORM VALIDATION =====
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[type="text"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();
            const subject = this.querySelector('input[type="text"]:nth-child(3)').value.trim();
            const message = this.querySelector('textarea').value.trim();
            
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'info') {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
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
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        const autoRemove = setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
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
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
    
    // ===== WHATSAPP FLOAT BUTTON WITH MASCOT INSIDE =====
    const whatsappFloat = document.createElement('div');
    whatsappFloat.className = 'whatsapp-float';
    whatsappFloat.innerHTML = `
        <div class="whatsapp-bubble" id="whatsappBubble">
            <button class="bubble-close" id="closeBubble" aria-label="Fechar mensagem">
                <i class="fas fa-times"></i>
            </button>
            Olá! Sou o Croninho.
             Posso Ajudar?
            <div class="bubble-arrow"></div>
        </div>
        <a href="https://wa.me/5581994527528?text=Olá!%20Gostaria%20de%20mais%20informações%20sobre%20os%20serviços%20da%20Cronos%20Solutions." 
        target="_blank" 
        rel="noopener noreferrer" 
        class="whatsapp-button">
            <img src="assets/image/croninho.png" alt="Croninho" class="mascot-img">
        </a>
    `;
    document.body.appendChild(whatsappFloat);

    // Mostrar ao scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            whatsappFloat.classList.add('show');
        } else {
            whatsappFloat.classList.remove('show');
        }
    });

    // Mostrar por padrão após 1 segundo
    setTimeout(() => {
        whatsappFloat.classList.add('show');
    }, 1000);

    // Fechar balão ao clicar no X
    const closeBubble = document.getElementById('closeBubble');
    if (closeBubble) {
        closeBubble.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const bubble = document.getElementById('whatsappBubble');
            bubble.style.opacity = '0';
            bubble.style.transform = 'scale(0.8)';
            bubble.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                bubble.style.display = 'none';
            }, 300);
        });
    }
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
                    AOS.refresh();
                }, 500);
            }, 300);
        }
    }
    
    setTimeout(updatePreloader, 500);
    
    // ===== PORTFOLIO MODAL EVENT LISTENERS =====
    const modal = document.getElementById('portfolioModal');
    const closeBtn = document.querySelector('.close-modal');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    if (modal && closeBtn && prevBtn && nextBtn) {
        closeBtn.addEventListener('click', closeModal);
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (modal.classList.contains('show')) {
                if (e.key === 'Escape') {
                    closeModal();
                } else if (e.key === 'ArrowLeft') {
                    prevSlide();
                } else if (e.key === 'ArrowRight') {
                    nextSlide();
                }
            }
        });
    }
    
    // ===== ADD CSS FOR DYNAMIC ELEMENTS =====
    const dynamicStyles = document.createElement('style');
    dynamicStyles.textContent = `
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
            heroSlider.autoplay.stop();
            testimonialsSlider.autoplay.stop();
            
            if (particlesArray) {
                particlesArray = particlesArray.slice(0, 50);
            }
        } else {
            heroSlider.autoplay.start();
            testimonialsSlider.autoplay.start();
        }
    }
    
    adjustForMobile();
    window.addEventListener('resize', adjustForMobile);
    
    // ===== TOUCH DEVICE OPTIMIZATIONS =====
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        document.body.classList.add('touch-device');
        
        const touchElements = document.querySelectorAll('button, .btn, .nav-link, .service-link');
        touchElements.forEach(element => {
            element.classList.add('touch-target');
        });
    }
    
    console.log('Cronos Solutions website initialized successfully');
    window.dispatchEvent(new Event('cronosInitialized'));
});

// ===== PORTFOLIO MODAL CONTENT =====
const portfolioData = [
    {
        images: ['assets/image/portifoliogabba.png'],
        description: 'O Portfólio Gabba apresenta a obra de um artista pernambucano com sensibilidade e identidade visual marcante. O site possui navegação fluida, responsiva e pensada para valorizar o percurso artístico. Possui formulário integrado que direciona pedidos ao WhatsApp com resumo automático, conectando arte e público de forma prática e inspiradora.',
        link: 'https://www.portifoliogabba.com.br'
    },
    {
        images: ['assets/image/painelgerenciamentooficina.png'],
        description: 'Protótipo de um sistema completo para gerenciamento de oficina mecânica, com controle de ordens de serviço, clientes, veículos e estoque.',
        link: '#'
    },
    {
        images: ['assets/image/painelagendamentomobile.png', 'assets/image/agendamento.png'],
        description: 'Sistema de agendamento para pet shop desenvolvido para Pets em Casa, permitindo que clientes agendem serviços de forma rápida e intuitiva. O Pets do Bairro é um SaaS completo para pet shops que integra loja virtual, gestão de vendas e painel administrativo em uma única plataforma.',
        link: 'https://petshop.petsemcasa.online/'
    },
    {
        images: ['assets/image/sistemaecommerce.png'],
        description: 'O e-commerce do Pets do Bairro permite que o pet shop venda produtos 24 horas por dia com loja virtual completa, organizada por categorias e integrada ao carrinho e checkout seguro. Possui controle de estoque, variações de produtos, gestão de pedidos e acompanhamento de pagamentos. Tudo conectado ao painel administrativo, facilitando a gestão das vendas e ampliando o alcance do negócio.',
        link: 'https://petshop.petsemcasa.online/'
    },
    {
        images: ['assets/image/agendamento.png', 'assets/image/painelagendamentomobile.png'],
        description: 'O sistema permite cadastro de clientes com área exclusiva, histórico de pedidos e dashboard personalizado. Possui módulo de serviços com agendamento de banho, tosa e atendimentos, além de teleconsulta veterinária integrada. Um grande diferencial é o perfil do pet, onde o tutor acompanha informações como aniversário, última tosa e histórico de cuidados',
        link: 'https://petshop.petsemcasa.online/'
    },
    {
        images: ['assets/image/legendarysite.png'],
        description: 'Site institucional para Legendary Acessórios, loja especializada em miçangas e acessórios, com catálogo de produtos e informações da marca.',
        link: 'https://legendaryacessorios.vercel.app'
    }
];

let currentModalIndex = 0;
let currentSlideIndex = 0;

function openPortfolioModal(index) {
    currentModalIndex = index;
    currentSlideIndex = 0;
    updateModalContent();
    const modal = document.getElementById('portfolioModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('portfolioModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function updateModalContent() {
    const data = portfolioData[currentModalIndex];
    const carousel = document.getElementById('modalCarousel');
    const dotsContainer = document.getElementById('carouselDots');
    const description = document.getElementById('modalDescription');
    const link = document.getElementById('modalLink');
    
    // Atualizar imagens do carrossel
    carousel.innerHTML = data.images.map((img, i) => `
        <div class="carousel-slide ${i === 0 ? 'active' : ''}">
            <img src="${img}" alt="Portfolio image ${i + 1}">
        </div>
    `).join('');
    
    // Atualizar dots se houver mais de uma imagem
    if (data.images.length > 1) {
        dotsContainer.innerHTML = data.images.map((_, i) => `
            <span class="dot ${i === 0 ? 'active' : ''}" onclick="changeSlide(${i})"></span>
        `).join('');
        dotsContainer.style.display = 'flex';
    } else {
        dotsContainer.style.display = 'none';
    }
    
    // Atualizar descrição com justificação
    description.textContent = data.description;
    description.style.textAlign = 'justify';
    description.style.hyphens = 'auto';
    
    // Configurar o link corretamente
    if (data.link && data.link !== '#') {
        link.href = data.link;
        link.style.display = 'inline-flex';
        link.style.pointerEvents = 'auto';
        link.style.opacity = '1';
        link.style.cursor = 'pointer';
        
        link.onclick = function(e) {
            e.stopPropagation();
            window.open(data.link, '_blank');
            return false;
        };
    } else {
        link.style.display = 'none';
    }
}

function changeSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlideIndex = index;
}

function nextSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    const nextIndex = (currentSlideIndex + 1) % slides.length;
    changeSlide(nextIndex);
}

function prevSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    const prevIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    changeSlide(prevIndex);
}

// ===== ADDITIONAL GLOBAL FUNCTIONS =====
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
    
    if (e.error && e.error.message && !e.error.message.includes('ResizeObserver')) {
        if (typeof showNotification !== 'undefined') {
            showNotification('An error occurred. Please refresh the page.', 'error');
        }
    }
});

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
    window.addEventListener('load', function() {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            const loadTime = Math.round(perfData.loadEventEnd - perfData.startTime);
            console.log(`Page fully loaded in ${loadTime}ms`);
        } else {
            console.log('Page loaded successfully');
        }
    });
}
