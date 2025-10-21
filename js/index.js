(() => {
  const ADMIN_KEY = 'anaelle_admin_mode';
  const HOME_KEY = 'anaelle_home_sections';
  let isAdmin = localStorage.getItem(ADMIN_KEY) === 'true';

  const container = document.getElementById('sections-container');
  const toggleBtn = document.getElementById('toggle-admin');
  const addBtn = document.getElementById('add-section');
  const clearBtn = document.getElementById('clear-sections');
  const adminControls = document.getElementById('admin-controls');

  let sections = JSON.parse(localStorage.getItem(HOME_KEY) || '[]');

  function save() {
    localStorage.setItem(HOME_KEY, JSON.stringify(sections));
  }

  function render() {
    adminControls.style.display = isAdmin ? 'flex' : 'none';
    toggleBtn.textContent = isAdmin ? '🔒 Désactiver l’édition' : '🪄 Activer l’édition';
    container.innerHTML = '';

    if (!sections.length) {
      const p = document.createElement('p');
      p.textContent = "Aucune rubrique pour l'instant.";
      container.appendChild(p);
      return;
    }

    sections.forEach((s, i) => {
      const article = document.createElement('article');
      article.className = 'rubrique';
      article.draggable = isAdmin;

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
      img.src = s.image || 'https://picsum.photos/400/200?random=' + i;
      article.appendChild(img);

      if (isAdmin) {
        const del = document.createElement('button');
        del.textContent = 'Supprimer';
        del.onclick = () => { sections.splice(i, 1); save(); render(); };
        article.appendChild(del);

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

        // Glisser-déposer
        article.addEventListener('dragstart', e => e.dataTransfer.setData('idx', i));
        article.addEventListener('drop', e => {
          e.preventDefault();
          const from = e.dataTransfer.getData('idx');
          const moved = sections.splice(from, 1)[0];
          sections.splice(i, 0, moved);
          save();
          render();
        });
        article.addEventListener('dragover', e => e.preventDefault());
      }

      container.appendChild(article);
    });

    container.querySelectorAll('[contenteditable="true"]').forEach(el => {
      el.addEventListener('blur', () => {
        const idx = el.dataset.idx;
        const field = el.dataset.field;
        sections[idx][field] = el.textContent.trim();
        save();
      });
    });
  }

  if (addBtn) addBtn.onclick = () => { sections.unshift({ title: 'Nouvelle rubrique', text: 'Texte...', image: '' }); save(); render(); };
  if (clearBtn) clearBtn.onclick = () => { if (confirm('Tout effacer ?')) { sections = []; save(); render(); } };
  if (toggleBtn) toggleBtn.onclick = () => { isAdmin = !isAdmin; localStorage.setItem(ADMIN_KEY, isAdmin ? 'true' : 'false'); render(); };

  render();
})();
