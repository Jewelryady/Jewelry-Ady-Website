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

function addToCart(productId, inputQuantity = 1) {
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
function increaseQuantity(index) {
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
    localStorage.setItem("total price", total + 70);
    return total;
}

// Initial call to display the cart products on page load
function checkCart() {
    if (cart.length == 0) {
        cartTextElements.forEach(element => {
            element.classList.add("empty");
            element.innerHTML = "Your cart is empty";
        })
        cartCounter.innerHTML = 0;
        btnControl.style.display = "none";
        cartTotal.style.display = "none";
        checkCartPage(0, 0);
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
        checkCartPage(total, totalQuantity);
    }
}
// Add cart page not cart section
function checkCartPage(total, totalQuantity) {
    if (window.location.pathname.includes("cartPage.html")) {
        if (cart.length == 0) {
            cartItemsCount.innerHTML = `(0 items)`;
            document.getElementById("Subtotal").innerHTML = `$0.00`;
            document.getElementById("total_order").innerHTML = `$0.00`;
        }
        else {
            cartItemsCount.innerHTML = `(${totalQuantity} items)`;
            displayInCartPage(total);
        }
    }
}
function displayInCartPage(total) {
    let subTotal = document.getElementById("Subtotal");
    subTotal.innerHTML = `$${total.toFixed(2)}`;
    let totalOrder = parseFloat(subTotal.innerHTML.replace('$', '')) + 70;
    document.getElementById("total_order").innerHTML = `$${totalOrder.toFixed(2)}`;
}

async function checkOut() {
    if (cart.length != 0) {
        // Get the subtotal and total order
        let total = updateTotalPrice();
        let deliveryCharge = 70; // Assuming a fixed delivery charge
        let totalOrder = total + deliveryCharge;

        // Format the message with items in the cart
        let itemsMessage = "Items:\n";
        cart.forEach((product, index) => {
            itemsMessage += `${index + 1}) ${product.name} | Quantity x${product.quantity}\n`;
        });

        // Create the final message
        let message = `Order Details:\n${itemsMessage}Total Order : $${totalOrder.toFixed(2)}`;

        // Send message to Telegram bot
        const telegramBotToken = "8002685277:AAEJoEwchmd1tbi-UY8tD1fCIXR-iHqRcyQ"; // Your bot token
        const chatId = "6042786969"; // Your chat ID
        const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

        try {
            let response = await fetch(telegramApiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                }),
            });

            if (response.ok) {
                alert("Produsul a fost cumpărat!"); // Notify user of successful checkout
                // Send data to server
                await sendPurchaseData(totalOrder);
            } else {
                console.error("Failed to send message:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    } else {
        alert("Your cart is empty!"); // Notify user if cart is empty
    }
}

// Function to send the total order to the server
async function sendPurchaseData(totalOrder) {
    // Get the current URL
    const currentUrl = window.location.href;

    // Function to get the referral code from the URL
    function getReferralCode(url) {
        const urlParams = new URLSearchParams(new URL(url).search);
        return urlParams.get('code'); // Extracts the 'code' parameter
    }

    // Get the referral code
    const refCode = getReferralCode(currentUrl);

    // Construct the purchase URL
    const purchaseUrl = `https://www.temkatut.com/purchase?code=${refCode ? refCode : ''}&income=${totalOrder}`;

    try {
        // Make a GET request to the server
        const response = await fetch(purchaseUrl, { method: 'GET' });

        if (response.ok) {
            console.log("Purchase data sent successfully.");
        } else {
            console.error("Failed to send purchase data:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error sending purchase data:", error);
    }
}



