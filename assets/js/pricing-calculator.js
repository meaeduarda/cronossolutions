class PricingCalculator {
    constructor() {
        // CONFIGURAÇÃO DOS PLANOS
        this.plans = {
            start: {
                name: "Cronos Start",
                originalPrice: 1348.50,
                discountPercentage: 20,
                months: 12,  
                isLifetime: true,  
                paymentType: "lifetime"  
            },
            plus: {
                name: "Cronos Plus",
                originalPrice: 2398.80,
                discountPercentage: 40,
                months: 12,
                isLifetime: false,
                paymentType: "subscription"
            },
            pro: {
                name: "Cronos Pro",
                originalPrice: 3588.00,
                discountPercentage: 10,
                months: 12,
                isLifetime: false,
                paymentType: "subscription"
            },
            premium: {
                name: "Cronos Premium",
                originalPrice: 9600.00,
                discountPercentage: 20,
                months: 12,
                isLifetime: false,
                paymentType: "subscription"
            }
        };
        
        this.init();
    }

    init() {
        this.updateAllPlans();
    }

    calculatePlan(planKey) {
        const plan = this.plans[planKey];
        
        if (!plan) return null;
        
        const discountAmount = (plan.originalPrice * plan.discountPercentage) / 100;
        const discountedPrice = plan.originalPrice - discountAmount;
        const monthlyPrice = discountedPrice / plan.months;
        const totalPeriodYears = plan.months / 12;
        const savings = plan.originalPrice - discountedPrice;
        
        return {
            name: plan.name,
            originalPrice: plan.originalPrice,
            discountPercentage: plan.discountPercentage,
            discountedPrice: discountedPrice,
            monthlyPrice: monthlyPrice,
            months: plan.months,
            totalPeriodYears: totalPeriodYears,
            savings: savings,
            isLifetime: plan.isLifetime,
            paymentType: plan.paymentType,
            formatted: {
                originalPrice: this.formatCurrency(plan.originalPrice),
                discountedPrice: this.formatCurrency(discountedPrice),
                monthlyPrice: this.formatCurrency(monthlyPrice),
                savings: this.formatCurrency(savings)
            }
        };
    }

    updateAllPlans() {
        Object.keys(this.plans).forEach(planKey => {
            const planData = this.calculatePlan(planKey);
            if (planData) {
                this.updatePlanCard(planKey, planData);
            }
        });
    }

    updatePlanCard(planKey, planData) {
        const card = document.querySelector(`.pricing-card[data-plan="${planKey}"]`);
        if (!card) return;
        
        // Adicionar badge "A PARTIR DE"
        this.addStartingBadge(card);
        
        // Preço original com desconto
        const oldPriceEl = card.querySelector('.old-price');
        if (oldPriceEl) {
            oldPriceEl.textContent = planData.formatted.originalPrice;
        }
        
        // Tag de desconto
        const discountTag = card.querySelector('.discount-tag');
        if (discountTag) {
            discountTag.textContent = `${planData.discountPercentage}% OFF`;
        }
        
        // Preço principal mensal - PARA TODOS OS PLANOS
        const mainPrice = card.querySelector('.main-price .amount');
        if (mainPrice) {
            const monthlyValue = planData.monthlyPrice.toFixed(2).replace('.', ',');
            mainPrice.textContent = monthlyValue;
        }
        
        // Período total
        const totalPeriod = card.querySelector('.total-period');
        if (totalPeriod) {
            if (planData.isLifetime) {
                // Para Start (vitalício visual)
                totalPeriod.textContent = `${planData.formatted.discountedPrice} valor único`;
            } else {
                totalPeriod.textContent = `${planData.formatted.discountedPrice} anual`;
            }
        }
        
        // Economia
        const savingsBadge = card.querySelector('.savings-badge');
        if (savingsBadge) {
            savingsBadge.textContent = `Economize ${planData.formatted.savings}`;
        }
        
        // Adicionar badge "VITALÍCIO" apenas para o plano Start
        if (planData.isLifetime) {
            this.addLifetimeBadge(card);
        }
        
        // Botões centralizados
        const button = card.querySelector('.pricing-btn');
        if (button) {
            button.style.margin = '1.5rem auto 0';
            button.style.display = 'block';
        }
    }

    addLifetimeBadge(card) {
        const header = card.querySelector('.price-card-header');
        if (!header) return;
        
        // Remover badge anterior se existir
        const existingBadge = header.querySelector('.lifetime-badge');
        if (existingBadge) {
            existingBadge.remove();
        }
        
        // Adicionar badge "VITALÍCIO" verde
        const lifetimeBadge = document.createElement('div');
        lifetimeBadge.className = 'lifetime-badge';
        lifetimeBadge.textContent = 'VITALÍCIO';
        
        // Inserir após o nome do plano
        const planName = header.querySelector('.pricing-plan-name');
        if (planName) {
            planName.insertAdjacentElement('afterend', lifetimeBadge);
        } else {
            header.prepend(lifetimeBadge);
        }
    }

    addStartingBadge(card) {
        const header = card.querySelector('.price-card-header');
        if (!header) return;
        
        // Remover badge anterior se existir
        const existingBadge = header.querySelector('.starting-badge');
        if (existingBadge) existingBadge.remove();
        
        // Adicionar badge "A PARTIR DE"
        const startingBadge = document.createElement('div');
        startingBadge.className = 'starting-badge';
        startingBadge.textContent = 'A PARTIR DE';
        
        // Inserir antes do preço principal
        const priceBody = card.querySelector('.price-card-body');
        if (priceBody) {
            priceBody.insertBefore(startingBadge, priceBody.firstChild);
        }
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        }).format(value);
    }

    selectPlan(planKey) {
        const planData = this.calculatePlan(planKey);
        if (!planData) return;
        
        let message = `Olá! Gostaria de contratar o plano ${planData.name}.`;
        
        if (planData.isLifetime) {
            message += `\n\nPlano Vitalício:\n`;
            message += `• Valor total: ${planData.formatted.discountedPrice}\n`;
            message += `• Parcelas: ${planData.formatted.monthlyPrice}/mês (${planData.months}x)\n`;
            message += `• Economia: ${planData.formatted.savings}`;
        } else {
            message += `\n\nValor mensal: ${planData.formatted.monthlyPrice}\n`;
            message += `Valor total: ${planData.formatted.discountedPrice}`;
        }
        
        const whatsappNumber = '5581994527528';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    window.pricingCalculator = new PricingCalculator();
    window.selectPlan = function(planKey) {
        window.pricingCalculator.selectPlan(planKey);
    };
});