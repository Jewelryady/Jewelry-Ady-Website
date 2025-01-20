var currentSlide = 1;
window.addEventListener("load", function () {
    getTrendingProducts();
});

async function getTrendingProducts() {
    let response = await fetch('json/products.json');
    let products = await response.json();
    let trendingProducts = products.filter(product => product.isTrending);
    displayTrendingProducts(trendingProducts);
}

function displayTrendingProducts(trendingProducts) {
    let content = ``;
    for (let i = 0; i < trendingProducts.length; i++) {
        // Verificăm dacă există `product_sizes`
        let sizes = trendingProducts[i].product_sizes || [];

        // Verificăm dacă există mărimi disponibile
        let sizeDropdown = '';
        if (sizes.length > 0) {
            // Generăm opțiunile dropdown din array
            let dropdownOptions = `<option disabled selected>Alege mărimea</option>`;
            sizes.forEach(size => {
                dropdownOptions += `<option value="${size}">${size}</option>`;
            });
            sizeDropdown = `<select class="size-dropdown">${dropdownOptions}</select>`;
        } else {
            // Dacă nu există mărimi, setăm un dropdown dezactivat
            sizeDropdown = `<select class="size-dropdown" disabled><option>Fără mărime disponibilă</option></select>`;
        }

        content += `
        <div class="product-card" data-id="${trendingProducts[i].id}">
            <div class="card-img">
                ${trendingProducts[i].old_price ? `<div class="sale-flag">Reducere</div>` : ''}
                ${trendingProducts[i].isNew ? `<div class="new-flag">NOU</div>` : ''}
                ${trendingProducts[i].out_Off_stock ? `<div class="out-of-stock">Stoc epuizat</div>` : ''}
                <img src="${trendingProducts[i].images[0]}" onclick="displayDetails(${trendingProducts[i].id});">
                <div class="card-watermark-logo">
                    <a href="link_catre_imagine.html">
                        <img src="images/logo_block.png" alt="Image description">
                    </a>
                </div>
                <a href="#" class="addToCart">
                    <ion-icon name="cart-outline" class="Cart"></ion-icon>
                </a>
            </div>
            <div class="card-info">
                <h4 class="product-name" onclick="displayDetails(${trendingProducts[i].id});">${trendingProducts[i].name}</h4>
                <h5 class="product-price">${trendingProducts[i].price}</h5>
                ${trendingProducts[i].old_price ? `<h5 class="old-price">${trendingProducts[i].old_price}</h5>` : ''}
                ${sizeDropdown} <!-- Afișăm dropdown-ul pentru mărimi -->
            </div>
        </div>`;
    }

    document.querySelector(".top_products .products").innerHTML = content;

    let addToCartLinks = document.querySelectorAll('.addToCart');
    addToCartLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            let productCard = event.target.closest('.product-card');
            if (productCard && productCard.dataset.id) {
                let id_product = productCard.dataset.id;

                // Preia valoarea selectată din dropdown, dacă este activ
                let selectedSize = productCard.querySelector('.size-dropdown').value;
                // Dacă dropdown-ul este dezactivat, putem adăuga produsul fără a alege o mărime
                if (!productCard.querySelector('.size-dropdown').disabled && selectedSize === "Alege mărimea") {
                    alert("Te rugăm să alegi o mărime înainte de a adăuga produsul în coș!");
                    return;
                }

                // Adaugă produsul în coș cu mărimea selectată (sau fără mărime dacă nu există)
                addToCart(id_product, 1, selectedSize); // Cantitatea este implicit 1
                
                // Apelează showToast după adăugarea produsului
                showToast();
            }
        });
    });
}



function showToast() {
 
    setTimeout(() => {
    
        showCart();
    }, 500);
   
}

function showCart() {
    let body = document.querySelector('body');
    body.classList.add('showCart');
}

function displayDetails(productId) {
    window.location.href = `ProductDetails.html?productId=${productId}`;
}
