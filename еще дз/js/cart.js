
const deliveryOptions = [
    { id: 'standard', name: 'Стандартная', time: '5-7 дней', price: 300 },
    { id: 'express', name: 'Экспресс', time: '1-2 дня', price: 600 },
    { id: 'pickup', name: 'Самовывоз', time: 'Сегодня', price: 0 }
];

let selectedDelivery = 'standard';
let deliveryPrice = 300;

function renderCart() {
    const cartContent = document.getElementById('cart-content');
    if (!cartContent) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="cart-empty">
                <div class="icon">🛒</div>
                <h2>Корзина пуста</h2>
                <p>Добавьте товары из каталога</p>
                <a href="catalog.html" class="btn btn-primary">Перейти в каталог</a>
            </div>
        `;
        return;
    }
    
    const cartItemsHTML = cart.map(item => createCartItem(item)).join('');
    
    const subtotal = getCartTotal();
    const subtotalOriginal = getCartTotalWithDiscount();
    const discount = subtotalOriginal - subtotal;
    const discountPercent = appliedPromo ? appliedPromo.discount : 0;
    
    const freeDeliveryThreshold = 100000;
    const isFreeDelivery = subtotal >= freeDeliveryThreshold;
    const finalDeliveryPrice = isFreeDelivery ? 0 : deliveryPrice;
    
    const total = subtotal - (discountPercent > 0 ? subtotal * discountPercent / 100 : 0) + finalDeliveryPrice;
    
    cartContent.innerHTML = `
        <div class="cart-container">
            <div class="cart-items">
                ${cartItemsHTML}
            </div>
            
            <div class="cart-summary">
                <h3>Итого</h3>
                
                <div class="summary-row">
                    <span>Товары (${cart.reduce((s, i) => s + i.quantity, 0)} шт.)</span>
                    <span>${formatPrice(subtotalOriginal)} ₽</span>
                </div>
                
                ${discount > 0 ? `
                <div class="summary-row" style="color: #27ae60;">
                    <span>Скидка</span>
                    <span>-${formatPrice(discount)} ₽</span>
                </div>
                ` : ''}
                
                ${discountPercent > 0 ? `
                <div class="summary-row" style="color: #27ae60;">
                    <span>Промокод (${appliedPromo.code})</span>
                    <span>-${discountPercent}%</span>
                </div>
                ` : ''}
                
                <div class="promo-code">
                    <input type="text" id="promo-input" placeholder="Введите промокод">
                    <button class="btn btn-outline btn-small" onclick="applyPromoFromInput()">Применить</button>
                    <div id="promo-message" class="promo-message"></div>
                </div>
                
                <div class="delivery-calculator">
                    <h4>Доставка</h4>
                    <div class="delivery-options">
                        ${deliveryOptions.map(opt => createDeliveryOption(opt)).join('')}
                    </div>
                    ${isFreeDelivery ? `
                    <div class="free-delivery-notice">
                        🎉 Бесплатная доставка! Закажите ещё на ${formatPrice(freeDeliveryThreshold - subtotal)} ₽
                    </div>
                    ` : ''}
                </div>
                
                <div class="summary-row">
                    <span>Доставка</span>
                    <span>${finalDeliveryPrice === 0 ? 'Бесплатно' : formatPrice(finalDeliveryPrice) + ' ₽'}</span>
                </div>
                
                <div class="summary-row total">
                    <span>К оплате</span>
                    <span class="value" id="total-value">${formatPrice(total)} ₽</span>
                </div>
                
                <button class="btn btn-primary" style="width: 100%; margin-top: 20px;" onclick="checkout()">
                    Оформить заказ
                </button>
                
                <button class="btn btn-outline" style="width: 100%; margin-top: 10px;" onclick="clearCart()">
                    Очистить корзину
                </button>
            </div>
        </div>
    `;
    

    updateDeliveryPrice();
}


function createCartItem(item) {
    const categoryLabels = {
        furniture: 'Мебель',
        lighting: 'Освещение',
        textiles: 'Текстиль',
        decor: 'Декор'
    };
    
    const itemTotal = item.price * item.quantity;
    
    return `
        <div class="cart-item">
            <div class="cart-item-image">
                <span class="placeholder-icon">📦</span>
            </div>
            <div class="cart-item-details">
                <div class="cart-item-category">${categoryLabels[item.category] || 'Товар'}</div>
                <h3 class="cart-item-title">${item.name}</h3>
                <div class="cart-item-price">${formatPrice(itemTotal)} ₽</div>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="changeQuantity(${item.id}, -1)">−</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Удалить</button>
            </div>
        </div>
    `;
}


function createDeliveryOption(option) {
    const isSelected = selectedDelivery === option.id;
    const priceText = option.price === 0 ? 'Бесплатно' : formatPrice(option.price) + ' ₽';
    
    return `
        <label class="delivery-option ${isSelected ? 'selected' : ''}" onclick="selectDelivery('${option.id}')">
            <input type="radio" name="delivery" value="${option.id}" ${isSelected ? 'checked' : ''}>
            <span class="radio-custom"></span>
            <div class="option-info">
                <div class="option-name">${option.name}</div>
                <div class="option-time">${option.time}</div>
            </div>
            <div class="option-price">${priceText}</div>
        </label>
    `;
}


function selectDelivery(optionId) {
    selectedDelivery = optionId;
    deliveryPrice = deliveryOptions.find(o => o.id === optionId).price;
    
    document.querySelectorAll('.delivery-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    document.querySelector(`[value="${optionId}"]`).closest('.delivery-option').classList.add('selected');
    
    updateDeliveryPrice();
}

function updateDeliveryPrice() {
    const cart = getCart();
    if (cart.length === 0) return;
    
    const subtotal = getCartTotal();
    const freeDeliveryThreshold = 5000;
    const isFreeDelivery = subtotal >= freeDeliveryThreshold;
    
    let finalDeliveryPrice = isFreeDelivery ? 0 : deliveryPrice;
    
    const discountPercent = appliedPromo ? appliedPromo.discount : 0;
    const discount = subtotalOriginal - getCartTotal();
    const subtotalOriginal = getCartTotalWithDiscount();
    
    let total = subtotal;
    if (discountPercent > 0) {
        total = total - (subtotal * discountPercent / 100);
    }
    total = total + finalDeliveryPrice;
    
    const totalEl = document.getElementById('total-value');
    if (totalEl) {
        totalEl.textContent = formatPrice(total) + ' ₽';
    }
    
    const noticeEl = document.querySelector('.free-delivery-notice');
    if (isFreeDelivery && !noticeEl) {
        const deliverySection = document.querySelector('.delivery-calculator');
        const notice = document.createElement('div');
        notice.className = 'free-delivery-notice';
        notice.innerHTML = '🎉 Бесплатная доставка!';
        deliverySection.appendChild(notice);
    } else if (!isFreeDelivery && noticeEl) {
        noticeEl.remove();
    }
}

function applyPromoFromInput() {
    const input = document.getElementById('promo-input');
    if (input) {
        applyPromoCode(input.value);
    }
}

function formatPrice(price) {
    return price.toLocaleString('ru-RU');
}

function clearCart() {
    if (confirm('Вы уверены, что хотите очистить корзину?')) {
        localStorage.removeItem('urbanDecorCart');
        appliedPromo = null;
        updateCartCount();
        renderCart();
    }
}

function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    
    const subtotal = getCartTotal();
    const total = subtotal + (selectedDelivery === 'pickup' ? 0 : deliveryOptions.find(o => o.id === selectedDelivery).price);
    
    const deliveryNames = {
        standard: 'Стандартная (5-7 дней)',
        express: 'Экспресс (1-2 дня)',
        pickup: 'Самовывоз'
    };
    
    const message = `Подтвердите заказ:\n\n` +
        cart.map(item => `${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)} ₽`).join('\n') +
        `\n\nДоставка: ${deliveryNames[selectedDelivery]}` +
        `\n\nИтого: ${formatPrice(total)} ₽`;
    
    if (confirm(message)) {
        alert('Спасибо за заказ! Мы свяжемся с вами в ближайшее время.');
        localStorage.removeItem('urbanDecorCart');
        appliedPromo = null;
        updateCartCount();
        window.location.href = 'index.html';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('cart-content')) {
        renderCart();
    }
});
