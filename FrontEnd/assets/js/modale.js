/**** Code GRAFIKART *****/

/*let modal = null
const focusableSelector = "button, a, input, textarea"
let focusables = []
let previouslyFocusedElement = null

const openModal = function (event) {
    event.preventDefault();
    modal = document.querySelector(event.target.getAttribute("href"));
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    previouslyFocusedElement = document.querySelector(':focus')
    modal.style.display = null;
    focusables[0].focus()
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true")
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
}

const closeModal = function (event) {
    if (modal === null) return
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()
    event.preventDefault();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)
    modal = null
}

const stopPropagation = function (event) {
    event.stopPropagation();
}

const focusInModal = function (event) {
    event.preventDefault()
    
    let index = focusables.findIndex()( f => f === modal.querySelector(':focus'))
    if (event.shiftKey === true) {
        index--
    } else {
        index++
    }
    if (index >= focusables.length) {
        index = 0
    }
    if (index < 0) {
        index = focusables.length - 1
    }
    focusables[index].focus()
}

document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", openModal);
    
})

window.addEventListener("keydown", function(event) {
    if (event.key === "Escape" || event.key === "Esc") {
        closeModal(event)
    }
    if (event.key === "Tab" && modal !== null) {
        focusInModal(event)
    }
})
*/

/**** Fonction Open/Close première vue + fonction delete image */
// Gere les evenements lié au modal
function initializeModalEvents() {
    document.querySelectorAll(".js-modal").forEach(trigger => {
        trigger.addEventListener("click", event => {
            event.preventDefault();
            const modalElement = document.querySelector(event.target.getAttribute("href"));
            openModal(modalElement);
        });
    });
}

// Gere la suppression des Projets et refresh la galerie
function initializeDeleteEvents(worksData) {
    const deleteButtons = document.querySelectorAll(".delete-icon");
    deleteButtons.forEach((button, index) => {
        const workId = worksData[index].id;
        const figureElement = button.closest("figure");
        button.addEventListener("click", event => {
            event.preventDefault();
            if (warnImgSupp()) {
                handleDelete(workId, figureElement);
                // fonction refresh() dans le fichier login.js
                refresh(); 
            }
        });
    });
}

// Gere la fermeture via clavier
function initializeKeyboardEvents() {
    window.addEventListener("keydown", event => {
        const modalElement = document.querySelector("[aria-modal='true']");
        if (!modalElement) return;

        if (event.key === "Escape" || event.key === "Esc") {
            closeModal(modalElement);
        }
    });
}

// Ouvre le modal
function openModal(modalElement) {
    modalElement.style.display = null;
    modalElement.removeAttribute("aria-hidden");
    modalElement.setAttribute("aria-modal", "true");

    // Ajoute les événements nécessaires pour le modal
    modalElement.addEventListener("click", () => closeModal(modalElement));
    modalElement.querySelector(".js-modal-close").addEventListener("click", () => closeModal(modalElement));
    modalElement.querySelector(".js-modal-stop").addEventListener("click", event => event.stopPropagation());
}

// Ferme le modal
function closeModal(modalElement) {
    modalElement.style.display = "none";
    modalElement.setAttribute("aria-hidden", "true");
    modalElement.removeAttribute("aria-modal");

    // Supprime les événements associés au modal
    modalElement.removeEventListener("click", () => closeModal(modalElement));
    modalElement.querySelector(".js-modal-close").removeEventListener("click", () => closeModal(modalElement));
    modalElement.querySelector(".js-modal-stop").removeEventListener("click", event => event.stopPropagation());
}

// Génère une galerie pour la modale
function displayGalleryModal(worksData) {
    const gallery = document.createElement("div");
    gallery.classList.add("gallery");

    worksData.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const deleteIcon = document.createElement("button");

        img.src = work.imageUrl;
        img.alt = work.title;

        deleteIcon.innerHTML = '<i class="fa-solid fa-trash-can fa-xs"></i>';
        deleteIcon.classList.add("delete-icon");

        figure.appendChild(img);
        figure.appendChild(deleteIcon);
        gallery.appendChild(figure);
    });

    return gallery;
}

// Permet d'afficher la galerie dans la modale
function injectGalleryToModal(modalWrapper, worksData) {
    modalWrapper.querySelector(".gallery");

    const newGallery = displayGalleryModal(worksData);
    modalWrapper.insertBefore(newGallery, modalWrapper.querySelector("input[type='submit']"));
}

