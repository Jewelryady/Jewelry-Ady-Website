let categories = {}; // Obiect pentru categorii și produsele lor
let currentCategory = null;

// Încarcă datele din fișierul JSON (simulat pentru localStorage)
async function loadCategories() {
    // Încearcă să preia categoriile din localStorage
    const storedData = localStorage.getItem("categories");
    categories = storedData ? JSON.parse(storedData) : {};
    displayCategories();
    if (currentCategory) {
        displayProducts();
    }
}

// Salvează categoriile și produsele în localStorage
function saveCategories() {
    localStorage.setItem("categories", JSON.stringify(categories));
}

// Adaugă o categorie nouă
function addCategory(event) {
    event.preventDefault();
    const categoryName = document.getElementById("categoryName").value.trim();

    if (!categoryName || categories[categoryName]) {
        alert("Categoria există deja sau numele este gol!");
        return;
    }

    categories[categoryName] = [];
    saveCategories();
    displayCategories();
    document.getElementById("categoryForm").reset();
}

// Afișează categoriile sub formă de butoane
function displayCategories() {
    const categoryList = document.getElementById("categoryList");
    categoryList.innerHTML = "";

    for (const categoryName in categories) {
        const button = document.createElement("button");
        button.textContent = categoryName;
        button.onclick = () => selectCategory(categoryName);
        categoryList.appendChild(button);
    }
}

// Selectează o categorie și afișează produsele asociate
function selectCategory(categoryName) {
    currentCategory = categoryName;
    document.getElementById("currentCategoryTitle").textContent = `Produse (${categoryName})`;
    document.getElementById("productForm").style.display = "block";
    displayProducts();
}

// Afișează produsele din categoria selectată
function displayProducts() {
    const productTableBody = document.querySelector("#productTable tbody");
    productTableBody.innerHTML = "";

    if (!currentCategory || !categories[currentCategory]) return;

    categories[currentCategory].forEach((product, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>
                <button onclick="editProduct(${index})">Editează</button>
                <button onclick="deleteProduct(${index})">Șterge</button>
            </td>
        `;

        productTableBody.appendChild(row);
    });
}

// Adaugă sau editează un produs în categoria curentă
function saveProduct(event) {
    event.preventDefault();

    if (!currentCategory) {
        alert("Selectați o categorie înainte de a adăuga un produs!");
        return;
    }

    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const images = document.getElementById("productImages").value.split(",");
    const description = document.getElementById("productDescription").value;

    const productList = categories[currentCategory];
    const newId = `${productList.length + 1}${currentCategory}`;

    const newProduct = { id: newId, name, price, images, description };
    productList.push(newProduct);

    saveCategories();
    displayProducts();
    document.getElementById("productForm").reset();
}

// Editează un produs
function editProduct(index) {
    const product = categories[currentCategory][index];
    document.getElementById("productName").value = product.name;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productImages").value = product.images.join(",");
    document.getElementById("productDescription").value = product.description;
}

// Șterge un produs
function deleteProduct(index) {
    categories[currentCategory].splice(index, 1);
    saveCategories();
    displayProducts();
}

// Evenimente
document.getElementById("categoryForm").addEventListener("submit", addCategory);
document.getElementById("productForm").addEventListener("submit", saveProduct);

// Încarcă datele inițial
loadCategories();
