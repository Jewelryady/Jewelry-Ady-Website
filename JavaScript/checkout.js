window.addEventListener("load", function(){
    clearCart();
    let totalPrice = document.getElementById("total_price");
    addDate();
    let total = localStorage.getItem('total price');
    if (total) {
        total = parseFloat(total);
        totalPrice.innerHTML = `$${total.toFixed(2)}`;
    } else {
        totalPrice.innerHTML = `$0.00`;
    }
});

function addDate(){
    let date = document.getElementById("order_date");
    const now = new Date();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const day = now.getDate(); 
    const month = months[now.getMonth()]; 
    const year = now.getFullYear();
    date.innerHTML  = ` ${month} ${day},  ${year}`;
}

function clearCart() {
    localStorage.removeItem('cart');
}

function backHome() {
    window.location.href = "index.html"; 
}
