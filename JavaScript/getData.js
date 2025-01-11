let productsContainer = [];
let linkName = document.getElementsByClassName("categories_link");

// Încărcăm toate produsele la început
getData();

async function getData(category = "") {
    try {
        const response = await fetch('json/products.json');
        const products = await response.json();

        // Filtrare produse după categorie
        const filteredProducts = category
            ? products.filter(product => product.category === category)
            : products;

        displayProducts(filteredProducts);
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



function displayProducts(products) {
    const content = document.querySelector(".content");
    content.innerHTML = ""; // Golește conținutul anterior

    if (products.length === 0) {
        content.innerHTML = `<p>Niciun produs nu a fost găsit în această categorie.</p>`;
        return;
    }

    // Generează carduri pentru fiecare produs
    products.forEach(product => {
        const productCard = `
            <div class="product-card">
                <div class="card-img">
                    <img src="${product.images[0]}" alt="${product.name}">
                    <div class="addToCart" onclick="addToCart(${product.id})">
                        <ion-icon name="cart-outline"></ion-icon>
                    </div>
                </div>
                <div class="card-info">
                    <p class="product-name">${product.name}</p>
                    <p class="product-price">${product.price}</p>
                </div>
            </div>
        `;
        content.insertAdjacentHTML("beforeend", productCard);
    });
}



// Obține categoria selectată și încarcă produsele corespunzătoare
function getCategory(e) {
    let category = e.target.getAttribute('productCategory');
    setActiveLink(e.target);
    try {
        getData(category);
    } catch (e) {
        console.log("Categoria nu a fost găsită:", e);
    }
    if (window.innerWidth <= 768) {
        // Închidem bara laterală pe dispozitive mobile
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

// Funcție pentru a adăuga produse în coș
function addToCart(productId) {
    console.log(`Produsul cu ID ${productId} a fost adăugat în coș.`);
}
