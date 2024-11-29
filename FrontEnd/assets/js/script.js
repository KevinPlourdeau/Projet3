/**** Mode classique *****/
// Fonction API fetch pour récupérer les images dans le fichier "Works" 
// Il faut obligatoirement utiliser async/await avec l'api fetch ou des ".then" ( en fonction de ce que l'on veut )
async function fetchWorks() {
    try{
        const res = await fetch(apiUrlWorks)
        if (!res.ok) {
            throw new Error("Erreur sur la récupération des travaux")
        }
        
        const gall = await res.json()
        return gall
    } catch (error) {
        console.error("Erreur:", error)
        return []
    }
}

// Fonction afficher la gallerie + enlever la gallerie HTML ( non obligatoire )
function displayGallery(gall) {
    const gallery = document.querySelector(".gallery")
    //gallery.innerHTML ='';

    for (let i = 0; i < gall.length; i++) {
        const galleryItem = gall[i]
        const galleryElement = document.createElement("div")

        galleryElement.innerHTML = `<img src="${galleryItem.imageUrl}" alt="${galleryItem.title}"><h3>${galleryItem.title}</h3>`
        gallery.appendChild(galleryElement)
    }
}

// Fonction pour supprimer le contenu dans le HTML partie "gallery"
function removeGalleryHTML() {
    const galleryHTML = document.querySelector(".gallery")
        galleryHTML.innerHTML = ""
}

// Fonction initialisant la gallerie via la fonction "removeGalleryHTML()","fetchWorks()" et "displayGallery()" 
async function initGallery() {
    removeGalleryHTML()
    const works = await fetchWorks()
    displayGallery(works)
}

// Fonction API fetch pour récupérer les différentes categories dans le fichier "categories"
// Il faut obligatoirement utiliser async/await avec l'api fetch ou des ".then" ( en fonction de ce que l'on veut )
async function fetchCategories() {
    try{
        const res = await fetch(apiUrlCategories)
        if (!res.ok) {
            throw new Error("Erreur lors de la récupération des catégories")
        }
        const cat = await res.json()
        return cat
    } catch (error) {
        console.error("Erreur:", error)
        return []
    }
}

function displayFiltersApi(categories, gall) {
    const portfolioSection = document.getElementById("portfolio");

    const filterContainer = document.createElement("div");
    filterContainer.classList.add("filters");

    //  Genere le boutton "tous"
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.classList.add("filter-btn", "active"); // Active par défaut
    allButton.addEventListener("click", () => {
        activateFilter(allButton, filterContainer);
        filterGallery(gall, "Tous");
    });
    filterContainer.appendChild(allButton);

    // Genere les boutons pour les autres catégories
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const button = document.createElement("button");
        button.textContent = category.name;
        button.classList.add("filter-btn");
        button.addEventListener("click", () => {
            activateFilter(button, filterContainer);
            filterGallery(gall, category.name);
        });
        filterContainer.appendChild(button);
    }

    // Insere le conteneur de filtres dans la section
    const gallery = portfolioSection.querySelector(".gallery");
    portfolioSection.insertBefore(filterContainer, gallery);
}

// Fonction pour gerer la classe active
function activateFilter(selectedButton, filterContainer) {
    const buttons = filterContainer.querySelectorAll(".filter-btn");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }
    selectedButton.classList.add("active");
}

// Fonction pour Filtrer la gallery en cliquant sur les différents filtres
function filterGallery(gall, selectedCategory) {
    removeGalleryHTML() 

    let filterWorks

    if (selectedCategory === "Tous") {
        filterWorks = gall; 
    } else {
        filterWorks = gall.filter(work => work.category.name === selectedCategory); 
    }

    displayGallery(filterWorks)
}

// Fonction initialisant les filtres via la fonction "fetchWorks()", "fetchCategories()" et "displayFiltersApi()"
async function initFilters() {
    const [works, categories] = await Promise.all([fetchWorks(), fetchCategories()])
    displayFiltersApi(categories, works)
}

// Fonction initialisant gallery + filtres fonctionnels
async function initGalleryFilters() {
    await initGallery()
    await initFilters()
}

/**** Mode Edition ******/

// Fonction pour gérer l'affichage du bouton Login ou Logout
function toggleLoginLogout() {
    const token = localStorage.getItem('token'); 
    const loginBtn = document.getElementById('login-btn');
    const loginLogoutBtn = document.getElementById('login-logout-btn');

    if (token) {
        // Afficher le bouton Logout si l'utilisateur est connecté
        loginBtn.textContent = "Logout";
        loginBtn.href = "#"; 
        loginLogoutBtn.addEventListener('click', logout); 
    } else {
        // Afficher le bouton Login si l'utilisateur n'est pas connecté
        loginBtn.textContent = "Login";
        loginBtn.href = "login.html";
    }
}

// Fonction de déconnexion
function logout() {
    localStorage.removeItem('token'); 
    window.location.href = "login.html"; 
}

// Fonction pour activer la bande "Mode édition" et ajoute le boutton "modifier"
function checkEditMode() {
    const token = localStorage.getItem('token'); 
    const banner = document.getElementById('edit-mode-banner');
    const filterContainer = document.querySelectorAll(".filters .filter-btn")
    const editButton = document.getElementById('edit-project-btn');
    console.log('token trouvé:', token); 

    if (token) {
        banner.style.display = 'block'; // Afficher la bande "Mode édition"
        editButton.style.display = "inline-block"; // Afficher le bouton "Modifier"
        filterContainer.forEach(filter => {
            filter.style.display = "none";
        })
    } else {
        banner.style.display = 'none'; // Cacher la bande "Mode édition"
        editButton.style.display = "none"; // Cacher le bouton "Modifier"

    }
}

function initModeEdition() {
    // Vérifier l'authentification et afficher le bouton login/logout
    toggleLoginLogout();
    // Appeler la fonction pour afficher l'en-tête "Mode édition"
    checkEditMode();
}

