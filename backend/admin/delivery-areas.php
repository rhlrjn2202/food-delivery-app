<?php
session_start();
if (!isset($_SESSION['admin_id'])) {
    header('Location: login.php');
    exit();
}
require_once '../config/database.php';

// Simplified query without JOIN since we're just starting
$areas = $conn->query("SELECT * FROM delivery_areas ORDER BY pincode");

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pincode = trim($_POST['pincode']);
    $city = trim($_POST['city']);
    $state = trim($_POST['state']);
    
    $stmt = $conn->prepare("INSERT INTO delivery_areas (pincode, city, state) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $pincode, $city, $state);
    
    if ($stmt->execute()) {
        header('Location: delivery-areas.php');
        exit();
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Manage Delivery Areas - Admin Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css" rel="stylesheet">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="index.php">Admin Dashboard</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" href="products.php">Products</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="orders.php">Orders</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="users.php">Users</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="categories.php">Categories</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" href="delivery-areas.php">Delivery Areas</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container-fluid py-4">
        <div class="row mb-4">
            <div class="col-md-6">
                <h2>Manage Delivery Areas</h2>
            </div>
            <div class="col-md-6 text-end">
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addAreaModal">
                    <i class="bi bi-plus-lg"></i> Add Delivery Area
                </button>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Pincode</th>
                                <th>City</th>
                                <th>State</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php while ($area = $areas->fetch_assoc()): ?>
                            <tr>
                                <td><?php echo $area['id']; ?></td>
                                <td><?php echo htmlspecialchars($area['pincode']); ?></td>
                                <td><?php echo htmlspecialchars($area['city']); ?></td>
                                <td><?php echo htmlspecialchars($area['state']); ?></td>
                                <td>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" 
                                               <?php echo $area['is_active'] ? 'checked' : ''; ?>
                                               onchange="toggleAreaStatus(<?php echo $area['id']; ?>, this.checked)">
                                    </div>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-danger" 
                                            onclick="deleteArea(<?php echo $area['id']; ?>)">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                            <?php endwhile; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Area Modal -->
    <div class="modal fade" id="addAreaModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add New Delivery Area</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form method="post">
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Pincode</label>
                            <input type="text" name="pincode" class="form-control" 
                                   pattern="[0-9]{6}" maxlength="6" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">City</label>
                            <input type="text" name="city" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">State</label>
                            <input type="text" name="state" class="form-control" required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Add Area</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
    function toggleAreaStatus(id, status) {
        fetch('update-area-status.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `area_id=${id}&status=${status ? 1 : 0}`
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                alert('Failed to update status');
                location.reload();
            }
        });
    }

    function deleteArea(id) {
        if (confirm('Are you sure you want to delete this delivery area?')) {
            window.location.href = `delete-area.php?id=${id}`;
        }
    }
    </script>
</body>
</html>