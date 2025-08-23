$(document).ready(function() {
    // Mobile Navigation Toggle
    $('.hamburger').click(function() {
        $('.hamburger').toggleClass('active');
        $('.nav-menu').toggleClass('active');
    });

    // Close mobile menu when clicking on a link
    $('.nav-link').click(function() {
        $('.hamburger').removeClass('active');
        $('.nav-menu').removeClass('active');
    });

    // Close mobile menu when clicking outside
    $(document).click(function(e) {
        if (!$(e.target).closest('.navbar').length) {
            $('.hamburger').removeClass('active');
            $('.nav-menu').removeClass('active');
        }
    });

    // Sample product data for canteen management system
    const products = [
        {
            id: 1,
            name: "Chicken Biryani",
            price: 450,
            description: "Aromatic basmati rice cooked with tender chicken pieces, aromatic spices, and herbs. Served with raita and pickle.",
            category: "lunch",
            image: "https://i.pinimg.com/1200x/1a/59/f0/1a59f0e988c227075ce7a6e261f9f362.jpg",
            sku: "BIR001",
            tags: "Rice, Chicken, Spicy",
            features: ["Fresh ingredients", "Made to order", "Serves 1 person", "Includes raita"]
        },
        {
            id: 2,
            name: "Masala Dosa",
            price: 180,
            description: "Crispy rice and lentil crepe filled with spiced potato mixture. Served with coconut chutney and sambar.",
            category: "breakfast",
            image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop",
            sku: "DOS002",
            tags: "Breakfast, Vegetarian, South Indian",
            features: ["Crispy texture", "Fresh coconut chutney", "Hot sambar", "Vegetarian"]
        },
        {
            id: 3,
            name: "Butter Chicken",
            price: 380,
            description: "Tender chicken pieces in rich, creamy tomato-based gravy with butter and cream. Served with naan bread.",
            category: "dinner",
            image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
            sku: "BUT003",
            tags: "Chicken, Creamy, Popular",
            features: ["Rich gravy", "Tender chicken", "Includes naan", "Mild spice"]
        },
        {
            id: 4,
            name: "Samosa",
            price: 25,
            description: "Crispy pastry filled with spiced potatoes, peas, and aromatic spices. Perfect snack with tea.",
            category: "snacks",
            image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
            sku: "SAM004",
            tags: "Snacks, Vegetarian, Tea Time",
            features: ["Crispy pastry", "Spiced filling", "Perfect with tea", "Vegetarian"]
        },
        {
            id: 5,
            name: "Masala Chai",
            price: 35,
            description: "Traditional Indian tea brewed with aromatic spices like cardamom, ginger, and cinnamon.",
            category: "beverages",
            image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop",
            sku: "CHAI005",
            tags: "Beverages, Hot, Traditional",
            features: ["Aromatic spices", "Freshly brewed", "Perfect temperature", "Traditional recipe"]
        },
        {
            id: 6,
            name: "Paneer Tikka",
            price: 280,
            description: "Marinated cottage cheese cubes grilled to perfection with aromatic spices and served with mint chutney.",
            category: "snacks",
            image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
            sku: "PAN006",
            tags: "Vegetarian, Grilled, Appetizer",
            features: ["Grilled to perfection", "Fresh paneer", "Mint chutney", "Vegetarian"]
        },
        {
            id: 7,
            name: "Dal Khichdi",
            price: 220,
            description: "Comforting one-pot meal of rice and lentils cooked with mild spices. Served with ghee and pickle.",
            category: "lunch",
            image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
            sku: "KHI007",
            tags: "Comfort Food, Vegetarian, Healthy",
            features: ["One-pot meal", "Easy to digest", "Includes ghee", "Healthy option"]
        },
        {
            id: 8,
            name: "Gulab Jamun",
            price: 45,
            description: "Soft, spongy milk solids dumplings soaked in sugar syrup. A classic Indian dessert.",
            category: "snacks",
            image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=300&fit=crop",
            sku: "GUL008",
            tags: "Dessert, Sweet, Traditional",
            features: ["Soft texture", "Sugar syrup", "Classic dessert", "2 pieces"]
        }
    ];

    let currentProduct = null;

    // Initialize the application
    function init() {
        loadProducts();
        setupEventListeners();
    }

    // Load products into the grid
    function loadProducts(filteredProducts = products) {
        const productGrid = $('#productGrid');
        productGrid.empty();

        filteredProducts.forEach(product => {
            const productCard = `
                <div class="product-card" data-product-id="${product.id}">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <div class="product-price">Rs ${product.price}</div>
                        <p class="product-description">${product.description}</p>
                        <div class="product-meta">
                            <span class="product-category">${product.category}</span>
                            <span>SKU: ${product.sku}</span>
                        </div>
                    </div>
                </div>
            `;
            productGrid.append(productCard);
        });
    }

    // Setup event listeners
    function setupEventListeners() {
        // Product card click
        $(document).on('click', '.product-card', function() {
            const productId = $(this).data('product-id');
            const product = products.find(p => p.id === productId);
            if (product) {
                openProductModal(product);
            }
        });

        // Close modal
        $('#closeModal').click(closeProductModal);
        $(window).click(function(e) {
            if ($(e.target).hasClass('modal')) {
                closeProductModal();
            }
        });

        // Quantity controls
        $('#decreaseQty').click(decreaseQuantity);
        $('#increaseQty').click(increaseQuantity);

        // Buy now
        $('#buyNowBtn').click(buyNow);

        // Filter functionality
        $('.filter-option input[type="checkbox"]').change(filterProducts);
        $('#priceRange').on('input', filterProducts);

        // Thumbnail clicks
        $('.thumbnail').click(function() {
            $('.thumbnail').removeClass('active');
            $(this).addClass('active');
            $('#modalImage').attr('src', $(this).attr('src'));
        });
    }

    // Open product modal
    function openProductModal(product) {
        currentProduct = product;
        
        $('#modalImage').attr('src', product.image);
        $('#modalTitle').text(product.name);
        $('#modalPrice').text(`Rs ${product.price}`);
        $('#modalDescription').text(product.description);
        $('#modalSku').text(product.sku);
        $('#modalCategory').text(product.category);
        $('#modalTags').text(product.tags);
        
        // Update features
        const featuresList = $('#modalFeatures');
        featuresList.empty();
        product.features.forEach(feature => {
            featuresList.append(`<li>${feature}</li>`);
        });

        // Reset quantity and size
        $('#quantity').text('1');
        $('#sizeSelect').val('');

        // Show/hide portion size section based on category
        const portionSection = $('.option-group').first();
        if (product.category === 'breakfast' || product.category === 'lunch' || product.category === 'dinner') {
            portionSection.show();
            // Update portion size options
            $('#sizeSelect').html(`
                <option value="">Choose an option</option>
                <option value="half">Half Portion</option>
                <option value="full">Full Portion</option>
            `);
        } else {
            portionSection.hide();
            $('#sizeSelect').val('standard');
        }

        $('#productModal').show();
        $('body').addClass('modal-open');
    }

    // Close product modal
    function closeProductModal() {
        $('#productModal').hide();
        $('body').removeClass('modal-open');
        currentProduct = null;
    }

    // Quantity controls
    function decreaseQuantity() {
        let qty = parseInt($('#quantity').text());
        if (qty > 1) {
            $('#quantity').text(qty - 1);
        }
    }

    function increaseQuantity() {
        let qty = parseInt($('#quantity').text());
        $('#quantity').text(qty + 1);
    }

    // Buy now function
    function buyNow() {
        if (!currentProduct) return;

        const size = $('#sizeSelect').val();
        const quantity = parseInt($('#quantity').text());

        // Check if portion size is required (for breakfast, lunch, dinner)
        if ((currentProduct.category === 'breakfast' || currentProduct.category === 'lunch' || currentProduct.category === 'dinner') && !size) {
            alert('Please select a portion size');
            return;
        }

        const orderItem = {
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            image: currentProduct.image,
            size: size || 'standard',
            quantity: quantity
        };

        // Redirect to checkout page with order data
        const orderData = encodeURIComponent(JSON.stringify({ item: orderItem }));
        window.location.href = `checkout.html?order=${orderData}`;
    }

    // Filter products
    function filterProducts() {
        const selectedCategories = $('.filter-option input[type="checkbox"]:checked').map(function() {
            return $(this).val();
        }).get();

        const maxPrice = parseInt($('#priceRange').val());

        const filteredProducts = products.filter(product => {
            const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
            const priceMatch = product.price <= maxPrice;
            return categoryMatch && priceMatch;
        });

        loadProducts(filteredProducts);
    }

    // Show notification
    function showNotification(message) {
        const notification = $(`
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #27ae60;
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                z-index: 3000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            ">
                ${message}
            </div>
        `);
        
        $('body').append(notification);
        
        setTimeout(() => {
            notification.fadeOut(() => {
                notification.remove();
            });
        }, 3000);
    }

    // Initialize the application
    init();
});
