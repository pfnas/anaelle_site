(() => {
  const ADMIN_KEY = 'anaelle_admin_mode';
  const HOME_KEY = 'anaelle_home_sections';
  let isAdmin = localStorage.getItem(ADMIN_KEY) === 'true';

  const container = document.getElementById('sections-container');
  
  // Les deux boutons doivent être référencés
  const toggleBtn = document.getElementById('toggle-admin');  
  const disableBtn = document.getElementById('disable-admin'); 
  
  const addBtn = document.getElementById('add-section');
  const clearBtn = document.getElementById('clear-sections');
  const adminControls = document.getElementById('admin-controls');

  let sections = JSON.parse(localStorage.getItem(HOME_KEY) || '[]');

  function save() {
    localStorage.setItem(HOME_KEY, JSON.stringify(sections));
  }

  function render() {
    // 1. Contrôle de visibilité du panneau admin
    // Le panneau entier s'affiche si isAdmin est vrai. Il contient le bouton 'Désactiver'.
    adminControls.style.display = isAdmin ? 'flex' : 'none';
    
    // 2. LOGIQUE CLÉ : Masquer le bouton 'Activer'
    if (toggleBtn) {
        // Si isAdmin est true (mode édition actif), on masque le bouton d'activation ('none').
        // Sinon, on le montre ('inline-block').
        toggleBtn.style.display = isAdmin ? 'none' : 'inline-block'; 
        toggleBtn.setAttribute('aria-pressed', isAdmin ? 'true' : 'false');
    }
    
    container.innerHTML = '';

    if (!sections.length && !isAdmin) {
      const p = document.createElement('p');
      p.textContent = "Aucune rubrique pour l'instant.";
      container.appendChild(p);
      return;
    }
    
    // --- Création et rendu des rubriques (reste inchangé) ---
    sections.forEach((s, i) => {
      const article = document.createElement('article');
      article.className = 'rubrique';
      article.draggable = isAdmin;

      // ... (Logique de création des h3, p, img)
      
      const h3 = document.createElement('h3');
      h3.textContent = s.title || 'Titre';
      h3.contentEditable = isAdmin;
      h3.dataset.idx = i;
      h3.dataset.field = 'title';
      article.appendChild(h3);

      const p = document.createElement('p');
      p.textContent = s.text || 'Texte...';
      p.contentEditable = isAdmin;
      p.dataset.idx = i;
      p.dataset.field = 'text';
      article.appendChild(p);

      const img = document.createElement('img');
      const defaultImage = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 400 200\'%3E%3Crect fill=\'%23f0f0f0\' width=\'400\' height=\'200\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-size=\'16px\' font-family=\'sans-serif\' fill=\'%23888\'%3ECLIQUEZ POUR AJOUTER UNE IMAGE%3C/text%3E%3C/svg%3E';
      img.src = s.image || (isAdmin ? defaultImage : '');
      img.alt = s.title || 'Illustration';
      article.appendChild(img);

      if (isAdmin) {
        // --- CONTRÔLES ADMIN PAR ARTICLE ---
        
        const del = document.createElement('button');
        del.className = 'delete-section-btn';
        del.textContent = 'Supprimer';
        del.onclick = () => { sections.splice(i, 1); save(); render(); };
        article.appendChild(del);

        img.style.cursor = 'pointer';
        img.title = 'Cliquez pour changer d\'image';
        img.onclick = () => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = e => {
            const f = e.target.files[0];
            const reader = new FileReader();
            reader.onload = ev => {
              sections[i].image = ev.target.result;
              save();
              render();
            };
            reader.readAsDataURL(f);
          };
          input.click();
        };

        // --- Logique de Glisser-Déposer (Drag & Drop) ---
        article.addEventListener('dragstart', e => {
            e.dataTransfer.setData('idx', i);
            e.target.classList.add('dragging');
        });
        article.addEventListener('dragend', e => e.target.classList.remove('dragging'));
        
        article.addEventListener('dragover', e => {
            e.preventDefault();
            article.classList.add('drag-over'); 
        });
        article.addEventListener('dragleave', () => {
             article.classList.remove('drag-over');
        });

        article.addEventListener('drop', e => {
          e.preventDefault();
          article.classList.remove('drag-over');
          
          const from = e.dataTransfer.getData('idx');
          const fromIndex = parseInt(from, 10);
          const toIndex = i;

          if (fromIndex !== toIndex) {
              const moved = sections.splice(fromIndex, 1)[0];
              sections.splice(toIndex, 0, moved);
              save();
              render();
          }
        });
      }

      container.appendChild(article);
    });

    // --- Écouteurs pour le contenu éditable (blur) ---
    container.querySelectorAll('[contenteditable="true"]').forEach(el => {
      el.addEventListener('blur', () => {
        const idx = el.dataset.idx;
        const field = el.dataset.field;
        sections[idx][field] = el.textContent.trim();
        save();
      });
    });
  }

  // --- Écouteurs pour les contrôles globaux ---

  // 3. GESTION DU BOUTON ACTIVER (#toggle-admin)
  if (toggleBtn) toggleBtn.onclick = () => { 
    isAdmin = true; 
    localStorage.setItem(ADMIN_KEY, 'true'); 
    render(); 
  };
  
  // 4. GESTION DU BOUTON DÉSACTIVER (#disable-admin)
  if (disableBtn) disableBtn.onclick = () => { 
    isAdmin = false; 
    localStorage.setItem(ADMIN_KEY, 'false'); 
    render(); 
  };
  
  // Reste des boutons
  if (addBtn) addBtn.onclick = () => { 
    sections.unshift({ title: 'Nouvelle rubrique', text: 'Cliquez ici pour modifier le texte.', image: '' }); 
    save(); 
    render(); 
  };
  
  if (clearBtn) clearBtn.onclick = () => { 
    if (confirm('Voulez-vous vraiment effacer TOUTES les rubriques ? Cette action est irréversible.')) { 
      sections = []; 
      save(); 
      render(); 
    } 
  };

  render(); 
})();