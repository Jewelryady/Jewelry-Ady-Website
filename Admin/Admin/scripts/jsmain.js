let categories = [];
let products = []; // Lista de produse
let productCounter = 1; // Counter for unique product IDs
let categoryCounter = 1; // Counter for unique category IDs

document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
    loadProducts();
    populateFilterDropdown();
    setupSearch();
});

function addCategory() {
    const categoryName = document.getElementById('categoryName').value.trim();
    if (categoryName) {
        categories.push(categoryName);
        updateCategories();
        saveCategoriesToJSON(); // Save categories to JSON file
        document.getElementById('categoryName').value = ''; // Clear input
        populateFilterDropdown(); // Update filter dropdown
    } else {
        alert("Introduceți un nume valid pentru categorie.");
    }
}

function updateCategories() {
    const categoriesContainer = document.getElementById('categoriesContainer');
    categoriesContainer.innerHTML = ''; // Clear previous categories

    categories.forEach((category, index) => {
        const categoryButton = document.createElement('button');
        categoryButton.textContent = category;
        categoryButton.className = 'categoryButton';
        categoryButton.onclick = () => selectCategory(category, index);

        const deleteCategoryButton = document.createElement('button');
        deleteCategoryButton.textContent = 'Șterge';
        deleteCategoryButton.className = 'deleteCategoryButton';
        deleteCategoryButton.onclick = () => deleteCategory(category, index);

        const categoryContainer = document.createElement('div');
        categoryContainer.className = 'categoryContainer';
        categoryContainer.appendChild(categoryButton);
        categoryContainer.appendChild(deleteCategoryButton);

        categoriesContainer.appendChild(categoryContainer);
    });
}

function deleteCategory(category, index) {
    const confirmation = confirm(`Sigur doriți să ștergeți categoria "${category}" și toate produsele din ea?`);
    if (confirmation) {
        // Remove the category
        categories.splice(index, 1);
        saveCategoriesToJSON();

        // Remove all products in the category
        products = products.filter(product => product.category !== category);
        saveProductsToJSON();

        // Update the UI
        updateCategories();
        displayAllProducts();
        populateFilterDropdown(); // Update filter dropdown
    }
}

function saveCategoriesToJSON() {
    fetch('save_categories.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(categories) // Send updated categories list
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            console.log("Categorii salvate cu succes în JSON.");
        } else {
            console.error("Eroare la salvarea categoriilor:", data.message);
        }
    })
    .catch(error => console.error('Eroare:', error));
}

function loadCategories() {
    fetch('json/categories.json')
        .then(response => response.json())
        .then(data => {
            categories = data; // Save the categories to the global variable
            updateCategories();
            populateFilterDropdown(); // Update filter dropdown
        })
        .catch(error => console.error('Error loading categories:', error));
}

function selectCategory(category, index) {
    document.getElementById('selectedCategory').textContent = category;
    document.getElementById('itemFormContainer').style.display = 'block';
    document.getElementById('overlay').style.display = 'block'; // Show overlay

    // Set unique ID based on category index and product count within that category
    const productCount = products.filter(product => product.category === category).length + 1;
    document.getElementById('id').textContent = `${index + 1}.${productCount}`;

    // Store selected category in local storage
    localStorage.setItem('selectedCategory', category);

    filterProductsByCategory(category); // Filter products by selected category
}

function filterProductsByCategory(category) {
    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML = ''; // Clear previous products

    const filteredProducts = products.filter(product => product.category === category);
    filteredProducts.forEach(product => {
        displayProduct(product); // Display each product in the selected category
    });

    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<p>Nu există produse disponibile în această categorie.</p>';
    }
}


