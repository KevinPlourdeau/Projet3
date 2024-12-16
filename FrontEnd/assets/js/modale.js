/**** Fonction Open/Close première vue + fonction delete image */
// Gère les événements liés à la modale
function initializeModalEvents() {
    document.querySelectorAll(".js-modal").forEach(trigger => {
        trigger.addEventListener("click", event => {
            event.preventDefault();
            const modalElement = document.querySelector(event.target.getAttribute("href"));
            openModal(modalElement);
        });
    });
}

// Gère la suppression des projets et refresh la galerie
function initializeDeleteEvents(worksData) {
    const deleteButtons = document.querySelectorAll(".delete-icon");
    
    deleteButtons.forEach((button, index) => {
        const workId = worksData[index].id;
        const figureElement = button.closest("figure");
        button.addEventListener("click", event => {
            event.preventDefault();
            if (warnImgSupp()) {
                handleDelete(workId, figureElement);
                refreshGallery();
            }
        });
    });
}

// Gère la fermeture via clavier
function initializeKeyboardEvents() {
    window.addEventListener("keydown", event => {
        const modalElement = document.querySelector("[aria-modal='true']");
        if (!modalElement) return;

        if (event.key === "Escape" || event.key === "Esc") {
            closeModal(modalElement);
        }
    });
}

// Ouvre la modale
function openModal(modalElement) {
    modalElement.style.display = null;
    modalElement.removeAttribute("aria-hidden");
    modalElement.setAttribute("aria-modal", "true");

    modalElement.addEventListener("click", () => closeModal(modalElement));
    modalElement.querySelector(".js-modal-close").addEventListener("click", () => closeModal(modalElement));
    modalElement.querySelector(".js-modal-stop").addEventListener("click", event => event.stopPropagation());
}

// Ferme la modale
function closeModal(modalElement) {
    modalElement.style.display = "none";
    modalElement.setAttribute("aria-hidden", "true");
    modalElement.removeAttribute("aria-modal");

    resetModalView();

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

// Injecte la galerie dans la modale
function injectGalleryToModal(modalWrapper, worksData) {
    const newGallery = displayGalleryModal(worksData);
    modalWrapper.insertBefore(newGallery, modalWrapper.querySelector("input[type='submit']"));
}

// Supprime le projet côté serveur et sur le DOM si réussi
async function handleDelete(workId, figureElement) {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Token non disponible. Veuillez vous connecter.");
        return;
    }
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
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

/**** Fonction switchview + Fonction seconde vue *****/
// Gère la première vue et la seconde vue de la modale
function initializeViewSwitching() {
    const btnAddPhoto = document.querySelector(".js-modal-gallery .js-modal-submit-add-photo");
    const btnReturn = document.querySelector(".js-modal-return");

    btnAddPhoto.addEventListener("click", event => {
        event.preventDefault();
        showAddPhotoView();
    });

    btnReturn.addEventListener("click", event => {
        event.preventDefault();
        showGalleryView();
    });
}

// Affiche la seconde vue
function showAddPhotoView() {
    document.querySelector(".js-modal-gallery").style.display = "none";
    document.querySelector(".js-modal-add-photo").style.display = "block";
}

// Affiche la première vue
function showGalleryView() {
    document.querySelector(".js-modal-gallery").style.display = "block";
    document.querySelector(".js-modal-add-photo").style.display = "none";
}

// Génère le formulaire pour ajouter une photo
function displayFormUploadPhotoModal(categoriesData) {
    const addPhotoView = document.querySelector(".js-modal-add-photo");
    const form = document.createElement("form");
    form.classList.add("photo-upload-form");

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

    setupImagePreview(inputFile);

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

    const selectLabelCategory = document.createElement("div");
    selectLabelCategory.classList.add("select-label-category");

    const selectCategory = document.createElement("select");
    selectCategory.id = "photo-category";

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

    const submitButton = document.createElement("input");
    submitButton.type = "submit";
    submitButton.value = "Valider";
    submitButton.classList.add("btn-validate-form");

    form.appendChild(addPhoto);
    form.appendChild(inputLabelTitle);
    form.appendChild(selectLabelCategory);
    form.appendChild(submitButton);

    addPhotoView.appendChild(form);
}

// Permet d'afficher la prévisualisation de l'image 
function setupImagePreview(inputFile) {
    const labelFile = inputFile.previousElementSibling;

    inputFile.addEventListener("change", () => {
        const file = inputFile.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = event => {
                labelFile.innerHTML = "";
                const previewImage = document.createElement("img");
                previewImage.classList.add("image-preview");
                previewImage.style.maxWidth = "420px";
                previewImage.style.height = "169px";
                previewImage.alt = "Aperçu de l'image";
                previewImage.src = event.target.result;

                labelFile.appendChild(previewImage);
            };
            reader.readAsDataURL(file);
        } else {
            labelFile.innerHTML = `
                <i class="fa-regular fa-image"></i>
                <p>+ Ajouter photo</p>
                <small>jpg, png · 4mo max</small>
            `;
        }
    });
}

