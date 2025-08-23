<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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