function saveProduct() {
    const id = document.getElementById('id').textContent;
    const name = document.getElementById('name').value.trim();
    let price = document.getElementById('price').value.trim();
    let images = document.getElementById('images').value.split(',').map(img => img.trim().replace(/\\/g, '/')).filter(img => img !== '');
    const category = document.getElementById('selectedCategory').textContent;
    const description = document.getElementById('description').value.trim();

    if (!name || !price || images.length === 0) {
        alert("Numele produsului, prețul și cel puțin o imagine sunt obligatorii.");
        return;
    }

    if (!price.toLowerCase().includes("mdl")) {
        price = `${price} MDL`;
    }

    const product = {
        id: id,
        name: name,
        price: price,
        images: images,
        category: category,
        description: description
    };

    const isTrending = document.getElementById('isTrending').checked;
    if (isTrending) product.isTrending = isTrending;

    let old_price = document.getElementById('old_price').value.trim();
    if (old_price) {
        if (!old_price.toLowerCase().includes("mdl")) {
            old_price = `${old_price} MDL`;
        }
        product.old_price = old_price;
    }

    const out_Of_stock = document.getElementById('out_Of_stock').checked;
    if (out_Of_stock) product.out_Of_stock = out_Of_stock;

    const isNew = document.getElementById('isNew').checked;
    if (isNew) product.isNew = isNew;

    const product_sizes = document.getElementById('product_sizes').value.split(',').map(size => size.trim()).filter(size => size !== '');
    if (product_sizes.length > 0) {
        product.product_sizes = product_sizes;
    }

    // 🚀 FIX: Verificăm dacă produsul există deja după ID și îl actualizăm fără a înlocui altul.
    const existingProductIndex = products.findIndex(prod => prod.id === id);
    if (existingProductIndex !== -1) {
        products[existingProductIndex] = product;
    } else {
        products.push(product);
    }

    saveProductsToJSON();  
    displayAllProducts(); // ✅ Reîmprospătăm UI-ul fără refresh  
    resetProductForm();  

    const selectedCategory = document.getElementById('selectedCategory').textContent;
    if (selectedCategory) {
        filterProductsByCategory(selectedCategory);
        // Store selected category in local storage
        localStorage.setItem('selectedCategory', selectedCategory);
    }
}


function loadProducts() {
    fetch('json/products.json')
        .then(response => response.json())
        .then(data => {
            products = data; // Save the products to the global variable
            data.forEach(product => {
                displayProduct(product); // Display each product
            });
        })
        .catch(error => console.error('Error loading products:', error));
}

function displayProduct(product) {
    const productsContainer = document.getElementById('productsContainer');

    // Eliminați produsul existent din DOM dacă există
    const existingProduct = document.querySelector(`.product[data-id="${product.id}"]`);
    if (existingProduct) {
        existingProduct.remove();
    }

    // Creați noul element pentru produs
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    productDiv.setAttribute('data-id', product.id); // Adăugați un atribut pentru identificare
    productDiv.innerHTML = `
        <h3>${product.name}</h3>
        <p>ID: ${product.id}</p>
        <p>Price: ${product.price} MDL</p>
        <p>Description: ${product.description}</p>
        <p>Category: ${product.category}</p>
        <p>Images: ${product.images.join(', ')}</p>
        ${product.isTrending ? '<p>Trending: Yes</p>' : ''}
        ${product.old_price ? `<p>Old Price: ${product.old_price} MDL</p>` : ''}
        ${product.out_Of_stock ? '<p>Out Of Stock: Yes</p>' : ''}
        ${product.isNew ? '<p>New: Yes</p>' : ''}
        ${product.product_sizes ? `<p>Sizes: ${product.product_sizes.join(', ')}</p>` : ''}
        <button class="editButton" onclick="editProduct('${product.id}')">Editează</button>
        <button class="deleteButton" onclick="deleteProduct('${product.id}')">Șterge</button>
    `;

    productsContainer.appendChild(productDiv);
}

function resetProductForm() {
    document.getElementById('productForm').reset(); // Reset all form fields
    document.getElementById('itemFormContainer').style.display = 'none'; // Hide the product form
    document.getElementById('overlay').style.display = 'none'; // Hide overlay
}

