       // Funções para o modal PuzzleCare
        function openPuzzleCareModal() {
            const modal = document.getElementById('puzzlecarePlansModal');
            if (modal) {
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        }

        function closePuzzleCareModal() {
            const modal = document.getElementById('puzzlecarePlansModal');
            if (modal) {
                modal.classList.remove('show');
                document.body.style.overflow = '';
            }
        }

        function selectPuzzleCarePlan(planType) {
            let planName = '';
            let planPrice = '';
            
            switch(planType) {
                case 'start':
                    planName = 'Plano START PuzzleCare';
                    planPrice = 'R$ 127/mês';
                    break;
                case 'clinico':
                    planName = 'Plano CLÍNICO PuzzleCare';
                    planPrice = 'R$ 297/mês';
                    break;
                case 'premium':
                    planName = 'Plano PREMIUM PuzzleCare';
                    planPrice = 'R$ 597/mês';
                    break;
            }
            
            const phone = '5581984564184';
            const message = `Olá! Gostaria de mais informações sobre o ${planName} (${planPrice}) da PuzzleCare.`;
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
            
            window.open(whatsappUrl, '_blank');
        }

        // Configurar o botão quando a página carregar
        document.addEventListener('DOMContentLoaded', function() {
            // Modificar o botão existente para abrir o modal
            const puzzlecareBtn = document.querySelector('.puzzlecare-cta');
            if (puzzlecareBtn) {
                puzzlecareBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    openPuzzleCareModal();
                });
            }
            
            // Configurar o botão de fechar
            const closeBtn = document.querySelector('.puzzlecare-plans-modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', closePuzzleCareModal);
            }
            
            // Fechar ao clicar fora do modal
            const modal = document.getElementById('puzzlecarePlansModal');
            if (modal) {
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        closePuzzleCareModal();
                    }
                });
            }
            
            // Fechar ao pressionar ESC
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
                    closePuzzleCareModal();
                }
            });
        });
   