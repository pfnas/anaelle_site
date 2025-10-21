(() => {
  const ADMIN_KEY = 'anaelle_admin_mode';
  const PASS = 'anaelle123';

  const password = document.getElementById('password');
  const login = document.getElementById('login');
  const logout = document.getElementById('logout');
  const status = document.getElementById('status');

  const isAdmin = localStorage.getItem(ADMIN_KEY) === 'true';

  function updateUI() {
    if (localStorage.getItem(ADMIN_KEY) === 'true') {
      status.textContent = '✅ Mode administrateur actif.';
      password.style.display = 'none';
      login.style.display = 'none';
      logout.style.display = 'inline-block';
    } else {
      status.textContent = '❌ Mode visiteur (édition désactivée).';
      password.style.display = 'inline-block';
      login.style.display = 'inline-block';
      logout.style.display = 'none';
    }
  }

  login.onclick = () => {
    if (password.value === PASS) {
      localStorage.setItem(ADMIN_KEY, 'true');
      alert('✅ Mode administrateur activé.');
      updateUI();
    } else {
      alert('❌ Mot de passe incorrect.');
    }
  };

  logout.onclick = () => {
    localStorage.setItem(ADMIN_KEY, 'false');
    alert('🔒 Mode administrateur désactivé.');
    updateUI();
  };

  updateUI();
})();
