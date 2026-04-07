document.addEventListener('DOMContentLoaded', () => {

    // 1. Effet au scroll sur le Header
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // 2. Gestion de la Modale "Espace Famille"
    const modal = document.getElementById('modal-famille');
    const btnFamille = document.getElementById('btn-famille');
    const closeBtn = document.querySelector('.close-modal');

    // Ouvrir la modale
    btnFamille.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    // Fermer la modale (croix)
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Fermer la modale (clic à l'extérieur)
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

});

// 3. Gestion du Panier (Simulation Frontend)
let cartCount = 0;

function addToCart() {
    // Incrémenter le compteur
    cartCount++;
    document.getElementById('cart-count').innerText = cartCount;

    // Afficher la notification Toast
    const toast = document.getElementById('toast');
    toast.className = "toast show";
    
    // Cacher la notification après 3 secondes
    setTimeout(function(){ 
        toast.className = toast.className.replace("show", ""); 
    }, 3000);
}
