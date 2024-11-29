<?php
session_start();
if (!isset($_SESSION['admin_id'])) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['area_id']) && isset($_POST['status'])) {
    $area_id = (int)$_POST['area_id'];
    $status = (int)$_POST['status'];
    
    $stmt = $conn->prepare("UPDATE delivery_areas SET is_active = ? WHERE id = ?");
    $stmt->bind_param("ii", $status, $area_id);
    
    $success = $stmt->execute();
    
    header('Content-Type: application/json');
    echo json_encode(['success' => $success]);
} else {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
?>