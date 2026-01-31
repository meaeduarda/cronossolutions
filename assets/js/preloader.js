// ===== PRELOADER WITH PERCENTAGE =====

class Preloader {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.percentElement = document.getElementById('percent');
        this.progress = 0;
        this.totalResources = 0;
        this.loadedResources = 0;
        
        this.init();
    }
    
    init() {
        if (!this.preloader) return;
        
        // Check if user already visited today
        if (this.hasVisitedToday()) {
            this.hidePreloader();
            this.initializePage();
            return;
        }
        
        // Save today's date for future visits
        this.saveVisitDate();
        
        // Count total resources to load
        this.countResources();
        
        // Start loading simulation
        this.simulateLoading();
        
        // Monitor real resource loading
        this.monitorResources();
        
        // Fallback: Hide preloader after max time
        setTimeout(() => {
            this.hidePreloader();
        }, 4000);
    }
    
    hasVisitedToday() {
        const lastVisit = localStorage.getItem('cronos_last_visit');
        if (!lastVisit) return false;
        
        const lastVisitDate = new Date(lastVisit);
        const today = new Date();
        
        // Check if same day
        return lastVisitDate.getDate() === today.getDate() &&
               lastVisitDate.getMonth() === today.getMonth() &&
               lastVisitDate.getFullYear() === today.getFullYear();
    }
    
    saveVisitDate() {
        const today = new Date();
        localStorage.setItem('cronos_last_visit', today.toISOString());
    }
    
    countResources() {
        // Count images
        const images = document.querySelectorAll('img');
        
        // Count external scripts and styles
        const scripts = document.querySelectorAll('script[src]');
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        
        this.totalResources = images.length + scripts.length + links.length + 5; // +5 for fonts, etc
    }
    
    monitorResources() {
        // Monitor images
        document.querySelectorAll('img').forEach(img => {
            if (img.complete) {
                this.resourceLoaded();
            } else {
                img.addEventListener('load', () => this.resourceLoaded());
                img.addEventListener('error', () => this.resourceLoaded()); // Count errors too
            }
        });
        
        // Monitor scripts
        document.querySelectorAll('script[src]').forEach(script => {
            script.addEventListener('load', () => this.resourceLoaded());
            script.addEventListener('error', () => this.resourceLoaded());
        });
        
        // Monitor stylesheets
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            link.addEventListener('load', () => this.resourceLoaded());
            link.addEventListener('error', () => this.resourceLoaded());
        });
        
        // Monitor fonts
        document.fonts.ready.then(() => {
            for (let i = 0; i < 3; i++) this.resourceLoaded(); // Fonts count as multiple resources
        });
    }
    
    resourceLoaded() {
        this.loadedResources++;
        this.updateProgress();
    }
    
    simulateLoading() {
        // Initial fast progress
        const initialInterval = setInterval(() => {
            this.progress += 5;
            if (this.progress >= 30) {
                clearInterval(initialInterval);
                this.startSlowerLoading();
            }
            this.updateDisplay();
        }, 50);
    }
    
    startSlowerLoading() {
        const slowInterval = setInterval(() => {
            if (this.progress >= 95) {
                clearInterval(slowInterval);
                return;
            }
            
            // Progress slower as we get closer to 100%
            const increment = 100 - this.progress > 10 ? 1 : 0.5;
            this.progress += increment;
            this.updateDisplay();
        }, 100);
    }
    
    updateProgress() {
        if (this.totalResources === 0) return;
        
        // Calculate real progress based on loaded resources
        const realProgress = (this.loadedResources / this.totalResources) * 100;
        
        // Use whichever is higher: simulated or real progress
        if (realProgress > this.progress) {
            this.progress = Math.min(realProgress, 100);
            this.updateDisplay();
        }
        
        // If everything is loaded and simulation is done
        if (this.progress >= 100) {
            setTimeout(() => this.hidePreloader(), 500);
        }
    }
    
    updateDisplay() {
        if (this.percentElement) {
            const displayPercent = Math.min(Math.floor(this.progress), 100);
            this.percentElement.textContent = `${displayPercent}%`;
            
            // Animate the number
            this.animateNumber(this.percentElement, displayPercent);
        }
    }
    
    animateNumber(element, target) {
        const current = parseInt(element.textContent) || 0;
        if (current === target) return;
        
        const increment = target > current ? 1 : -1;
        element.textContent = `${current + increment}%`;
        
        setTimeout(() => this.animateNumber(element, target), 20);
    }
    
    hidePreloader() {
        if (!this.preloader || this.preloader.style.display === 'none') return;
        
        // Animate out
        this.preloader.style.opacity = '0';
        this.preloader.style.transition = 'opacity 0.5s ease';
        
        // Remove from DOM after animation
        setTimeout(() => {
            this.preloader.style.display = 'none';
            
            // Trigger custom event
            document.dispatchEvent(new CustomEvent('preloaderComplete'));
            
            // Initialize other components
            this.initializePage();
        }, 500);
    }
    
    initializePage() {
        // Initialize AOS animations
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100
            });
        }
        
        // Add loaded class to body for CSS transitions
        document.body.classList.add('page-loaded');
        
        // Trigger any deferred animations
        setTimeout(() => {
            document.querySelectorAll('[data-aos]').forEach(el => {
                el.style.opacity = '1';
            });
        }, 100);
    }
}

// Initialize preloader when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Preloader();
});

// Handle page transitions (for multipage sites)
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link || link.target === '_blank' || link.href.includes('#')) return;
    
    // Check if it's an internal link
    const isInternal = link.href.includes(window.location.origin) || 
                       link.href.startsWith('/') || 
                       link.href.startsWith('./') ||
                       link.href.startsWith('../');
    
    if (isInternal && !link.href.includes('mailto:') && !link.href.includes('tel:')) {
        e.preventDefault();
        
        // Show preloader
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.display = 'flex';
            preloader.style.opacity = '1';
        }
        
        // Navigate after short delay
        setTimeout(() => {
            window.location.href = link.href;
        }, 300);
    }
});

// Handle browser back/forward buttons
window.addEventListener('pageshow', (event) => {
    // If page is loaded from cache, hide preloader immediately
    if (event.persisted) {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.display = 'none';
        }
    }
});