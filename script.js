document.addEventListener('DOMContentLoaded', () => {

    // 1. INITIALISATION DU PANIER (Lecture de la mémoire du navigateur)
    let cart = JSON.parse(localStorage.getItem('panierDuCoin')) || [];
    
    const cartBadge = document.querySelector('.cart-badge');
    const cartPriceDisplay = document.querySelector('.cart-btn .action-text strong');

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

            // Animation visuelle
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
                <div class="empty-cart">
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
                <div class="cart-item">
                    <div class="cart-item-info">
                        <img src="${item.img}" alt="${item.name}">
                        <div>
                            <h4>${item.name}</h4>
                            <span style="color: var(--text-muted); font-size:0.85rem;">Quantité : ${item.qty}</span>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:30px;">
                        <span class="cart-item-price">${(item.price * item.qty).toFixed(2).replace('.', ',')} €</span>
                        <button class="btn-remove" onclick="removeItem(${index})"><i class="fa-solid fa-trash"></i></button>
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
    };

    // Lancer l'affichage si on est sur panier.html
    renderCartPage();

    // 4. Redirection des boutons (Lier les pages entre elles)
    const cartButton = document.querySelector('.cart-btn');
    if(cartButton) {
        cartButton.addEventListener('click', () => {
            window.location.href = 'panier.html';
        });
    }
});
