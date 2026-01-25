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
        // REDUZIDO SIGNIFICATIVAMENTE para compensar o tamanho maior
        // Menos partículas, mas maiores
        const width = this.canvas?.width || window.innerWidth;
        
        if (width < 768) return 15;    // Mobile: reduzido de 30 para 15
        if (width < 1024) return 25;   // Tablet: reduzido de 50 para 25
        return 35;                     // Desktop: reduzido de 70 para 35
    }
    
    createParticle() {
        const width = this.canvas?.width || window.innerWidth;
        const height = this.canvas?.height || window.innerHeight;
        
        // Tamanhos maiores como na imagem - base mais espalhada
        const baseSize = Math.random() > 0.7 ? 8 : 6; // 30% grandes (8px), 70% médias (6px)
        const variation = Math.random() * 3; // Variação de 0-3px
        const radius = baseSize + variation; // 6-11px para médias, 8-11px para grandes
        
        // Particle configuration com tamanhos maiores
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: radius, // AUMENTADO: 6-11 pixels (era 0.5-3)
            speed: {
                x: (Math.random() - 0.5) * 0.15, // Horizontal drift reduzido
                y: Math.random() * 0.2 + 0.1,    // Vertical speed reduzido
            },
            opacity: Math.random() * 0.6 + 0.4,  // AUMENTADO: mais opacas
            alpha: Math.random() * 0.6 + 0.4,    // Aumentado: 0.4-1.0
            pulseSpeed: Math.random() * 0.015 + 0.01, // Pulsing mais lento
            pulseDirection: Math.random() > 0.5 ? 1 : -1,
            color: this.getRandomBlueColor(),
            glow: Math.random() > 0.3, // Mais partículas com glow (70%)
            // Adicionado: peso visual para partículas maiores
            weight: radius > 8 ? 'heavy' : radius > 6 ? 'medium' : 'light'
        };
    }
    
    getRandomBlueColor() {
        // Cores mais vibrantes como na imagem
        const colors = [
            { r: 0, g: 200, b: 255 },   // Ciano vibrante
            { r: 100, g: 220, b: 255 }, // Azul claro
            { r: 0, g: 180, b: 255 },   // Azul médio
            { r: 50, g: 150, b: 255 },  // Azul royal
            { r: 0, g: 160, b: 230 },   // Azul mais escuro
            { r: 120, g: 200, b: 255 }, // Azul céu
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
            // Update position - partículas maiores se movem mais devagar
            const speedMultiplier = particle.radius > 8 ? 0.7 : particle.radius > 6 ? 0.85 : 1;
            particle.x += particle.speed.x * speedMultiplier;
            particle.y -= particle.speed.y * speedMultiplier;
            
            // Pulsing effect - mais suave para partículas maiores
            const pulseMultiplier = particle.radius > 8 ? 0.8 : 1;
            particle.alpha += particle.pulseSpeed * particle.pulseDirection * pulseMultiplier;
            if (particle.alpha > 1 || particle.alpha < 0.3) {
                particle.pulseDirection *= -1;
                particle.alpha = Math.max(0.3, Math.min(1, particle.alpha));
            }
            
            // Wrap around edges
            if (particle.x > width + 50) particle.x = -50;
            if (particle.x < -50) particle.x = width + 50;
            if (particle.y < -50) {
                particle.y = height + 50;
                particle.x = Math.random() * width;
            }
            
            // Movimento mais suave para partículas maiores
            if (particle.radius > 8) {
                particle.speed.x += (Math.random() - 0.5) * 0.005;
                particle.speed.x = Math.max(-0.2, Math.min(0.2, particle.speed.x));
            } else {
                particle.speed.x += (Math.random() - 0.5) * 0.01;
                particle.speed.x = Math.max(-0.3, Math.min(0.3, particle.speed.x));
            }
        });
    }
    
    drawParticles() {
        // Clear canvas with transparency
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Desenhar partículas maiores primeiro (para camadas)
        const sortedParticles = [...this.particles].sort((a, b) => a.radius - b.radius);
        
        sortedParticles.forEach(particle => {
            // Raio do gradiente proporcional ao tamanho da partícula
            const gradientRadius = particle.radius * 3.5;
            
            // Create gradient for glow effect
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, gradientRadius
            );
            
            if (particle.glow) {
                // Glow mais forte para partículas maiores
                const glowStrength = particle.radius > 8 ? 0.9 : particle.radius > 6 ? 0.7 : 0.5;
                gradient.addColorStop(0, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particle.alpha * glowStrength})`);
                gradient.addColorStop(0.3, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particle.alpha * glowStrength * 0.6})`);
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
            
            // Adicionar glow/brilho para partículas maiores
            if (particle.glow) {
                this.ctx.shadowColor = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0.7)`;
                this.ctx.shadowBlur = particle.radius * 3; // Glow proporcional ao tamanho
                this.ctx.fill();
                this.ctx.shadowBlur = 0; // Reset shadow
            }
            
            // Adicionar brilho central para partículas maiores
            if (particle.radius > 7) {
                const innerGradient = this.ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.radius * 0.7
                );
                innerGradient.addColorStop(0, `rgba(255, 255, 255, ${particle.alpha * 0.3})`);
                innerGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
                
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.radius * 0.5, 0, Math.PI * 2);
                this.ctx.fillStyle = innerGradient;
                this.ctx.fill();
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
                particle.speed.x *= 0.3;
                particle.speed.y *= 0.3;
                particle.pulseSpeed *= 0.5;
            });
        }
        
        // Listen for changes
        prefersReducedMotion.addEventListener('change', (e) => {
            const speedMultiplier = e.matches ? 0.3 : 1;
            const pulseMultiplier = e.matches ? 0.5 : 1;
            this.particles.forEach(particle => {
                particle.speed.x *= speedMultiplier;
                particle.speed.y *= speedMultiplier;
                particle.pulseSpeed *= pulseMultiplier;
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
                    
                    // Partículas maiores reagem menos ao mouse
                    const reactionDistance = particle.radius > 8 ? 150 : 200;
                    const reactionStrength = particle.radius > 8 ? 0.3 : 0.5;
                    
                    if (distance < reactionDistance) {
                        // Push particles away from cursor
                        const force = (reactionDistance - distance) / reactionDistance * reactionStrength;
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
    
    // Fallback: start particles even if preloader doesn't fire
    setTimeout(() => {
        if (!window.particleSystem) {
            window.particleSystem = new ParticleSystem();
        }
    }, 2000);
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticleSystem;
}