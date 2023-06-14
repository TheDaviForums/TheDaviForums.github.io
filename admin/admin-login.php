<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];

    // Add your admin username and password validation logic here
    $adminUsername = "admin";
    $adminPassword = "password";

    if ($username === $adminUsername && $password === $adminPassword) {
        echo "Login successful. Welcome, admin!";
    } else {
        echo "Invalid username or password. Please try again.";
    }
}
?>