// Permet l'envoie du projet ( de form ) à l'api
async function uploadPhoto() {
    const form = document.querySelector(".photo-upload-form");
    const submitButton = form.querySelector(".btn-validate-form");

    let errorMessage = document.createElement("p");
    errorMessage.classList.add("form-error-message");

    form.prepend(errorMessage);


    submitButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const inputFile = document.getElementById("photo-file");
        const inputTitle = document.getElementById("photo-title");
        const selectCategory = document.getElementById("photo-category");

        errorMessage.style.display = "none";
        errorMessage.textContent = "";

        if (!inputFile.files[0] || !inputTitle.value || !selectCategory.value) {
            errorMessage.textContent = "Veuillez remplir tous les champs !";
            errorMessage.style.display = "block";
            return;
        }

        const formData = new FormData();
        formData.append("image", inputFile.files[0]);
        formData.append("title", inputTitle.value);
        formData.append("category", selectCategory.value);

        try {
            const response = await fetch(apiUrlWorks, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Photo ajoutée avec succès :", result);
                alert("La photo a été ajoutée avec succès !");
                errorMessage.style.display = "none";

                refreshGallery();

                const modalElement = document.querySelector("#modal");
                if (modalElement) {
                    closeModal(modalElement);
                }
            } else {
                const errorData = await response.json();
                console.error("Erreur lors de l'ajout de la photo :", response.status, errorData);
                errorMessage.textContent = errorData.message || "Une erreur s'est produite, veuillez réessayer.";
                errorMessage.style.display = "block";
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
            errorMessage.textContent = "Une erreur réseau s'est produite, veuillez vérifier votre connexion.";
            errorMessage.style.display = "block";
        }
    });
}


/**** Fonction Refresh *****/
// Permet de rafraichir les deux galerie ( non modale et modale )
async function refreshGallery() {
    const worksData = await fetchWorks();
    clearGalleryHTML();
    displayGallery(worksData);

    const modalWrapper = document.querySelector(".js-modal-gallery");
    if (modalWrapper) {
            const existingGallery = modalWrapper.querySelector(".gallery");
            if (existingGallery) {
                existingGallery.remove();
            }

            const newGallery = displayGalleryModal(worksData);
            modalWrapper.insertBefore(newGallery, modalWrapper.querySelector("input[type='submit']"));

            initializeDeleteEvents(worksData);
    }
}

// Permet d'enlever l'image previsualiser
function resetPreviewImage() {
    const inputFile = document.getElementById("photo-file");
    const labelFile = inputFile.previousElementSibling;

    inputFile.value = "";

    labelFile.innerHTML = `
        <i class="fa-regular fa-image"></i>
        <p>+ Ajouter photo</p>
        <small>jpg, png · 4mo max</small>
    `;
}

// Permet de remettre à zero le formulaire de la modale et de revenir sur la modale premiere vue lorsqu'on reouvre la modale
function resetModalView() {
    const galleryView = document.querySelector(".js-modal-gallery");
    const addPhotoView = document.querySelector(".js-modal-add-photo");

    if (galleryView) galleryView.style.display = "block";
    if (addPhotoView) addPhotoView.style.display = "none";

    const form = document.querySelector(".photo-upload-form");
    if (form) form.reset();

    resetPreviewImage();
}



/**** Fonction Main *****/
async function mainModal() {
    try {
        initializeModalEvents();
        initializeKeyboardEvents();

        const worksData = await fetchWorks();
        const modalElement = document.querySelector("#modal");

        if (modalElement) {
            const modalWrapper = modalElement.querySelector(".js-modal-gallery");
            injectGalleryToModal(modalWrapper, worksData);
            initializeDeleteEvents(worksData);
            initializeViewSwitching();

            const categoriesData = await fetchCategories();
            displayFormUploadPhotoModal(categoriesData);

            uploadPhoto();
        }
    } catch (error) {
        console.error("Erreur dans la fonction mainModal :", error);
    }
}

/**** Appel de la fonction main *****/
document.addEventListener("DOMContentLoaded", () => {
    mainModal();
});

