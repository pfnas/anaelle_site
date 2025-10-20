(() => {
  const ADMIN_KEY = 'anaelle_admin_mode';
  const KEY = 'anaelle_galerie';
  let isAdmin = localStorage.getItem(ADMIN_KEY) === 'true';

  const galerie = document.getElementById('galerie');
  const uploader = document.getElementById('uploader');
  const addSample = document.getElementById('add-sample');
  const clearBtn = document.getElementById('clear-galerie');
  const adminControls = document.getElementById('admin-controls');
  const toggleBtn = document.getElementById('toggle-admin');

  let data = JSON.parse(localStorage.getItem(KEY) || '[]');

  function save() {
    localStorage.setItem(KEY, JSON.stringify(data));
    render();
  }

  function render() {
    galerie.innerHTML = '';
    if (!data.length) galerie.innerHTML = '<p>Aucune image pour le moment.</p>';
    data.forEach((d, i) => {
      const card = document.createElement('div');
      card.className = 'item';
      card.innerHTML = `
        <img src="${d.image}" alt="">
        <h3 contenteditable="${isAdmin}">${d.title || 'Titre'}</h3>
        <p contenteditable="${isAdmin}">${d.price || '0,00 €'}</p>
      `;

      if (isAdmin) {
        const b = document.createElement('button');
        b.textContent = 'Supprimer';
        b.onclick = () => { data.splice(i, 1); save(); };
        card.appendChild(b);
      }
      galerie.appendChild(card);
    });
  }

  // 🧠 Affiche le panneau admin si connecté
  function updateAdminUI() {
    if (isAdmin) {
      adminControls.style.display = 'block';
      toggleBtn.textContent = '🔒 Désactiver l’édition';
    } else {
      adminControls.style.display = 'none';
      toggleBtn.textContent = '🪄 Activer l’édition';
    }
  }

  // ⚙️ Gestion du bouton Activer/Désactiver
  toggleBtn.addEventListener('click', () => {
    isAdmin = !isAdmin;
    localStorage.setItem(ADMIN_KEY, isAdmin ? 'true' : 'false');
    updateAdminUI();
    render();
  });

  // 📸 Upload manuel
  if (uploader) uploader.onchange = e => {
    [...e.target.files].forEach(f => {
      const r = new FileReader();
      r.onload = ev => {
        data.unshift({ image: ev.target.result, title: 'Titre', price: '0,00 €' });
        save();
      };
      r.readAsDataURL(f);
    });
  };

  // ➕ Image d’exemple
  if (addSample) addSample.onclick = () => {
    data.unshift({
      image: 'https://picsum.photos/200/200?' + Math.random(),
      title: 'Exemple',
      price: '9,99 €'
    });
    save();
  };

  // ❌ Tout supprimer
  if (clearBtn) clearBtn.onclick = () => {
    if (confirm('Tout supprimer ?')) {
      data = [];
      save();
    }
  };

  // 👂 Synchronisation entre onglets
  window.addEventListener('storage', e => {
    if (e.key === ADMIN_KEY) {
      isAdmin = e.newValue === 'true';
      updateAdminUI();
      render();
    }
  });

  updateAdminUI();
  render();
})();
