/* ============================================
   PRINTFUL INTEGRATION
   ============================================ */

// Printful API Configuration - Official OpenAPI Spec Compliant
const PRINTFUL_CONFIG = {
    apiKey: 'ZtVtYKQTbD5USYJJhKSzMhdHD4A6mqek9jcDIRE8', // Add your Printful API key here
    baseUrl: 'https://api.printful.com',
    storeId: null,
    version: 'v2',
    rateLimit: {
        maxRequests: 120,
        windowSeconds: 60
    }
};

// Printful Product Sync
async function fetchPrintfulProducts() {
    if (PRINTFUL_CONFIG.apiKey === 'YOUR_PRINTFUL_API_KEY') {
        showToast('Please add your Printful API key first');
        return [];
    }

    try {
        showToast('Syncing products from Printful...');
        
        // Official GET /store/products endpoint from OpenAPI spec
        const headers = {
            'Authorization': `Bearer ${PRINTFUL_CONFIG.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        // Add store ID header if configured
        if (PRINTFUL_CONFIG.storeId) {
            headers['X-PF-Store-Id'] = PRINTFUL_CONFIG.storeId;
        }

        const response = await fetch(`${PRINTFUL_CONFIG.baseUrl}/store/products`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Printful API ${response.status}: ${errorData.result?.message || response.statusText}`);
        }

        const data = await response.json();
        console.log('Printful sync products response:', data);
        
        // Fetch full details for each product using official GET /store/products/{id}
        const products = [];
        for (const item of data.result) {
            const productDetail = await fetchPrintfulProductDetails(item.id);
            if (productDetail) {
                products.push(productDetail);
            }
            // Rate limit compliance - 10req/60s limit for product updates
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        showToast(`Synced ${products.length} products from Printful`);
        return products;

    } catch (error) {
        console.error('Printful sync error:', error);
        showToast(`Sync failed: ${error.message}`);
        return [];
    }
}

async function fetchPrintfulProductDetails(productId) {
    try {
        const headers = {
            'Authorization': `Bearer ${PRINTFUL_CONFIG.apiKey}`,
            'Accept': 'application/json'
        };
        
        if (PRINTFUL_CONFIG.storeId) {
            headers['X-PF-Store-Id'] = PRINTFUL_CONFIG.storeId;
        }

        // Official GET /store/products/{id} endpoint from OpenAPI spec
        const response = await fetch(`${PRINTFUL_CONFIG.baseUrl}/store/products/${productId}`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            console.warn(`Product ${productId} returned ${response.status}`);
            return null;
        }

        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error(`Error fetching product ${productId}:`, error);
        return null;
    }
}

function convertPrintfulToStoreProduct(printfulProduct) {
    // Find primary mockup image
    const primaryMockup = printfulProduct.sync_variants?.[0]?.files?.find(f => f.type === 'preview') 
        || printfulProduct.sync_variants?.[0]?.files?.[0];
    
    const price = printfulProduct.sync_variants?.[0]?.retail_price 
        || printfulProduct.retail_price 
        || '0';

    return {
        id: printfulProduct.id,
        name: printfulProduct.name,
        description: printfulProduct.description || 'Premium BEEFY print-on-demand product',
        price: parseFloat(price),
        image: primaryMockup?.preview_url || primaryMockup?.url || '',
        category: mapPrintfulCategory(printfulProduct.type),
        variants: printfulProduct.sync_variants?.map(v => ({
            id: v.id,
            name: v.name,
            size: v.size,
            color: v.color,
            price: parseFloat(v.retail_price || price)
        })) || [],
        sku: printfulProduct.sku,
        status: printfulProduct.status
    };
}

function mapPrintfulCategory(printfulType) {
    const categoryMap = {
        'tshirt': 'tops',
        'tank_top': 'tops',
        'hoodie': 'tops',
        'sweatshirt': 'tops',
        'longsleeve': 'tops',
        'shorts': 'bottoms',
        'leggings': 'bottoms',
        'sweatpants': 'bottoms',
        'hat': 'accessories',
        'bag': 'accessories',
        'mug': 'accessories',
        'phone_case': 'accessories',
        'poster': 'accessories',
        'sports_bra': 'women',
        'tank_womens': 'women',
        'leggings_womens': 'women'
    };
    return categoryMap[printfulType] || 'accessories';
}

async function syncPrintfulProductsToStore() {
    const printfulProducts = await fetchPrintfulProducts();
    
    if (printfulProducts.length === 0) {
        return;
    }

    // Convert Printful products to store format
    const storeProducts = printfulProducts.map(convertPrintfulToStoreProduct);
    
    // Clear existing products
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    // Add new products from Printful
    storeProducts.forEach((product, index) => {
        const productCard = createProductCard(product, index + 1);
        productsGrid.appendChild(productCard);
    });

    // Re-initialize product filter tabs
    initializeProductFilters();

    // Update global product data
    window.STORE_PRODUCTS = storeProducts;
    
    showToast(`Successfully synced ${storeProducts.length} products`);
}

function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.category = product.category;
    card.dataset.productId = product.id;

    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-overlay">
                <a href="#" class="quick-view-btn" data-product="${index}">Quick View</a>
            </div>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-desc">${product.description.substring(0, 60)}...</p>
            <div class="product-footer">
                <span class="product-price">R${product.price.toFixed(0)}</span>
                <a href="#" class="btn-buy" data-product-id="${product.id}">
                    <i class="fas fa-shopping-bag"></i>
                </a>
            </div>
        </div>
    `;

    return card;
}

function initializeProductFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const productCards = document.querySelectorAll('.product-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filter = tab.dataset.filter;
            productCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease-out both';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// Add sync button to admin area
function addPrintfulSyncButton() {
    const productsHeader = document.querySelector('.products .section-header');
    if (productsHeader) {
        const syncBtn = document.createElement('button');
        syncBtn.className = 'btn btn-primary';
        syncBtn.style.marginTop = '20px';
        syncBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Sync Printful Products';
        syncBtn.addEventListener('click', syncPrintfulProductsToStore);
        productsHeader.appendChild(syncBtn);
    }
}

// Initialize Printful integration when document loads
document.addEventListener('DOMContentLoaded', () => {
    // Add sync button to products section
    setTimeout(addPrintfulSyncButton, 1000);

    // Auto sync on page load if API key is set
    if (PRINTFUL_CONFIG.apiKey !== 'YOUR_PRINTFUL_API_KEY') {
        setTimeout(syncPrintfulProductsToStore, 2000);
    }
});