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
                paymentType: "lifetime",
                icon: "fa-rocket",
                features: [
                    "Autônomos e pequenas empresas",
                    "Site institucional responsivo",
                    "Até 5 páginas personalizadas",
                    "Botão WhatsApp integrado",
                    "Formulário de contato",
                    "Publicação do site"
                ]
            },
            plus: {
                name: "Cronos Plus",
                originalPrice: 2398.80,
                discountPercentage: 20,
                months: 12,
                isLifetime: false,
                paymentType: "subscription",
                icon: "fa-star",
                features: [
                    "Clínicas, Lojas, consultórios",
                    "Site institucional responsivo",
                    "Agendamento online",
                    "Cadastro de clientes",
                    "Painel administrativo",
                    "Histórico simples",
                    "Suporte padrão"
                ]
            },
            pro: {
                name: "Cronos Pro",
                originalPrice: 3588.00,
                discountPercentage: 10,
                months: 12,
                isLifetime: false,
                paymentType: "subscription",
                icon: "fa-crown",
                features: [
                    "Clínicas, oficinas, lojas",
                    "Painel do cliente/Usuário",
                    "Histórico de Serviços",
                    "Relatórios",
                    "E-commerce (se aplicável)",
                    "Catálogo / Galerias",
                    "Controle de acesso por perfil",
                    "Domínio premium",
                    "Suporte prioritário"
                ]
            },
            premium: {
                name: "Cronos Premium",
                originalPrice: 9600.00,
                discountPercentage: 20,
                months: 12,
                isLifetime: false,
                paymentType: "subscription",
                icon: "fa-gem",
                features: [
                    "Sistema customizado por segmento",
                    "Painel digital Recepção (TV)",
                    "E-commerce (se aplicável)",
                    "Painel administrativo avançado",
                    "Integrações (WhatsApp e pagamento)",
                    "Sistema de Gestão Completo",
                    "Suporte 24/7 prioritário"
                ]
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
            months: plan.months,
            savings: savings,
            isLifetime: plan.isLifetime,
            paymentType: plan.paymentType,
            features: plan.features,
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
        
        // Preço principal mensal
        const mainPrice = card.querySelector('.main-price .amount');
        if (mainPrice) {
            const monthlyValue = planData.monthlyPrice.toFixed(2).replace('.', ',');
            mainPrice.textContent = monthlyValue;
        }
        
        // Período total
        const totalPeriod = card.querySelector('.total-period');
        if (totalPeriod) {
            if (planData.isLifetime) {
                totalPeriod.textContent = `${planData.formatted.discountedPrice} (valor único)`;
            } else {
                totalPeriod.textContent = `${planData.formatted.discountedPrice} (valor anual)`;
            }
        }
        
        // Economia
        const savingsBadge = card.querySelector('.savings-badge');
        if (savingsBadge) {
            savingsBadge.textContent = `Economize ${planData.formatted.savings}`;
        }
        
        // Botões centralizados
        const button = card.querySelector('.pricing-btn');
        if (button) {
            button.style.margin = '1.5rem auto 0';
            button.style.display = 'block';
        }
    }

    addStartingBadge(card) {
        const priceBody = card.querySelector('.price-card-body');
        if (!priceBody) return;
        
        // Remover badge anterior se existir
        const existingBadge = priceBody.querySelector('.starting-badge');
        if (existingBadge) existingBadge.remove();
        
        // Adicionar badge "A PARTIR DE"
        const startingBadge = document.createElement('div');
        startingBadge.className = 'starting-badge';
        startingBadge.textContent = 'A PARTIR DE';
        
        // Inserir antes do preço principal
        priceBody.insertBefore(startingBadge, priceBody.firstChild);
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        }).format(value);
    }

    setupEventListeners() {
        // Configurar eventos de clique para todos os botões
        const buttons = document.querySelectorAll('.pricing-btn-standard, .pricing-btn-premium');
        
        buttons.forEach(button => {
            // Se já tem onclick via HTML, não adiciona outro
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
        
        // Formatar a mensagem completa
        const featuresList = planData.features.map(feature => `✓ ${feature}`).join('\n');
        
        const message = `Olá Cronos Solutions! Gostaria de solicitar um orçamento para o plano:

*${planData.name}*

📊 *Detalhes do Plano:*
• Valor Original: ${planData.formatted.originalPrice}
• Desconto: ${planData.discountPercentage}% OFF
• Valor com Desconto: ${planData.formatted.discountedPrice}
• Valor Mensal: ${planData.formatted.monthlyPrice}/mês${planData.isLifetime ? ' (valor único)' : ' (plano anual)'}
• Economia: ${planData.formatted.savings}

📋 *Inclui:*
${featuresList}

🏷️ *Tipo de Pagamento:* ${planData.isLifetime ? 'Vitalício (pagamento único)' : 'Assinatura Anual'}

💬 *Observações:*
Tenho interesse neste plano e gostaria de mais informações sobre personalizações e condições de pagamento.

*Mensagem enviada através do site cronossolutions.com.br*

Aguardo seu retorno!`;
        
        // Codificar mensagem para URL
        const encodedMessage = encodeURIComponent(message);
        
        // Criar URL do WhatsApp
        const whatsappNumber = '5581994527528';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Abrir WhatsApp
        window.open(whatsappUrl, '_blank');
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    window.pricingCalculator = new PricingCalculator();
    
    // Manter compatibilidade com HTML onclick
    window.selectPlan = function(planKey) {
        window.pricingCalculator.sendToWhatsApp(planKey);
    };
});