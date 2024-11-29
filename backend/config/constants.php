<?php
// Environment
define('DEBUG_MODE', false);

// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'u947451844_food');
define('DB_USER', 'u947451844_food');
define('DB_PASS', 'Food@123');

// Application configuration
define('SITE_URL', 'https://manojk10.sg-host.com');
define('ADMIN_EMAIL', 'admin@example.com');

// Session configuration
define('SESSION_LIFETIME', 3600); // 1 hour
define('SESSION_NAME', 'food_delivery_admin');

// Security
define('CSRF_TOKEN_NAME', 'csrf_token');
define('PASSWORD_HASH_ALGO', PASSWORD_BCRYPT);
define('PASSWORD_HASH_OPTIONS', ['cost' => 12]);