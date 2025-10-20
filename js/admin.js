const ADMIN_KEY = "anaelle_admin_mode";

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const pass = document.getElementById("password").value.trim();

  if (pass === "anaelle123") {
    localStorage.setItem(ADMIN_KEY, "true");
    window.location.href = "index.html";
  } else {
    const error = document.getElementById("error");
    error.textContent = "❌ Mot de passe incorrect";
    error.style.color = "red";
  }
});
