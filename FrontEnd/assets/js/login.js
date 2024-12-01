/**** Functions *****/
// Fonction: Bold "Login" sur la page login.html 
function boldLoginNav() {
    
    const currentPage = window.location.pathname;
    const loginNavLink = document.querySelector('nav a[href="login.html"]');

    if (currentPage.includes("login.html")) {
        loginNavLink;
        if (loginNavLink) {
            loginNavLink.classList.add("active-login");
        }
    }
}

// Récupere les valeurs du formulaire
function getFormValues(form) {
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    return { email, password };
}

// Valide les deux champs avant d'envoyer la requete
function validateForm(email, password) {
    if (!email || !password) {
        return { isValid: false, message: "Veuillez remplir tous les champs." };
    }
    return { isValid: true };
}

// Envoie les données récuperé à l'API
async function sendLoginFormToApi(email, password) {
    const response = await fetch("http://localhost:5678/api/users/login", {
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
}

// Affiche les erreurs dans le DOM
function showErrorMessageLogin(message) {
    const errorContainer = document.getElementById("error-message");

    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = "block";
    }
}

// Stock le token
function storeToken(token) {
    if(token) {
        window.localStorage.setItem("token", token);
    }
}

// Redirige sur la page index.html
function redirectIndexPage() {
    window.location.href = "index.html"
}


/**** Fonction Main *****/
async function mainLogin() {
    try {
        // Login en gras; fonction : ligne 3
        boldLoginNav();

        // Empêche le rechargement de la page
        const form = document.querySelector("form");
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            // Récupère les valeurs du formulaire; fonction : ligne 17
            const { email, password } = getFormValues(event.target);

            // Valide les champs du formulaire et l'arrete si erreur; fonctions : ligne 24 / 48
            const validate = validateForm(email, password);
            if (!validate.isValid) {
                showErrorMessageLogin(validate.message);
                return;
            }

            // Envoie les données à l'API; fonction : ligne 32
            const response = await sendLoginFormToApi(email, password);

            // Réponse de l'API + (stocke le token et redirige la page); fonctions : ligne 58 / 64 / 48
            if (response.success) {
                storeToken(response.token);
                redirectIndexPage();
            } else {
                showErrorMessageLogin(response.message);
            }
        });
      
    } catch(error) {
        console.error("Une erreur s'est produite dans le mainLogin:", error);
    }
}


/**** Appel Fonction Main *****/
document.addEventListener("DOMContentLoaded", () => {
    mainLogin();
});