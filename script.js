/*
    Luxe E-Commerce Script
*/

// DOM Elements
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const cartCountEl = document.getElementById('cart-count');
const featuredGrid = document.getElementById('featured-products');

// State
let cart = JSON.parse(localStorage.getItem('luxe_cart')) || [];

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    initMobileMenu();
    initActionButtons();

    // If on cart page, render it
    if (document.querySelector('.cart-table')) {
        renderCart();
    }
});

// Mobile Menu
function initMobileMenu() {
    if (mobileMenuBtn) {
        // Create overlay element
        const overlay = document.createElement('div');
        overlay.className = 'mobile-overlay';
        document.body.appendChild(overlay);

        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-open');
            overlay.classList.toggle('active');
        });

        // Close menu when clicking overlay
        overlay.addEventListener('click', () => {
            navLinks.classList.remove('mobile-open');
            overlay.classList.remove('active');
        });
    }
}

// Cart Logic
function updateCartCount() {
    if (cartCountEl) {
        const count = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartCountEl.textContent = count;
    }
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartCount();

    // Visual Feedback
    alert(`${product.title} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
}

function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = parseInt(quantity);
        saveCart();
        updateCartCount();
        renderCart();
    }
}

function renderCart() {
    const cartTableBody = document.querySelector('.cart-table tbody');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    const cartTitle = document.querySelector('.cart-list h1');

    if (!cartTableBody) return;

    // Clear and render items
    cartTableBody.innerHTML = '';

    if (cart.length === 0) {
        cartTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 2rem;">Your cart is empty</td></tr>';
        if (cartTitle) cartTitle.textContent = 'Shopping Cart (0)';
        if (subtotalEl) subtotalEl.textContent = '$0.00';
        if (totalEl) totalEl.textContent = '$0.00';
        return;
    }

    let subtotal = 0;

    cart.forEach(item => {
        // Price cleaning (remove $ and convert to float)
        const priceNum = parseFloat(item.price.replace('$', ''));
        const itemTotal = priceNum * item.quantity;
        subtotal += itemTotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="cart-item-info">
                    <img src="${item.image}" class="cart-item-img" alt="${item.title}">
                    <div>
                        <h4 style="margin-bottom:0.25rem">${item.title}</h4>
                        <p style="font-size:0.9rem; color:var(--text-light)">${item.price}</p>
                    </div>
                </div>
            </td>
            <td>
                <select onchange="updateQuantity('${item.id}', this.value)" style="padding: 5px; border-radius: 4px; border: 1px solid #ddd;">
                    ${[1, 2, 3, 4, 5].map(q => `<option value="${q}" ${q === item.quantity ? 'selected' : ''}>${q}</option>`).join('')}
                </select>
            </td>
            <td style="font-weight:600">$${itemTotal.toFixed(2)}</td>
            <td><button onclick="removeFromCart('${item.id}')" style="color:#ef4444;"><i class="fa-solid fa-trash"></i></button></td>
        `;
        cartTableBody.appendChild(row);
    });

    if (cartTitle) cartTitle.textContent = `Shopping Cart (${cart.length})`;
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${(subtotal + 10).toFixed(2)}`; // $10 flat tax for demo
}

function saveCart() {
    localStorage.setItem('luxe_cart', JSON.stringify(cart));
}

// Event Listeners for Buttons (delegation)
function initActionButtons() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.action-btn');
        if (!btn) return;

        if (btn.title === "Add to Cart") {
            const card = btn.closest('.product-card');
            if (card) {
                const title = card.querySelector('.product-title').innerText;
                const price = card.querySelector('.price').innerText;
                const image = card.querySelector('img').src;
                const id = title.toLowerCase().replace(/\s/g, '-');

                addToCart({ id, title, price, image });
            }
        }
    });
}
