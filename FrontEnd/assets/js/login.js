// Permet l'ecriture en gras du lien Login lorsqu'on se trouve sur la page login.html
function boldLoginLink() {
    const navLinks = document.querySelectorAll("nav ul li a");
    const currentURL = window.location.href;

    // Sélectionne uniquement le lien vers "login" si c'est la page actuelle
    const loginLink = Array.from(navLinks).find(link => link.href === currentURL);
    
    if (loginLink) {
        loginLink.classList.add("active-login");
    }
}

// Récupere les valeurs dans le formulaire soumis
function getFormData(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    return { email, password };
}

// Envoie les données récuperé à l'API
async function sendLoginRequest(email, password) {
    try {
        const response = await fetch(apiUrlLogin, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            return { success: true, token: data.token };
        } else {
            return { success: false, message: "Email ou mot de passe incorrect." };
        }
    } catch (error) {
        console.error("Erreur:", error);
        return { success: false, message: "Une erreur est survenue. Veuillez réessayer." };
    }
}

// Affiche les erreurs dans le DOM
function showErrorMessageLogin(message) {
    const errorContainer = document.getElementById("error-message");
    errorContainer.textContent = message;
    errorContainer.style.display = "block";

    setTimeout(() => {
        errorContainer.style.display = "none";
    }, 5000);
}

// Valide les deux champs avant d'envoyer la requete
function validateForm(email, password) {
    if (!email || !password) {
        showErrorMessageLogin("Veuillez remplir tous les champs.");
        return false;
    }
    return true;
}

// Gère le stockage du token et redirige l'utilisateur si connexion réussie
function manageSuccessfulLogin(token) {
    if (token) {
        // Stockage du token dans le localStorage
        window.localStorage.setItem("token", token);
        window.location.href = "index.html"; 
    } else {
        showErrorMessageLogin("Une erreur est survenue. Aucun token reçu.");
    }
}

// Initialisation des différentes fonctions 
function initLoginProcess() {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", async (event) => {
        const { email, password } = getFormData(event); 

        if (!validateForm(email, password)) return;

        const result = await sendLoginRequest(email, password); 

        if (result.success) {
            manageSuccessfulLogin(result.token);
        } else {
            showErrorMessageLogin(result.message); 
        }
    });
}
