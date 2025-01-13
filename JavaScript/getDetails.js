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

function displayDetails(product) {
    let productDetails = document.getElementsByClassName('productDetails')[0];
    productDetails.setAttribute("data-id", product.id);
    document.getElementById("product_image").src = product.images[0];
    document.querySelector(".category_name").innerHTML = product.category;
    document.querySelector(".product_name").innerHTML = product.name;
    document.querySelector(".product_price").innerHTML = product.price;
    document.querySelector(".product_des").innerHTML = product.description;

    // Adăugăm prețul vechi, dacă există
    const oldPriceElement = document.createElement('p');
    oldPriceElement.className = 'old-price';
    if (product.old_price) {
        oldPriceElement.textContent = product.old_price;
        document.querySelector(".product_price").insertAdjacentElement('afterend', oldPriceElement); // Adăugăm prețul vechi sub prețul actual
    }

    const linkAdd = document.getElementById("btn_add");
    linkAdd.addEventListener('click', function (event) {
        event.preventDefault();
        addToCart(product.id, parseInt(quantity.value) || 1);
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