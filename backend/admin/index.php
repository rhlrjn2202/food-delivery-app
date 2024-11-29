<?php
session_start();
if (!isset($_SESSION['admin_id'])) {
    header('Location: login.php');
    exit();
}
require_once '../config/database.php';

// Get dashboard statistics
$stats = [
    'orders' => $conn->query("SELECT COUNT(*) as count FROM orders")->fetch_assoc()['count'] ?? 0,
    'products' => $conn->query("SELECT COUNT(*) as count FROM products")->fetch_assoc()['count'] ?? 0,
    'users' => $conn->query("SELECT COUNT(*) as count FROM users")->fetch_assoc()['count'] ?? 0,
    'revenue' => $conn->query("SELECT SUM(total_amount) as total FROM orders WHERE status = 'delivered'")->fetch_assoc()['total'] ?? 0,
    'pending_orders' => $conn->query("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'")->fetch_assoc()['count'] ?? 0,
    'delivery_areas' => $conn->query("SELECT COUNT(*) as count FROM delivery_areas WHERE is_active = 1")->fetch_assoc()['count'] ?? 0
];

// Get recent orders
$recentOrders = $conn->query("
    SELECT o.*, u.name as customer_name, u.email as customer_email 
    FROM orders o 
    LEFT JOIN users u ON o.user_id = u.id 
    ORDER BY o.created_at DESC 
    LIMIT 5
");

// Get top selling products
$topProducts = $conn->query("
    SELECT p.name, COUNT(oi.id) as order_count, SUM(oi.quantity) as total_quantity
    FROM products p
    LEFT JOIN order_items oi ON p.id = oi.product_id
    GROUP BY p.id
    ORDER BY total_quantity DESC
    LIMIT 5
");
?>
<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        .stat-card {
            border-radius: 15px;
            transition: transform 0.2s;
        }
        .stat-card:hover {
            transform: translateY(-5px);
        }
        .nav-link {
            padding: 0.8rem 1rem;
            color: rgba(255,255,255,.8);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .nav-link:hover {
            color: white;
            background: rgba(255,255,255,.1);
        }
        .nav-link.active {
            color: white;
            background: rgba(255,255,255,.1);
        }
        .quick-action-btn {
            transition: transform 0.2s;
        }
        .quick-action-btn:hover {
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="index.php">
                <i class="bi bi-shop me-2"></i>
                Admin Dashboard
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link active" href="index.php">
                            <i class="bi bi-speedometer2"></i> Dashboard
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="products.php">
                            <i class="bi bi-box"></i> Products
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="orders.php">
                            <i class="bi bi-cart"></i> Orders
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="users.php">
                            <i class="bi bi-people"></i> Users
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="categories.php">
                            <i class="bi bi-tags"></i> Categories
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="delivery-areas.php">
                            <i class="bi bi-geo-alt"></i> Delivery Areas
                        </a>
                    </li>
                </ul>
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="logout.php">
                            <i class="bi bi-box-arrow-right"></i> Logout
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container-fluid py-4">
        <!-- Quick Actions -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title mb-3">Quick Actions</h5>
                        <div class="d-flex gap-2 flex-wrap">
                            <a href="create-order.php" class="btn btn-primary quick-action-btn">
                                <i class="bi bi-plus-lg"></i> Create Order
                            </a>
                            <a href="add-product.php" class="btn btn-success quick-action-btn">
                                <i class="bi bi-plus-lg"></i> Add Product
                            </a>
                            <a href="delivery-areas.php" class="btn btn-info quick-action-btn text-white">
                                <i class="bi bi-geo-alt"></i> Manage Delivery Areas
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Statistics Cards -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card stat-card bg-primary text-white">
                    <div class="card-body">
                        <h5 class="card-title">Total Orders</h5>
                        <h2><?php echo $stats['orders']; ?></h2>
                        <small>Including <?php echo $stats['pending_orders']; ?> pending orders</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stat-card bg-success text-white">
                    <div class="card-body">
                        <h5 class="card-title">Total Revenue</h5>
                        <h2>₹<?php echo number_format($stats['revenue'], 2); ?></h2>
                        <small>From completed orders</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stat-card bg-info text-white">
                    <div class="card-body">
                        <h5 class="card-title">Active Products</h5>
                        <h2><?php echo $stats['products']; ?></h2>
                        <small>Across all categories</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stat-card bg-warning text-white">
                    <div class="card-body">
                        <h5 class="card-title">Delivery Areas</h5>
                        <h2><?php echo $stats['delivery_areas']; ?></h2>
                        <small>Active service areas</small>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <!-- Recent Orders -->
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">Recent Orders</h5>
                        <a href="orders.php" class="btn btn-sm btn-primary">View All</a>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php while ($order = $recentOrders->fetch_assoc()): ?>
                                    <tr>
                                        <td>#<?php echo $order['id']; ?></td>
                                        <td>
                                            <?php echo htmlspecialchars($order['customer_name']); ?>
                                            <br>
                                            <small class="text-muted"><?php echo htmlspecialchars($order['customer_email']); ?></small>
                                        </td>
                                        <td>₹<?php echo number_format($order['total_amount'], 2); ?></td>
                                        <td>
                                            <span class="badge bg-<?php 
                                                echo match($order['status']) {
                                                    'pending' => 'warning',
                                                    'confirmed' => 'info',
                                                    'delivered' => 'success',
                                                    'cancelled' => 'danger',
                                                    default => 'secondary'
                                                };
                                            ?>">
                                                <?php echo ucfirst($order['status']); ?>
                                            </span>
                                        </td>
                                        <td>
                                            <a href="view-order.php?id=<?php echo $order['id']; ?>" 
                                               class="btn btn-sm btn-primary">
                                                <i class="bi bi-eye"></i> View
                                            </a>
                                        </td>
                                    </tr>
                                    <?php endwhile; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Top Selling Products -->
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title mb-0">Top Selling Products</h5>
                    </div>
                    <div class="card-body">
                        <div class="list-group list-group-flush">
                            <?php while ($product = $topProducts->fetch_assoc()): ?>
                            <div class="list-group-item">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 class="mb-1"><?php echo htmlspecialchars($product['name']); ?></h6>
                                        <small class="text-muted">
                                            <?php echo $product['order_count']; ?> orders
                                        </small>
                                    </div>
                                    <span class="badge bg-primary rounded-pill">
                                        <?php echo $product['total_quantity']; ?> sold
                                    </span>
                                </div>
                            </div>
                            <?php endwhile; ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>