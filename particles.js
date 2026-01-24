// ===== PARTICLE SYSTEM FOR HERO BANNER =====

class ParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.isActive = false;
        
        this.init();
    }
    
    init() {
        // Create canvas element
        this.createCanvas();
        
        // Initialize particles
        this.createParticles();
        
        // Start animation
        this.startAnimation();
        
        // Handle window resize
        this.bindEvents();
        
        // Check for reduced motion preference
        this.checkReducedMotion();
    }
    
    createCanvas() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'hero-particles';
        this.canvas.className = 'particles-canvas';
        
        // Get hero section
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;
        
        // Insert canvas at the beginning of hero section
        heroSection.prepend(this.canvas);
        
        // Set canvas context
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas dimensions
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        if (!this.canvas) return;
        
        const heroSection = this.canvas.parentElement;
        if (!heroSection) return;
        
        // Get hero section dimensions
        const rect = heroSection.getBoundingClientRect();
        
        // Set canvas dimensions to match hero section
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Update particle positions if needed
        if (this.particles.length > 0) {
            this.adjustParticlesToNewSize();
        }
    }
    
    createParticles() {
        this.particles = [];
        
        const particleCount = this.calculateParticleCount();
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    calculateParticleCount() {
        // Adjust particle count based on screen size
        const width = this.canvas?.width || window.innerWidth;
        
        if (width < 768) return 30;    // Mobile
        if (width < 1024) return 50;   // Tablet
        return 70;                     // Desktop
    }
    
    createParticle() {
        const width = this.canvas?.width || window.innerWidth;
        const height = this.canvas?.height || window.innerHeight;
        
        // Particle configuration
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2.5 + 0.5, // 0.5 to 3 pixels
            speed: {
                x: (Math.random() - 0.5) * 0.2, // Horizontal drift
                y: Math.random() * 0.3 + 0.1,   // Vertical speed
            },
            opacity: Math.random() * 0.4 + 0.2, // 0.2 to 0.6
            alpha: Math.random() * 0.5 + 0.5,   // Base opacity
            pulseSpeed: Math.random() * 0.02 + 0.01, // Pulsing speed
            pulseDirection: Math.random() > 0.5 ? 1 : -1,
            color: this.getRandomBlueColor(),
            glow: Math.random() > 0.7, // Some particles have stronger glow
        };
    }
    
    getRandomBlueColor() {
        // Array of blue/cyan colors for variety
        const colors = [
            { r: 0, g: 180, b: 255 },   // Cyan blue
            { r: 100, g: 200, b: 255 },  // Light blue
            { r: 0, g: 150, b: 255 },    // Medium blue
            { r: 0, g: 120, b: 220 },    // Darker blue
            { r: 70, g: 170, b: 255 },   // Sky blue
        ];
        
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    adjustParticlesToNewSize() {
        if (!this.canvas) return;
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        this.particles.forEach(particle => {
            // Keep particles within bounds
            particle.x = Math.min(particle.x, width);
            particle.y = Math.min(particle.y, height);
        });
    }
    
    updateParticles() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.speed.x;
            particle.y -= particle.speed.y;
            
            // Pulsing effect
            particle.alpha += particle.pulseSpeed * particle.pulseDirection;
            if (particle.alpha > 1 || particle.alpha < 0.3) {
                particle.pulseDirection *= -1;
                particle.alpha = Math.max(0.3, Math.min(1, particle.alpha));
            }
            
            // Wrap around edges
            if (particle.x > width + 20) particle.x = -20;
            if (particle.x < -20) particle.x = width + 20;
            if (particle.y < -20) {
                particle.y = height + 20;
                particle.x = Math.random() * width;
            }
            
            // Subtle horizontal oscillation
            particle.speed.x += (Math.random() - 0.5) * 0.01;
            particle.speed.x = Math.max(-0.3, Math.min(0.3, particle.speed.x));
        });
    }
    
    drawParticles() {
        // Clear canvas with transparency
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Create gradient for glow effect
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.radius * 3
            );
            
            if (particle.glow) {
                // Stronger glow for some particles
                gradient.addColorStop(0, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particle.alpha})`);
                gradient.addColorStop(0.5, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particle.alpha * 0.5})`);
                gradient.addColorStop(1, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0)`);
            } else {
                // Regular particles
                const opacity = particle.opacity * particle.alpha;
                gradient.addColorStop(0, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${opacity})`);
                gradient.addColorStop(1, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0)`);
            }
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            // Add glow/blur effect
            if (particle.glow) {
                this.ctx.shadowColor = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0.8)`;
                this.ctx.shadowBlur = 15;
                this.ctx.fill();
                this.ctx.shadowBlur = 0; // Reset shadow
            }
        });
    }
    
    animate() {
        if (!this.isActive) return;
        
        this.updateParticles();
        this.drawParticles();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    startAnimation() {
        this.isActive = true;
        this.animate();
    }
    
    stopAnimation() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    bindEvents() {
        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resizeCanvas();
                this.createParticles(); // Recreate particles for new size
            }, 250);
        });
        
        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAnimation();
            } else {
                this.startAnimation();
            }
        });
        
        // Handle page unload
        window.addEventListener('beforeunload', () => {
            this.stopAnimation();
        });
    }
    
    checkReducedMotion() {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            // Slow down animation for accessibility
            this.particles.forEach(particle => {
                particle.speed.x *= 0.5;
                particle.speed.y *= 0.5;
            });
        }
        
        // Listen for changes
        prefersReducedMotion.addEventListener('change', (e) => {
            const speedMultiplier = e.matches ? 0.5 : 1;
            this.particles.forEach(particle => {
                particle.speed.x *= speedMultiplier;
                particle.speed.y *= speedMultiplier;
            });
        });
    }
    
    // Public methods
    destroy() {
        this.stopAnimation();
        
        // Remove canvas
        if (this.canvas && this.canvas.parentElement) {
            this.canvas.parentElement.removeChild(this.canvas);
        }
        
        // Clean up particles
        this.particles = [];
    }
    
    restart() {
        this.stopAnimation();
        this.createParticles();
        this.startAnimation();
    }
    
    // Method to add mouse interaction (optional)
    enableMouseInteraction() {
        if (!this.canvas) return;
        
        this.canvas.style.pointerEvents = 'auto';
        
        let mouseX = 0;
        let mouseY = 0;
        let isMouseOver = false;
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            isMouseOver = true;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            isMouseOver = false;
        });
        
        // Modify updateParticles to include mouse interaction
        const originalUpdate = this.updateParticles.bind(this);
        this.updateParticles = function() {
            originalUpdate();
            
            if (isMouseOver) {
                this.particles.forEach(particle => {
                    const dx = mouseX - particle.x;
                    const dy = mouseY - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        // Push particles away from cursor
                        const force = (100 - distance) / 100 * 0.5;
                        particle.x -= (dx / distance) * force;
                        particle.y -= (dy / distance) * force;
                    }
                });
            }
        };
    }
}

// Initialize particle system when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait for preloader to complete
    document.addEventListener('preloaderComplete', () => {
        // Small delay to ensure hero section is ready
        setTimeout(() => {
            window.particleSystem = new ParticleSystem();
            
            // Optional: Add mouse interaction (disabled by default)
            // window.particleSystem.enableMouseInteraction();
        }, 500);
    });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticleSystem;
}