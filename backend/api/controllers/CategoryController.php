<?php
class CategoryController {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function getAll() {
        $query = "SELECT id, name, slug FROM categories ORDER BY name";
        $result = $this->conn->query($query);

        if (!$result) {
            throw new Exception("Database error: " . $this->conn->error);
        }

        $categories = [];
        while ($row = $result->fetch_assoc()) {
            $categories[] = $row;
        }

        return $categories;
    }
}