const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

const searchInput = document.getElementById('search');
const searchButton = document.getElementById('search-button');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

// unsplash API
let count = 5;
let query = 'nature'; // default search query
const apiKey = 'kvtEWc3dHvl8W62RX-QTZBFe2R95q-Hv2hsP4m8_i7k';
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}&query=${query}`;

// function to update the query based on user input
function updateQuery() {
    query = searchInput.value.trim();
  }

// clear existing images in the image container
function clearImages() {
    imageContainer.innerHTML = '';
  }


// function to handle the search button click
function handleSearch() {
    updateQuery();
    clearImages(); // clear existing images
    updateApiUrl();
    getPhotos(); // fetch new photos based on the updated query
  }

// event listener for search button click
searchButton.addEventListener('click', handleSearch);

// event listener for input field change
searchInput.addEventListener('input', updateQuery);

// modify the apiUrl to include the query parameter
function updateApiUrl() {
    apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}&query=${query}`;
  }


  

// check if all images were loaded
function imageLoaded() {
    imagesLoaded++;
    console.log(imagesLoaded);
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
        count = 30;
        apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}&query=${query}`;
        console.log(count);
        console.log("ready =", ready);
    }
}

// helper function to set attributes on DOM elements
function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// create elements for links and photos, add to DOM
function displayPhotos() {
    imagesLoaded = 0;
    totalImages = photosArray.length;
    console.log("total images =", totalImages);
    //run function for each object in photosArray
    photosArray.forEach((photo) => {
        // create <a> to link to unsplash
        const item = document.createElement('a');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank',
        });
        // create <img> for photo
        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description,
        });

        // event listener, check when each is finished loading
        img.addEventListener('load', imageLoaded);

        // put <img> inside <a>, then put both inside imgContainer element
        item.appendChild(img);
        imageContainer.appendChild(item);
    });
}


// get photos from unsplash api
async function getPhotos() {
    try {
        const response = await fetch(apiUrl);
        photosArray = await response.json();
        displayPhotos();
        console.log(photosArray);
    } catch (error) {
        console.log(error);
    }
}

// check to see if scrolling is near bottom of the page, laod more photos
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        getPhotos();
    }
})

// run on load
getPhotos();