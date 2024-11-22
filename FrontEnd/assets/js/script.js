// Tout en une fonction --> utile ? 
/*async function fetchWorksData() {
    try{
        const response = await fetch(apiUrl)
        if (!response.ok) {
            throw new Error('Erreur sur la récupération des travaux')
        }
        const gall = await response.json()
        const gallery = document.querySelector(".gallery")
        gallery.innerHTML ='';

        for (let i = 0; i < gall.length; i++) {
            const galleryItem = gall[i]
            const galleryElement = document.createElement("div")

            galleryElement.innerHTML = `<img src="${galleryItem.imageUrl}" alt="${galleryItem.title}"><h3>${galleryItem.title}</h3>`
            gallery.appendChild(galleryElement)
        }

    } catch (error) {
        console.error("Erreur:", error)
    }
}*/



// Fonction API fetch
// Il faut obligatoirement utiliser async/await avec l'api fetch ou des ".then"
// La fonction est appelé via une autre fonction pour la lié à "displayGallery"
async function apiFetch() {
    try{
        const response = await fetch(apiUrl)
        if (!response.ok) {
            throw new Error('Erreur sur la récupération des travaux')
        }
        const gall = await response.json()
        return gall
    } catch (error) {
        console.error("Erreur:", error)
        return []
    }
}

// Fonction afficher la gallerie + enlever la gallerie HTML
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

// Fonction "temporaire" pour supprimer le contenu dans le HTML partie "gallery" --> utile ?
function removeGalleryHTML() {
    const galleryHTML = document.querySelector('.gallery')
        galleryHTML.innerHTML = ''
}

//Fonction initialisant la gallerie via la "fonction fetchWorks()" et "displayGallery(gall)"
async function initGallery() {
    removeGalleryHTML()
    const works = await apiFetch()
    displayGallery(works)
}
