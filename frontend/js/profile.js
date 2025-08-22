// Smart Canteen System JavaScript

class SmartCanteenApp {
    constructor() {
        this.currentPage = 'profile';
        this.userData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            studentId: 'STU12345',
            department: 'computer-science',
            dietary: []
        };
        this.cart = [];
        this.feedbackData = [];
        this.currentRating = 0;
        this.menuItems = [
            {
                id: 1,
                name: 'Classic Burger',
                description: 'Juicy beef patty with lettuce, tomato, and cheese',
                price: 8.99,
                category: 'lunch',
                emoji: '🍔'
            },
            {
                id: 2,
                name: 'Caesar Salad',
                description: 'Fresh romaine lettuce with parmesan and croutons',
                price: 6.99,
                category: 'lunch',
                emoji: '🥗'
            },
            {
                id: 3,
                name: 'Pancakes',
                description: 'Fluffy pancakes with maple syrup and butter',
                price: 5.99,
                category: 'breakfast',
                emoji: '🥞'
            },
            {
                id: 4,
                name: 'Coffee',
                description: 'Premium arabica coffee, freshly brewed',
                price: 2.99,
                category: 'beverages',
                emoji: '☕'
            },
            {
                id: 5,
                name: 'Chocolate Chip Cookies',
                description: 'Warm, gooey chocolate chip cookies',
                price: 3.99,
                category: 'snacks',
                emoji: '🍪'
            },
            {
                id: 6,
                name: 'Grilled Chicken',
                description: 'Tender grilled chicken breast with herbs',
                price: 12.99,
                category: 'lunch',
                emoji: '🍗'
            },
            {
                id: 7,
                name: 'French Toast',
                description: 'Golden french toast with cinnamon and sugar',
                price: 6.99,
                category: 'breakfast',
                emoji: '🍞'
            },
            {
                id: 8,
                name: 'Fresh Orange Juice',
                description: 'Freshly squeezed orange juice',
                price: 3.99,
                category: 'beverages',
                emoji: '🍊'
            }
        ];
        
