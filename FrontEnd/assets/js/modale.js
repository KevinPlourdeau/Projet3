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

        img.src = work.imageUrl;
        img.alt = work.title;

        figure.appendChild(img);
        gallery.appendChild(figure);
    });

    return gallery;
}

function injectGalleryToModal(modalWrapper, worksData) {
    modalWrapper.querySelector(".modal-column");
    modalWrapper.querySelector(".gallery");

    const newGallery = displayGalleryModal(worksData);
    modalWrapper.insertBefore(newGallery, modalWrapper.querySelector("input[type='submit']"));
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
        }
    } catch (error) {
        console.error("Erreur dans la fonction mainModal :", error);
    }
}


/**** Appel fonction main *****/
document.addEventListener("DOMContentLoaded", () => {
    mainModal();
});
