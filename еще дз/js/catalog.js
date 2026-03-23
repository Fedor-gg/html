
const products = [
    {
        id: 1,
        name: 'Industrial Coffee Table',
        category: 'furniture',
        price: 239,
        originalPrice: 299,
        rating: 4,
        reviews: 24,
        badges: ['sale'],
        icon: '☕'
    },
    {
        id: 2,
        name: 'Minimalist Floor Lamp',
        category: 'lighting',
        price: 149,
        originalPrice: null,
        rating: 5,
        reviews: 18,
        badges: ['new'],
        icon: '💡'
    },
    {
        id: 3,
        name: 'Wool Blend Throw',
        category: 'textiles',
        price: 89,
        originalPrice: null,
        rating: 4,
        reviews: 12,
        badges: [],
        icon: '🧶'
    },
    {
        id: 4,
        name: 'Modern Bookshelf',
        category: 'furniture',
        price: 169,
        originalPrice: 199,
        rating: 3,
        reviews: 8,
        badges: ['sale'],
        icon: '📚'
    },
    {
        id: 5,
        name: 'Ceramic Vase Set',
        category: 'decor',
        price: 59,
        originalPrice: null,
        rating: 5,
        reviews: 31,
        badges: [],
        icon: '🏺'
    },
    {
        id: 6,
        name: 'Leather Armchair',
        category: 'furniture',
        price: 499,
        originalPrice: 599,
        rating: 4,
        reviews: 27,
        badges: ['sale'],
        icon: '🪑'
    },
    {
        id: 7,
        name: 'Brass Table Lamp',
        category: 'lighting',
        price: 129,
        originalPrice: null,
        rating: 5,
        reviews: 15,
        badges: [],
        icon: '🪔'
    },
    {
        id: 8,
        name: 'Linen Curtains',
        category: 'textiles',
        price: 116,
        originalPrice: 129,
        rating: 4,
        reviews: 22,
        badges: ['sale'],
        icon: '🪟'
    },
    {
        id: 9,
        name: 'Super Curtains',
        category: 'textiles',
        price: 150,
        originalPrice: 200,
        rating: 5,
        reviews: 28,
        badges: ['sale'],
        icon: '🏠'
    },
    {
        id: 10,
        name: 'Velvet Sofa',
        category: 'furniture',
        price: 899,
        originalPrice: null,
        rating: 5,
        reviews: 42,
        badges: ['new'],
        icon: '🛋️'
    },
    {
        id: 11,
        name: 'Pendant Light',
        category: 'lighting',
        price: 179,
        originalPrice: null,
        rating: 4,
        reviews: 19,
        badges: [],
        icon: '✨'
    },
    {
        id: 12,
        name: 'Wall Mirror',
        category: 'decor',
        price: 89,
        originalPrice: null,
        rating: 4,
        reviews: 25,
        badges: [],
        icon: '🪞'
    },
    {
        id: 13,
        name: 'Cotton Bedspread',
        category: 'textiles',
        price: 199,
        originalPrice: null,
        rating: 5,
        reviews: 33,
        badges: ['new'],
        icon: '🛏️'
    },
    {
        id: 14,
        name: 'Wooden Console',
        category: 'furniture',
        price: 349,
        originalPrice: 399,
        rating: 4,
        reviews: 16,
        badges: ['sale'],
        icon: '🪵'
    },
    {
        id: 15,
        name: 'Table Lamp Pro',
        category: 'lighting',
        price: 199,
        originalPrice: null,
        rating: 5,
        reviews: 21,
        badges: [],
        icon: '🔦'
    },
    {
        id: 16,
        name: 'Decorative Pillows',
        category: 'decor',
        price: 45,
        originalPrice: null,
        rating: 4,
        reviews: 38,
        badges: [],
        icon: '🛋️'
    }
];

let currentFilter = 'all';

function initCatalog() {
    const productsGrid = document.getElementById('products-grid');
    const filterBar = document.getElementById('filter-bar');
    
    if (!productsGrid) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const saleParam = urlParams.get('sale');
    
    if (categoryParam) {
        currentFilter = categoryParam;
        updateFilterButtons();
    } else if (saleParam === 'true') {
        currentFilter = 'sale';
        updateFilterButtons();
    }
    
    if (filterBar) {
        filterBar.addEventListener('click', function(e) {
            if (e.target.classList.contains('filter-btn')) {
                currentFilter = e.target.dataset.filter;
                updateFilterButtons();
                renderProducts();
            }
        });
    }
    
    renderProducts();
}

function updateFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === currentFilter);
    });
}

function getFilteredProducts() {
    if (currentFilter === 'all') {
        return products;
    }
    
    if (currentFilter === 'sale') {
        return products.filter(p => p.originalPrice !== null);
    }
    
    return products.filter(p => p.category === currentFilter);
}

function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    const filteredProducts = getFilteredProducts();
    
    productsGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    
    setTimeout(() => {
        document.querySelectorAll('.product-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }, 10);
}

function createProductCard(product) {
    const badges = product.badges.map(badge => {
        const label = badge === 'sale' ? `-${Math.round((1 - product.price / product.originalPrice) * 100)}%` : 'New';
        return `<span class="badge badge-${badge}">${label}</span>`;
    }).join('');
    
    const priceHTML = product.originalPrice 
        ? `<span class="price-current">$${product.price}</span>
           <span class="price-old">$${product.originalPrice}</span>`
        : `<span class="price-current">$${product.price}</span>`;
    
    const stars = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);
    const categoryLabels = {
        furniture: 'Мебель',
        lighting: 'Освещение',
        textiles: 'Текстиль',
        decor: 'Декор'
    };
    
    return `
        <div class="product-card">
            <div class="product-image">
                <span class="placeholder-icon">${product.icon}</span>
                <div class="product-badges">${badges}</div>
            </div>
            <div class="product-info">
                <div class="product-category">${categoryLabels[product.category]}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    <span>${stars}</span>
                    <span>(${product.reviews})</span>
                </div>
                <div class="product-price">
                    ${priceHTML}
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="addToCartFromCatalog(${product.id})">
                        В корзину
                    </button>
                </div>
            </div>
        </div>
    `;
}

function addToCartFromCatalog(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            category: product.category
        });
    }
}

document.addEventListener('DOMContentLoaded', initCatalog);
