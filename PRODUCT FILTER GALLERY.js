// 1) Product Data (Array of Objects)
let products = [];
// 2) Selecting HTML Elements
let productsGrid = document.getElementById("productsGrid");
let searchInput = document.getElementById("searchInput");
let categoryFilter = document.getElementById("categoryFilter");
let priceFilter = document.getElementById("priceFilter");
let resetBtn = document.getElementById("resetBtn");
let resultCount = document.getElementById("resultCount");
let noResults = document.getElementById("noResults");
// 3) Price Ranges (Cleaner logic)
function fetchProducts() {
    fetch("https://raw.githubusercontent.com/maruthi-26/package_E-Commerce/refs/heads/main/Product.json", {
            method: "GET"
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            if (Array.isArray(data)) {
                products = data;
            } else if (Array.isArray(data.products)) {
                products = data.products;
            } else {
                console.log("No products array found in JSON");
                products = [];
            }
            displayProducts(products);
        })
        .catch(err => console.log(err));

}
// 4) Create Product Card (HTML for one product)
function createProductCard(product) {
    return `
    <div class="bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition">
      <div class="h-44 bg-gray-100 overflow-hidden">
        <img src="${product.image}" alt="${product.name}"
          class="w-full h-full object-cover"
          onerror="this.src='https://placehold.co/400x300?text=No+Image'" />
      </div>

      <div class="p-4">
        <h3 class="font-semibold text-gray-800">${product.name}</h3>
        <p class="text-sm text-gray-500 capitalize">${product.category}</p>
        <p class="text-lg font-bold text-gray-800 mt-2">₹${product.price}</p>
      </div>
    </div>
  `;
}

// 5) Show products on screen
function displayProducts(productsToShow) {
    if (productsToShow.length === 0) {
        productsGrid.classList.add('hidden');
        noResults.classList.remove('hidden');
        resultCount.textContent = '0';
    } else {
        productsGrid.classList.remove('hidden');
        noResults.classList.add('hidden');
        productsGrid.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
        resultCount.textContent = productsToShow.length;
    }
}
// 6) Main filter function 
function filterProducts() {
    let searchValue = searchInput.value.toLowerCase();
    let selectedCategory = categoryFilter.value;
    let selectedPrice = priceFilter.value;

    let filteredProducts = products.filter((product) => {
        let matchesSearch = product.name.toLowerCase().includes(searchValue);
        let matchesCategory = selectedCategory === "all" || product.category === selectedCategory;

        let matchesPrice = true;
        if (selectedPrice !== 'all') {
            if (selectedPrice === '0-1000') {
                matchesPrice = product.price <= 1000;
            } else if (selectedPrice === '1000-2500') {
                matchesPrice = product.price > 1000 && product.price <= 2500;
            } else if (selectedPrice === '2500-5000') {
                matchesPrice = product.price > 2500 && product.price <= 5000;
            } else if (selectedPrice === '5000-10000') {
                matchesPrice = product.price > 5000 && product.price <= 10000;
            } else if (selectedPrice === '10000+') {
                matchesPrice = product.price > 10000;
            }
        }
        return matchesSearch && matchesCategory && matchesPrice;
    });
    displayProducts(filteredProducts);
}
// 7) Reset everything
function resetFilters() {
    searchInput.value = "";
    categoryFilter.value = "all";
    priceFilter.value = "all";

    displayProducts(products);
}
// 8) Event Listeners
searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);
priceFilter.addEventListener("change", filterProducts);
resetBtn.addEventListener("click", resetFilters);
// 9) Fetch products when page Loads
fetchProducts();