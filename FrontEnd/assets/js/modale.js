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
        button.addEventListener("click", () => {
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


// Popup pour confirmer la suppression d'un projet
function warnImgSupp() {
    return window.confirm("Attention, vous allez supprimer une image de la galerie photo. Voulez-vous continuer ?");
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
    modalWrapper.querySelector(".modal-column");
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
            const modalWrapper = modalElement.querySelector(".modal-wrapper");
            injectGalleryToModal(modalWrapper, worksData);

            // Initialise les événements des boutons poubelles
            initializeDeleteEvents(worksData);
        }
    } catch (error) {
        console.error("Erreur dans la fonction mainModal :", error);
    }
}


/**** Appel fonction main *****/
document.addEventListener("DOMContentLoaded", () => {
    mainModal();
});
