const products = [
  { id: 1, title: "Wireless Headphones", price: 4500, category: "electronics",  },
  { id: 2, title: "Smart Watch", price: 7000, category: "electronics",  },
  { id: 3, title: "Running Shoes", price: 3200, category: "fashion" }
];

// ====================
// CART & STORAGE
// ====================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateStorage(){
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount(){
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById("cart-count");
  if(badge) badge.innerText = count;
}

updateCartCount();

// ====================
// PRODUCT RENDERING
// ====================
function displayProducts(items){
  const container = document.getElementById("products");
  if(!container) return;

  container.innerHTML = items.map(product => `
    <div class="card">
      <img src="${product.image}">
      <h3>${product.title}</h3>
      <p>Rs ${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    </div>
  `).join("");
}

displayProducts(products);

// ====================
// SEARCH
// ====================
const searchInput = document.getElementById("search");
if(searchInput){
  searchInput.addEventListener("input", function(e){
    const value = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.title.toLowerCase().includes(value));
    displayProducts(filtered);
  });
}

// ====================
// CATEGORY FILTER
// ====================
function filterCategory(category){
  if(category === "all") displayProducts(products);
  else displayProducts(products.filter(p => p.category === category));
}

// ====================
// CART LOGIC
// ====================
function addToCart(id){
  const product = products.find(p => p.id === id);
  const exist = cart.find(item => item.id === id);

  if(exist) exist.quantity += 1;
  else cart.push({...product, quantity: 1});

  updateStorage();
  renderCart();
}

function increaseQuantity(id){
  const item = cart.find(p => p.id === id);
  if(item){
    item.quantity += 1;
    updateStorage();
    renderCart();
  }
}

function decreaseQuantity(id){
  const item = cart.find(p => p.id === id);
  if(item){
    if(item.quantity > 1) item.quantity -= 1;
    else cart = cart.filter(p => p.id !== id);
    updateStorage();
    renderCart();
  }
}

function removeItem(id){
  cart = cart.filter(p => p.id !== id);
  updateStorage();
  renderCart();
}

function calculateTotal(){
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalElement = document.getElementById("total");
  if(totalElement) totalElement.innerText = total;
}

// ====================
// RENDER CART PAGE
// ====================
function renderCart(){
  const container = document.getElementById("cart-items");
  if(!container) return;

  if(cart.length === 0){
    container.innerHTML = "<h2>Your Cart is Empty</h2>";
    const totalElement = document.getElementById("total");
    if(totalElement) totalElement.innerText = "0";
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <h3>${item.title}</h3>
      <p>Rs ${item.price}</p>
      <div>
        <button onclick="decreaseQuantity(${item.id})">-</button>
        <span>${item.quantity}</span>
        <button onclick="increaseQuantity(${item.id})">+</button>
      </div>
      <p>Subtotal: Rs ${item.price * item.quantity}</p>
      <button onclick="removeItem(${item.id})">Remove</button>
    </div>
  `).join("");

  calculateTotal();
}

renderCart();

// ====================
// CHECKOUT & PAYMENT
// ====================
function renderOrderSummary(){
  const container = document.getElementById("order-summary");
  if(!container) return;

  if(cart.length === 0){
    container.innerHTML = "<h3>No Items in Cart</h3>";
    return;
  }

  container.innerHTML = cart.map(item => `
    <div>${item.title} x ${item.quantity} = Rs ${item.price * item.quantity}</div>
  `).join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  container.innerHTML += `<h3>Total: Rs ${total}</h3>`;
}

renderOrderSummary();

function placeOrder(){
  const name = document.getElementById("name")?.value;
  const email = document.getElementById("email")?.value;
  const address = document.getElementById("address")?.value;

  if(!name || !email || !address){
    alert("Please fill all fields");
    return;
  }

  const orderId = "ORD" + Date.now();
  alert(`Order Placed Successfully! 🎉\nOrder ID: ${orderId}`);

  localStorage.removeItem("cart");
  window.location.href = "index.html";
}

// ====================
// PAYMENT METHOD UI
// ====================
const paymentRadios = document.querySelectorAll("input[name='payment']");
const cardSection = document.getElementById("card-details");

paymentRadios.forEach(radio => {
  radio.addEventListener("change", function(){
    if(this.value === "card") cardSection.style.display = "block";
    else cardSection.style.display = "none";
  });
});
