<?php
class ProductController {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function getAll($category = null) {
        $query = "SELECT p.*, c.name as category_name 
                 FROM products p 
                 LEFT JOIN categories c ON p.category_id = c.id";
        
        if ($category) {
            $category = $this->conn->real_escape_string($category);
            $query .= " WHERE c.slug = '$category'";
        }
        
        $query .= " ORDER BY p.name";
        
        $result = $this->conn->query($query);

        if (!$result) {
            throw new Exception("Database error: " . $this->conn->error);
        }

        $products = [];
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }

        return $products;
    }
}