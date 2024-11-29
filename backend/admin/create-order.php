<?php
session_start();
if (!isset($_SESSION['admin_id'])) {
    header('Location: login.php');
    exit();
}
require_once '../config/database.php';

// Get all products
$products = $conn->query("SELECT id, name, price FROM products ORDER BY name");

// Get all users
$users = $conn->query("SELECT id, name, email FROM users ORDER BY name");

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $conn->begin_transaction();
    
    try {
        $user_id = $_POST['user_id'];
        $payment_method = $_POST['payment_method'];
        $status = $_POST['status'];
        $items = $_POST['items'] ?? [];
        $quantities = $_POST['quantities'] ?? [];
        
        // If creating new user
        if ($user_id === 'new') {
            $stmt = $conn->prepare("INSERT INTO users (name, email, phone) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $_POST['customer_name'], $_POST['customer_email'], $_POST['customer_phone']);
            $stmt->execute();
            $user_id = $conn->insert_id;
        }
        
        // Calculate totals
        $subtotal = 0;
        foreach ($items as $index => $product_id) {
            $quantity = (int)$quantities[$index];
            $stmt = $conn->prepare("SELECT price FROM products WHERE id = ?");
            $stmt->bind_param("i", $product_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $product = $result->fetch_assoc();
            $subtotal += $product['price'] * $quantity;
        }
        
        // Apply delivery fee if subtotal is less than minimum order value
        $delivery_fee = $subtotal < 200 ? 30 : 0;
        $total_amount = $subtotal + $delivery_fee;
        
        // Create order
        $stmt = $conn->prepare("INSERT INTO orders (user_id, total_amount, delivery_fee, status, payment_method) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("iddss", $user_id, $total_amount, $delivery_fee, $status, $payment_method);
        $stmt->execute();
        $order_id = $conn->insert_id;
        
        // Add order items
        foreach ($items as $index => $product_id) {
            $quantity = (int)$quantities[$index];
            $stmt = $conn->prepare("SELECT price FROM products WHERE id = ?");
            $stmt->bind_param("i", $product_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $product = $result->fetch_assoc();
            
            $stmt = $conn->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("iiid", $order_id, $product_id, $quantity, $product['price']);
            $stmt->execute();
        }
        
        $conn->commit();
        header('Location: orders.php?success=1');
        exit();
    } catch (Exception $e) {
        $conn->rollback();
        $error = "Failed to create order: " . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Create Order - Admin Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        .product-row { background-color: #f8f9fa; padding: 10px; margin-bottom: 10px; border-radius: 5px; }
    </style>
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
                        <a class="nav-link active" href="orders.php">Orders</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="users.php">Users</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="categories.php">Categories</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="delivery-areas.php">Delivery Areas</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container-fluid py-4">
        <div class="row mb-4">
            <div class="col-md-6">
                <h2>Create New Order</h2>
            </div>
            <div class="col-md-6 text-end">
                <a href="orders.php" class="btn btn-secondary">
                    <i class="bi bi-arrow-left"></i> Back to Orders
                </a>
            </div>
        </div>

        <?php if (isset($error)): ?>
            <div class="alert alert-danger"><?php echo $error; ?></div>
        <?php endif; ?>

        <div class="card">
            <div class="card-body">
                <form method="post" id="orderForm">
                    <div class="row">
                        <div class="col-md-6">
                            <h5 class="mb-3">Customer Information</h5>
                            <div class="mb-3">
                                <label class="form-label">Select Customer</label>
                                <select name="user_id" class="form-select" onchange="toggleNewCustomerForm(this.value)">
                                    <option value="">Select Customer</option>
                                    <option value="new">+ New Customer</option>
                                    <?php while ($user = $users->fetch_assoc()): ?>
                                        <option value="<?php echo $user['id']; ?>">
                                            <?php echo htmlspecialchars($user['name'] . ' (' . $user['email'] . ')'); ?>
                                        </option>
                                    <?php endwhile; ?>
                                </select>
                            </div>

                            <div id="newCustomerForm" style="display: none;">
                                <div class="mb-3">
                                    <label class="form-label">Customer Name</label>
                                    <input type="text" name="customer_name" class="form-control">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Email</label>
                                    <input type="email" name="customer_email" class="form-control">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Phone</label>
                                    <input type="text" name="customer_phone" class="form-control">
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <h5 class="mb-3">Order Details</h5>
                            <div class="mb-3">
                                <label class="form-label">Payment Method</label>
                                <select name="payment_method" class="form-select" required>
                                    <option value="cod">Cash on Delivery</option>
                                    <option value="prepaid">Prepaid</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Order Status</label>
                                <select name="status" class="form-select" required>
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="delivered">Delivered</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <h5 class="mt-4 mb-3">Order Items</h5>
                    <div id="orderItems">
                        <div class="product-row">
                            <div class="row">
                                <div class="col-md-6">
                                    <label class="form-label">Product</label>
                                    <select name="items[]" class="form-select" required>
                                        <option value="">Select Product</option>
                                        <?php 
                                        $products->data_seek(0);
                                        while ($product = $products->fetch_assoc()): 
                                        ?>
                                            <option value="<?php echo $product['id']; ?>" 
                                                    data-price="<?php echo $product['price']; ?>">
                                                <?php echo htmlspecialchars($product['name'] . ' (₹' . $product['price'] . ')'); ?>
                                            </option>
                                        <?php endwhile; ?>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Quantity</label>
                                    <input type="number" name="quantities[]" class="form-control" min="1" value="1" required>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label">&nbsp;</label>
                                    <button type="button" class="btn btn-danger d-block" onclick="removeProduct(this)">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-3">
                        <button type="button" class="btn btn-secondary" onclick="addProduct()">
                            <i class="bi bi-plus-lg"></i> Add Product
                        </button>
                    </div>

                    <div class="mt-4">
                        <button type="submit" class="btn btn-primary">Create Order</button>
                        <a href="orders.php" class="btn btn-secondary">Cancel</a>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
    function toggleNewCustomerForm(value) {
        const form = document.getElementById('newCustomerForm');
        form.style.display = value === 'new' ? 'block' : 'none';
        
        // Toggle required attributes
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.required = value === 'new';
        });
    }

    function addProduct() {
        const container = document.getElementById('orderItems');
        const template = container.children[0].cloneNode(true);
        
        // Clear values
        template.querySelector('select').value = '';
        template.querySelector('input[type="number"]').value = 1;
        
        container.appendChild(template);
    }

    function removeProduct(button) {
        const container = document.getElementById('orderItems');
        if (container.children.length > 1) {
            button.closest('.product-row').remove();
        }
    }

    // Form validation
    document.getElementById('orderForm').addEventListener('submit', function(e) {
        const userSelect = document.querySelector('select[name="user_id"]');
        if (!userSelect.value) {
            e.preventDefault();
            alert('Please select a customer or create a new one');
            return;
        }

        const products = document.querySelectorAll('select[name="items[]"]');
        if (!Array.from(products).some(select => select.value)) {
            e.preventDefault();
            alert('Please add at least one product');
            return;
        }
    });
    </script>
</body>
</html>