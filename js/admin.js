// Fichier : js/admin.js

(() => {
    // --- CLÉS ---
    const ADMIN_KEY = 'anaelle_admin_mode';
    // Clés pour les statistiques de vues (doivent correspondre à celles de index.js)
    const VIEWS_KEY = 'anaelle_site_views_total';
    const VIEWS_DAILY_KEY = 'anaelle_site_views_daily';

    // ATTENTION : Le mot de passe en dur n'est PAS sécurisé en production.
    const CORRECT_PASSWORD = "anaelle123"; 

    // --- SÉLECTEURS DU DOM ---
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login');
    const statusText = document.getElementById('status');
    
    // SÉLECTEURS POUR LES ZONES D'AFFICHAGE/MASQUAGE
    const loginControls = document.getElementById('login-controls');
    const secureContent = document.getElementById('secure-admin-content');
    const logoutBtn = secureContent ? secureContent.querySelector('#logout') : null; // Sélectionne le bouton logout DANS la zone sécurisée

    let isAdmin = localStorage.getItem(ADMIN_KEY) === 'true';

    // --- FONCTIONS DE GESTION DES STATS ---

    // Fonction pour lire et afficher les compteurs stockés dans localStorage
    function loadStats() {
        const totalViews = localStorage.getItem(VIEWS_KEY) || '0';
        const dailyViews = localStorage.getItem(VIEWS_DAILY_KEY) || '0';
        
        const viewsTotalEl = document.getElementById('views-total');
        const viewsTodayEl = document.getElementById('views-today');
        
        if (viewsTotalEl) viewsTotalEl.textContent = totalViews;
        if (viewsTodayEl) viewsTodayEl.textContent = dailyViews;
    }


    // --- FONCTIONS DE GESTION DU STATUT ADMIN ET RENDU ---

    function setAdminMode(state) {
        isAdmin = state;
        localStorage.setItem(ADMIN_KEY, state ? 'true' : 'false');
        checkLoginStatus(); // On utilise checkLoginStatus pour le rendu
    }

    // Fonction principale qui affiche le contenu basé sur le statut
    function checkLoginStatus() {
        if (isAdmin) {
            statusText.textContent = "✅ Mode administrateur ACTIF !";
            statusText.style.color = 'green';
            
            // Masquer les contrôles de connexion
            if (loginControls) loginControls.style.display = 'none';
            
            // Afficher le contenu sécurisé et charger les stats
            if (secureContent) secureContent.style.display = 'block'; 
            loadStats(); 

        } else {
            statusText.textContent = "Mode administrateur INACTIF. Connectez-vous pour commencer l'édition.";
            statusText.style.color = 'black';

            // Afficher les contrôles de connexion
            if (loginControls) loginControls.style.display = 'block';
            
            // Masquer le contenu sécurisé
            if (secureContent) secureContent.style.display = 'none';
        }
    }


    // --- GESTION DES ÉVÉNEMENTS ---

    function handleLogin() {
        if (passwordInput && passwordInput.value === CORRECT_PASSWORD) {
            setAdminMode(true);
            // Redirection vers index.html pour commencer l'édition
            // Note: Nous laissons ici l'option de recharger la page pour l'admin.
            // Une redirection vers index.html pourrait être plus pratique.
            // window.location.href = 'index.html'; 
            
        } else {
            statusText.textContent = "❌ Mot de passe incorrect.";
            statusText.style.color = 'red';
            if (passwordInput) passwordInput.value = ""; // Efface le mot de passe
        }
    }

    function handleLogout() {
        setAdminMode(false);
        // Rediriger vers l'accueil après déconnexion
        window.location.href = 'index.html'; 
    }

    // Attribution des écouteurs d'événements
    if (loginBtn) loginBtn.addEventListener('click', handleLogin);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    // Activer la connexion avec la touche Entrée
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleLogin();
            }
        });
    }

    // --- INITIALISATION ---
    checkLoginStatus(); 
})();