document.addEventListener('DOMContentLoaded', () => {

    // 1. Effet Glassmorphism au scroll sur le Header
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // 2. Gestion de la Modale "Espace Famille"
    const modal = document.getElementById('modal-famille');
    const btnFamille = document.getElementById('btn-famille');
    const closeBtn = document.querySelector('.close-modal');

    btnFamille.addEventListener('click', () => {
        modal.style.display = 'flex';
        // Petite animation d'apparition
        modal.querySelector('.modal-content').animate([
            { transform: 'scale(0.9)', opacity: 0 },
            { transform: 'scale(1)', opacity: 1 }
        ], { duration: 300, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
    });

    closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
});

// 3. Gestion du Panier Premium
let cartCount = 0;

function addToCart() {
    cartCount++;
    
    // Animation du badge panier
    const badge = document.getElementById('cart-count');
    badge.innerText = cartCount;
    badge.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.5)' },
        { transform: 'scale(1)' }
    ], { duration: 300 });

    // Affichage du Toast Premium
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    
    // Auto-hide après 3 secondes
    setTimeout(() => { 
        toast.classList.remove('show'); 
    }, 3000);
}
