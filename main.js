const dessertContainer = document.getElementById("dessert-container");
const cartContent = document.querySelector(".cart-content");
const cartTitle = document.querySelector(".cart-title");
const cartTotal = document.querySelector(".amout");
const confirmOrderBtn = document.getElementById("confirm-order");
const orderModal = document.getElementById("order-modal");
const modalCartItems = document.getElementById("modal-cart-items");
const startNewOrderBtn = document.getElementById("start-new-order");

let cart = [];
let dessertsData = [];

// Fetching desserts
async function loadDesserts() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error("Failed to fetch data.json");
    dessertsData = await response.json();
    renderDesserts();
  } catch (err) {
    console.error("Error loading desserts:", err);
    dessertContainer.innerHTML = "<p>Error loading desserts.</p>";
  }
}

// Rendering the dessert cards to the page
function renderDesserts() {
  dessertContainer.innerHTML = "";
  dessertsData.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.name = item.name;
    card.dataset.id = item.id;

    card.innerHTML = `
      <div class="image-button">
        <picture>
          <source media="(min-width: 1024px)" srcset="${item.image.desktop}" />
          <source media="(min-width: 768px)" srcset="${item.image.tablet}" />
          <source media="(max-width: 767px)" srcset="${item.image.mobile}" />
          <img src="${item.image.thumbnail}" alt="${item.name}" />
        </picture>
        
          <button class="add-to-cart" data-name="${item.name}" data-price="${
      item.price
    }">
            🛒 Add to Cart
          </button>
        
      </div>
      <div class="info">
        <p class="category">${item.category}</p>
        <h3 class="item-name">${item.name}</h3>
        <p class="price">$${item.price.toFixed(2)}</p>
      </div>
    `;
    dessertContainer.appendChild(card);
  });
}

// Event delegation for cart actions
document.addEventListener("click", (e) => {
  const addBtn = e.target.closest(".add-to-cart");
  const increaseBtn = e.target.closest(".increase");
  const decreaseBtn = e.target.closest(".decrease");
  const removeBtn = e.target.closest(".remove");

  if (addBtn) {
    const name = addBtn.dataset.name;
    const price = parseFloat(addBtn.dataset.price);
    addToCart(name, price);
  }

  if (increaseBtn) {
    const name = increaseBtn.dataset.name;
    const item = cart.find((item) => item.name === name);
    if (item) item.quantity++;
    updateCart();
    updateProductButtons();
  }

  if (decreaseBtn) {
    const name = decreaseBtn.dataset.name;
    const item = cart.find((item) => item.name === name);
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      removeFromCart(name);
    }
    updateCart();
    updateProductButtons();
  }

  if (removeBtn) {
    const name = removeBtn.dataset.name;
    removeFromCart(name);
  }
});
// Adds item to cart
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCart();
  updateProductButtons();
}
// Remove item from cart
function removeFromCart(name) {
  cart = cart.filter((item) => item.name !== name);
  updateCart();
  updateProductButtons();
}

// This appends the item in the cart and its controls
function updateCart() {
  cartContent.innerHTML = "";
  let total = 0;
  let count = 0;
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    count += item.quantity;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <span class="item-name">${item.name}</span>
      <div class="cart-controls">
      <div class="controls">
        <button class="decrease" data-name="${item.name}">−</button>
        <span class="quantity">${item.quantity}</span>
        <button class="increase" data-name="${item.name}">+</button>
      </div>
        
      <span>$${itemTotal.toFixed(2)}</span>
      <button class="remove" data-name="${item.name}">
        <img src="./assets/images/icon-remove-item.svg" alt="Remove" />
      </button>
      </div>
      
    `;
    cartContent.appendChild(cartItem);
  });

  cartTitle.textContent = `Your Cart(${count})`;
  cartTotal.textContent = `$${total.toFixed(2)}`;
}
// Used in the cards
function updateProductButtons() {
  document.querySelectorAll(".card").forEach((card) => {
    const name = card.dataset.name;
    const item = cart.find((i) => i.name === name);
    const actionContainer = card.querySelector(".cart-action");
  });
}

// Order Confirmation Modal
function showOrderConfirmation() {
  modalCartItems.innerHTML = "";
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    const modalItem = document.createElement("div");
    modalItem.classList.add("cart-item-modal");
    modalItem.innerHTML = `
      <p class="item-name">${item.name}</p>
      <div class="cart-item-pricing">
      <p> <span class="quantity">${
        item.quantity
      }x</span> @ <span class="item-price">$${item.price.toFixed(2)}</span></p>
      <p class="item-price">$${itemTotal.toFixed(2)}</p>
      </div>
    `;
    modalCartItems.appendChild(modalItem);
  });
  orderModal.style.display = "flex";
}

function resetCart() {
  cart = [];
  updateCart();
  updateProductButtons();
  orderModal.style.display = "none";
}

confirmOrderBtn?.addEventListener("click", () => {
  if (cart.length > 0) showOrderConfirmation();
});

startNewOrderBtn?.addEventListener("click", resetCart);

// Initialize
loadDesserts();