        this.init();
    }

    init() {
        this.loadSavedData();
        this.bindEvents();
        this.updateUserDisplay();
        this.renderMenuItems();
        this.renderFeedbackList();
        this.showPage('profile');
    }

    bindEvents() {
        // Sidebar navigation
        const navButtons = document.querySelectorAll('.nav-button');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Profile form
        const profileForm = document.getElementById('profile-form');
        profileForm?.addEventListener('submit', (e) => this.handleProfileSave(e));

        const cancelProfileBtn = document.getElementById('cancel-profile-btn');
        cancelProfileBtn?.addEventListener('click', () => this.resetProfileForm());

        // Avatar change
        const changeAvatarBtn = document.getElementById('change-avatar-btn');
        changeAvatarBtn?.addEventListener('click', () => this.handleAvatarChange());

        // Order page events
        const foodSearch = document.getElementById('food-search');
        foodSearch?.addEventListener('input', (e) => this.handleSearch(e));

        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleCategoryFilter(e));
        });

        const checkoutBtn = document.getElementById('checkout-btn');
        checkoutBtn?.addEventListener('click', () => this.handleCheckout());

        // Feedback form
        const feedbackForm = document.getElementById('feedback-form');
        feedbackForm?.addEventListener('submit', (e) => this.handleFeedbackSubmit(e));

        const clearFeedbackBtn = document.getElementById('clear-feedback-btn');
        clearFeedbackBtn?.addEventListener('click', () => this.clearFeedbackForm());

        // Star rating
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.addEventListener('click', () => this.setRating(index + 1));
            star.addEventListener('mouseover', () => this.highlightStars(index + 1));
        });

        const starRating = document.getElementById('star-rating');
        starRating?.addEventListener('mouseleave', () => this.highlightStars(this.currentRating));

        // Feedback tabs
        const feedbackTabBtns = document.querySelectorAll('.feedback-tab-btn');
        feedbackTabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchFeedbackTab(e));
        });

        // Feedback filter
        const feedbackFilter = document.getElementById('feedback-filter');
        feedbackFilter?.addEventListener('change', (e) => this.filterFeedback(e));

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn?.addEventListener('click', () => this.handleLogout());

        // Mobile menu toggle (if needed)
        this.createMobileMenuToggle();
    }

    loadSavedData() {
        // Load user data
        const savedUserData = localStorage.getItem('canteenUserData');
        if (savedUserData) {
            this.userData = { ...this.userData, ...JSON.parse(savedUserData) };
        }

        // Load cart
        const savedCart = localStorage.getItem('canteenCart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            this.updateCartDisplay();
        }

        // Load feedback
        const savedFeedback = localStorage.getItem('canteenFeedback');
        if (savedFeedback) {
            this.feedbackData = JSON.parse(savedFeedback);
        }

        // Load avatar
        const savedAvatar = localStorage.getItem('canteenAvatar');
        if (savedAvatar) {
            const avatarElements = document.querySelectorAll('#profile-avatar, #sidebar-avatar');
            avatarElements.forEach(el => el.src = savedAvatar);
        }
    }

    saveData() {
        localStorage.setItem('canteenUserData', JSON.stringify(this.userData));
        localStorage.setItem('canteenCart', JSON.stringify(this.cart));
        localStorage.setItem('canteenFeedback', JSON.stringify(this.feedbackData));
    }

    handleNavigation(e) {
        const page = e.currentTarget.dataset.page;
        this.showPage(page);
        
        // Update active nav button
        document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
        e.currentTarget.classList.add('active');
    }

    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            setTimeout(() => {
                targetPage.classList.add('active');
            }, 100);
        }

        this.currentPage = pageId;

        // Update page-specific content
        if (pageId === 'order') {
            this.renderMenuItems();
        } else if (pageId === 'feedback') {
            this.renderFeedbackList();
        }
    }

    updateUserDisplay() {
        // Update sidebar user info
        const sidebarName = document.getElementById('sidebar-name');
        const sidebarEmail = document.getElementById('sidebar-email');
        
        if (sidebarName) sidebarName.textContent = `${this.userData.firstName} ${this.userData.lastName}`;
        if (sidebarEmail) sidebarEmail.textContent = this.userData.email;

        // Update profile form
        this.populateProfileForm();
    }

    populateProfileForm() {
        const fields = {
            'first-name': this.userData.firstName,
            'last-name': this.userData.lastName,
            'email': this.userData.email,
            'phone': this.userData.phone,
            'student-id': this.userData.studentId,
            'department': this.userData.department
        };

        Object.entries(fields).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.value = value || '';
        });

        // Update dietary preferences
        const dietaryCheckboxes = document.querySelectorAll('input[name="dietary"]');
        dietaryCheckboxes.forEach(checkbox => {
            checkbox.checked = this.userData.dietary.includes(checkbox.value);
        });
    }

    handleProfileSave(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(e.target);
        const dietary = [];
        
        // Collect dietary preferences
        document.querySelectorAll('input[name="dietary"]:checked').forEach(checkbox => {
            dietary.push(checkbox.value);
        });

        // Update user data
        this.userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            studentId: formData.get('studentId'),
            department: formData.get('department'),
            dietary: dietary
        };

        this.saveData();
        this.updateUserDisplay();
        this.showNotification('Profile updated successfully!', 'success');
    }

    resetProfileForm() {
        this.populateProfileForm();
        this.showNotification('Changes discarded', 'warning');
    }

    handleAvatarChange() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';

        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.processAvatarUpload(file);
            }
        });

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    }

    processAvatarUpload(file) {
        if (!file.type.startsWith('image/')) {
            this.showNotification('Please select a valid image file', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            this.showNotification('Image size should be less than 5MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const avatarUrl = e.target.result;
            const avatarElements = document.querySelectorAll('#profile-avatar, #sidebar-avatar');
            avatarElements.forEach(el => el.src = avatarUrl);
            
            localStorage.setItem('canteenAvatar', avatarUrl);
            this.showNotification('Avatar updated successfully!', 'success');
        };

        reader.readAsDataURL(file);
    }

    renderMenuItems(filter = 'all', searchTerm = '') {
        const menuGrid = document.getElementById('menu-grid');
        if (!menuGrid) return;

        let filteredItems = this.menuItems;

        // Apply category filter
        if (filter !== 'all') {
            filteredItems = filteredItems.filter(item => item.category === filter);
        }

        // Apply search filter
        if (searchTerm) {
            filteredItems = filteredItems.filter(item => 
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        menuGrid.innerHTML = '';

        if (filteredItems.length === 0) {
            menuGrid.innerHTML = '<div class="no-results">No items found matching your criteria.</div>';
            return;
        }

        filteredItems.forEach(item => {
            const menuItemEl = document.createElement('div');
            menuItemEl.className = 'menu-item';
            menuItemEl.innerHTML = `
                <div class="menu-item-image">${item.emoji}</div>
                <h3>${item.name}</h3>
                <p class="menu-item-description">${item.description}</p>
                <div class="menu-item-footer">
                    <span class="menu-item-price">$${item.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" onclick="canteenApp.addToCart(${item.id})">
                        Add to Cart
                    </button>
                </div>
            `;
            menuGrid.appendChild(menuItemEl);
        });
    }

    handleSearch(e) {
        const searchTerm = e.target.value;
        const activeFilter = document.querySelector('.filter-btn.active').dataset.category;
        this.renderMenuItems(activeFilter, searchTerm);
    }

    handleCategoryFilter(e) {
        const category = e.target.dataset.category;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Apply filter
        const searchTerm = document.getElementById('food-search')?.value || '';
        this.renderMenuItems(category, searchTerm);
    }

    addToCart(itemId) {
        const item = this.menuItems.find(i => i.id === itemId);
        if (!item) return;

        const existingItem = this.cart.find(i => i.id === itemId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...item, quantity: 1 });
        }

        this.updateCartDisplay();
        this.saveData();
        this.showNotification(`${item.name} added to cart!`, 'success');
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.updateCartDisplay();
        this.saveData();
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cart-items');
        const cartCount = document.getElementById('cart-count');
        const totalAmount = document.getElementById('total-amount');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (!cartItems) return;

        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Update cart count
        if (cartCount) cartCount.textContent = `${totalItems} items`;

        // Update total amount
        if (totalAmount) totalAmount.textContent = total.toFixed(2);

        // Update checkout button
        if (checkoutBtn) {
            checkoutBtn.disabled = totalItems === 0;
        }

        // Render cart items
        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            return;
        }

        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span class="cart-item-quantity">Quantity: ${item.quantity}</span>
                </div>
                <div class="cart-item-actions">
                    <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    <button onclick="canteenApp.removeFromCart(${item.id})" style="margin-left: 0.5rem; background: #ef4444; color: white; border: none; border-radius: 4px; padding: 0.25rem 0.5rem; cursor: pointer;">×</button>
                </div>
            </div>
        `).join('');
    }

    handleCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty', 'warning');
            return;
        }

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        if (confirm(`Place order for $${total.toFixed(2)}?`)) {
            // Simulate order processing
            this.cart = [];
            this.updateCartDisplay();
            this.saveData();
            this.showNotification('Order placed successfully! We\'ll prepare your food shortly.', 'success');
        }
    }

    setRating(rating) {
        this.currentRating = rating;
        this.highlightStars(rating);
        
        const ratingText = document.getElementById('rating-text');
        const ratingTexts = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
        if (ratingText) {
            ratingText.textContent = ratingTexts[rating - 1] || 'Click to rate';
        }
    }

    highlightStars(rating) {
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    handleFeedbackSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const feedbackType = formData.get('feedbackType');
        const message = formData.get('message');
        const isAnonymous = document.getElementById('anonymous-feedback').checked;

        if (!feedbackType || !message || this.currentRating === 0) {
            this.showNotification('Please fill in all required fields and provide a rating', 'error');
            return;
        }

        const feedback = {
            id: Date.now(),
            type: feedbackType,
            rating: this.currentRating,
            message: message,
            anonymous: isAnonymous,
            user: isAnonymous ? 'Anonymous' : `${this.userData.firstName} ${this.userData.lastName}`,
            date: new Date().toLocaleDateString(),
            timestamp: Date.now()
        };

        this.feedbackData.unshift(feedback);
        this.saveData();
        this.clearFeedbackForm();
        this.renderFeedbackList();
        this.showNotification('Feedback submitted successfully!', 'success');
    }

    clearFeedbackForm() {
        const form = document.getElementById('feedback-form');
        if (form) form.reset();
        
        this.currentRating = 0;
        this.highlightStars(0);
        
        const ratingText = document.getElementById('rating-text');
        if (ratingText) ratingText.textContent = 'Click to rate';
    }

    switchFeedbackTab(e) {
        const tab = e.target.dataset.tab;
        
        // Update tab buttons
        document.querySelectorAll('.feedback-tab-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Update tab content
        document.querySelectorAll('.feedback-tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tab}-feedback`).classList.add('active');

        if (tab === 'view') {
            this.renderFeedbackList();
        }
    }

    renderFeedbackList(filter = 'all') {
        const feedbackList = document.getElementById('feedback-list');
        if (!feedbackList) return;

        let filteredFeedback = [...this.feedbackData];

        // Apply filters
        switch (filter) {
            case 'my-feedback':
                const currentUser = `${this.userData.firstName} ${this.userData.lastName}`;
                filteredFeedback = filteredFeedback.filter(f => f.user === currentUser);
                break;
            case 'recent':
                const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
                filteredFeedback = filteredFeedback.filter(f => f.timestamp > weekAgo);
                break;
            case 'high-rated':
                filteredFeedback = filteredFeedback.filter(f => f.rating >= 4);
                break;
            case 'low-rated':
                filteredFeedback = filteredFeedback.filter(f => f.rating <= 2);
                break;
        }

        if (filteredFeedback.length === 0) {
            feedbackList.innerHTML = '<div class="no-feedback">No feedback found.</div>';
            return;
        }

        feedbackList.innerHTML = filteredFeedback.map(feedback => `
            <div class="feedback-item">
                <div class="feedback-header">
                    <div class="feedback-user">
                        <div class="feedback-avatar">
                            ${feedback.anonymous ? '?' : feedback.user.charAt(0).toUpperCase()}
                        </div>
                        <div class="feedback-user-info">
                            <h4>${feedback.user}</h4>
                            <span class="feedback-date">${feedback.date}</span>
                        </div>
                    </div>
                    <div class="feedback-rating">
                        ${'★'.repeat(feedback.rating)}${'☆'.repeat(5 - feedback.rating)}
                    </div>
                </div>
                <div class="feedback-type">${feedback.type.replace('-', ' ')}</div>
                <div class="feedback-message">${feedback.message}</div>
            </div>
        `).join('');
    }

    filterFeedback(e) {
        const filter = e.target.value;
        this.renderFeedbackList(filter);
    }

    // handleLogout() {
    //     if (confirm('Are you sure you want to logout?')) {
    //         // Clear all stored data
    //         localStorage.removeItem('canteenUserData');
    //         localStorage.removeItem('canteenCart');
    //         localStorage.removeItem('canteenFeedback');
    //         localStorage.removeItem('canteenAvatar');
           
    //         window.location.href = "Home.html";
    //     }
    // }

    // Open modal when clicking logout button


    createMobileMenuToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'mobile-menu-toggle';
        toggle.innerHTML = '☰';
        toggle.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.toggle('open');
        });
        document.body.appendChild(toggle);
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 24px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease',
            maxWidth: '400px',
            wordWrap: 'break-word'
        });

        // Set background color based on type
        const colors = {
            success: '#22c55e',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });

        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Add some sample feedback data for demonstration
    initializeSampleData() {
        if (this.feedbackData.length === 0) {
            const sampleFeedback = [
                {
                    id: 1,
                    type: 'food-quality',
                    rating: 5,
                    message: 'The burger was absolutely delicious! Perfect cooking and fresh ingredients.',
                    anonymous: false,
                    user: 'Alice Johnson',
                    date: new Date(Date.now() - 86400000).toLocaleDateString(),
                    timestamp: Date.now() - 86400000
                },
                {
                    id: 2,
                    type: 'service',
                    rating: 4,
                    message: 'Quick service and friendly staff. Could improve the ordering system a bit.',
                    anonymous: false,
                    user: 'Bob Smith',
                    date: new Date(Date.now() - 172800000).toLocaleDateString(),
                    timestamp: Date.now() - 172800000
                },
                {
                    id: 3,
                    type: 'cleanliness',
                    rating: 5,
                    message: 'Very clean dining area and kitchen. Great hygiene standards!',
                    anonymous: true,
                    user: 'Anonymous',
                    date: new Date(Date.now() - 259200000).toLocaleDateString(),
                    timestamp: Date.now() - 259200000
                },
                {
                    id: 4,
                    type: 'suggestion',
                    rating: 4,
                    message: 'Please add more vegan options to the menu. The current selection is limited.',
                    anonymous: false,
                    user: 'Carol Davis',
                    date: new Date(Date.now() - 345600000).toLocaleDateString(),
                    timestamp: Date.now() - 345600000
                }
            ];
            this.feedbackData = sampleFeedback;
            this.saveData();
        }
    }

    // Handle keyboard shortcuts
    handleKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        document.querySelector('[data-page="profile"]').click();
                        break;
                    case '2':
                        e.preventDefault();
                        document.querySelector('[data-page="order"]').click();
                        break;
                    case '3':
                        e.preventDefault();
                        document.querySelector('[data-page="feedback"]').click();
                        break;
                }
            }

            // Escape key to clear search
            if (e.key === 'Escape') {
                const searchInput = document.getElementById('food-search');
                if (searchInput && searchInput === document.activeElement) {
                    searchInput.value = '';
                    this.handleSearch({ target: searchInput });
                }
            }
        });
    }

    // Initialize online/offline status
    initializeNetworkStatus() {
        const updateNetworkStatus = () => {
            if (navigator.onLine) {
                this.showNotification('You are back online!', 'success');
            } else {
                this.showNotification('You are offline. Some features may be limited.', 'warning');
            }
        };

        window.addEventListener('online', updateNetworkStatus);
        window.addEventListener('offline', updateNetworkStatus);
    }

    // Auto-save functionality for forms
    setupAutoSave() {
        const autoSaveFields = ['first-name', 'last-name', 'email', 'phone'];
        
        autoSaveFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', debounce(() => {
                    const formData = new FormData(document.getElementById('profile-form'));
                    console.log('Auto-saving profile data...');
                    // Auto-save could be implemented here
                }, 2000));
            }
        });
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global instance
    window.canteenApp = new SmartCanteenApp();
    
    // Initialize additional features
    canteenApp.initializeSampleData();
    canteenApp.handleKeyboardShortcuts();
    canteenApp.initializeNetworkStatus();
    canteenApp.setupAutoSave();
    
    // Add loading animation for cards
    const animateCards = () => {
        const cards = document.querySelectorAll('.menu-item, .feedback-item, .form-group');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    };

    // Run card animation after a short delay
    setTimeout(animateCards, 500);
    
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('App is now in background');
    } else {
        console.log('App is now in foreground');
        // Could refresh data here
    }
});

// Handle beforeunload for unsaved changes
window.addEventListener('beforeunload', (e) => {
    // Check if there are unsaved changes
    const form = document.getElementById('profile-form');
    if (form && form.checkValidity && !form.checkValidity()) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    }
});