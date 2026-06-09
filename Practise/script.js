(function() {
    // ---------- DATA ----------
    const menuItems = [
        { id: 'espresso', name: 'Espresso', basePrice: 3, desc: 'Rich & bold · single origin' },
        { id: 'cappuccino', name: 'Cappuccino', basePrice: 4, desc: 'Velvety foam · double shot option' },
        { id: 'latte', name: 'Latte', basePrice: 4.5, desc: 'Smooth steamed milk' },
        { id: 'mocha', name: 'Mocha', basePrice: 5, desc: 'Chocolate espresso bliss' }
    ];

    // Cart state: array of { id, name, price, quantity }
    let cart = [];

    // DOM elements
    const orderBtn = document.getElementById('orderNowBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');
    const cartCountBadge = document.getElementById('cartCountBadge');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const toastEl = document.getElementById('dynamicToast');

    // Helper: show toast message
    function showToast(message, duration = 2300) {
        if (!toastEl) return;
        toastEl.textContent = message;
        toastEl.style.opacity = '1';
        toastEl.style.transform = 'translateX(-50%) scale(1)';
        clearTimeout(window.toastTimeout);
        window.toastTimeout = setTimeout(() => {
            toastEl.style.opacity = '0';
            toastEl.style.transform = 'translateX(-50%) scale(0.9)';
        }, duration);
    }

    // Save & render cart
    function saveCart() {
        localStorage.setItem('coffeeMastersCart', JSON.stringify(cart));
    }

    function loadCart() {
        const saved = localStorage.getItem('coffeeMastersCart');
        if (saved) {
            try {
                cart = JSON.parse(saved);
            } catch(e) { cart = []; }
        } else {
            cart = [];
        }
        renderCart();
    }

    // Add item to cart (with quantity)
    function addToCart(itemId, quantity) {
        if (quantity <= 0) return;
        const menuItem = menuItems.find(i => i.id === itemId);
        if (!menuItem) return;

        const existing = cart.find(i => i.id === itemId);
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({
                id: itemId,
                name: menuItem.name,
                price: menuItem.basePrice,
                quantity: quantity
            });
        }
        saveCart();
        renderCart();
        showToast(`✨ Added ${quantity} × ${menuItem.name} to cart`, 1500);
        // optional side cart open hint
        if (!cartSidebar.classList.contains('open')) {
            // subtle: open automatically after first add? but better not to annoy, just animate badge
        }
        updateCartCountBadge();
    }

    function removeCartItem(itemId) {
        cart = cart.filter(i => i.id !== itemId);
        saveCart();
        renderCart();
        updateCartCountBadge();
        showToast('Item removed', 1000);
    }

    function updateQuantity(itemId, delta) {
        const idx = cart.findIndex(i => i.id === itemId);
        if (idx === -1) return;
        const newQty = cart[idx].quantity + delta;
        if (newQty <= 0) {
            cart.splice(idx, 1);
        } else {
            cart[idx].quantity = newQty;
        }
        saveCart();
        renderCart();
        updateCartCountBadge();
    }

    function getCartTotal() {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    function updateCartCountBadge() {
        const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
        if (cartCountBadge) {
            cartCountBadge.textContent = totalItems;
            cartCountBadge.style.display = totalItems > 0 ? 'inline-flex' : 'none';
        }
    }

    function renderCart() {
        if (!cartItemsContainer) return;
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div style="text-align:center;padding:1.5rem;color:#ad8865;">🛒 Cart is empty<br>Add delicious coffee!</div>';
            if (cartTotalSpan) cartTotalSpan.textContent = '$0.00';
            updateCartCountBadge();
            return;
        }

        let html = '';
        cart.forEach(item => {
            const itemTotal = (item.price * item.quantity).toFixed(2);
            html += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-info">
                        <strong>${item.name}</strong><br>
                        <span style="font-size:0.7rem;">$${item.price} each</span>
                        <div style="display:flex; gap:8px; margin-top:5px;">
                            <button class="cart-qty-dec" data-id="${item.id}" style="background:#e6d8c6; border:none; width:26px; border-radius:30px;">−</button>
                            <span style="font-weight:600;">${item.quantity}</span>
                            <button class="cart-qty-inc" data-id="${item.id}" style="background:#e6d8c6; border:none; width:26px; border-radius:30px;">+</button>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div class="cart-item-price">$${itemTotal}</div>
                        <button class="cart-item-remove" data-id="${item.id}" style="background:none; border:none; color:#b85f1e; cursor:pointer;">🗑️</button>
                    </div>
                </div>
            `;
        });
        cartItemsContainer.innerHTML = html;
        const total = getCartTotal();
        if (cartTotalSpan) cartTotalSpan.textContent = `$${total.toFixed(2)}`;

        // attach event listeners to new buttons
        document.querySelectorAll('.cart-qty-dec').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                updateQuantity(id, -1);
            });
        });
        document.querySelectorAll('.cart-qty-inc').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                updateQuantity(id, 1);
            });
        });
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                removeCartItem(id);
            });
        });
        updateCartCountBadge();
    }

    // open/close cart sidebar
    function openCart() {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderCart(); // re-render to ensure fresh data
    }

    function closeCart() {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // attach quantity controls on menu cards (dynamic plus/minus + add)
    function attachMenuQuantityControls() {
        const coffeeCards = document.querySelectorAll('.coffee-card');
        coffeeCards.forEach(card => {
            const itemId = card.getAttribute('data-item-id');
            if (!itemId) return;
            const qtySpan = card.querySelector('.qty-value');
            const minusBtn = card.querySelector('.qty-minus');
            const plusBtn = card.querySelector('.qty-plus');
            const addBtn = card.querySelector('.add-to-cart-btn');
            let currentQty = 1;
            if (qtySpan) qtySpan.textContent = currentQty;

            if (minusBtn) {
                minusBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (currentQty > 1) {
                        currentQty--;
                        if (qtySpan) qtySpan.textContent = currentQty;
                    }
                });
            }
            if (plusBtn) {
                plusBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentQty++;
                    if (qtySpan) qtySpan.textContent = currentQty;
                });
            }
            if (addBtn) {
                addBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    addToCart(itemId, currentQty);
                    // after adding reset quantity to 1
                    currentQty = 1;
                    if (qtySpan) qtySpan.textContent = currentQty;
                });
            }
        });
    }

    // Build menu cards with embedded selectors
    function buildEnhancedMenu() {
        const menuGrid = document.getElementById('dynamicMenuGrid');
        if (!menuGrid) return;
        menuGrid.innerHTML = '';
        menuItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'coffee-card';
            card.setAttribute('data-item-id', item.id);
            card.innerHTML = `
                <div class="coffee-info">
                    <span class="coffee-name">${item.name}</span>
                    <span class="coffee-desc">${item.desc}</span>
                    <div class="quantity-selector">
                        <button class="qty-btn qty-minus">−</button>
                        <span class="qty-value">1</span>
                        <button class="qty-btn qty-plus">+</button>
                        <button class="add-to-cart-btn">➕ Add</button>
                    </div>
                </div>
                <div class="coffee-price">$${item.basePrice}</div>
            `;
            menuGrid.appendChild(card);
        });
        attachMenuQuantityControls();
    }

    // checkout logic
    function checkout() {
        if (cart.length === 0) {
            showToast('☕ Your cart is empty. Add some coffee first!', 1800);
            return;
        }
        const total = getCartTotal().toFixed(2);
        showToast(`🎉 Order placed! Total $${total}. Thank you, coffee lover!`, 3000);
        cart = [];
        saveCart();
        renderCart();
        updateCartCountBadge();
        closeCart();
        // additional console fun
        console.log('[Coffee Masters] Order completed with total $' + total);
    }

    // event listeners
    function bindGlobalEvents() {
        if (orderBtn) {
            orderBtn.addEventListener('click', () => {
                if (cart.length === 0) {
                    showToast('Add items to your cart first! ☕', 1700);
                } else {
                    openCart();
                }
            });
        }
        if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
        if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
        if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);
    }

    // initialize everything
    function init() {
        buildEnhancedMenu();     // create dynamic cards with quantity + add buttons
        loadCart();             // load existing cart from localStorage
        bindGlobalEvents();
        updateCartCountBadge();
        // ensure render cart if needed
        renderCart();
    }

    init();
})();