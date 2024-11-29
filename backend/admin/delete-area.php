<?php
session_start();
if (!isset($_SESSION['admin_id'])) {
    header('Location: login.php');
    exit();
}

require_once '../config/database.php';

if (isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    
    $stmt = $conn->prepare("DELETE FROM delivery_areas WHERE id = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        header('Location: delivery-areas.php?success=1');
    } else {
        header('Location: delivery-areas.php?error=1');
    }
} else {
    header('Location: delivery-areas.php');
}
exit();
?>