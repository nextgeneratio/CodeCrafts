<?php
// Database connection
<?php in>

// Handle form submission
$notification = "";
if (isset($_POST['addItem'])) {
    $foodName = $conn->real_escape_string($_POST['foodName']);
    $foodPrice = floatval($_POST['foodPrice']);
    $imagePath = "";

    if (isset($_FILES['foodImage']) && $_FILES['foodImage']['error'] == 0) {
        $targetDir = "uploads/";
        $fileName = uniqid() . "_" . basename($_FILES["foodImage"]["name"]);
        $targetFile = $targetDir . $fileName;
        $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];

        if (in_array($imageFileType, $allowedTypes)) {
            if (move_uploaded_file($_FILES["foodImage"]["tmp_name"], $targetFile)) {
                $imagePath = $targetFile;
                // Insert into DB
                $stmt = $conn->prepare("INSERT INTO Menu (name, price, image_path) VALUES (?, ?, ?)");
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
$menuItems = [];
$result = $conn->query("SELECT * FROM Menu ORDER BY id DESC");
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $menuItems[] = $row;
    }
}
$conn->close();
?>