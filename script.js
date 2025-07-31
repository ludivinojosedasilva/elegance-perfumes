// public/script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Seletores de Elementos ---
    const productList = document.getElementById('product-list');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const loadMoreContainer = document.getElementById('load-more-container');
    const contactForm = document.getElementById('contact-form');
    
    // Elementos do Carrinho
    const cartButton = document.getElementById('cart-button');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const modalOverlay = document.getElementById('modal-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const cartBadge = document.getElementById('cart-badge');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Elementos do Checkout
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutBtn = document.getElementById('close-checkout-btn');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutTotalEl = document.getElementById('checkout-total');
    const checkoutSummaryEl = document.getElementById('checkout-summary');
    const checkoutView = document.getElementById('checkout-view');

    // --- Estado da Aplicação ---
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let currentOffset = 0;
    const productsPerLoad = 3;

    // --- Funções do Carrinho ---

    const openCart = () => {
        cartModal.classList.add('open');
        modalOverlay.classList.add('open');
    };

    const closeCart = () => {
        cartModal.classList.remove('open');
        if (!checkoutModal.classList.contains('open')) {
            modalOverlay.classList.remove('open');
        }
    };

    const updateCart = () => {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let itemCount = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center text-gray-500">Seu carrinho está vazio.</p>';
        } else {
            cart.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'flex justify-between items-center mb-4';
                itemEl.innerHTML = `
                    <div class="flex items-center">
                        <img src="${item.imageUrl}" alt="${item.name}" class="w-12 h-16 object-cover rounded-md mr-4">
                        <div>
                            <h4 class="font-bold">${item.name}</h4>
                            <p class="text-sm text-gray-600">Qtd: ${item.quantity}</p>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <span class="font-semibold w-24 text-right">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                        <button class="remove-from-cart-btn" data-id="${item.id}">×</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemEl);
                total += item.price * item.quantity;
            });
        }
        
        cart.forEach(item => itemCount += item.quantity);
        cartTotalEl.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
        
        if (itemCount > 0) {
            cartBadge.innerText = itemCount;
            cartBadge.classList.remove('hidden');
        } else {
            cartBadge.classList.add('hidden');
        }
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
        openCart();
    };

    const removeFromCart = (productId) => {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    };
    
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.matches('.remove-from-cart-btn')) {
            const id = parseInt(e.target.dataset.id, 10);
            removeFromCart(id);
        }
    });

    // --- Funções de Checkout ---

    const openCheckout = () => {
        if (cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        closeCart();
        checkoutModal.classList.add('open');
        modalOverlay.classList.add('open');

        let total = 0;
        checkoutSummaryEl.innerHTML = '';
        cart.forEach(item => {
            checkoutSummaryEl.innerHTML += `<p>${item.quantity}x ${item.name}</p>`;
            total += item.price * item.quantity;
        });
        checkoutTotalEl.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    };

    const closeCheckout = () => {
        checkoutModal.classList.remove('open');
        modalOverlay.classList.remove('open');
    };
    
    const processOrder = (e) => {
        e.preventDefault();
        checkoutView.innerHTML = `
            <div class="text-center p-8">
                <h3 class="text-2xl font-bold text-green-600 mb-4">Obrigado!</h3>
                <p>Seu pedido foi realizado com sucesso e em breve será enviado.</p>
            </div>
        `;
        cart = [];
        updateCart();
        setTimeout(() => {
            closeCheckout();
            const originalFormHTML = `
                <form id="checkout-form">
                    <div class="space-y-4">
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700">Nome Completo</label>
                            <input type="text" id="checkout-name" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        </div>
                        <div>
                            <label for="address" class="block text-sm font-medium text-gray-700">Endereço de Entrega</label>
                            <input type="text" id="checkout-address" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" required>
                        </div>
                        <div class="border-t pt-4">
                            <h4 class="font-semibold mb-2">Resumo do Pedido</h4>
                            <div id="checkout-summary" class="text-sm text-gray-600"></div>
                            <div class="flex justify-between items-center mt-2 font-bold text-lg">
                                <span>Total</span>
                                <span id="checkout-total">R$ 0,00</span>
                            </div>
                        </div>
                    </div>
                    <div class="mt-6">
                        <button type="submit" class="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-md transition duration-300">
                            Pagar Agora
                        </button>
                    </div>
                </form>
            `;
            checkoutView.innerHTML = originalFormHTML;
            document.getElementById('checkout-form').addEventListener('submit', processOrder);
        }, 3000);
    };

    checkoutForm.addEventListener('submit', processOrder);

    // --- Funções de Produtos ---

    const displayProducts = (products) => {
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'perfume-card bg-white rounded-lg overflow-hidden shadow-md';
            productCard.innerHTML = `
                <div class="image-hover overflow-hidden">
                    <img src="${product.imageUrl}" alt="${product.name}" class="w-full h-96 object-cover" />
                </div>
                <div class="p-6">
                    <h3 class="font-bold text-xl mb-2">${product.name}</h3>
                    <p class="text-gray-700 text-sm mb-4 h-12">${product.description}</p>
                    <div class="flex justify-between items-center mt-4">
                        <span class="font-bold text-lg">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                        <button class="add-to-cart-btn bg-gray-900 hover:bg-gray-700 text-white text-sm py-2 px-4 rounded-full">
                            Adicionar
                        </button>
                    </div>
                </div>
            `;
            productCard.querySelector('.add-to-cart-btn').addEventListener('click', () => addToCart(product));
            productList.appendChild(productCard);
        });
    };

    const fetchProducts = async (offset = 0) => {
        try {
            const response = await fetch(`/api/products?limit=${productsPerLoad}&offset=${offset}`);
            if (!response.ok) throw new Error('Não foi possível carregar os produtos. Verifique o servidor.');
            
            const data = await response.json();
            displayProducts(data.products);
            
            const totalLoaded = offset + data.products.length;
            if (totalLoaded >= data.total) {
                loadMoreContainer.style.display = 'none';
            }
        } catch (error) {
            productList.innerHTML = `<p class="text-center text-red-500 col-span-3">${error.message}</p>`;
        }
    };
    
    // --- Event Listeners ---
    loadMoreBtn.addEventListener('click', () => {
        currentOffset += productsPerLoad;
        fetchProducts(currentOffset);
    });

    cartButton.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    modalOverlay.addEventListener('click', () => {
        closeCart();
        closeCheckout();
    });
    checkoutBtn.addEventListener('click', openCheckout);
    closeCheckoutBtn.addEventListener('click', closeCheckout);

    // --- Inicialização ---
    fetchProducts(currentOffset);
    updateCart();
});