// Permet la suppression du projet côté serveur puis sur le DOM si c'est réussi
async function handleDelete(workId, figureElement) {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Token non disponible. Veuillez vous connecter.");
        return;
    }
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}` // Ajoutez le token dans l'en-tête
        }
    });

    if (response.ok) {
        figureElement.remove();
        console.log(`L'image avec l'ID ${workId} a été supprimée.`);
    } else {
        console.error("Échec de la suppression de l'image :", response.statusText);
    }
}

// Popup pour confirmer la suppression d'un projet
function warnImgSupp() {
    return window.confirm("Attention, vous allez supprimer une image de la galerie photo. Voulez-vous continuer ?");
}


/**** Fonction switchview + Fonction seconde vue*****/
// Gere la premiere vue et la seconde vue de la modale
function initializeViewSwitching() {
    const btnAddPhoto = document.querySelector(".js-modal-gallery input[type='submit']");
    const btnReturn = document.querySelector(".js-modal-return");

    // Lorsque l'utilisateur clique sur "Ajouter une photo"
    btnAddPhoto.addEventListener("click", event => {
        event.preventDefault();
        showAddPhotoView();
    });

    // Lorsque l'utilisateur clique sur "Retour"
    btnReturn.addEventListener("click", event => {
        event.preventDefault();
        showGalleryView();
    });
}

// Affiche la seconde vue
function showAddPhotoView() {
    const galleryView = document.querySelector(".js-modal-gallery");
    const addPhotoView = document.querySelector(".js-modal-add-photo");

    galleryView.style.display = "none";
    addPhotoView.style.display = "block";
}

// Affiche la première vue
function showGalleryView() {
    const galleryView = document.querySelector(".js-modal-gallery");
    const addPhotoView = document.querySelector(".js-modal-add-photo");

    galleryView.style.display = "block";
    addPhotoView.style.display = "none";
}

// Génère une galerie pour la modale
function displayFormUploadPhotoModal(categoriesData) {
    const addPhotoView = document.querySelector(".js-modal-add-photo");

    const form = document.createElement("form");
    form.classList.add("photo-upload-form");

    // Div pour bouton d'ajout de photo
    const addPhoto = document.createElement("div");
    addPhoto.classList.add("add-photo");

    const labelFile = document.createElement("label");
    labelFile.setAttribute("for", "photo-file");
    labelFile.classList.add("add-photo-label");
    labelFile.innerHTML = `
      <i class="fa-regular fa-image"></i>
      <p>+ Ajouter photo</p>
      <small>jpg, png · 4mo max</small>
    `;

    const inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.id = "photo-file";
    inputFile.accept = "image/png, image/jpeg";
    inputFile.hidden = true;

    addPhoto.appendChild(labelFile);
    addPhoto.appendChild(inputFile);

    // Div pour input/label pour le titre
    const inputLabelTitle = document.createElement("div");
    inputLabelTitle.classList.add("input-label-title");

    const inputTitle = document.createElement("input");
    inputTitle.type = "text";
    inputTitle.required = true;
    inputTitle.id = "photo-title";

    const labelTitle = document.createElement("label");
    labelTitle.setAttribute("for", "photo-title");
    labelTitle.textContent = "Titre";

    inputLabelTitle.appendChild(labelTitle);
    inputLabelTitle.appendChild(inputTitle);

    // Div pour select/label pour la catégorie
    const selectLabelCategory = document.createElement("div");
    selectLabelCategory.classList.add("select-label-category");

    const selectCategory = document.createElement("select");
    selectCategory.id = "photo-category";
    selectCategory.required = true;

    const labelCategory = document.createElement("label");
    labelCategory.setAttribute("for", "photo-category");
    labelCategory.textContent = "Catégorie";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.hidden = true;
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = "";

    selectCategory.appendChild(defaultOption);

    categoriesData.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        selectCategory.appendChild(option);
    });

    selectLabelCategory.appendChild(labelCategory);
    selectLabelCategory.appendChild(selectCategory);

    // Bouton de validation
    const submitButton = document.createElement("input");
    submitButton.type = "submit";
    submitButton.value = "Valider";
    submitButton.disabled = true;
    submitButton.classList.add("btn-validate-form");

    // Assemblage des éléments dans le formulaire
    form.appendChild(addPhoto);
    form.appendChild(inputLabelTitle);
    form.appendChild(selectLabelCategory);
    form.appendChild(submitButton);

    // Ajoute le formulaire à la vue "Ajout photo"
    addPhotoView.appendChild(form);

    // Événements pour validation de formulaire
    setupFormValidation(inputFile, inputTitle, selectCategory, submitButton);
}

function setupFormValidation(inputFile, inputTitle, selectCategory, submitButton) {
    // Active le bouton "Valider" si tous les champs sont remplis
    function validateForm() {
        if (inputFile.files.length > 0 && inputTitle.value.trim() !== "" && selectCategory.value !== "") {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    }

    inputFile.addEventListener("change", validateForm);
    inputTitle.addEventListener("input", validateForm);
    selectCategory.addEventListener("change", validateForm);
}


/**** Fonction Main *****/
async function mainModal() {
    try {
        initializeModalEvents();
        initializeKeyboardEvents();

        // Récupère les données des travaux
        const worksData = await fetchWorks();

        // Cible la modale et injecte la galerie
        const modalElement = document.querySelector("#modal");
        if (modalElement) {
            const modalWrapper = modalElement.querySelector(".js-modal-gallery");
            injectGalleryToModal(modalWrapper, worksData);

            // Initialise les événements des boutons poubelles
            initializeDeleteEvents(worksData);

            // Initialise les événements pour changer de vue
            initializeViewSwitching();

            const categoriesData = await fetchCategories();
            displayFormUploadPhotoModal(categoriesData);
        }
    } catch (error) {
        console.error("Erreur dans la fonction mainModal :", error);
    }
}


/**** Appel fonction main *****/
document.addEventListener("DOMContentLoaded", () => {
    mainModal();
});
