<?php
class Product {
    private $conn;
    private $table = 'products';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT 
                    p.id, 
                    p.name, 
                    p.description, 
                    p.price, 
                    p.image, 
                    c.name as category_name 
                FROM 
                    " . $this->table . " p
                LEFT JOIN
                    categories c ON p.category_id = c.id
                ORDER BY
                    p.id DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $products = [];
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }

        return $products;
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table . "
                SET
                    name = ?,
                    description = ?,
                    price = ?,
                    category_id = ?,
                    image = ?";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssdis", 
            $data->name,
            $data->description,
            $data->price,
            $data->category_id,
            $data->image
        );

        if ($stmt->execute()) {
            return ["message" => "Product created successfully"];
        }
        return ["message" => "Failed to create product"];
    }
}
?>