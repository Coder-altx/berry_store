const API_KEY = "1BMHTGF-2RVM5EF-KNP118R-8ZHYRQ9";
let selectedProduct = null;
let allProducts = [];

// Fetch products and render them
fetch("products.json")
  .then(res => res.json())
  .then(products => {
    allProducts = products;
    renderProducts(products);
  });

// Render product cards
function renderProducts(products) {
  const list = document.getElementById("product-list");
  list.innerHTML = "";
  products.forEach((p, i) => {
    const final = p.discount ? p.price - p.discount : p.price;
    const html = `
      <div class="product" data-category="${p.category}">
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p class="price">₹${final} ${p.discount ? `<span class="old">₹${p.price}</span>` : ""}</p>
        <button onclick="openOverlay(${i})">🚀 Buy Now</button>
      </div>`;
    list.innerHTML += html;
  });
}

// Filter by product name
function filterProducts() {
  const search = document.getElementById("searchBar").value.toLowerCase();
  const filtered = allProducts.filter(p => p.name.toLowerCase().includes(search));
  renderProducts(filtered);
}

// Filter by category
function filterCategory(cat) {
  if (cat === "all") return renderProducts(allProducts);
  const filtered = allProducts.filter(p => p.category === cat);
  renderProducts(filtered);
}

// Show payment popup
function openOverlay(index) {
  selectedProduct = allProducts[index];
  document.getElementById("popup-product-name").innerText = `Product: ${selectedProduct.name}`;
  const price = selectedProduct.discount ? selectedProduct.price - selectedProduct.discount : selectedProduct.price;
  document.getElementById("popup-final-price").innerText = `Total: ₹${price}`;
  document.getElementById("buyOverlay").style.display = "flex";
}

// Hide payment popup
function closeOverlay() {
  document.getElementById("buyOverlay").style.display = "none";
}

// Start Litecoin payment
async function startPayment() {
  const email = document.getElementById("userEmail").value;
  const discountInput = document.getElementById("discountCode").value.trim();
  const validCodes = { "10OFF": 10, "20OFF": 20 };
  let discountExtra = 0;

  // Validate discount
  if (discountInput && validCodes[discountInput]) {
    discountExtra = validCodes[discountInput];
  } else if (discountInput) {
    alert("Invalid discount code.");
    return;
  }

  // Calculate final price
  let finalPrice = selectedProduct.price - (selectedProduct.discount || 0) - discountExtra;
  if (finalPrice < 1) finalPrice = 1;

  const data = {
    price_amount: finalPrice,
    price_currency: "inr",
    pay_currency: "ltc",
    order_id: "berry_" + Math.floor(Math.random() * 999999),
    order_description: `${selectedProduct.name} - ${email}`,
    success_url: "https://berry-store-success.vercel.app/"
  };

  // Create invoice with NOWPayments
  try {
    const res = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const json = await res.json();
    if (json.invoice_url) {
      logOrder(selectedProduct.name, email, finalPrice);
      window.location.href = json.invoice_url;
    } else {
      alert("Error: " + (json.message || "Could not create invoice"));
    }
  } catch (e) {
    alert("Payment failed.");
  }
}

// Show the order in the order log (client-side only)
function logOrder(product, email, amount) {
  const log = document.getElementById("orderList");
  const item = document.createElement("li");
  item.innerText = `${product} - ₹${amount} - ${email}`;
  log.prepend(item);
}
