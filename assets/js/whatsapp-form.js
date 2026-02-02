// Função para validar email com domínios válidos
function validateEmail(email) {
    // Expressão regular para validar email com domínios válidos
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Lista de domínios comuns válidos
    const validDomains = [
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
        'aol.com', 'protonmail.com', 'zoho.com', 'yandex.com', 'mail.com',
        'gmx.com', 'live.com', 'msn.com', 'bol.com.br', 'uol.com.br',
        'terra.com.br', 'ig.com.br', 'r7.com', 'globo.com', 'oi.com.br',
        'empresa.com', 'empresa.com.br', 'company.com', 'org.com',
        'edu.br', 'usp.br', 'ufmg.br', 'unb.br', 'ufrgs.br',
        'ifsp.edu.br', 'ifmg.edu.br', 'senac.br', 'senai.br'
    ];
    
    // Verifica formato básico do email
    if (!emailRegex.test(email)) {
        return { isValid: false, message: 'Formato de email inválido. Use: usuario@dominio.com' };
    }
    
    // Extrai o domínio do email
    const domain = email.split('@')[1].toLowerCase();
    
    // Verifica se o domínio tem pelo menos um ponto (ex: dominio.com)
    if (!domain.includes('.')) {
        return { isValid: false, message: 'Domínio de email inválido. Deve conter um ponto (ex: .com, .com.br)' };
    }
    
    // Verifica se o domínio termina com extensão válida
    const validExtensions = ['.com', '.com.br', '.br', '.net', '.org', '.edu', '.gov', '.mil', '.info'];
    const hasValidExtension = validExtensions.some(ext => domain.endsWith(ext));
    
    if (!hasValidExtension) {
        return { isValid: false, message: 'Extensão de domínio não reconhecida. Use .com, .com.br, .br, etc.' };
    }
    
    // Verifica se não é um email temporário/disponível
    const tempDomains = [
        'tempmail.com', 'temp-mail.org', 'guerrillamail.com', 'mailinator.com',
        '10minutemail.com', 'yopmail.com', 'trashmail.com', 'fakeinbox.com',
        'throwawaymail.com', 'disposablemail.com'
    ];
    
    if (tempDomains.some(temp => domain.includes(temp))) {
        return { isValid: false, message: 'Não aceitamos emails temporários/disponíveis.' };
    }
    
    // Verifica domínio específico (opcional - remover se quiser aceitar qualquer domínio válido)
    if (!validDomains.some(valid => domain === valid || domain.endsWith('.' + valid))) {
        // Se quiser ser mais permissivo, pode retornar true aqui
        return { 
            isValid: true, 
            message: 'Email aceito. Verifique se o domínio está correto.',
            warning: true 
        };
    }
    
    return { isValid: true, message: 'Email válido!' };
}

// Função principal para enviar ao WhatsApp
function sendToWhatsApp(event) {
    event.preventDefault();
    
    // Coletar dados
    const formData = {
        name: document.getElementById('contact-name').value.trim(),
        email: document.getElementById('contact-email').value.trim(),
        subject: document.getElementById('contact-subject').value.trim(),
        message: document.getElementById('contact-message').value.trim()
    };
    
    // Validação básica
    if (!formData.name || !formData.email || !formData.message) {
        showAlert('Por favor, preencha Nome, Email e Mensagem.', 'danger');
        return false;
    }
    
    // Validar email
    const emailValidation = validateEmail(formData.email);
    
    if (!emailValidation.isValid) {
        showAlert(emailValidation.message, 'danger');
        // Focar no campo de email
        document.getElementById('contact-email').focus();
        return false;
    }
    
    // Se houver aviso, mostrar mas permitir continuar
    if (emailValidation.warning) {
        const proceed = confirm(`⚠️ ${emailValidation.message}\n\nDeseja continuar mesmo assim?`);
        if (!proceed) {
            document.getElementById('contact-email').focus();
            return false;
        }
    }
    
    // Construir texto para WhatsApp
    const whatsappText = `
*NOVA MENSAGEM - CRONOS SOLUTIONS*

*Nome:* ${formData.name}
*Email:* ${formData.email}
*Assunto:* ${formData.subject || 'Não informado'}
*Mensagem:*
${formData.message}

_Enviado através do formulário de contato do site._
    `.trim();
    
    // Codificar para URL
    const encodedText = encodeURIComponent(whatsappText);
    
    // Número no formato internacional
    const phoneNumber = '5581994527528';
    
    // Criar URL do WhatsApp
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedText}`;
    
    // Mostrar mensagem de confirmação
    showAlert('✓ Mensagem preparada! Você será redirecionado para o WhatsApp.', 'success');
    
    // Abrir WhatsApp após 1.5 segundos
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 1500);
    
    // Limpar formulário
    document.getElementById('contact-form').reset();
    
    return false;
}

// Função para mostrar alertas
function showAlert(message, type = 'info') {
    // Remover alertas anteriores
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Criar novo alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} custom-alert mt-3`;
    alertDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Adicionar ao formulário
    const form = document.getElementById('contact-form');
    form.parentNode.insertBefore(alertDiv, form.nextSibling);
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.style.opacity = '0';
            alertDiv.style.transition = 'opacity 0.3s ease';
            setTimeout(() => alertDiv.remove(), 300);
        }
    }, 5000);
}

// Validação em tempo real do email
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('contact-email');
    
    if (emailInput) {
        // Adicionar validação ao perder o foco
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            
            if (email) {
                const validation = validateEmail(email);
                
                // Remover feedback anterior
                this.classList.remove('is-valid', 'is-invalid');
                
                if (!validation.isValid) {
                    this.classList.add('is-invalid');
                    showAlert(validation.message, 'danger');
                } else if (validation.warning) {
                    this.classList.add('is-warning');
                    showAlert(validation.message, 'warning');
                } else {
                    this.classList.add('is-valid');
                }
            }
        });
        
        // Limpar validação ao começar a digitar
        emailInput.addEventListener('input', function() {
            this.classList.remove('is-valid', 'is-invalid', 'is-warning');
        });
    }
    
    // Adicionar validação ao submeter
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', sendToWhatsApp);
    }
});