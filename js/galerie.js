(() => {
  const ADMIN_KEY = 'anaelle_admin_mode';
  const KEY = 'anaelle_galerie';
  const galerie = document.getElementById('galerie');
  const uploader = document.getElementById('uploader');
  const addSample = document.getElementById('add-sample');
  const clearBtn = document.getElementById('clear-galerie');
  const adminControls = document.getElementById('admin-controls');

  let data = JSON.parse(localStorage.getItem(KEY) || '[]');
  let isAdmin = localStorage.getItem(ADMIN_KEY) === 'true';

  function save(silent = false) {
    localStorage.setItem(KEY, JSON.stringify(data));
    if (!silent) render();
  }

  function render() {
    galerie.innerHTML = '';

    // Affiche les outils admin si connecté
    adminControls.style.display = isAdmin ? 'block' : 'none';

    if (!data.length) {
      galerie.innerHTML = '<p>Aucune image pour le moment.</p>';
      return;
    }

    data.forEach((d, i) => {
      const card = document.createElement('div');
      card.className = 'item';
      card.innerHTML = `
        <img src="${d.image}" alt="">
        <h3 ${isAdmin ? 'contenteditable="true"' : ''}>${d.title || 'Titre'}</h3>
        <p ${isAdmin ? 'contenteditable="true"' : ''}>${d.price || '0,00 €'}</p>
      `;

      // Bouton supprimer visible uniquement en admin
      if (isAdmin) {
        const del = document.createElement('button');
        del.textContent = '🗑️';
        del.className = 'delete-btn';
        del.onclick = () => {
          if (confirm('Supprimer cette image ?')) {
            data.splice(i, 1);
            save();
          }
        };
        card.appendChild(del);

        // ✅ Correction ici : sauvegarde uniquement quand on quitte la zone
        const titleEl = card.querySelector('h3');
        const priceEl = card.querySelector('p');

        titleEl.onblur = () => {
          data[i].title = titleEl.textContent.trim();
          save(true);
        };
        priceEl.onblur = () => {
          data[i].price = priceEl.textContent.trim();
          save(true);
        };
      }

      galerie.appendChild(card);
    });
  }

  // 📷 Upload d'images locales
  if (uploader) {
    uploader.onchange = (e) => {
      [...e.target.files].forEach((file) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          data.unshift({ image: ev.target.result, title: 'Nouveau', price: '0,00 €' });
          save();
        };
        reader.readAsDataURL(file);
      });
    };
  }

  // 🖼️ Ajout d’un exemple automatique
  if (addSample) {
    addSample.onclick = () => {
      data.unshift({
        image: 'https://picsum.photos/300/300?random=' + Math.random(),
        title: 'Exemple',
        price: '9,99 €',
      });
      save();
    };
  }

  // 🗑️ Tout supprimer
  if (clearBtn) {
    clearBtn.onclick = () => {
      if (confirm('Supprimer toute la galerie ?')) {
        data = [];
        save();
      }
    };
  }

  // 🔄 Réagit si l’état admin change (ex : depuis admin.html)
  window.addEventListener('storage', (e) => {
    if (e.key === ADMIN_KEY) {
      isAdmin = e.newValue === 'true';
      render();
    }
  });

  render();
})();
