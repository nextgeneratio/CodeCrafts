<?php
$servername = "localhost";
$username = "workbench";
$password = "mypassword";
$dbname = "codecrafts";
$port = 3306;

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Check connection
if ($conn->connect_error) {
    die("Not connected: " . $conn->connect_error);
} else {
    echo "Connected successfully";
}

$conn->close();
?>