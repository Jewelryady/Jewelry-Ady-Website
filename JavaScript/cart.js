let cart = [];
let products = [];
let totalPrice = document.getElementById("total_price");
let cartCounter = document.getElementById("cart-counter");
let cartItemsCount = document.getElementById("cart_counts");
const cartTextElements = document.querySelectorAll(".cart_products");
const btnControl = document.querySelector(".btn_control");
const cartTotal = document.querySelector(".cart_total");

loadCart();
getData();
checkCart();

async function getData() {
    let response = await fetch('json/products.json');
    let json = await response.json();
    products = json;
}
function loadCart() {
    let storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId,inputQuantity = 1) {
    let product = products.find(p => p.id == productId);
    if (product) {
        let existingProduct = cart.find(p => p.id == productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            let productWithQuantity = { ...product, quantity: inputQuantity };
            cart.push(productWithQuantity);
        }
        saveCart();
        checkCart();
    }
}

function addCartToHTML() {
    let content = ``;
    cart.forEach((product, index) => {
        let price = parseFloat(product.price.replace('$', ''));
        let totalPrice = price * product.quantity;
        content += `
        <div class="cart_product">
            <div class="cart_product_img">  
                <img src=${product.images[0]}>
            </div>
            <div class="cart_product_info">  
                <div class="top_card">
                    <div class="left_card">
                        <h4 class="product_name">${product.name}</h4>
                        <span class="product_price">${product.price}</span>
                    </div>
                    <div class="remove_product" onclick="removeFromCart(${index})">
                        <ion-icon name="close-outline"></ion-icon>
                    </div>
                </div>
                <div class="buttom_card">
                    <div class="counts">
                        <button class="counts_btns minus"  onclick="decreaseQuantity(${index})">-</button>
                        <input type="number" inputmode="numeric" name="productCount" min="1" step="1" max="999"
                            class="product_count"  value=${product.quantity}>
                        <button  class="counts_btns plus" onclick="increaseQuantity(${index})">+</button>
                    </div>
                    <span class="total_price">$${totalPrice}.00</span>
                </div>
            </div>
        </div>`;
    });
    cartTextElements.forEach(element => {
        element.innerHTML = content;
    });;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    checkCart();
}
function increaseQuantity(index){
    cart[index].quantity += 1;
    saveCart();
    checkCart();
}
function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        saveCart();
        checkCart();
    } else {
        removeFromCart(index);
    }
}

function updateTotalPrice() {
    let total = cart.reduce((sum, product) => {
        let price = parseFloat(product.price.replace('$', ''));
        return sum + (price * product.quantity);
    }, 0);
    totalPrice.innerHTML = `$${total.toFixed(2)}`;
    localStorage.setItem("total price" , total + 70);
    return total;
}

// Initial call to display the cart products on page load
function checkCart(){
    if (cart.length == 0) {
        cartTextElements.forEach(element => {
            element.classList.add("empty");
            element.innerHTML = "Your cart is empty";
        })
        cartCounter.innerHTML = 0;
        btnControl.style.display = "none";
        cartTotal.style.display = "none";
        checkCartPage(0,0);
    } else {
        cartTextElements.forEach(element => {
            element.classList.remove("empty");
        })
        addCartToHTML();
        let totalQuantity = cart.reduce((sum, product) => sum + product.quantity, 0);
        cartCounter.innerHTML = totalQuantity;
        btnControl.style.display = "flex";
        cartTotal.style.display = "flex";
        let total = updateTotalPrice();
        checkCartPage(total,totalQuantity);       
    }
}
// Add cart page not cart section
function checkCartPage(total,totalQuantity){
    if (window.location.pathname.includes("cartPage.html")) {
        if (cart.length == 0) {
            cartItemsCount.innerHTML = `(0 items)`;
            document.getElementById("Subtotal").innerHTML = `$0.00`;
            document.getElementById("total_order").innerHTML = `$0.00`;
        }
        else{
            cartItemsCount.innerHTML = `(${totalQuantity} items)`;
            displayInCartPage(total);
        }
    }
}
function displayInCartPage(total){
    let subTotal = document.getElementById("Subtotal");
    subTotal.innerHTML = `$${total.toFixed(2)}`;
    let totalOrder= parseFloat(subTotal.innerHTML.replace('$', '')) + 70;
    document.getElementById("total_order").innerHTML = `$${totalOrder.toFixed(2)}`;
}

function checkOut() {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items before checkout.");
        return;
    }

    // Preluarea informațiilor de livrare
    let shippingInputs = document.querySelectorAll(".Shiping_Info input");
    let shippingInfo = {
        Nume: shippingInputs[0].value,
        Prenume: shippingInputs[1].value,
        Locatia: shippingInputs[2].value,
        Telefon: shippingInputs[3].value,
        Telegram: shippingInputs[4].value,
        CodulPostal: shippingInputs[5].value
    };

    // Validare informații utilizator
    for (let key in shippingInfo) {
        if (!shippingInfo[key]) {
            alert(`Please fill in the ${key} field.`);
            return;
        }
    }

    // Crearea mesajului de comandă
    let orderDetails = "Order Details:\nItems:\n";
    cart.forEach((product, index) => {
        orderDetails += `${index + 1}) ${product.name} | Quantity x${product.quantity}\n`;
    });
    let totalOrderPrice = `$${updateTotalPrice().toFixed(2)}`;
    orderDetails += `Total Order: ${totalOrderPrice}\n\n`;
    orderDetails += `Nume: ${shippingInfo.Nume} ${shippingInfo.Prenume}\n`;
    orderDetails += `Locatia: ${shippingInfo.Locatia}\n`;
    orderDetails += `Telefon: ${shippingInfo.Telefon}\n`;
    orderDetails += `Telegram: ${shippingInfo.Telegram}\n`;
    orderDetails += `Codul Postal: ${shippingInfo.CodulPostal}`;

    // Trimiterea mesajului prin Telegram API
    const botToken = "8002685277:AAEJoEwchmd1tbi-UY8tD1fCIXR-iHqRcyQ";
    const chatId = "6042786969";
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(orderDetails)}`;

    fetch(telegramApiUrl)
    .then(response => {
        if (response.ok) {
            //alert("Order placed successfully!");
            cart = []; // Golește coșul
            saveCart();
            checkCart(); // Actualizează interfața
            // Redirecționează către pagina de succes
            window.location.href = "paymenSuccesful.html";
        } else {
            //alert("Failed to send order details. Redirecting to payment failed page.");
            // Redirecționează către pagina de eșec
            window.location.href = "paymenFailed.html";
        }
    })
    .catch(error => {
        console.error("Error sending order details:", error);
        //alert("An error occurred while sending the order. Redirecting to payment failed page.");
        // Redirecționează către pagina de eșec
        window.location.href = "paymenFailed.html";
    });
}