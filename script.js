/* ============================================
   BEEFY GYM WEAR - JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========== LOADER ==========
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1800);

    // ========== NAVBAR ==========
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinkItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    navLinkItems.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });

    // ========== TOAST ==========
    function showToast(message) {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        document.body.appendChild(toast);
        requestAnimationFrame(() => { toast.classList.add('show'); });
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    // ========== PRODUCT FILTER ==========
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

    // ========== QUICK VIEW MODAL ==========
    const modal = document.getElementById('quickViewModal');
    const modalClose = document.getElementById('modalClose');
    const modalName = document.getElementById('modalName');
    const modalDesc = document.getElementById('modalDesc');
    const modalPrice = document.getElementById('modalPrice');
    const modalAddCart = document.getElementById('modalAddCart');

    const productData = {
        1: { name: 'BEEFY Classic Tee', desc: 'Heavyweight 220gsm cotton tee with bold BEEFY logo print. Pre-shrunk, true to size. Available in black, white, and charcoal.', price: 'R450', slug: 'classic-tee' },
        2: { name: 'Dundee Beast Tank', desc: 'Breathable mesh tank top built for intense workouts. Lightweight, moisture-wicking fabric with raw-cut armholes.', price: 'R380', slug: 'beast-tank' },
        3: { name: 'Power Shorts', desc: '4-way stretch shorts with deep pockets. Squat-proof material, elastic waistband with drawcord. 7" inseam.', price: 'R520', slug: 'power-shorts' },
        4: { name: 'BEEFY Hoodie', desc: 'Premium 350gsm fleece hoodie with embroidered BEEFY logo. Kangaroo pocket, ribbed cuffs and hem.', price: 'R750', slug: 'beefy-hoodie' },
        5: { name: 'Track Pants', desc: 'Tapered fit track pants with zip pockets. Soft brushed interior, BEEFY branding down the leg.', price: 'R680', slug: 'track-pants' },
        6: { name: 'BEEFY Cap', desc: 'Structured snapback with flat brim. Embroidered BEEFY logo front and back. Adjustable fit.', price: 'R280', slug: 'beefy-cap' },
        7: { name: 'BEEFY Sports Bra', desc: 'High-support sports bra with moisture-wicking fabric. Racerback design, removable padding.', price: 'R420', slug: 'sports-bra' },
        8: { name: 'Flex Leggings', desc: 'High-waist sculpting leggings with 4-way stretch. Squat-proof, hidden pocket in waistband.', price: 'R580', slug: 'flex-leggings' },
        9: { name: 'Lifting Gloves', desc: 'Genuine leather palm lifting gloves with wrist wraps. Padded grip, BEEFY embossed logo.', price: 'R320', slug: 'lifting-gloves' },
        10: { name: 'BEEFY Stringer', desc: 'Competition-cut stringer tank. Deep armholes, lightweight fabric. Show your gains.', price: 'R350', slug: 'beefy-stringer' },
        11: { name: 'BEEFY Shaker', desc: '750ml BPA-free protein shaker with BEEFY branding. Leak-proof lid, mixing ball included.', price: 'R180', slug: 'beefy-shaker' },
        12: { name: 'Gym Bag', desc: 'Heavy-duty canvas gym bag with separate shoe compartment. Multiple pockets, BEEFY embroidered.', price: 'R890', slug: 'gym-bag' },
    };

    let currentModalProduct = null;

    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.dataset.product;
            const product = productData[id];
            if (product) {
                currentModalProduct = product;
                modalName.textContent = product.name;
                modalDesc.textContent = product.desc;
                modalPrice.textContent = product.price;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // ========== CART SYSTEM ==========
    const cartBtn = document.getElementById('cartBtn');
    const cartCount = document.getElementById('cartCount');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartCloseBtn = document.getElementById('cartClose');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartItemsEl = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartFooterEl = document.getElementById('cartFooter');
    const checkoutBtn = document.getElementById('checkoutBtn');
    let cart = [];

    function openCart() {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCartFn() {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    cartBtn.addEventListener('click', openCart);
    cartCloseBtn.addEventListener('click', closeCartFn);
    cartOverlay.addEventListener('click', closeCartFn);

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        cartCount.textContent = totalItems;
        cartTotalEl.textContent = `R${totalPrice.toLocaleString()}`;
        if (cart.length === 0) {
            cartItemsEl.innerHTML = `<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>Your cart is empty</p></div>`;
            cartFooterEl.style.display = 'none';
        } else {
            cartFooterEl.style.display = 'block';
            cartItemsEl.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-img"><i class="fas fa-tshirt"></i></div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">R${item.price}</div>
                        <div class="cart-item-qty">
                            <button class="qty-btn" data-id="${item.id}" data-change="-1">-</button>
                            <span>${item.qty}</span>
                            <button class="qty-btn" data-id="${item.id}" data-change="1">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                </div>
            `).join('');
            document.querySelectorAll('.qty-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const item = cart.find(i => i.id === btn.dataset.id);
                    if (item) {
                        item.qty += parseInt(btn.dataset.change);
                        if (item.qty <= 0) cart = cart.filter(i => i.id !== item.id);
                        updateCartUI();
                    }
                });
            });
            document.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', () => {
                    cart = cart.filter(i => i.id !== btn.dataset.id);
                    updateCartUI();
                    showToast('Item removed');
                });
            });
        }
    }

    function addToCart(id, name, price) {
        const existing = cart.find(i => i.id === id);
        if (existing) { existing.qty++; }
        else { cart.push({ id, name, price: parseInt(price), qty: 1 }); }
        updateCartUI();
        showToast(`${name} added to cart`);
        openCart();
    }

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        let msg = `*BEEFY ORDER*\n\n`;
        cart.forEach(item => { msg += `• ${item.name} x${item.qty} — R${item.price * item.qty}\n`; });
        msg += `\n*Total: R${total}*\n\nPlease confirm my order!`;
        window.open(`https://wa.me/27000000000?text=${encodeURIComponent(msg)}`, '_blank');
    });

    document.querySelectorAll('.btn-buy').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.product-card');
            const name = card.querySelector('.product-name').textContent;
            const price = card.querySelector('.product-price').textContent.replace('R', '');
            addToCart(name, name, price);
        });
    });

    modalAddCart.addEventListener('click', () => {
        if (currentModalProduct) {
            const price = currentModalProduct.price.replace('R', '');
            addToCart(currentModalProduct.slug, currentModalProduct.name, price);
            closeModal();
        }
    });

    // ========== SHOPIFY BUY BUTTON INTEGRATION ==========
    function initShopifyBuyButton() {
        if (typeof BEEFY_CONFIG === 'undefined') return;
        const config = BEEFY_CONFIG;
        if (!config || config.shopifyAccessToken === 'YOUR_SHOPIFY_ACCESS_TOKEN') return;
        const client = ShopifyBuy.buildClient({
            domain: config.shopifyDomain,
            storefrontAccessToken: config.shopifyAccessToken
        });
        ShopifyBuy.UI.init(client);
    }
    initShopifyBuyButton();

    // ========== TESTIMONIALS SLIDER ==========
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        testimonialCards[index].classList.add('active');
        dots[index].classList.add('active');
        currentTestimonial = index;
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            showTestimonial(parseInt(dot.dataset.index));
        });
    });

    setInterval(() => {
        showTestimonial((currentTestimonial + 1) % testimonialCards.length);
    }, 5000);

    // ========== NEWSLETTER FORM ==========
    const newsletterForm = document.getElementById('newsletterForm');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Welcome to the BEEFY family!');
        newsletterForm.reset();
    });

    // ========== CONTACT FORM ==========
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Message sent! We\'ll be in touch.');
        contactForm.reset();
    });

    // ========== SCROLL REVEAL ==========
    const revealElements = document.querySelectorAll('.product-card, .feature, .value, .gallery-item, .about-content, .about-visual, .contact-info, .contact-form-wrapper');
    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => observer.observe(el));

    // ========== COUNTDOWN TIMER (FOMO) ==========
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    let totalSeconds = 5 * 3600 + 42 * 60 + 18;
    
    function updateCountdown() {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        hoursEl.textContent = h.toString().padStart(2, '0');
        minutesEl.textContent = m.toString().padStart(2, '0');
        secondsEl.textContent = s.toString().padStart(2, '0');
        if (totalSeconds > 0) totalSeconds--;
        else totalSeconds = 5 * 3600 + 42 * 60 + 18;
    }
    setInterval(updateCountdown, 1000);

    // ========== SOCIAL PROOF POPUPS (FOMO) ==========
    const socialProof = document.getElementById('socialProof');
    const socialProofName = document.getElementById('socialProofName');
    const socialProofProduct = document.getElementById('socialProofProduct');
    const socialProofLocation = document.getElementById('socialProofLocation');
    
    const firstNames = ['Thabo', 'Pieter', 'Nokuthula', 'Johan', 'Sipho', 'Maria', 'Andries', 'Zanele', 'Ruan', 'Lethabo', 'Bongani', 'Wynand', 'Ayanda', 'Christo', 'Nomsa', 'Stefan', 'Zinhle', 'Dawid', 'Palesa', 'Francois', 'Mandla', 'Elize', 'Sibusiso', 'Annelie', 'Kagiso', 'Hennie', 'Thandi', 'Gert', 'Lindiwe', 'Trevor', 'Naledi', 'Jaco', 'Refilwe', 'Schalk', 'Busisiwe', 'Wayne', 'Dineo', 'Gerhard', 'Precious', 'Braam', 'Mpho', 'Cornel', 'Zodwa', 'Tiaan', 'Lerato', 'Willem', 'Nthabiseng', 'Riaan', 'Kelebogile', 'Morné'];
    const lastInitials = ['M.', 'v.d. Merwe', 'D.', 'S.', 'N.', 'L.', 'P.', 'K.', 'B.', 'J.', 'v. Wyk', 'T.', 'H.', 'N.', 'S.', 'W.', 'C.', 'R.', 'D.', 'P.', 'V.', 'A.', 'G.', 'F.', 'E.', 'U.', 'I.', 'O.', 'Y.', 'Z.'];
    const locations = ['Dundee', 'Newcastle', 'Glencoe', 'Vryheid', 'Ladysmith', 'Durban', 'Pietermaritzburg', 'Richards Bay', 'Empangeni', 'Ulundi', 'Johannesburg', 'Cape Town', 'Pretoria', 'Port Elizabeth', 'Bloemfontein', 'East London', 'Nelspruit', 'Polokwane', 'Rustenburg', 'Kimberley', 'George', 'Stanger', 'Eshowe', 'Greytown', 'Volksrust', 'Utrecht', 'Piet Retief', 'Standerton', 'Mpumalanga', 'Harrismith'];
    const products = ['BEEFY Classic Tee', 'BEEFY Hoodie', 'Flex Leggings', 'Dundee Beast Tank', 'Power Shorts', 'BEEFY Sports Bra', 'Gym Bag', 'Track Pants', 'BEEFY Stringer', 'Lifting Gloves', 'BEEFY Cap', 'BEEFY Shaker'];
    const usedNames = new Set();
    
    function generateUniqueName() {
        let name;
        let attempts = 0;
        do {
            const first = firstNames[Math.floor(Math.random() * firstNames.length)];
            const last = lastInitials[Math.floor(Math.random() * lastInitials.length)];
            name = first + ' ' + last;
            attempts++;
            if (attempts > 100) { usedNames.clear(); break; }
        } while (usedNames.has(name));
        usedNames.add(name);
        return name;
    }
    
    function showSocialProof() {
        const name = generateUniqueName();
        const product = products[Math.floor(Math.random() * products.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        socialProofName.textContent = name;
        socialProofProduct.textContent = product;
        socialProofLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${location}`;
        socialProof.classList.add('show');
        setTimeout(() => { socialProof.classList.remove('show'); }, 4500);
        setTimeout(showSocialProof, 10000 + Math.random() * 12000);
    }
    setTimeout(showSocialProof, 6000);

    // ========== LIVE VIEWERS & PURCHASES PULSE (FOMO) ==========
    const liveViewers = document.getElementById('liveViewers');
    const livePurchases = document.getElementById('livePurchases');
    const pulseTrend = document.getElementById('pulseTrend');
    let viewers = 12837;
    let purchases = 3371;
    
    function formatNumber(n) { return n.toLocaleString('en-ZA'); }
    
    function updateLiveStats() {
        const viewerChange = Math.floor(Math.random() * 15) - 6;
        viewers = Math.max(11500, Math.min(14200, viewers + viewerChange));
        liveViewers.textContent = formatNumber(viewers);
        if (viewerChange > 0) {
            liveViewers.classList.add('flash');
            setTimeout(() => liveViewers.classList.remove('flash'), 400);
        }
        if (Math.random() > 0.7) {
            purchases += 1;
            livePurchases.textContent = formatNumber(purchases);
            livePurchases.classList.add('flash');
            setTimeout(() => livePurchases.classList.remove('flash'), 400);
        }
        if (viewers > 12500) {
            pulseTrend.innerHTML = '<i class="fas fa-arrow-trend-up"></i> Trending';
            pulseTrend.style.color = '#4ade80';
        } else {
            pulseTrend.innerHTML = '<i class="fas fa-fire"></i> Hot';
            pulseTrend.style.color = '#c8102e';
        }
    }
    setInterval(updateLiveStats, 3000);

    // ========== KEYBOARD SHORTCUTS ==========
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { closeModal(); }
    });

    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

});
