let cart = [];
let currentUser = null;

// --- AUTH LOGIC ---
const loginForm = document.getElementById('login-form');
const regForm = document.getElementById('register-form');
const authContainer = document.getElementById('auth-container');
const storeContainer = document.getElementById('store-container');
const authMsg = document.getElementById('auth-msg');

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    if (tab === 'login') {
        loginForm.style.display = 'block';
        regForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        regForm.style.display = 'block';
    }
}

// Login Handler
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-user').value;
    const password = document.getElementById('login-pass').value;

    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (data.success) {
        currentUser = data.username;
        document.getElementById('welcome-user').innerText = `Hello, ${currentUser}`;
        authContainer.classList.add('hidden');
        storeContainer.classList.remove('hidden');
        loadProducts();
    } else {
        authMsg.innerText = data.message;
        authMsg.style.color = 'red';
    }
});

// Register Handler
regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-user').value;
    const password = document.getElementById('reg-pass').value;

    const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    
    authMsg.innerText = data.message;
    authMsg.style.color = data.success ? 'green' : 'red';
    if(data.success) switchTab('login');
});

function logout() {
    currentUser = null;
    cart = [];
    updateCartUI();
    storeContainer.classList.add('hidden');
    authContainer.classList.remove('hidden');
    loginForm.reset();
}

// --- STORE LOGIC ---

async function loadProducts() {
    const res = await fetch('/api/products');
    const products = await res.json();
    const container = document.getElementById('product-list');
    container.innerHTML = '';

    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <div class="p-info">
                <h3>${p.name}</h3>
                <p class="p-price">$${p.price.toFixed(2)}</p>
                <button class="add-btn" onclick="addToCart(${p.id}, '${p.name}', ${p.price})">
                    Add to Cart
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- CART LOGIC ---

function addToCart(id, name, price) {
    cart.push({ id, name, price });
    updateCartUI();
    alert(`${name} added to cart!`);
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        cartItems.innerHTML += `
            <div class="cart-item">
                <span>${item.name}</span>
                <span>$${item.price.toFixed(2)}</span>
            </div>
        `;
    });
    document.getElementById('cart-total-price').innerText = total.toFixed(2);
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.classList.toggle('hidden');
}

async function checkout() {
    if (cart.length === 0) return alert("Cart is empty!");
    
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    
    const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser, items: cart, total })
    });
    
    const data = await res.json();
    if(data.success) {
        alert(`Order Placed Successfully! Order ID: ${data.orderId}`);
        cart = [];
        updateCartUI();
        toggleCart();
    }
}