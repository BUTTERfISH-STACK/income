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

        const headers = {
            'Authorization': `Bearer ${PRINTFUL_CONFIG.apiKey}`,
            'Accept': 'application/json'
        };

        if (PRINTFUL_CONFIG.storeId) {
            headers['X-PF-Store-Id'] = PRINTFUL_CONFIG.storeId;
        }

        // Official GET /store/products endpoint from OpenAPI spec
        const response = await fetch(`${PRINTFUL_CONFIG.baseUrl}/store/products`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Printful sync products response:', data);

        showToast(`Found ${data.result.length} products in Printful store`);

        // Fetch full details for each product using official GET /store/products/{id}
        const products = [];
        for (const item of data.result) {
            const productDetail = await fetchPrintfulProductDetails(item.id);
            if (productDetail) {
                products.push(productDetail);
            }
            // Rate limit compliance - 120req/60s limit
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        showToast(`Synced ${products.length} products from Printful`);
        return products;

    } catch (error) {
        console.error('Printful sync error:', error);
        showToast(`Sync failed: ${error.message}`);
        
        // Show error in products grid
        const productsGrid = document.getElementById('productsGrid');
        if (productsGrid) {
            productsGrid.innerHTML = `<p style="color: #ef4444;">Sync failed: ${error.message}</p>`;
        }
        
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
    let printfulProducts = [];

    try {
        printfulProducts = await fetchPrintfulProducts();
    } catch (error) {
        console.error('Printful sync failed, using fallback products:', error);
        showToast('Using BEEFY products (Printful sync failed)');
    }

    // If no Printful products, use fallback static products
    if (printfulProducts.length === 0) {
        printfulProducts = [
            {
                id: 1,
                name: 'BEEFY Classic Tee',
                description: 'Heavyweight 220gsm cotton tee with bold BEEFY logo print. Pre-shrunk, true to size.',
                price: 25.00,
                image: 'images/product-tee.jpg',
                category: 'tops',
                variants: [
                    { id: 101, name: 'BEEFY Classic Tee / S', size: 'S', color: 'Black', price: 25.00 },
                    { id: 102, name: 'BEEFY Classic Tee / M', size: 'M', color: 'Black', price: 25.00 },
                    { id: 103, name: 'BEEFY Classic Tee / L', size: 'L', color: 'Black', price: 25.00 },
                    { id: 104, name: 'BEEFY Classic Tee / XL', size: 'XL', color: 'Black', price: 25.00 }
                ]
            },
            {
                id: 2,
                name: 'Dundee Beast Tank',
                description: 'Breathable mesh tank top built for intense workouts. Lightweight, moisture-wicking fabric.',
                price: 22.00,
                image: 'images/product-tank.jpg',
                category: 'tops',
                variants: [
                    { id: 201, name: 'Dundee Beast Tank / S', size: 'S', color: 'White', price: 22.00 },
                    { id: 202, name: 'Dundee Beast Tank / M', size: 'M', color: 'White', price: 22.00 },
                    { id: 203, name: 'Dundee Beast Tank / L', size: 'L', color: 'White', price: 22.00 }
                ]
            },
            {
                id: 3,
                name: 'Power Shorts',
                description: '4-way stretch shorts with deep pockets. Squat-proof material, elastic waistband.',
                price: 30.00,
                image: 'images/product-shorts.jpg',
                category: 'bottoms',
                variants: [
                    { id: 301, name: 'Power Shorts / M', size: 'M', color: 'Black', price: 30.00 },
                    { id: 302, name: 'Power Shorts / L', size: 'L', color: 'Black', price: 30.00 },
                    { id: 303, name: 'Power Shorts / XL', size: 'XL', color: 'Black', price: 30.00 }
                ]
            },
            {
                id: 4,
                name: 'BEEFY Hoodie',
                description: 'Premium 350gsm fleece hoodie with embroidered BEEFY logo. Kangaroo pocket.',
                price: 45.00,
                image: 'images/product-hoodie.jpg',
                category: 'tops',
                variants: [
                    { id: 401, name: 'BEEFY Hoodie / S', size: 'S', color: 'Black', price: 45.00 },
                    { id: 402, name: 'BEEFY Hoodie / M', size: 'M', color: 'Black', price: 45.00 },
                    { id: 403, name: 'BEEFY Hoodie / L', size: 'L', color: 'Black', price: 45.00 },
                    { id: 404, name: 'BEEFY Hoodie / XL', size: 'XL', color: 'Black', price: 45.00 }
                ]
            },
            {
                id: 5,
                name: 'Track Pants',
                description: 'Tapered fit track pants with zip pockets. Soft brushed interior.',
                price: 40.00,
                image: 'images/product-tracks.jpg',
                category: 'bottoms',
                variants: [
                    { id: 501, name: 'Track Pants / M', size: 'M', color: 'Black', price: 40.00 },
                    { id: 502, name: 'Track Pants / L', size: 'L', color: 'Black', price: 40.00 },
                    { id: 503, name: 'Track Pants / XL', size: 'XL', color: 'Black', price: 40.00 }
                ]
            },
            {
                id: 6,
                name: 'BEEFY Cap',
                description: 'Structured snapback with flat brim. Embroidered BEEFY logo.',
                price: 18.00,
                image: 'images/product-cap.jpg',
                category: 'accessories',
                variants: [
                    { id: 601, name: 'BEEFY Cap / One Size', size: 'One Size', color: 'Black', price: 18.00 }
                ]
            },
            {
                id: 7,
                name: 'BEEFY Sports Bra',
                description: 'High-support sports bra with moisture-wicking fabric. Racerback design.',
                price: 25.00,
                image: 'images/product-sportsbra.jpg',
                category: 'women',
                variants: [
                    { id: 701, name: 'BEEFY Sports Bra / S', size: 'S', color: 'Black', price: 25.00 },
                    { id: 702, name: 'BEEFY Sports Bra / M', size: 'M', color: 'Black', price: 25.00 },
                    { id: 703, name: 'BEEFY Sports Bra / L', size: 'L', color: 'Black', price: 25.00 }
                ]
            },
            {
                id: 8,
                name: 'Flex Leggings',
                description: 'High-waist sculpting leggings with 4-way stretch. Squat-proof.',
                price: 35.00,
                image: 'images/product-leggings.jpg',
                category: 'bottoms',
                variants: [
                    { id: 801, name: 'Flex Leggings / S', size: 'S', color: 'Black', price: 35.00 },
                    { id: 802, name: 'Flex Leggings / M', size: 'M', color: 'Black', price: 35.00 },
                    { id: 803, name: 'Flex Leggings / L', size: 'L', color: 'Black', price: 35.00 }
                ]
            },
            {
                id: 9,
                name: 'Lifting Gloves',
                description: 'Genuine leather palm lifting gloves with wrist wraps. Padded grip.',
                price: 20.00,
                image: 'images/product-gloves.jpg',
                category: 'accessories',
                variants: [
                    { id: 901, name: 'Lifting Gloves / M', size: 'M', color: 'Black', price: 20.00 },
                    { id: 902, name: 'Lifting Gloves / L', size: 'L', color: 'Black', price: 20.00 }
                ]
            },
            {
                id: 10,
                name: 'BEEFY Stringer',
                description: 'Competition-cut stringer tank. Deep armholes, lightweight fabric.',
                price: 22.00,
                image: 'images/product-stringer.jpg',
                category: 'tops',
                variants: [
                    { id: 1001, name: 'BEEFY Stringer / S', size: 'S', color: 'White', price: 22.00 },
                    { id: 1002, name: 'BEEFY Stringer / M', size: 'M', color: 'White', price: 22.00 },
                    { id: 1003, name: 'BEEFY Stringer / L', size: 'L', color: 'White', price: 22.00 }
                ]
            },
            {
                id: 11,
                name: 'BEEFY Shaker',
                description: '750ml BPA-free protein shaker with BEEFY branding. Leak-proof lid.',
                price: 12.00,
                image: 'images/product-shaker.jpg',
                category: 'accessories',
                variants: [
                    { id: 1101, name: 'BEEFY Shaker / One Size', size: 'One Size', color: 'Black', price: 12.00 }
                ]
            },
            {
                id: 12,
                name: 'Gym Bag',
                description: 'Heavy-duty canvas gym bag with separate shoe compartment. Multiple pockets.',
                price: 55.00,
                image: 'images/product-gymbag.jpg',
                category: 'accessories',
                variants: [
                    { id: 1201, name: 'Gym Bag / One Size', size: 'One Size', color: 'Black', price: 55.00 }
                ]
            }
        ];
    }

    // Convert products to store format
    const storeProducts = printfulProducts.map(convertPrintfulToStoreProduct);

    // Clear existing products
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    // Add products
    storeProducts.forEach((product, index) => {
        const productCard = createProductCard(product, index + 1);
        productsGrid.appendChild(productCard);
    });

    // Re-initialize product filter tabs
    initializeProductFilters();

    // Update global product data
    window.STORE_PRODUCTS = storeProducts;

    // Update product data for modal/cart functionality
    if (window.updateProductData) {
        window.updateProductData(storeProducts);
    }

    showToast(`Loaded ${storeProducts.length} products`);
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