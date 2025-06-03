// js/cart.js

// Simule un Catalogue de produits plus détaillé
const MOCK_PRODUCTS = {
    "prod001": { id: "prod001", name: "Canard Entier Prêt à Cuire", category: "canard_entier", priceHT: 12.50, unit: "kg", description: "Canard entier de qualité supérieure, plumé et vidé. Idéal pour rôtir. Environ 1.8kg - 2.2kg.", stock: 15, image: "https://placehold.co/300x220/e67e22/ffffff?text=Canard+Entier", allergens: "Aucun", specs: "Origine: France, DLC: 7 jours" },
    "prod002": { id: "prod002", name: "Magret de Canard (x2)", category: "magret", priceHT: 25.90, unit: "kg", description: "Lot de deux magrets de canard frais, parfaits pour griller ou poêler. Environ 350g-400g pièce.", stock: 30, image: "https://placehold.co/300x220/e67e22/ffffff?text=Magret+Canard", allergens: "Aucun", specs: "Origine: Sud-Ouest, DLC: 8 jours" },
    "prod003": { id: "prod003", name: "Foie Gras de Canard Entier Cru", category: "foie_gras", priceHT: 55.00, unit: "pièce", description: "Lobe de foie gras de canard cru extra, idéal pour vos terrines maison. Environ 500g.", stock: 10, image: "https://placehold.co/300x220/e67e22/ffffff?text=Foie+Gras", allergens: "Aucun", specs: "Qualité Extra, DLC: 5 jours" },
    "prod004": { id: "prod004", name: "Cuisses de Canard Confites (x4)", category: "confit", priceHT: 18.75, unit: "lot de 4", description: "Quatre cuisses de canard confites dans leur graisse, tendres et savoureuses. Prêtes à réchauffer.", stock: 25, image: "https://placehold.co/300x220/e67e22/ffffff?text=Confit+Canard", allergens: "Aucun", specs: "Prêt à l'emploi, DLC: 30 jours" },
    "prod005": { id: "prod005", name: "Aiguillettes de Canard Fraîches", category: "autre_decoupe", priceHT: 15.50, unit: "barquette 500g", description: "Barquette d'aiguillettes de canard fraîches, idéales pour des préparations rapides et gourmandes.", stock: 0, image: "https://placehold.co/300x220/e67e22/ffffff?text=Aiguillettes", allergens: "Aucun", specs: "Barquette ~500g, DLC: 6 jours" },
    "prod006": { id: "prod006", name: "Gésiers de Canard Confits", category: "autre_decoupe", priceHT: 9.80, unit: "boîte 380g", description: "Gésiers de canard confits, parfaits pour agrémenter vos salades gourmandes.", stock: 5, image: "https://placehold.co/300x220/e67e22/ffffff?text=Gésiers+Confits", allergens: "Aucun", specs: "Conserve, DLC: 1 an" }
};

function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : []; // Un panier est un tableau d'objets { productId, quantity }
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateNavCartCount();
}

function addToCart(productId, quantity = 1) {
    // DS09: Ajouter un produit au panier
    let cart = getCart();
    const product = MOCK_PRODUCTS[productId];
    quantity = parseInt(quantity);

    if (!product) {
        console.error("Produit non trouvé:", productId);
        alert("Erreur: produit non trouvé.");
        return;
    }

    if (product.stock < quantity) {
        // DS16: Proposer une alternative en cas de rupture (partielle ici)
        alert(`Stock insuffisant pour ${product.name}. Disponible : ${product.stock}. Alternative proposée (simulation) : commander la quantité disponible ou être notifié.`);
        // Pour la démo, on n'ajoute rien si stock insuffisant pour la quantité demandée.
        // On pourrait ajouter la quantité max dispo.
        return;
    }

    const existingProductIndex = cart.findIndex(item => item.productId === productId);

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += quantity;
        if (cart[existingProductIndex].quantity > product.stock) {
            alert(`Quantité totale pour ${product.name} dépasse le stock disponible (${product.stock}). Ajustement à la quantité max.`);
            cart[existingProductIndex].quantity = product.stock;
        }
    } else {
        cart.push({ productId, quantity });
    }
    saveCart(cart);
    alert(`${quantity} x ${product.name} ajouté(s) au panier.`);
    // Mettre à jour l'affichage du panier si on est sur la page panier
    if (typeof displayCart === "function") {
        displayCart();
    }
}

