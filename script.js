document.addEventListener('DOMContentLoaded', () => {

    // 1. INITIALISATION DU PANIER (Lecture de la mémoire du navigateur)
    let cart = JSON.parse(localStorage.getItem('panierDuCoin')) || [];
    
    const cartBadge = document.querySelector('.cart-badge');
    const cartPriceDisplay = document.querySelector('.cart-btn .action-text strong');

    // Création dynamique de la notification (Toast)
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);

    function showToast(message) {
        toast.innerHTML = `<i class="fa-solid fa-check-circle" style="margin-right: 8px;"></i> ${message}`;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Mettre à jour l'en-tête (Badge et Prix Total)
    function updateHeaderCart() {
        let count = 0;
        let total = 0;
        cart.forEach(item => {
            count += item.qty;
            total += item.price * item.qty;
        });

        if (cartBadge) cartBadge.innerText = count;
        if (cartPriceDisplay) cartPriceDisplay.innerText = total.toFixed(2).replace('.', ',') + ' €';
    }

    // Sauvegarder dans la mémoire
    function saveCart() {
        localStorage.setItem('panierDuCoin', JSON.stringify(cart));
        updateHeaderCart();
        renderCartPage(); // Si on est sur la page panier, on la met à jour
    }

    updateHeaderCart(); // On lance la MAJ au chargement

    // 2. AJOUTER AU PANIER (Depuis index.html ou boutique.html)
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = e.target.closest('.product-card');
            
            // Récupération des données HTML (data-attributes)
            const id = productCard.getAttribute('data-id') || Math.random().toString();
            const name = productCard.getAttribute('data-name') || productCard.querySelector('.product-title').innerText;
            const priceText = productCard.getAttribute('data-price') || productCard.querySelector('.product-price').innerText.replace(' €', '').replace(',', '.');
            const price = parseFloat(priceText);
            const img = productCard.getAttribute('data-img') || productCard.querySelector('img').src;

            // Vérifier si le produit est déjà dans le panier
            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.qty += 1;
            } else {
                cart.push({ id, name, price, img, qty: 1 });
            }

            saveCart();

            // Afficher la notification Toast
            showToast(`<b>${name}</b> ajouté au panier !`);

            // Animation visuelle du bouton
            const originalHtml = button.innerHTML;
            button.innerHTML = '<i class="fa-solid fa-check"></i>';
            button.style.backgroundColor = 'var(--primary)';
            button.style.color = 'white';
            setTimeout(() => {
                button.innerHTML = originalHtml;
                button.style.backgroundColor = '';
                button.style.color = '';
            }, 1000);
        });
    });

    // 3. AFFICHAGE DE LA PAGE PANIER (panier.html)
    function renderCartPage() {
        const cartContainer = document.getElementById('cart-container');
        if (!cartContainer) return; // Si on n'est pas sur la page panier, on stoppe la fonction

        const subtotalEl = document.getElementById('cart-subtotal');
        const totalFinalEl = document.getElementById('cart-total-final');

        if (cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart" style="text-align: center; padding: 50px; color: var(--text-muted); background: white; border-radius: 12px; border: 1px dashed var(--border-color);">
                    <i class="fa-solid fa-basket-shopping" style="font-size: 3rem; margin-bottom: 15px; color: #ccc;"></i><br>
                    Votre panier unique est vide.<br>
                    <a href="boutique.html" class="btn-primary" style="margin-top:20px;">Remplir mon panier</a>
                </div>`;
            subtotalEl.innerText = "0,00 €";
            totalFinalEl.innerText = "0,00 €";
            return;
        }

        cartContainer.innerHTML = '';
        let subtotal = 0;

        cart.forEach((item, index) => {
            subtotal += item.price * item.qty;
            const itemHTML = `
                <div class="cart-item" style="display: flex; align-items: center; justify-content: space-between; padding: 20px; background: white; border: 1px solid var(--border-color); border-radius: 12px; margin-bottom: 15px;">
                    <div class="cart-item-info" style="display: flex; align-items: center; gap: 20px;">
                        <img src="${item.img}" alt="${item.name}" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover;">
                        <div>
                            <h4 style="margin-bottom: 5px; color: var(--text-main); font-size: 1.1rem;">${item.name}</h4>
                            <span style="color: var(--text-muted); font-size:0.85rem;">Quantité : ${item.qty}</span>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:30px;">
                        <span class="cart-item-price" style="font-weight: bold; color: var(--primary); font-size: 1.2rem;">${(item.price * item.qty).toFixed(2).replace('.', ',')} €</span>
                        <button class="btn-remove" onclick="removeItem(${index})" style="color: #e74c3c; font-size: 1.2rem; cursor: pointer; background: none; border: none;"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            `;
            cartContainer.insertAdjacentHTML('beforeend', itemHTML);
        });

        subtotalEl.innerText = subtotal.toFixed(2).replace('.', ',') + ' €';
        totalFinalEl.innerText = (subtotal + 2.50).toFixed(2).replace('.', ',') + ' €'; // 2.50€ de frais de livraison
    }

    // Rendre la fonction de suppression globale pour qu'elle fonctionne avec onclick=""
    window.removeItem = function(index) {
        cart.splice(index, 1);
        saveCart();
        showToast("Produit retiré du panier");
    };

    // Lancer l'affichage si on est sur panier.html
    renderCartPage();

    // 4. ANIMATION AU SCROLL (En-tête collant)
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                header.style.position = 'sticky';
                header.style.top = '0';
                header.style.boxShadow = 'var(--shadow-sm)';
                header.style.zIndex = '1000';
            } else {
                header.style.position = 'relative';
                header.style.boxShadow = 'none';
            }
        });
    }
});
