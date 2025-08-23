<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database connection
include '/var/www/html/conn.php';

$notification = "";

// Handle form submission
if (isset($_POST['addItem'])) {
    $foodName = $conn->real_escape_string($_POST['foodName']);
    $foodPrice = floatval($_POST['foodPrice']);
    $imagePath = "";

    if (isset($_FILES['foodImage']) && $_FILES['foodImage']['error'] == 0) {
        $targetDir = "uploads/";
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0777, true);
        }
        $fileName = uniqid() . "_" . basename($_FILES["foodImage"]["name"]);
        $targetFile = $targetDir . $fileName;
        $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];

        if (in_array($imageFileType, $allowedTypes)) {
            if (move_uploaded_file($_FILES["foodImage"]["tmp_name"], $targetFile)) {
                $imagePath = $targetFile;
                // Insert into DB
                $stmt = $conn->prepare("INSERT INTO Menu (m_name, price, image) VALUES (?, ?, ?)");
                $stmt->bind_param("sds", $foodName, $foodPrice, $imagePath);
                if ($stmt->execute()) {
                    $notification = "<div class='notification success'>Item added successfully!</div>";
                } else {
                    $notification = "<div class='notification error'>Database error: " . $conn->error . "</div>";
                }
                $stmt->close();
            } else {
                $notification = "<div class='notification error'>Failed to upload image.</div>";
            }
        } else {
            $notification = "<div class='notification error'>Invalid image type. Only JPG, JPEG, PNG, GIF allowed.</div>";
        }
    } else {
        $notification = "<div class='notification error'>Please upload an image.</div>";
    }
}

// Fetch menu items
$Menu = [];
$result = $conn->query("SELECT * FROM Menu ORDER BY m_id DESC");
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $Menu[] = $row;
    }
}
$conn->close();
?>
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
                    <?php if (count($Menu) > 0): ?>
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