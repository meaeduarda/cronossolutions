// ===== SWIPER SLIDER CONFIGURATION =====

document.addEventListener('DOMContentLoaded', function() {
    // Check if Swiper is loaded
    if (typeof Swiper === 'undefined') {
        console.warn('Swiper library not loaded. Sliders will not work.');
        return;
    }
    
    // Initialize Testimonials Slider
    initTestimonialsSlider();
    
    // Initialize Clients Slider
    initClientsSlider();
    
    // Initialize Portfolio Slider (if needed)
    initPortfolioSlider();
    
    function initTestimonialsSlider() {
        const testimonialSlider = document.querySelector('.testimonials-slider');
        if (!testimonialSlider) return;
        
        new Swiper(testimonialSlider, {
            // Optional parameters
            direction: 'horizontal',
            loop: true,
            speed: 800,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            grabCursor: true,
            centeredSlides: true,
            spaceBetween: 30,
            slidesPerView: 1,
            
            // If we need pagination
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            
            // Navigation arrows
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            
            // Responsive breakpoints
            breakpoints: {
                // when window width is >= 768px
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                },
                // when window width is >= 992px
                992: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                }
            },
            
            // Additional effects
            effect: 'slide',
            fadeEffect: {
                crossFade: true
            },
            
            // Callbacks
            on: {
                init: function() {
                    console.log('Testimonials slider initialized');
                },
                slideChange: function() {
                    // Add animation to active slide
                    const activeSlide = this.slides[this.activeIndex];
                    activeSlide.classList.add('swiper-slide-active-animated');
                    
                    // Remove animation from other slides
                    this.slides.forEach(slide => {
                        if (slide !== activeSlide) {
                            slide.classList.remove('swiper-slide-active-animated');
                        }
                    });
                }
            }
        });
        
        // Add CSS for slider animations
        addSliderStyles();
    }
    
    function initClientsSlider() {
        const clientsSlider = document.querySelector('.clients-slider');
        if (!clientsSlider) return;
        
        new Swiper(clientsSlider, {
            direction: 'horizontal',
            loop: true,
            speed: 6000, // Faster speed for continuous scroll
            autoplay: {
                delay: 0, // No delay for continuous scroll
                disableOnInteraction: false,
            },
            grabCursor: false,
            spaceBetween: 30,
            slidesPerView: 2,
            freeMode: true,
            freeModeMomentum: false,
            
            breakpoints: {
                576: {
                    slidesPerView: 3,
                },
                768: {
                    slidesPerView: 4,
                },
                992: {
                    slidesPerView: 5,
                }
            },
            
            // Make it continuous
            loopAdditionalSlides: 5,
            
            // Disable all interactions
            allowTouchMove: false,
            simulateTouch: false,
        });
    }
    
    function initPortfolioSlider() {
        const portfolioSlider = document.querySelector('.portfolio-slider');
        if (!portfolioSlider) return;
        
        new Swiper(portfolioSlider, {
            direction: 'horizontal',
            loop: true,
            speed: 800,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            grabCursor: true,
            spaceBetween: 30,
            slidesPerView: 1,
            
            // Navigation
            navigation: {
                nextEl: '.portfolio-button-next',
                prevEl: '.portfolio-button-prev',
            },
            
            // Pagination
            pagination: {
                el: '.portfolio-pagination',
                clickable: true,
            },
            
            breakpoints: {
                576: {
                    slidesPerView: 2,
                },
                992: {
                    slidesPerView: 3,
                }
            },
            
            // Cube effect for portfolio
            effect: 'cube',
            cubeEffect: {
                shadow: true,
                slideShadows: true,
                shadowOffset: 20,
                shadowScale: 0.94,
            },
        });
    }
    
    function addSliderStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Swiper Custom Styles */
            .testimonials-slider {
                padding: 20px 0 50px;
            }
            
            .swiper-slide {
                height: auto;
                opacity: 0.5;
                transition: opacity 0.3s ease, transform 0.3s ease;
            }
            
            .swiper-slide-active {
                opacity: 1;
                transform: scale(1.05);
            }
            
            .swiper-slide-active-animated {
                animation: slidePulse 0.5s ease;
            }
            
            @keyframes slidePulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.02); }
                100% { transform: scale(1.05); }
            }
            
            .swiper-pagination-bullet {
                width: 12px;
                height: 12px;
                background: var(--gray);
                opacity: 0.5;
                transition: all 0.3s ease;
            }
            
            .swiper-pagination-bullet-active {
                background: var(--primary-color);
                opacity: 1;
                transform: scale(1.2);
            }
            
            .swiper-button-next,
            .swiper-button-prev {
                color: var(--primary-color);
                background: var(--white);
                width: 50px;
                height: 50px;
                border-radius: 50%;
                box-shadow: var(--shadow);
                transition: all 0.3s ease;
            }
            
            .swiper-button-next:after,
            .swiper-button-prev:after {
                font-size: 1.2rem;
                font-weight: bold;
            }
            
            .swiper-button-next:hover,
            .swiper-button-prev:hover {
                background: var(--primary-color);
                color: var(--white);
                transform: scale(1.1);
            }
            
            /* Clients Slider Specific */
            .clients-slider {
                overflow: hidden;
            }
            
            .clients-slider .swiper-wrapper {
                transition-timing-function: linear !important;
            }
            
            /* Portfolio Slider Specific */
            .portfolio-slider .swiper-slide {
                opacity: 1;
            }
            
            .portfolio-slider .swiper-slide-active {
                transform: scale(1);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add keyboard navigation
    addKeyboardNavigation();
    
    function addKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            const activeSlider = document.querySelector('.swiper-slide-active')?.closest('.swiper');
            if (!activeSlider) return;
            
            const swiperInstance = activeSlider.swiper;
            if (!swiperInstance) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    swiperInstance.slidePrev();
                    break;
                case 'ArrowRight':
                    swiperInstance.slideNext();
                    break;
                case ' ':
                    e.preventDefault();
                    if (swiperInstance.autoplay.running) {
                        swiperInstance.autoplay.stop();
                    } else {
                        swiperInstance.autoplay.start();
                    }
                    break;
            }
        });
    }
    
    // Add touch gesture improvements
    improveTouchGestures();
    
    function improveTouchGestures() {
        let touchStartX = 0;
        let touchStartY = 0;
        
        document.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        document.addEventListener('touchend', function(e) {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            
            // Only trigger if horizontal swipe is dominant
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                const activeSlider = document.elementFromPoint(
                    e.changedTouches[0].clientX,
                    e.changedTouches[0].clientY
                )?.closest('.swiper-slide')?.closest('.swiper');
                
                if (activeSlider && activeSlider.swiper) {
                    if (diffX > 0) {
                        activeSlider.swiper.slideNext();
                    } else {
                        activeSlider.swiper.slidePrev();
                    }
                }
            }
        }, { passive: true });
    }
    
    // Initialize slider after preloader
    document.addEventListener('preloaderComplete', function() {
        // Refresh all swiper instances
        document.querySelectorAll('.swiper').forEach(slider => {
            if (slider.swiper) {
                slider.swiper.update();
            }
        });
    });
});

