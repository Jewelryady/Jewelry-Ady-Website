let productsContainer = [];
let linkName = document.getElementsByClassName("categories_link");

// Încărcăm toate produsele la început
getData();

async function getData(category = "") {
    try {
        const response = await fetch('json/products.json');
        const products = await response.json();

        const filteredProducts = category
            ? products.filter(product => product.category === category)
            : products;

        displayProducts(filteredProducts, category);
    } catch (error) {
        console.error("Eroare la încărcarea datelor:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromURL = urlParams.get("category") || "";

    // Marchează butonul activ în funcție de categorie
    const categoryLinks = document.querySelectorAll(".categories_link");
    categoryLinks.forEach(link => {
        if (link.getAttribute("productCategory") === categoryFromURL) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    // Încarcă produsele pe baza categoriei din URL
    getData(categoryFromURL);
});

function displayProducts(products, category = "") {
    const content = document.querySelector(".content");
    const currentCategoryElements = document.querySelectorAll("#currentCategory");
    const productCountSpan = document.getElementById("productCount");

    // Actualizează toate elementele cu ID-ul `currentCategory`
    currentCategoryElements.forEach(element => {
        element.textContent = `> ${category || "Toate Produsele"}`;
    });

    // Actualizare text pentru numărul total de produse
    productCountSpan.textContent = `Produse: ${products.length}`;

    content.innerHTML = ""; // Curăță conținutul anterior

    if (products.length === 0) {
        content.innerHTML = `<p>Niciun produs nu a fost găsit în această categorie.</p>`;
        return;
    }

    products.forEach(product => {
        // Check for product sizes
        let sizes = product.product_sizes || [];

        // Generate dropdown options
        let dropdownOptions = `<option disabled selected>Alege mărimea</option>`;
        sizes.forEach(size => {
            dropdownOptions += `<option value="${size}">${size}</option>`;
        });

        // Create product card
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-id', product.id);

        productCard.innerHTML = `
            <div class="card-img">
                ${product.old_price ? `<div class="sale-flag">Reducere</div>` : ''}
                ${product.isNew ? `<div class="new-flag">NOU</div>` : ''}
                ${product.out_Off_stock ? `<div class="out-of-stock">Stoc epuizat</div>` : ''}
                <img src="${product.images[0]}" alt="${product.name}" onclick="displayDetails(${product.id});">
                <a href="#" class="addToCart">
                    <ion-icon name="cart-outline" class="Cart"></ion-icon>
                </a>
            </div>
            <div class="card-info">
                <h4 class="product-name" onclick="displayDetails(${product.id});">${product.name}</h4>
                <h5 class="product-price">${product.price}</h5>
                ${product.old_price ? `<h5 class="old-price">${product.old_price}</h5>` : ''}
                <select class="size-dropdown">
                    ${dropdownOptions}
                </select>
            </div>
        `;

        content.appendChild(productCard);
    });

    // Adding event listeners for the Add to Cart buttons
    let addToCartLinks = document.querySelectorAll('.addToCart');
    addToCartLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            let productCard = event.target.closest('.product-card');
            if (productCard && productCard.dataset.id) {
                let id_product = productCard.dataset.id;

                let selectedSize = productCard.querySelector('.size-dropdown').value;
                if (selectedSize === "Alege mărimea") {
                    alert("Te rugăm să alegi o mărime înainte de a adăuga produsul în coș!");
                    return;
                }

                addToCart(id_product, 1, selectedSize);
            }
        });
    });
}


function getCategory(e) {
    let category = e.target.getAttribute('productCategory');
    setActiveLink(e.target);
    try {
        getData(category);
    } catch (e) {
        console.log("Categoria nu a fost găsită:", e);
    }
    if (window.innerWidth <= 768) {
        toggleSidebar();
    }
}


// Setăm link-ul activ pentru categoria selectată
function setActiveLink(activeLink) {
    Array.from(linkName).forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// Adăugăm evenimentele pentru link-urile de categorii
Array.from(linkName).forEach(function (element) {
    element.addEventListener('click', getCategory);
});

// Deschidem sau închidem bara laterală
function toggleSidebar() {
    var sidebar = document.querySelector(".aside");
    sidebar.classList.toggle("open");
}

// Navigăm la pagina de detalii produs
function displayDetails(productId) {
    window.location.href = `ProductDetails.html?productId=${productId}`;
}

// Adaugă elementul <style> în head-ul documentului
document.head.appendChild(style);

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'Style/main.css'; // înlocuiește cu calea fișierului tău CSS
document.head.appendChild(link);