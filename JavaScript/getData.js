let productsContainer = [];
let linkName = document.getElementsByClassName("categories_link");

// Încărcăm toate produsele la început
getData();
async function getData(category = null) {
    let response = await fetch('json/products.json');
    let json = await response.json();
    productsContainer = json;
    if (category) {
        productsContainer = productsContainer.filter(product => product.category === category);
    }
    displayProducts();
}

// Afișarea produselor pe baza filtrului
function displayProducts() {
    let container = ``;
    for (let i = 0; i < productsContainer.length; i++) {
        container += `
        <div class="product-card" data-id="${productsContainer[i].id}">
            <div class="card-img">
                <img onclick="displayDetails(${productsContainer[i].id});" 
                     src="${productsContainer[i].images[0]}" 
                     alt="${productsContainer[i].name}">
                <a href="#" class="addToCart">
                    <ion-icon name="cart-outline" class="Cart"></ion-icon>
                </a>
            </div>
            <div class="card-info">
                <h4 class="product-name" onclick="displayDetails(${productsContainer[i].id});">${productsContainer[i].name}</h4>
                <h5 class="product-price">${productsContainer[i].price}</h5>
            </div>
        </div>`;
    }
    document.getElementById("productCount").innerHTML = `${productsContainer.length} Products`;
    document.querySelector('.products .content').innerHTML = container;

    // Adăugarea evenimentului de click pentru butonul "addToCart"
    let addToCartLinks = document.querySelectorAll('.addToCart');
    addToCartLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            let productCard = event.target.closest('.product-card');
            if (productCard && productCard.dataset.id) {
                let id_product = productCard.dataset.id;
                addToCart(id_product);
            }
        });
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
