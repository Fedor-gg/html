
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    initMobileMenu();
});

function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
}

function updateCartCount() {
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        const cart = getCart();
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = count;
    }
}

function getCart() {
    const cartData = localStorage.getItem('urbanDecorCart');
    return cartData ? JSON.parse(cartData) : [];
}

function saveCart(cart) {
    localStorage.setItem('urbanDecorCart', JSON.stringify(cart));
}

function addToCart(product) {
    let cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice || null,
            category: product.category,
            quantity: 1
        });
    }
    
    saveCart(cart);
    updateCartCount();
    
    showNotification(`"${product.name}" добавлен в корзину`);
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartCount();
    
    if (typeof renderCart === 'function') {
        renderCart();
    }
}

function changeQuantity(productId, delta) {
    let cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
    }
    
    saveCart(cart);
    updateCartCount();
    
    if (typeof renderCart === 'function') {
        renderCart();
    }
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function getCartTotalWithDiscount() {
    const cart = getCart();
    return cart.reduce((sum, item) => {
        const price = item.originalPrice || item.price;
        return sum + (price * item.quantity);
    }, 0);
}
const promoCodes = {
    'WELCOME10': 10,
    'SAVE20': 20,
    'URBAN5': 5
};

let appliedPromo = null;

function applyPromoCode(code) {
    const promoInput = document.getElementById('promo-input');
    const promoMessage = document.getElementById('promo-message');
    const discountEl = document.getElementById('discount-row');
    const totalEl = document.getElementById('total-value');
    
    const upperCode = code.toUpperCase();
    
    if (promoCodes.hasOwnProperty(upperCode)) {
        appliedPromo = { code: upperCode, discount: promoCodes[upperCode] };
        
        if (promoMessage) {
            promoMessage.textContent = `Промокод "${upperCode}" применен! Скидка ${promoCodes[upperCode]}%`;
            promoMessage.className = 'promo-message success';
        }
        
        if (typeof renderCart === 'function') {
            renderCart();
        }
        
        return true;
    } else {
        if (promoMessage) {
            promoMessage.textContent = 'Неверный промокод';
            promoMessage.className = 'promo-message error';
        }
        appliedPromo = null;
        
        if (typeof renderCart === 'function') {
            renderCart();
        }
        
        return false;
    }
}

function showNotification(message) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #2c3e50;
        color: #fff;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
