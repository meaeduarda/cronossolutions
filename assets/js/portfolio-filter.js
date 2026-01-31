// Função para filtrar portfólio com Isotope
function initPortfolioFilter() {
    const portfolioBtns = document.querySelectorAll('.portfolio-btn');
    const portfolioGroup = document.querySelector('.portfolio-group');
    
    // Inicializar Isotope se existir
    if (typeof Isotope !== 'undefined' && portfolioGroup) {
        const iso = new Isotope(portfolioGroup, {
            itemSelector: '.portfolio-item',
            layoutMode: 'fitRows',
            fitRows: {
                gutter: 30
            }
        });
        
        // Adicionar eventos aos botões
        portfolioBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remover classe active de todos os botões
                portfolioBtns.forEach(b => b.classList.remove('active'));
                
                // Adicionar classe active ao botão clicado
                this.classList.add('active');
                
                // Filtrar
                const filterValue = this.getAttribute('data-filter');
                iso.arrange({ filter: filterValue });
            });
        });
        
        // Trigger click no botão "All" para inicializar
        const allBtn = document.querySelector('.portfolio-btn[data-filter="*"]');
        if (allBtn) {
            allBtn.click();
        }
    } else {
        // Fallback se Isotope não estiver disponível
        portfolioBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remover classe active de todos os botões
                portfolioBtns.forEach(b => b.classList.remove('active'));
                
                // Adicionar classe active ao botão clicado
                this.classList.add('active');
                
                // Filtrar manualmente
                const filterValue = this.getAttribute('data-filter');
                const items = document.querySelectorAll('.portfolio-item');
                
                items.forEach(item => {
                    if (filterValue === '*' || item.classList.contains(filterValue.substring(1))) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeIn 0.5s ease';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
}

// Adicionar animação CSS
function addPortfolioAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .portfolio-item {
            animation: fadeIn 0.5s ease;
        }
        
        /* Ajuste para responsividade */
        @media (max-width: 767.98px) {
            .portfolio-btn {
                margin: 5px;
            }
            
            .portfolio-img-link {
                height: 200px !important;
            }
        }
        
        @media (max-width: 575.98px) {
            .portfolio-btn-list {
                justify-content: flex-start !important;
                flex-wrap: nowrap !important;
                overflow-x: auto !important;
                padding-bottom: 15px !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initPortfolioFilter();
    addPortfolioAnimations();
});