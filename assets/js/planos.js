// Função para enviar mensagem ao WhatsApp
function selectPlan(planName, price, maintenance, features) {
    const phoneNumber = "5581994527528";
    
    // Formatar lista de features
    const featuresList = features.map(feature => `✓ ${feature}`).join('\n');
    
    // Criar mensagem
    const message = `Olá Cronos Solutions! Gostaria de solicitar um orçamento para o plano:

📋 *${planName}*
💰 *Valor:* ${price}
🔧 *Manutenção:* ${maintenance}

✨ *Inclui:*
${featuresList}

💬 *Mensagem enviada através do site cronossolutions.com.br*

Gostaria de mais informações sobre este plano!`;
    
    // Codificar mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Criar URL do WhatsApp
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Abrir WhatsApp
    window.open(whatsappURL, '_blank');
}

// Adicionar evento de clique a todos os botões (backup)
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.pricing-btn-standard, .pricing-btn-premium');
    
    buttons.forEach(button => {
        // Verificar se já não tem onclick
        if (!button.getAttribute('onclick')) {
            button.addEventListener('click', function() {
                const card = this.closest('.pricing-card-standard, .pricing-card-premium');
                const planName = card.querySelector('.pricing-plan-name').textContent;
                const price = card.querySelector('.pricing-amount').textContent;
                const maintenance = card.querySelector('.pricing-period').textContent;
                
                // Coletar features
                const featuresItems = card.querySelectorAll('.pricing-features-list li');
                const features = Array.from(featuresItems).map(item => item.textContent.trim());
                
                // Chamar função
                selectPlan(planName, price, maintenance, features);
            });
        }
    });
});