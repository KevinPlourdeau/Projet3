/**** Mode classique ---> Filtres + Gallerie *****/
// Fonction API fetch pour récupérer les images dans le fichier "Works" 
async function fetchWorks() {
    const res = await fetch("http://localhost:5678/api/works");
    if (!res.ok) {
        throw new Error("Erreur sur la récupération des travaux");
    }
    
    const worksData = await res.json();
    return worksData;
}

// Affiche la gallerie se trouvant sur l'Api Url "/works"
function displayGallery(worksData) {
    const galleryContainer = document.querySelector('.gallery');

    worksData.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');
        
        img.src = work.imageUrl;
        img.alt = work.title;
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        galleryContainer.appendChild(figure);
    });
}

// Fonction pour supprimer le contenu dans le HTML partie "gallery"
function clearGalleryHTML() {
    const galleryHTML = document.querySelector(".gallery")
    galleryHTML.innerHTML = ""
}


// Fonction API fetch pour récupérer les différentes categories dans le fichier "categories"
async function fetchCategories() {
    const res = await fetch("http://localhost:5678/api/categories");
    if (!res.ok) {
        throw new Error("Erreur lors de la récupération des catégories");
    }

    const categoriesData = await res.json();
    return categoriesData;
}

// Affiche les différents filtres se trouvant sur l'Api Url "/categories"
function displayCategoryFilters(categoriesData) {
    const portfolioSection = document.getElementById("portfolio");
    const filtersContainer = document.createElement("div");
    filtersContainer.classList.add("filters");

    //  Genere le boutton "tous"
    const allFilterButton = document.createElement("button");
    allFilterButton.classList.add('filter-btn', "active");
    allFilterButton.textContent = 'Tous';
    filtersContainer.appendChild(allFilterButton);

    // Genere les boutons pour les autres catégories + donne un id aux filtres
    categoriesData.forEach(category => {
        const filtersButton = document.createElement('button');
        filtersButton.classList.add('filter-btn');
        filtersButton.textContent = category.name;
        filtersButton.dataset.categoryId = category.id;
        filtersContainer.appendChild(filtersButton);
    });
    portfolioSection.insertBefore(filtersContainer, portfolioSection.querySelector(".gallery"));
}

// Gere la classe active de chaque boutons
function handleActiveFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
 
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

{
    // Filtre works en fonction de categories
    function filterWorksByCategory(worksData, categoryId) {
        if (categoryId === null) {

            return worksData;
        }

        return worksData.filter(work => work.categoryId === categoryId);
    }
    // Filtres fonctionnels
    function handleFilterClick(event, worksData) {
        let categoryId = null;

        if (event.target.dataset.categoryId) {
            categoryId = parseInt(event.target.dataset.categoryId, 10);
        }

        const filteredWorks = filterWorksByCategory(worksData, categoryId);


        clearGalleryHTML();

        displayGallery(filteredWorks);
    }
    // EventListener boutons filtre
    function addFilterEventListeners(worksData) {
        const filterButtons = document.querySelectorAll('.filter-btn');

        filterButtons.forEach(button => {
            if (!button.hasEventListener) {
                button.addEventListener("click", (event) => { 
                    event.preventDefault();
                    handleFilterClick(event, worksData)
                });
                button.hasEventListener = true; // Ajouter un attribut pour indiquer que l'événement est déjà ajouté.
            }
        });
    }
}

/**** Mode Edition ---> remove des filtres + Ajout d'une banniere haut de page, d'un bouton "modifie" la gallerie et du "logout" ******/
// Change login en logout si token actif
function toggleLoginLogout() {
    const token = localStorage.getItem('token');
    const loginButton = document.getElementById("login-btn");

    if (token) {
        loginButton.textContent = "Logout";
    }
}
{
    // Fonction de déconnexion
    function logout() {
        localStorage.removeItem('token'); 
        window.location.href = "login.html"; 
    }
    // Eventlistener pour la deconnexion
    function LogoutEventListener() {
        const loginButton = document.getElementById("login-btn");

        // Vérifie si le bouton est un bouton "Logout"
        if (loginButton.textContent === "Logout") {
            loginButton.addEventListener("click", (event) => {
                event.preventDefault();
                logout();
            });
        }
    }
}

// Afficher le bandeau "mode edition"
function displayEditModeBanner() {
    const editModeBanner = document.getElementById("edit-mode-banner");
    if (editModeBanner) {
        editModeBanner.style.display = "block";
    }
}
// Cacher le bandeau "mode edition"
function hideEditModeBanner() {
    const editModeBanner = document.getElementById("edit-mode-banner");
    if (editModeBanner) {
        editModeBanner.style.display = "none";
    }
}

// Afficher le bouton modifié
function displayEditButton() {
    const editGallery = document.getElementById("edit-gallery");
    if (editGallery) {
        editGallery.style.display = "block";
    }
}
// Cacher le bouton modifié
function hideEditButton() {
    const editGallery = document.getElementById("edit-gallery");
    if (editGallery) {
        editGallery.style.display = "none";
    }
}

// Cacher les filtres 
function hideCategoryFilters() {
    const filtersEditionContainer = document.querySelector('.filters');
    if (filtersEditionContainer) {
        filtersEditionContainer.style.display = 'none';
    }
}



/**** Fonction Main *****/
async function main() {
    try {
        // Verifie si un token est présent
        const token = localStorage.getItem('token');
        console.log(token)

        // login --> logout
        toggleLoginLogout()

        // enleve le token en cliquant sur logout
        LogoutEventListener()

        // Recupere les donnees "works"
        const worksData = await fetchWorks();

        // Efface le contenu HTML dans la galerie
        clearGalleryHTML();

        // Affiche la galerie avec les données /Works
        displayGallery(worksData);

        // Recupere les categories
        const categoriesData = await fetchCategories();

        if(token) {
            // Si un token est présent, masque les filtres
            hideCategoryFilters();

            // Affiche la banniere edition mode
            displayEditModeBanner();

            // Affiche le boutton modifié
            displayEditButton()
        } else {
             // Affiche les filtres des categories
            displayCategoryFilters(categoriesData);

            // Cache le mode edition
            hideEditModeBanner();

            // Cache le bouton modifier
            hideEditButton();

            // Filtres fonctionnels 
            addFilterEventListeners(worksData);

            // Gere l'etat actif de chaque boutons
            handleActiveFilterButtons()
        }
    } catch(error) {
        console.error('Erreur dans la fonction main:', error);
    }
}


/**** Appel Fonction Main *****/
document.addEventListener("DOMContentLoaded", () => {
    main();
});