function updateCartQuantity(productId, newQuantity) {
    // DS14: Modifier une ligne du panier
    let cart = getCart();
    newQuantity = parseInt(newQuantity);
    const product = MOCK_PRODUCTS[productId];

    if (!product) {
        console.error("Produit non trouvé:", productId);
        return;
    }

    const itemIndex = cart.findIndex(item => item.productId === productId);
    if (itemIndex > -1) {
        if (newQuantity <= 0) {
            removeFromCart(productId); // Supprime si quantité <= 0
        } else if (newQuantity > product.stock) {
            alert(`Stock insuffisant pour ${product.name}. Maximum ${product.stock} unités.`);
            cart[itemIndex].quantity = product.stock; // Ajuste à la quantité max dispo
            // Mettre à jour la valeur de l'input sur la page panier
            const inputElement = document.querySelector(`.cart-table input[data-product-id="${productId}"]`);
            if(inputElement) inputElement.value = product.stock;

        } else {
            cart[itemIndex].quantity = newQuantity;
        }
        saveCart(cart);
    }
     // Mettre à jour l'affichage du panier si on est sur la page panier
    if (typeof displayCart === "function") {
        displayCart();
    }
}

function removeFromCart(productId) {
    // DS15: Supprimer un produit du panier
    let cart = getCart();
    cart = cart.filter(item => item.productId !== productId);
    saveCart(cart);
     // Mettre à jour l'affichage du panier si on est sur la page panier
    if (typeof displayCart === "function") {
        displayCart();
    }
}

function calculateCartTotals(cartItems, promoCode = null) {
    // DS19: Calculer le montant total de la commande
    let subtotalHT = 0;
    cartItems.forEach(item => {
        const product = MOCK_PRODUCTS[item.productId];
        if (product) {
            subtotalHT += product.priceHT * item.quantity;
        }
    });

    let discountAmount = 0;
    let finalSubtotalHT = subtotalHT;

    // DS17: Appliquer automatiquement les remises contractuelles
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.contractualRemiseRate > 0) {
        const contractualDiscount = subtotalHT * currentUser.contractualRemiseRate;
        discountAmount += contractualDiscount;
        console.log(`Remise contractuelle (${currentUser.contractualRemiseRate*100}%): -${contractualDiscount.toFixed(2)} €`);
    }

    // DS18: Appliquer un code promotionnel
    if (promoCode) {
        // Simulation de codes promo
        if (promoCode.toUpperCase() === "PROMO10B2B" && subtotalHT >= 50) { // -10% sur le sous-total (après remise contractuelle) pour commandes > 50€
            const promoDiscount = (subtotalHT - discountAmount) * 0.10;
            discountAmount += promoDiscount;
             console.log(`Code PROMO10B2B: -${promoDiscount.toFixed(2)} €`);
        } else if (promoCode.toUpperCase() === "CANARD5EU" && subtotalHT >= 30) { // -5€ fixes pour commandes > 30€
            const promoDiscountValue = 5;
            discountAmount += promoDiscountValue;
            console.log(`Code CANARD5EU: -${promoDiscountValue.toFixed(2)} €`);
        } else {
            console.log("Code promo invalide ou conditions non remplies.");
            // On pourrait retourner un message d'erreur ici
        }
    }
    
    finalSubtotalHT = subtotalHT - discountAmount;
    if(finalSubtotalHT < 0) finalSubtotalHT = 0; // Éviter un total négatif

    const tvaRate = 0.20; // Taux de TVA standard de 20%
    const tvaAmount = finalSubtotalHT * tvaRate;

    // Gestion du franco de port (simulation: franco si commande > 150€ HT)
    const shippingThreshold = 150;
    let shippingCost = (finalSubtotalHT > 0 && finalSubtotalHT < shippingThreshold) ? 15.00 : 0; // 15€ de port sinon
    if (finalSubtotalHT === 0) shippingCost = 0;


    const totalTTC = finalSubtotalHT + tvaAmount + shippingCost;

    return {
        subtotalHT: subtotalHT,
        discountAmount: discountAmount,
        finalSubtotalHT: finalSubtotalHT,
        tvaAmount: tvaAmount,
        shippingCost: shippingCost,
        totalTTC: totalTTC,
        appliedPromoCode: promoCode // Pour affichage
    };
}


function updateNavCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const navCartCountElement = document.getElementById('nav-cart-count');
    if (navCartCountElement) {
        navCartCountElement.textContent = count;
    }
}

function getProductById(productId) {
    return MOCK_PRODUCTS[productId] || null;
}

// Initialiser le compteur au chargement du script (si la nav est présente)
if (document.getElementById('nav-cart-count')) {
    updateNavCartCount();
}
