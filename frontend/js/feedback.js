// Enhanced Feedback Form JavaScript
class FeedbackForm {
    constructor() {
        this.initializeForm();
        this.bindEvents();
        this.updateProgress();
    }

    initializeForm() {
        // Add loading states and enhanced animations
        this.addLoadingStates();
        this.addHoverEffects();
        this.initializeTooltips();
    }

    bindEvents() {
        // Section toggling
        document.querySelectorAll('.section-header').forEach(header => {
            header.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleSection(e.currentTarget);
            });
        });

        // Star rating functionality
        document.querySelectorAll('.star-rating').forEach(rating => {
            this.initializeStarRating(rating);
        });

        // Emoji slider functionality
        document.querySelectorAll('.emoji-slider').forEach(slider => {
            this.initializeEmojiSlider(slider);
        });

        // File upload
        const fileUpload = document.getElementById('photo-upload');
        if (fileUpload) {
            fileUpload.addEventListener('change', (e) => this.handleFileUpload(e));
        }

        // Form submission
        const form = document.getElementById('feedbackForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmission(e));
        }

        // Reset button
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetForm());
        }

        // Close modal button
        const closeModalBtn = document.getElementById('closeModalBtn');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.closeModal());
        }

        // Modal close events
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('thankYouModal');
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Auto-save functionality
        this.initializeAutoSave();
    }

    toggleSection(header) {
        const section = header.parentElement;
        const content = section.querySelector('.section-content');
        const arrow = header.querySelector('span');
        
        // Add smooth animation
        if (section.classList.contains('active')) {
            section.classList.remove('active');
            arrow.textContent = '▼';
            arrow.style.transform = 'rotate(0deg)';
        } else {
            section.classList.add('active');
            arrow.textContent = '▲';
            arrow.style.transform = 'rotate(180deg)';
        }
        
        this.updateProgress();
        this.saveFormState();
        
        // Debug log to ensure function is being called
        console.log('Section toggled:', section.classList.contains('active') ? 'opened' : 'closed');
    }

    initializeStarRating(rating) {
        const stars = rating.querySelectorAll('.star');
        const ratingName = rating.dataset.rating;
        
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                this.setStarRating(rating, index + 1);
                this.showRatingFeedback(ratingName, index + 1);
            });

            // Hover effects
            star.addEventListener('mouseenter', () => {
                this.highlightStars(stars, index);
            });

            star.addEventListener('mouseleave', () => {
                this.resetStarHighlight(stars);
            });
        });
    }

    setStarRating(rating, value) {
        const stars = rating.querySelectorAll('.star');
        
        // Remove active class from all stars
        stars.forEach(s => s.classList.remove('active'));
        
        // Add active class to clicked star and all previous stars
        for (let i = 0; i < value; i++) {
            stars[i].classList.add('active');
        }

        // Add animation
        stars.forEach((star, index) => {
            if (index < value) {
                star.style.animation = `starPop 0.3s ease ${index * 0.1}s`;
            }
        });

        this.saveFormState();
    }

    highlightStars(stars, index) {
        stars.forEach((star, i) => {
            if (i <= index) {
                star.style.color = '#fbbf24';
                star.style.transform = 'scale(1.1)';
            }
        });
    }

    resetStarHighlight(stars) {
        stars.forEach(star => {
            if (!star.classList.contains('active')) {
                star.style.color = '#e2e8f0';
                star.style.transform = 'scale(1)';
            }
        });
    }

    showRatingFeedback(ratingName, value) {
        const feedbackMessages = {
            'food-quality': ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
            'cleanliness': ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
            'staff-behavior': ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
            'service-speed': ['Very Slow', 'Slow', 'Average', 'Fast', 'Very Fast'],
            'overall': ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
        };

        const message = feedbackMessages[ratingName]?.[value - 1];
        if (message) {
            this.showToast(`${ratingName.replace('-', ' ').toUpperCase()}: ${message}`, 'success');
        }
    }

    initializeEmojiSlider(slider) {
        const options = slider.querySelectorAll('.emoji-option');
        const ratingName = slider.dataset.rating;
        
        options.forEach(option => {
            option.addEventListener('click', () => {
                this.setEmojiRating(slider, option);
                this.showEmojiFeedback(ratingName, option.dataset.value);
            });

            // Hover effects
            option.addEventListener('mouseenter', () => {
                option.style.transform = 'scale(1.2)';
            });

            option.addEventListener('mouseleave', () => {
                if (!option.classList.contains('selected')) {
                    option.style.transform = 'scale(1)';
                }
            });
        });
    }

    setEmojiRating(slider, selectedOption) {
        const options = slider.querySelectorAll('.emoji-option');
        
        // Remove selected class from all options
        options.forEach(o => o.classList.remove('selected'));
        
        // Add selected class to clicked option
        selectedOption.classList.add('selected');
        selectedOption.style.transform = 'scale(1.2)';

        // Add bounce animation
        selectedOption.style.animation = 'emojiBounce 0.5s ease';

        this.saveFormState();
    }

    showEmojiFeedback(ratingName, value) {
        const feedbackMessages = {
            'seating': ['No seats available', 'Limited seating', 'Some seats available', 'Good seating', 'Plenty of seating'],
            'ambience': ['Unpleasant', 'Basic', 'Nice', 'Very pleasant', 'Excellent atmosphere']
        };

        const message = feedbackMessages[ratingName]?.[value - 1];
        if (message) {
            this.showToast(`${ratingName.toUpperCase()}: ${message}`, 'info');
        }
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                this.showToast('File size must be less than 5MB', 'error');
                event.target.value = '';
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                this.showToast('Please select an image file', 'error');
                event.target.value = '';
                return;
            }

            const uploadDiv = event.target.parentElement;
            uploadDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 2rem;">📷</span>
                    <div>
                        <p style="margin: 0; font-weight: 600; color: #2d3748;">${file.name}</p>
                        <small style="color: #718096;">${(file.size / 1024 / 1024).toFixed(2)} MB</small>
                    </div>
                </div>
                <small style="color: #48bb78; margin-top: 8px; display: block;">✓ File selected successfully</small>
            `;

            this.showToast('Photo uploaded successfully!', 'success');
        }
    }

    handleFormSubmission(event) {
        event.preventDefault();
        
        const submitBtn = event.target.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Submitting...';

        // Simulate form processing
        setTimeout(() => {
            const formData = this.collectFormData();
            console.log('Form Data:', formData);
            
            // Show success modal
            this.showThankYouModal();
            
            // Reset button
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Submit Feedback';
        }, 2000);
    }

    collectFormData() {
        const formData = {
            name: document.getElementById('name')?.value || '',
            contact: document.getElementById('contact')?.value || '',
            role: document.getElementById('role')?.value || '',
            ratings: {},
            favoriteDish: document.getElementById('favorite-dish')?.value || '',
            leastFavoriteDish: document.getElementById('least-favorite-dish')?.value || '',
            suggestions: document.getElementById('suggestions')?.value || '',
            issueType: document.getElementById('issue-type')?.value || '',
            issueDescription: document.getElementById('issue-description')?.value || '',
            generalSuggestions: document.getElementById('general-suggestions')?.value || '',
            timestamp: new Date().toISOString()
        };

        // Collect star ratings
        document.querySelectorAll('.star-rating').forEach(rating => {
            const ratingName = rating.dataset.rating;
            const activeStars = rating.querySelectorAll('.star.active');
            formData.ratings[ratingName] = activeStars.length;
        });

        // Collect emoji ratings
        document.querySelectorAll('.emoji-slider').forEach(slider => {
            const ratingName = slider.dataset.rating;
            const selectedOption = slider.querySelector('.emoji-option.selected');
            formData.ratings[ratingName] = selectedOption ? selectedOption.dataset.value : null;
        });

        // Collect hygiene checkboxes
        const hygieneItems = [];
        document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            hygieneItems.push(checkbox.value);
        });
        formData.hygiene = hygieneItems;

        return formData;
    }

    showThankYouModal() {
        const modal = document.getElementById('thankYouModal');
        modal.style.display = 'block';
        
        // Add confetti effect
        this.createConfetti();
    }

    closeModal() {
        const modal = document.getElementById('thankYouModal');
        modal.style.display = 'none';
        this.resetForm();
    }

    resetForm() {
        const form = document.getElementById('feedbackForm');
        form.reset();
        
        // Reset star ratings
        document.querySelectorAll('.star').forEach(star => {
            star.classList.remove('active');
            star.style.animation = '';
        });
        
        // Reset emoji sliders
        document.querySelectorAll('.emoji-option').forEach(option => {
            option.classList.remove('selected');
            option.style.animation = '';
            option.style.transform = 'scale(1)';
        });
        
        // Reset file upload
        const fileUpload = document.getElementById('photo-upload');
        if (fileUpload) {
            fileUpload.parentElement.innerHTML = `
                <p>📷 Click to upload a photo</p>
                <small>Max size: 5MB</small>
            `;
        }
        
        // Reset sections
        document.querySelectorAll('.section').forEach((section, index) => {
            if (index === 0) {
                section.classList.add('active');
                section.querySelector('span').textContent = '▲';
            } else {
                section.classList.remove('active');
                section.querySelector('span').textContent = '▼';
            }
        });
        
        this.updateProgress();
        this.clearFormState();
        this.showToast('Form reset successfully!', 'info');
    }

    updateProgress() {
        const sections = document.querySelectorAll('.section');
        const activeSections = document.querySelectorAll('.section.active');
        const progress = (activeSections.length / sections.length) * 100;
        
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
    }

    // Enhanced UI Features
    addLoadingStates() {
        // Add loading animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes starPop {
                0% { transform: scale(1); }
                50% { transform: scale(1.3); }
                100% { transform: scale(1.1); }
            }
            
            @keyframes emojiBounce {
                0% { transform: scale(1); }
                50% { transform: scale(1.4); }
                100% { transform: scale(1.2); }
            }
            
            @keyframes confetti {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    addHoverEffects() {
        // Add hover effects to form controls
        document.querySelectorAll('.form-control').forEach(control => {
            control.addEventListener('focus', () => {
                control.parentElement.style.transform = 'translateY(-2px)';
            });
            
            control.addEventListener('blur', () => {
                control.parentElement.style.transform = 'translateY(0)';
            });
        });
    }

    initializeTooltips() {
        // Add tooltips to rating items
        document.querySelectorAll('.rating-item').forEach(item => {
            const label = item.querySelector('.rating-label span:last-child');
            if (label) {
                label.title = `Rate your experience with ${label.textContent.toLowerCase()}`;
            }
        });
    }

    showToast(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        
        // Add toast styles
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    animation: slideIn 0.3s ease;
                    font-family: 'Inter', sans-serif;
                    font-weight: 500;
                }
                
                .toast-success { border-left: 4px solid #48bb78; }
                .toast-error { border-left: 4px solid #f56565; }
                .toast-info { border-left: 4px solid #4299e1; }
                
                .toast button {
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    color: #718096;
                }
                
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 3000);
    }

    createConfetti() {
        const colors = ['#667eea', '#764ba2', '#f59e0b', '#10b981', '#ef4444'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                top: -10px;
                left: ${Math.random() * 100}vw;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                animation: confetti ${Math.random() * 3 + 2}s linear forwards;
            `;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 5000);
        }
    }

    // Auto-save functionality
    initializeAutoSave() {
        const form = document.getElementById('feedbackForm');
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.saveFormState();
            });
        });

        // Load saved state on page load
        this.loadFormState();
    }

    saveFormState() {
        const formData = this.collectFormData();
        localStorage.setItem('feedbackFormState', JSON.stringify(formData));
    }

    loadFormState() {
        const savedState = localStorage.getItem('feedbackFormState');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                this.restoreFormState(state);
            } catch (error) {
                console.error('Error loading form state:', error);
            }
        }
    }

    restoreFormState(state) {
        // Restore form fields
        if (state.name) document.getElementById('name').value = state.name;
        if (state.contact) document.getElementById('contact').value = state.contact;
        if (state.role) document.getElementById('role').value = state.role;
        if (state.favoriteDish) document.getElementById('favorite-dish').value = state.favoriteDish;
        if (state.leastFavoriteDish) document.getElementById('least-favorite-dish').value = state.leastFavoriteDish;
        if (state.suggestions) document.getElementById('suggestions').value = state.suggestions;
        if (state.issueType) document.getElementById('issue-type').value = state.issueType;
        if (state.issueDescription) document.getElementById('issue-description').value = state.issueDescription;
        if (state.generalSuggestions) document.getElementById('general-suggestions').value = state.generalSuggestions;

        // Restore ratings
        if (state.ratings) {
            Object.entries(state.ratings).forEach(([ratingName, value]) => {
                if (value) {
                    const rating = document.querySelector(`[data-rating="${ratingName}"]`);
                    if (rating) {
                        if (rating.classList.contains('star-rating')) {
                            this.setStarRating(rating, value);
                        } else if (rating.classList.contains('emoji-slider')) {
                            const option = rating.querySelector(`[data-value="${value}"]`);
                            if (option) {
                                this.setEmojiRating(rating, option);
                            }
                        }
                    }
                }
            });
        }

        // Restore checkboxes
        if (state.hygiene) {
            state.hygiene.forEach(item => {
                const checkbox = document.querySelector(`input[value="${item}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }
    }

    clearFormState() {
        localStorage.removeItem('feedbackFormState');
    }
}

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FeedbackForm();
});

// All functionality is now handled by the FeedbackForm class 