function editProduct(productId) {
    const product = products.find(prod => prod.id === productId);
    if (product) {
        document.getElementById('id').textContent = product.id; // Use textContent instead of value
        document.getElementById('name').value = product.name;
        document.getElementById('price').value = product.price;
        document.getElementById('images').value = product.images.join(', ');
        document.getElementById('description').value = product.description;
        document.getElementById('old_price').value = product.old_price || '';
        document.getElementById('isTrending').checked = product.isTrending || false;
        document.getElementById('out_Of_stock').checked = product.out_Of_stock || false;
        document.getElementById('isNew').checked = product.isNew || false;
        document.getElementById('product_sizes').value = product.product_sizes ? product.product_sizes.join(', ') : '';

        document.getElementById('itemFormContainer').style.display = 'block'; // Show form for editing
        document.getElementById('overlay').style.display = 'block'; // Show overlay

        // Store selected category in local storage
        const selectedCategory = document.getElementById('selectedCategory').textContent;
        localStorage.setItem('selectedCategory', selectedCategory);
    } else {
        alert("Produsul nu a fost găsit.");
    }
}

function deleteProduct(productId) {
    const confirmation = confirm(`Sigur doriți să ștergeți produsul cu ID: ${productId}?`);
    if (confirmation) {
        // Găsim indexul produsului în array
        const productIndex = products.findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            // Eliminăm produsul din array
            products.splice(productIndex, 1);

            // Salvăm lista actualizată în JSON
            saveProductsToJSON();

            // Eliminăm produsul din DOM
            const productElement = document.querySelector(`.product[data-id="${productId}"]`);
            if (productElement) {
                productElement.remove();
            }

            alert(`Produsul cu ID: ${productId} a fost șters.`);

            // Dacă nu mai există produse, afișăm un mesaj în container
            if (products.length === 0) {
                const productsContainer = document.getElementById('productsContainer');
                productsContainer.innerHTML = '<p>Nu există produse disponibile.</p>';
            }
        } else {
            alert("Produsul nu a fost găsit.");
        }
    }
    displayAllProducts(); // Refresh product display after deleting
}

function saveProductsToJSON() {
    products.forEach(product => {
        product.images = product.images.map(img => img.replace(/\\/g, '/'));
    });

    fetch('save_product.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(products)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            console.log("Produse salvate cu succes în JSON.");
            displayAllProducts(); // ✅ Reafișăm produsele fără a da refresh  
        } else {
            console.error("Eroare la salvarea produselor:", data.message);
        }
    })
    .catch(error => console.error('Eroare:', error));
}


function populateFilterDropdown() {
    const filterDropdown = document.getElementById('filterDropdown');
    filterDropdown.innerHTML = '<option value="">Toate categoriile</option>'; // Default option

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        filterDropdown.appendChild(option);
    });

    filterDropdown.addEventListener('change', () => {
        const selectedCategory = filterDropdown.value;
        if (selectedCategory) {
            filterProductsByCategory(selectedCategory);
        } else {
            displayAllProducts();
        }
    });
}

function displayAllProducts() {
    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML = ''; // Clear previous products

    products.forEach(product => {
        displayProduct(product); // Display each product
    });

    if (products.length === 0) {
        productsContainer.innerHTML = '<p>Nu există produse disponibile.</p>';
    }

    // Retrieve selected category from local storage and filter products
    const selectedCategory = localStorage.getItem('selectedCategory');
    if (selectedCategory) {
        filterProductsByCategory(selectedCategory);
        document.getElementById('filterDropdown').value = selectedCategory;
    }
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        searchProducts(query);
    });
}

function searchProducts(query) {
    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML = ''; // Clear previous products

    const filteredProducts = products.filter(product => {
        return product.name.toLowerCase().includes(query) ||
               product.id.toLowerCase().includes(query) ||
               product.price.toString().includes(query);
    });

    filteredProducts.forEach(product => {
        displayProduct(product); // Display each matching product
    });

    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<p>Nu există produse care să corespundă căutării.</p>';
    }
}