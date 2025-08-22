<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>University Canteen Menu Management</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background-color: #f5f7fa;
            color: #333;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        header {
            background: linear-gradient(135deg, #2c3e50, #4a6491);
            color: white;
            padding: 20px 0;
            text-align: center;
            border-radius: 8px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .management-panel {
            display: flex;
            gap: 30px;
            margin-bottom: 30px;
        }
        
        .add-item-form {
            flex: 1;
            background: white;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .form-title {
            font-size: 1.5rem;
            margin-bottom: 20px;
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #2c3e50;
        }
        
        input[type="text"],
        input[type="number"],
        input[type="file"] {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
        }
        
        button {
            background: #3498db;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            transition: background 0.3s;
        }
        
        button:hover {
            background: #2980b9;
        }
        
        .menu-display {
            flex: 2;
        }
        
        .menu-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 25px;
        }
        
        .menu-item {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s;
        }
        
        .menu-item:hover {
            transform: translateY(-5px);
        }
        
        .item-image {
            height: 180px;
            background-color: #f1f1f1;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        
        .item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .item-details {
            padding: 20px;
        }
        
        .item-name {
            font-size: 1.3rem;
            margin-bottom: 10px;
            color: #2c3e50;
        }
        
        .item-price {
            font-size: 1.2rem;
            color: #e74c3c;
            font-weight: 600;
            margin-bottom: 15px;
        }
        
        .delete-btn {
            background: #e74c3c;
            width: 100%;
            text-align: center;
        }
        
        .delete-btn:hover {
            background: #c0392b;
        }
        
        .notification {
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
            text-align: center;
            font-weight: 500;
        }
        
        .success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        @media (max-width: 900px) {
            .management-panel {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Quick Serve Menu Management</h1>
            <p class="subtitle">Manage food items in the canteen menu</p>
        </header>

        <div class="management-panel">
            <div class="add-item-form">
                <h2 class="form-title">Add New Food Item</h2>
                <form id="addItemForm" method="POST" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="foodName">Food Name</label>
                        <input type="text" id="foodName" name="foodName" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="foodPrice">Price (Rs)</label>
                        <input type="number" id="foodPrice" name="foodPrice" min="0" step="0.01" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="foodImage">Food Image</label>
                        <input type="file" id="foodImage" name="foodImage" accept="image/*" required>
                    </div>
                    
                    <button type="submit" name="addItem">Add to Menu</button>
                </form>
            </div>
            
            <div class="menu-display">
                <h2 class="form-title">Current Menu</h2>
                
                <div class="menu-grid">
                    <!-- Sample menu items - these would be populated from the database -->
                    <div class="menu-item">
                        <div class="item-image">
                            <img src="C:\Users\VISION\Downloads\burger.jpg">
                        </div>
                        <div class="item-details">
                            <h3 class="item-name">Burger</h3>
                            <p class="item-price">$5.99</p>
                            <button class="delete-btn">Delete Item</button>
                        </div>
                    </div>
                    
                    <div class="menu-item">
                        <div class="item-image">
                            <img src="C:\Users\VISION\Downloads\pizza.jpg">
                        </div>
                        <div class="item-details">
                            <h3 class="item-name">Pizza</h3>
                            <p class="item-price">$7.99</p>
                            <button class="delete-btn">Delete Item</button>
                        </div>
                    </div>
                    
                    <div class="menu-item">
                        <div class="item-image">
                            <img src="C:\Users\VISION\Downloads\salad.jpg">
                        </div>
                        <div class="item-details">
                            <h3 class="item-name">Salad</h3>
                            <p class="item-price">$4.99</p>
                            <button class="delete-btn">Delete Item</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // JavaScript for form validation and interactivity
        document.getElementById('addItemForm').addEventListener('submit', function(e) {
            const foodName = document.getElementById('foodName').value;
            const foodPrice = document.getElementById('foodPrice').value;
            const foodImage = document.getElementById('foodImage').value;
            
            if (!foodName || !foodPrice || !foodImage) {
                e.preventDefault();
                alert('Please fill in all fields');
                return false;
            }
            
            if (parseFloat(foodPrice) <= 0) {
                e.preventDefault();
                alert('Please enter a valid price');
                return false;
            }
        });
        
        // Add event listeners to all delete buttons
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const itemName = this.parentElement.querySelector('.item-name').textContent;
                if (confirm(`Are you sure you want to delete ${itemName}?`)) {
                    // This would trigger the PHP delete functionality
                    this.closest('.menu-item').style.display = 'none';
                    alert(`${itemName} has been deleted from the menu.`);
                }
            });
        });
    </script>
</body>
</html>