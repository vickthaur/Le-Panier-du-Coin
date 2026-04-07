document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Gestion du Panier E-commerce ---
    let cartCount = 0;
    let cartTotal = 0.0;

    const cartBadge = document.querySelector('.cart-badge');
    const cartPriceDisplay = document.querySelector('.cart-btn .action-text strong');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // Création dynamique de la notification (Toast)
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);

    // Écoute des clics sur tous les boutons "Ajouter"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Empêche le comportement par défaut si le bouton est dans un lien
            e.preventDefault();

            // 1.1 Animation du bouton de validation
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fa-solid fa-check"></i> Ajouté';
            button.style.backgroundColor = 'var(--primary)';
            button.style.color = 'var(--white)';

            // Remet le bouton à son état normal après 2 secondes
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.backgroundColor = '';
                button.style.color = '';
            }, 2000);

            // 1.2 Récupération du prix depuis la carte HTML
            const productCard = e.target.closest('.product-card');
            const priceText = productCard.querySelector('.product-price').innerText;
            // On transforme "3,20 €" en nombre décimal 3.20 pour le calcul
            const priceValue = parseFloat(priceText.replace(' €', '').replace(',', '.'));

            // 1.3 Mise à jour des données
            cartCount++;
            cartTotal += priceValue;

            // 1.4 Mise à jour de l'affichage du panier (Badge + Prix total)
            cartBadge.innerText = cartCount;
            cartPriceDisplay.innerText = cartTotal.toFixed(2).replace('.', ',') + ' €';

            // Animation du badge pour attirer l'œil
            cartBadge.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(1.4)' },
                { transform: 'scale(1)' }
            ], { duration: 300 });

            // 1.5 Affichage de la notification Toast
            showToast(`Article ajouté ! Total panier : ${cartTotal.toFixed(2).replace('.', ',')} €`);
        });
    });

    // Fonction pour gérer l'affichage de la notification
    function showToast(message) {
        toast.innerText = message;
        toast.classList.add('show');
        // Cache la notification après 3 secondes
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // --- 2. Animation au Scroll (En-tête collant) ---
    const header = document.querySelector('.main-header');
    const topBarHeight = document.querySelector('.top-bar').offsetHeight;

    window.addEventListener('scroll', () => {
        if (window.scrollY > topBarHeight) {
            header.style.position = 'sticky';
            header.style.top = '0';
            header.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)';
            header.style.zIndex = '1000';
        } else {
            header.style.position = 'relative';
            header.style.boxShadow = 'none';
        }
    });

    // --- 3. Espace Famille ---
    const btnFamille = document.getElementById('btn-famille');
    if(btnFamille) {
        btnFamille.addEventListener('click', () => {
            alert("Redirection vers l'espace sécurisé 'Compte Famille'...\nIci, l'aidant familial pourra se connecter, gérer les livraisons de ses proches et payer à distance.");
        });
    }

    // --- 4. Barre de recherche ---
    const searchForm = document.querySelector('.search-bar');
    const searchInput = document.querySelector('.search-bar input');
    
    searchForm.querySelector('button').addEventListener('click', (e) => {
        e.preventDefault();
        if(searchInput.value.trim() !== "") {
            alert(`Recherche des producteurs locaux pour : "${searchInput.value}"`);
        }
    });
});
