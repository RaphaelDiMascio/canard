// js/auth.js

// Simule une base de données d'utilisateurs B2B
const MOCK_USERS = {
    "clientpro@example.com": {
        password: "password123",
        companyName: "Restaurant Le Gourmet",
        siret: "123 456 789 00010",
        contactName: "Jean Dupont",
        phone: "0123456789",
        addresses: [
            { id: "addr1", type: "Facturation et Livraison", street: "12 Rue de la Gastronomie", postalCode: "75001", city: "Paris", country: "France", isDefaultBilling: true, isDefaultShipping: true },
            { id: "addr2", type: "Livraison Secondaire", street: "45 Avenue des Saveurs", postalCode: "75008", city: "Paris", country: "France", isDefaultBilling: false, isDefaultShipping: false }
        ],
        contractualRemiseRate: 0.05 // 5% de remise contractuelle
    },
    "chef@cuisine.fr": {
        password: "chef",
        companyName: "La Table du Chef",
        siret: "987 654 321 00020",
        contactName: "Alice Martin",
        phone: "0612345678",
        addresses: [
            { id: "addr3", type: "Unique", street: "1 Place du Marché", postalCode: "69002", city: "Lyon", country: "France", isDefaultBilling: true, isDefaultShipping: true }
        ],
        contractualRemiseRate: 0.03
    }
};

function login(email, password) {
    const user = MOCK_USERS[email.toLowerCase()];
    if (user && user.password === password) {
        const userData = {
            email: email.toLowerCase(),
            companyName: user.companyName,
            siret: user.siret,
            contactName: user.contactName,
            phone: user.phone,
            addresses: user.addresses,
            contractualRemiseRate: user.contractualRemiseRate
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        return { success: true, message: 'Connexion réussie !' };
    }
    return { success: false, message: 'Email ou mot de passe incorrect.' };
}

function register(userData) {
    // DS06: Création d'un compte utilisateur
    const email = userData.email.toLowerCase();
    if (MOCK_USERS[email]) {
        return { success: false, message: 'Un compte existe déjà avec cet email.' };
    }
    // Simule l'ajout à la "base de données"
    MOCK_USERS[email] = {
        password: userData.password,
        companyName: userData.companyName,
        siret: userData.siret,
        contactName: `${userData.contactFirstName} ${userData.contactLastName}`,
        phone: userData.phone,
        addresses: [{
            id: `addr${Date.now()}`, // Génère un ID unique simple
            type: "Principale",
            street: userData.addressStreet,
            postalCode: userData.addressPostalCode,
            city: userData.addressCity,
            country: userData.addressCountry,
            isDefaultBilling: true,
            isDefaultShipping: true
        }],
        contractualRemiseRate: 0 // Pas de remise par défaut à l'inscription
    };
    // Pour la démo, on connecte l'utilisateur directement après inscription validée (simulation)
    // Dans la vraie vie, il y aurait une étape de validation par Canard Dodu.
    // login(email, userData.password); // Optionnel: auto-login après validation simulée
    return { success: true, message: 'Demande de création de compte envoyée. Elle sera examinée par notre équipe (simulation).' };
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cart'); // Vide aussi le panier à la déconnexion
    // Redirige vers la page de connexion ou d'accueil
    if (window.location.pathname.includes('connexion.html')) {
        checkLoginStatus(); // Met à jour l'UI sur la page de connexion
         const loginMessage = document.getElementById('login-message');
         if(loginMessage) {
            loginMessage.textContent = 'Vous avez été déconnecté avec succès.';
            loginMessage.className = 'form-message success';
            loginMessage.style.display = 'block';
         }
    } else {
        window.location.href = 'connexion.html?logout=true';
    }
}

function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function checkLoginStatus() {
    const currentUser = getCurrentUser();
    const navMonCompte = document.getElementById('nav-mon-compte');
    const navConnexion = document.getElementById('nav-connexion');
    const navDeconnexion = document.getElementById('nav-deconnexion');
    const heroInscriptionBtn = document.getElementById('hero-inscription-btn');
    const navCodePromo = document.getElementById('nav-code-promo');


    if (currentUser) {
        if (navMonCompte) navMonCompte.style.display = 'inline-block';
        if (navConnexion) navConnexion.style.display = 'none';
        if (navDeconnexion) navDeconnexion.style.display = 'inline-block';
        if (navCodePromo) navCodePromo.style.display = 'inline-block';
        if (heroInscriptionBtn) heroInscriptionBtn.style.display = 'none'; // Cache le bouton d'inscription si connecté

        // Personnalisation du message d'accueil si l'élément existe
        const welcomeMessageElement = document.getElementById('user-welcome-message');
        if (welcomeMessageElement) {
            welcomeMessageElement.textContent = `Bienvenue, ${currentUser.contactName || currentUser.companyName}!`;
        }

    } else {
        if (navMonCompte) navMonCompte.style.display = 'none';
        if (navConnexion) navConnexion.style.display = 'inline-block';
        if (navDeconnexion) navDeconnexion.style.display = 'none';
        if (navCodePromo) navCodePromo.style.display = 'none';
        if (heroInscriptionBtn) heroInscriptionBtn.style.display = 'inline-block';
    }
}

// Appeler checkLoginStatus sur les pages où la nav est présente
// Ceci sera fait dans le script de chaque page.
