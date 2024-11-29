<?php
session_start();
if (!isset($_SESSION['admin_id'])) {
    header('Location: login.php');
    exit();
}

require_once '../config/database.php';

if (isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    
    // Get product image before deleting
    $stmt = $conn->prepare("SELECT image FROM products WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $product = $result->fetch_assoc();
    
    // Delete the product
    $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        // Delete the image file if it exists
        if ($product && $product['image'] && file_exists('../' . $product['image'])) {
            unlink('../' . $product['image']);
        }
        header('Location: products.php?success=1');
    } else {
        header('Location: products.php?error=1');
    }
} else {
    header('Location: products.php');
}
exit();
?>