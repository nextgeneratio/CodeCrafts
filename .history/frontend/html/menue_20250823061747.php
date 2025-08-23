<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/frontend/css/meanu.css">
    <title>QuickServe</title>
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
                <?php if (!empty($notification)) echo $notification; ?>
                <div class="menu-grid">
                    <?php if (count($menuItems) > 0): ?>
                    <?php foreach ($Menu as $item): ?>
                    <div class="menu-item">
                        <div class="item-image">
                            <img src="<?php echo htmlspecialchars($item['image']); ?>"
                                alt="<?php echo htmlspecialchars($item['m_name']); ?>">
                        </div>
                        <div class="item-details">
                            <h3 class="item-name"><?php echo htmlspecialchars($item['m_name']); ?></h3>
                            <p class="item-price">Rs <?php echo number_format($item['price'], 2); ?></p>
                            <!-- You can add delete functionality here -->
                        </div>
                    </div>
                    <?php endforeach; ?>
                    <?php else: ?>
                    <p>No menu items found.</p>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>

</body>

</html>