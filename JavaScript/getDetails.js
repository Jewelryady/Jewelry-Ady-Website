const params = new URL(location.href).searchParams;
const productId = params.get('productId');
let quantity = document.getElementById("productCount");
getData();

async function getData() {
    try {
        let response = await fetch('json/products.json');
        let json = await response.json();
        let product = json.find(item => item.id == productId);

        if (product) {
            displayDetails(product);
        } else {
            console.error('Product not found');
        }
    } catch (error) {
        console.error('Error fetching the data', error);
    }
}
let currentImageIndex = 0; // Indexul imaginii curente
let productImages = []; // Lista imaginilor produsului

function updateImageNavigation() {
    // Verificăm dacă indexul curent este valid
    if (currentImageIndex >= 0 && currentImageIndex < productImages.length) {
        // Actualizăm sursa imaginii
        document.getElementById("product_image").src = productImages[currentImageIndex];
    }

    // Dezactivăm/activăm butoanele în funcție de poziția curentă
    document.getElementById("prevImage").disabled = currentImageIndex === 0;
    document.getElementById("nextImage").disabled = currentImageIndex === productImages.length - 1;
}

document.getElementById("prevImage").addEventListener("click", () => {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateImageNavigation();
    }
});

document.getElementById("nextImage").addEventListener("click", () => {
    if (currentImageIndex < productImages.length - 1) {
        currentImageIndex++;
        updateImageNavigation();
    }
});

function displayDetails(product) {
    let productDetails = document.getElementsByClassName('productDetails')[0];
    productDetails.setAttribute("data-id", product.id);

    // Preluăm lista de imagini și resetăm indexul curent
    productImages = product.images || [];
    currentImageIndex = 0;
    updateImageNavigation();

    document.querySelector(".category_name").innerHTML = product.category;
    document.querySelector(".product_name").innerHTML = product.name;
    document.querySelector(".product_price").innerHTML = product.price;
    document.querySelector(".product_des").innerHTML = product.description;

    const oldPriceElement = document.createElement('p');
    oldPriceElement.className = 'old-price';
    if (product.old_price) {
        oldPriceElement.textContent = product.old_price;
        document.querySelector(".product_price").insertAdjacentElement('afterend', oldPriceElement);
    }

    const sizeDropdownContainer = document.getElementById('sizeDropdownContainer');
    sizeDropdownContainer.innerHTML = ''; // Clear existing options

    if (product.product_sizes && product.product_sizes.length > 0) {
        let dropdownOptions = `<select class="size-dropdown">
            <option disabled selected>Alege mărimea</option>`;
        product.product_sizes.forEach(size => {
            dropdownOptions += `<option value="${size}">${size}</option>`;
        });
        dropdownOptions += `</select>`;
        sizeDropdownContainer.innerHTML = dropdownOptions; // Add the dropdown to the container
    } else {
        sizeDropdownContainer.innerHTML = `<select class="size-dropdown" disabled>
            <option>Fără mărime disponibilă</option>
        </select>`;
    }

    // Load product images into preview squares
    const previewContainer = document.querySelector('.prewiev-image-navigation');
    previewContainer.innerHTML = ''; // Clear existing previews

    product.images.forEach(image => {
        const previewSquare = document.createElement('div');
        previewSquare.className = 'preview-square';
        previewSquare.style.backgroundImage = `url(${image})`;
        previewSquare.style.backgroundSize = 'cover'; // Ensure the image covers the square
        previewSquare.style.backgroundPosition = 'center'; // Center the image
        previewSquare.addEventListener('click', () => {
            currentImageIndex = product.images.indexOf(image); // Update index based on clicked image
            updateImageNavigation();
        });
        previewContainer.appendChild(previewSquare); // Append to the preview container
    });

    const linkAdd = document.getElementById("btn_add");
    linkAdd.addEventListener("click", function (event) {
        event.preventDefault();

        const sizeSelect = sizeDropdownContainer.querySelector('.size-dropdown'); // Get the size dropdown
        const selectedSize = sizeSelect ? sizeSelect.value : null;

        if (selectedSize === "Alege mărimea" || selectedSize === null) {
            alert("Te rugăm să alegi o mărime înainte de a adăuga produsul în coș!");
            return;
        }

        addToCart(product.id, parseInt(quantity.value) || 1, selectedSize);
        showToast();
    });
}



function showToast() {
    const toastOverlay = document.getElementById("toast-overlay");
    toastOverlay.classList.add("show");
    setTimeout(() => {
        toastOverlay.classList.remove("show");
    }, 1000);
}

function showCart() {
    let body = document.querySelector('body');
    body.classList.add('showCart');
}

document.getElementById("minus").addEventListener("click", function () {
    let value = parseInt(quantity.value) || 1;
    if (value > 1) {
        quantity.value = value - 1;
    }
});

document.getElementById("plus").addEventListener("click", function () {
    let value = parseInt(quantity.value) || 1;
    if (value < 999) {
        quantity.value = value + 1;
    }
});

async function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');

    try {
        const response = await fetch('json/products.json');
        const products = await response.json();
        const product = products.find(prod => prod.id == productId);

        if (product) {
            document.getElementById('product_image').src = product.images[0];
            document.querySelector('.category_name').textContent = product.category;
            document.querySelector('.product_name').textContent = product.name;
            document.querySelector('.product_price').textContent = product.price;

            // Afișează inscripția de reducere dacă există un preț vechi
            if (product.old_price) {
                document.querySelector('.product_des').textContent = product.description; // Descrierea produsului
                document.getElementById('saleFlag').style.display = 'block'; // Afișează inscripția de reducere
            } else {
                document.getElementById('saleFlag').style.display = 'none'; // Ascunde inscripția de reducere
            }

            // Afișează inscripția „NOU” dacă produsul este nou
            if (product.isNew) {
                document.getElementById('newFlag').style.display = 'block'; // Afișează inscripția „NOU”
            } else {
                document.getElementById('newFlag').style.display = 'none'; // Ascunde inscripția „NOU”
            }

            // Afișează mesajul "Out of stock" dacă produsul este indisponibil
            if (product.out_Off_stock) {
                document.getElementById('outOfStock').style.display = 'flex'; // Afișează panoul "Out of stock"
            } else {
                document.getElementById('outOfStock').style.display = 'none'; // Ascunde panoul "Out of stock"
            }
        }
    } catch (error) {
        console.error("Eroare la încărcarea detaliilor produsului:", error);
    }
}

// Asigură-te că funcția este apelată
loadProductDetails();