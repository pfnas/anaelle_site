// Fichier : js/admin.js

(() => {
    const ADMIN_KEY = 'anaelle_admin_mode';
    // ATTENTION : En production, un mot de passe en dur n'est PAS sécurisé.
    // Il faudrait utiliser un système côté serveur. Pour cet exercice, nous utilisons un mot de passe simple.
    const CORRECT_PASSWORD = "anaelle123"; 

    // Références aux éléments du DOM
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login');
    const logoutBtn = document.getElementById('logout');
    const statusP = document.getElementById('status');
    const mainContent = document.querySelector('.admin-page');

    let isAdmin = localStorage.getItem(ADMIN_KEY) === 'true';

    // --- Fonctions de base ---

    function setAdminMode(state) {
        isAdmin = state;
        localStorage.setItem(ADMIN_KEY, state ? 'true' : 'false');
        renderAdminStatus();
    }

    function renderAdminStatus() {
        if (isAdmin) {
            statusP.textContent = "✅ Mode administrateur ACTIF ! Vous pouvez modifier vos rubriques.";
            statusP.style.color = 'green';
            loginBtn.style.display = 'none';
            passwordInput.style.display = 'none';
            logoutBtn.style.display = 'block'; 
        } else {
            statusP.textContent = "Mode administrateur INACTIF. Connectez-vous pour commencer l'édition.";
            statusP.style.color = 'black';
            loginBtn.style.display = 'block';
            passwordInput.style.display = 'block';
            logoutBtn.style.display = 'none';
        }
    }

    // --- Gestion de la connexion (Login) ---

    loginBtn.addEventListener('click', () => {
        if (passwordInput.value === CORRECT_PASSWORD) {
            setAdminMode(true);
            // Redirection optionnelle vers la page d'accueil pour commencer l'édition
            // window.location.href = 'index.html'; 
            
        } else {
            statusP.textContent = "❌ Mot de passe incorrect.";
            statusP.style.color = 'red';
            passwordInput.value = ''; // Efface le mot de passe
        }
    });

    // --- Gestion de la déconnexion (Logout) ---
    // Ce bouton est une sécurité, mais le bouton "Désactiver l'édition" sur index.html est la méthode principale.

    logoutBtn.addEventListener('click', () => {
        setAdminMode(false);
        // Après déconnexion, renvoyer l'utilisateur vers la page d'accueil
        window.location.href = 'index.html'; 
    });

    // Rendu initial au chargement de la page
    renderAdminStatus();
})();