class PricingCalculator {
    constructor() {
        this.plans = {
            start: {
                name: "Cronos Start",
                customPrice: true,
                icon: "fa-rocket"
            },
            plus: {
                name: "Cronos Plus",
                originalPrice: 2398.80,
                discountPercentage: 20,
                months: 12,
                icon: "fa-star"
            },
            pro: {
                name: "Cronos Pro",
                originalPrice: 4932.00,
                discountPercentage: 10,
                months: 12,
                icon: "fa-crown"
            },
            premium: {
                name: "Cronos Premium",
                originalPrice: 9600.00,
                discountPercentage: 20,
                months: 12,
                icon: "fa-gem"
            }
        };
        
        this.init();
    }

    init() {
        this.updateAllPlans();
        this.setupEventListeners();
    }

    calculatePlan(planKey) {
        const plan = this.plans[planKey];
        
        if (!plan) return null;
        
        if (planKey === 'start') {
            return {
                name: plan.name,
                customPrice: true,
                icon: plan.icon
            };
        }
        
        const discountAmount = (plan.originalPrice * plan.discountPercentage) / 100;
        const discountedPrice = plan.originalPrice - discountAmount;
        const monthlyPrice = discountedPrice / plan.months;
        const savings = plan.originalPrice - discountedPrice;
        
        return {
            name: plan.name,
            originalPrice: plan.originalPrice,
            discountPercentage: plan.discountPercentage,
            discountedPrice: discountedPrice,
            monthlyPrice: monthlyPrice,
            savings: savings,
            icon: plan.icon,
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
        
        this.clearPriceElements(card);
        
        if (planKey === 'start') {
            this.updateStartPlanCard(card);
            return;
        }
        
        this.updatePricedPlanCard(card, planData);
    }

    updateStartPlanCard(card) {
        const oldPriceEl = card.querySelector('.old-price');
        if (oldPriceEl) {
            oldPriceEl.textContent = '';
            oldPriceEl.style.display = 'none';
        }
        
        const discountTag = card.querySelector('.discount-tag');
        if (discountTag) {
            discountTag.textContent = '';
            discountTag.style.display = 'none';
        }
        
        const mainPrice = card.querySelector('.main-price .amount');
        if (mainPrice) {
            mainPrice.textContent = '';
        }
        
        const currencySpan = card.querySelector('.main-price .currency');
        if (currencySpan) {
            currencySpan.textContent = '';
        }
        
        const periodSpan = card.querySelector('.main-price .period');
        if (periodSpan) {
            periodSpan.textContent = '';
        }
        
        const totalPeriod = card.querySelector('.total-period');
        if (totalPeriod) {
            totalPeriod.textContent = '';
            totalPeriod.style.display = 'none';
        }
        
        const savingsBadge = card.querySelector('.savings-badge');
        if (savingsBadge) {
            savingsBadge.textContent = 'Valores Personalizados';
            savingsBadge.style.display = 'block';
        }
        
        const button = card.querySelector('.pricing-btn');
        if (button) {
            button.textContent = 'Falar com Especialista';
            button.style.margin = '1.5rem auto 0';
            button.style.display = 'block';
            button.style.width = '100%';
            button.style.maxWidth = '250px';
            button.style.float = 'none';
            button.style.textAlign = 'center';
        }
    }

    updatePricedPlanCard(card, planData) {
        const oldPriceEl = card.querySelector('.old-price');
        if (oldPriceEl) {
            oldPriceEl.textContent = planData.formatted.originalPrice;
            oldPriceEl.style.display = 'block';
        }
        
        const discountTag = card.querySelector('.discount-tag');
        if (discountTag) {
            discountTag.textContent = `${planData.discountPercentage}% OFF`;
            discountTag.style.display = 'inline-block';
        }
        
        const mainPrice = card.querySelector('.main-price .amount');
        if (mainPrice) {
            const monthlyValue = planData.monthlyPrice.toFixed(2).replace('.', ',');
            mainPrice.textContent = monthlyValue;
        }
        
        const currencySpan = card.querySelector('.main-price .currency');
        if (currencySpan) {
            currencySpan.textContent = 'R$';
        }
        
        const totalPeriod = card.querySelector('.total-period');
        if (totalPeriod) {
            totalPeriod.textContent = '';
            totalPeriod.style.display = 'none';
        }
        
        const savingsBadge = card.querySelector('.savings-badge');
        if (savingsBadge) {
            savingsBadge.textContent = `Economize ${planData.formatted.savings}`;
            savingsBadge.style.display = 'block';
        }
        
        const button = card.querySelector('.pricing-btn');
        if (button) {
            button.textContent = 'Falar com Especialista';
            button.style.margin = '1.5rem auto 0';
            button.style.display = 'block';
            button.style.width = '100%';
            button.style.maxWidth = '250px';
            button.style.float = 'none';
            button.style.textAlign = 'center';
        }
    }

    clearPriceElements(card) {
        const elementsToClear = [
            '.old-price',
            '.discount-tag',
            '.main-price .amount',
            '.total-period',
            '.savings-badge',
            '.starting-badge'
        ];
        
        elementsToClear.forEach(selector => {
            const element = card.querySelector(selector);
            if (element) {
                element.textContent = '';
                element.style.display = '';
            }
        });
        
        const currencySpan = card.querySelector('.main-price .currency');
        const planKey = card.getAttribute('data-plan');
        if (currencySpan && planKey !== 'start') {
            currencySpan.textContent = 'R$';
        }
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        }).format(value);
    }

    setupEventListeners() {
        const buttons = document.querySelectorAll('.pricing-btn');
        
        buttons.forEach(button => {
            if (!button.hasAttribute('onclick')) {
                button.addEventListener('click', (event) => {
                    event.preventDefault();
                    const card = button.closest('.pricing-card');
                    const planKey = card.getAttribute('data-plan');
                    this.sendToWhatsApp(planKey);
                });
            }
        });
    }

    sendToWhatsApp(planKey) {
        const planData = this.calculatePlan(planKey);
        if (!planData) return;
        
        let message;
        
        if (planKey === 'start') {
            message = `Olá Cronos Solutions! Gostaria de solicitar um orçamento personalizado para o plano:

*${planData.name}*

💬 *Observações:*
Tenho interesse no plano Cronos Start e gostaria de um orçamento personalizado de acordo com minhas necessidades.

*Mensagem enviada através do site cronossolutions.com.br*

Aguardo seu retorno!`;
        } else {
            message = `Olá Cronos Solutions! Gostaria de solicitar um orçamento para o plano:

*${planData.name}*

📊 *Detalhes do Plano:*
• Valor Original: ${planData.formatted.originalPrice}
• Desconto: ${planData.discountPercentage}% OFF
• Valor Mensal: ${planData.formatted.monthlyPrice}/mês
• Economia: ${planData.formatted.savings}

💬 *Observações:*
Tenho interesse neste plano e gostaria de mais informações sobre personalizações e condições de pagamento.

*Mensagem enviada através do site cronossolutions.com.br*

Aguardo seu retorno!`;
        }
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappNumber = '5581985904605';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    }
}

// Inicializar a calculadora de preços
document.addEventListener('DOMContentLoaded', () => {
    window.pricingCalculator = new PricingCalculator();
    
    // Função global para compatibilidade com onclick no HTML
    window.selectPlan = function(planKey) {
        window.pricingCalculator.sendToWhatsApp(planKey);
    };
});
