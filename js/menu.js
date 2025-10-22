// Fichier : js/menu.js

(() => {
    // 1. Sélection des éléments
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');

    // 2. Fonction pour basculer le menu
    function toggleMenu() {
        // Ajoute ou supprime la classe 'active' sur l'élément <nav>
        mainNav.classList.toggle('active');
        
        // Met à jour l'attribut ARIA (accessibilité)
        const isExpanded = mainNav.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
    }

    // 3. Écoute l'événement de clic sur le bouton hamburger
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', toggleMenu);
        
        // Optionnel : Fermer le menu si l'utilisateur clique sur un lien 
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    toggleMenu(); // Ferme le menu après un clic sur le lien
                }
            });
        });
    }
})();