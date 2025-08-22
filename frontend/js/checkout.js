$(document).ready(function() {
    // Get order details from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const orderData = JSON.parse(decodeURIComponent(urlParams.get('order') || '{}'));
    
    let currentOrder = null;
    
    // Initialize checkout
    function init() {
        if (orderData && orderData.item) {
            currentOrder = orderData;
            displayOrderSummary();
            setupEventListeners();
        } else {
            // Redirect to main page if no order data
            window.location.href = 'index.html';
        }
    }
    
    // Display order summary
    function displayOrderSummary() {
        const orderDetails = $('#orderDetails');
        const item = currentOrder.item;
        
        const orderItem = `
            <div class="order-item">
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-details">
                        ${item.size !== 'standard' ? `Size: ${item.size}` : ''} | Qty: ${item.quantity}
                    </div>
                </div>
                <div class="item-price">Rs ${item.price * item.quantity}</div>
            </div>
        `;
        
        orderDetails.html(orderItem);
        
        // Calculate totals
        const subtotal = item.price * item.quantity;
        const deliveryFee = subtotal >= 500 ? 0 : 50;
        const total = subtotal + deliveryFee;
        
        $('#subtotal').text(`Rs ${subtotal}`);
        $('#deliveryFee').text(`Rs ${deliveryFee}`);
        $('#finalTotal').text(`Rs ${total}`);
        
        // Update current order with totals
        currentOrder.subtotal = subtotal;
        currentOrder.deliveryFee = deliveryFee;
        currentOrder.total = total;
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Card number formatting and validation
        $('#cardNumber').on('input', function() {
            formatCardNumber(this);
            validateCardNumber();
            updateCardIcons();
        });
        
        // Cardholder name validation
        $('#cardHolder').on('input', function() {
            validateCardHolder();
        });
        
        // Expiry date formatting and validation
        $('#expiryDate').on('input', function() {
            formatExpiryDate(this);
            validateExpiryDate();
        });
        
        // CVV validation
        $('#cvv').on('input', function() {
            validateCVV();
        });
        

        
        // Form submission
        $('#paymentForm').on('submit', function(e) {
            e.preventDefault();
            processPayment();
        });
    }
    
    // Format card number with spaces
    function formatCardNumber(input) {
        let value = input.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = '';
        
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        input.value = formattedValue;
    }
    
    // Validate card number (Luhn algorithm)
    function validateCardNumber() {
        const cardNumber = $('#cardNumber').val().replace(/\s/g, '');
        const errorElement = $('#cardNumberError');
        
        if (!cardNumber) {
            errorElement.text('Card number is required');
            return false;
        }
        
        if (cardNumber.length < 13 || cardNumber.length > 19) {
            errorElement.text('Card number must be 13-19 digits');
            return false;
        }
        
        // Luhn algorithm validation
        let sum = 0;
        let isEven = false;
        
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber[i]);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        if (sum % 10 !== 0) {
            errorElement.text('Invalid card number');
            return false;
        }
        
        errorElement.text('');
        return true;
    }
    
    // Update card type icons
    function updateCardIcons() {
        const cardNumber = $('#cardNumber').val().replace(/\s/g, '');
        const visaIcon = $('#visaIcon');
        const mastercardIcon = $('#mastercardIcon');
        
        // Reset all icons
        visaIcon.removeClass('active');
        mastercardIcon.removeClass('active');
        
        // Check card type
        if (cardNumber.startsWith('4')) {
            visaIcon.addClass('active');
        } else if (cardNumber.startsWith('5') || cardNumber.startsWith('2')) {
            mastercardIcon.addClass('active');
        }
    }
    
    // Validate cardholder name
    function validateCardHolder() {
        const cardHolder = $('#cardHolder').val().trim();
        const errorElement = $('#cardHolderError');
        
        if (!cardHolder) {
            errorElement.text('Cardholder name is required');
            return false;
        }
        
        if (cardHolder.length < 2) {
            errorElement.text('Cardholder name must be at least 2 characters');
            return false;
        }
        
        if (!/^[a-zA-Z\s]+$/.test(cardHolder)) {
            errorElement.text('Cardholder name can only contain letters and spaces');
            return false;
        }
        
        errorElement.text('');
        return true;
    }
    
    // Format expiry date
    function formatExpiryDate(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        
        input.value = value;
    }
    
    // Validate expiry date
    function validateExpiryDate() {
        const expiryDate = $('#expiryDate').val();
        const errorElement = $('#expiryError');
        
        if (!expiryDate) {
            errorElement.text('Expiry date is required');
            return false;
        }
        
        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            errorElement.text('Please enter date in MM/YY format');
            return false;
        }
        
        const [month, year] = expiryDate.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        if (parseInt(month) < 1 || parseInt(month) > 12) {
            errorElement.text('Invalid month');
            return false;
        }
        
        if (parseInt(year) < currentYear || 
            (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
            errorElement.text('Card has expired');
            return false;
        }
        
        errorElement.text('');
        return true;
    }
    
    // Validate CVV
    function validateCVV() {
        const cvv = $('#cvv').val();
        const errorElement = $('#cvvError');
        
        if (!cvv) {
            errorElement.text('CVV is required');
            return false;
        }
        
        if (!/^\d{3,4}$/.test(cvv)) {
            errorElement.text('CVV must be 3-4 digits');
            return false;
        }
        
        errorElement.text('');
        return true;
    }
    

    
    // Process payment
    function processPayment() {
        // Validate all fields
        const isCardValid = validateCardNumber();
        const isHolderValid = validateCardHolder();
        const isExpiryValid = validateExpiryDate();
        const isCvvValid = validateCVV();
        
        if (!isCardValid || !isHolderValid || !isExpiryValid || !isCvvValid) {
            return;
        }
        
        // Show loading state
        const payButton = $('#payButton');
        payButton.addClass('loading');
        payButton.text('Processing Payment...');
        payButton.prop('disabled', true);
        
        // Simulate payment processing
        setTimeout(() => {
            // Simulate successful payment
            payButton.removeClass('loading');
            payButton.addClass('success-animation');
            payButton.html('<i class="fas fa-check"></i> Payment Successful!');
            
            // Generate QR code after a short delay
            setTimeout(() => {
                generateQRCode();
            }, 1000);
            
        }, 2000);
    }
    
    // Generate QR code
    function generateQRCode() {
        const orderNumber = generateOrderNumber();
        const qrData = {
            orderNumber: orderNumber,
            item: currentOrder.item,
            total: currentOrder.total,
            timestamp: new Date().toISOString()
        };
        
        // Display QR code modal
        $('#orderNumber').text(orderNumber);
        
        // Generate QR code
        QRCode.toCanvas(document.getElementById('qrCode'), JSON.stringify(qrData), {
            width: 200,
            margin: 2,
            color: {
                dark: '#2c3e50',
                light: '#ffffff'
            }
        }, function(error) {
            if (error) {
                console.error('QR Code generation error:', error);
            }
        });
        
        // Display order details in QR modal
        const qrOrderDetails = $('#qrOrderDetails');
        const item = currentOrder.item;
        const orderDetails = `
            <div class="order-item">
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-details">
                        ${item.size !== 'standard' ? `Size: ${item.size}` : ''} | Qty: ${item.quantity}
                    </div>
                </div>
                <div class="item-price">Rs ${item.price * item.quantity}</div>
            </div>
            <div class="total-row final-total">
                <span>Total:</span>
                <span>Rs ${currentOrder.total}</span>
            </div>
        `;
        qrOrderDetails.html(orderDetails);
        
        // Show QR modal
        $('#qrModal').show();
        $('body').addClass('modal-open');
    }
    
    // Generate unique order number
    function generateOrderNumber() {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `ORD${timestamp.slice(-6)}${random}`;
    }
    
    // Print QR code function (global)
    window.printQR = function() {
        const printWindow = window.open('', '_blank');
        const qrContent = `
            <html>
                <head>
                    <title>Order QR Code</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                        .qr-container { margin: 20px 0; }
                        .order-info { margin: 20px 0; }
                        .order-number { font-size: 18px; font-weight: bold; margin: 10px 0; }
                    </style>
                </head>
                <body>
                    <h2>Order QR Code</h2>
                    <div class="order-number">Order #: ${$('#orderNumber').text()}</div>
                    <div class="qr-container">
                        <canvas id="printQR"></canvas>
                    </div>
                    <div class="order-info">
                        <p>Please show this QR code to collect your order</p>
                        <p>Thank you for your order!</p>
                    </div>
                </body>
            </html>
        `;
        
        printWindow.document.write(qrContent);
        printWindow.document.close();
        
        // Generate QR code for print
        setTimeout(() => {
            const qrData = {
                orderNumber: $('#orderNumber').text(),
                item: currentOrder.item,
                total: currentOrder.total,
                timestamp: new Date().toISOString()
            };
            
            QRCode.toCanvas(printWindow.document.getElementById('printQR'), JSON.stringify(qrData), {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            }, function(error) {
                if (!error) {
                    printWindow.print();
                }
            });
        }, 500);
    };
    
    // Initialize the checkout
    init();
});
