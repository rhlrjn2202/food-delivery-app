<?php
class Order {
    private $conn;
    private $table = 'orders';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT 
                    o.id,
                    o.user_id,
                    o.total_amount,
                    o.delivery_fee,
                    o.status,
                    o.created_at,
                    u.name as customer_name,
                    u.email as customer_email
                FROM 
                    " . $this->table . " o
                LEFT JOIN
                    users u ON o.user_id = u.id
                ORDER BY
                    o.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $orders = [];
        while ($row = $result->fetch_assoc()) {
            $orders[] = $row;
        }

        return $orders;
    }

    public function create($data) {
        $this->conn->begin_transaction();

        try {
            // Insert order
            $query = "INSERT INTO " . $this->table . "
                    SET
                        user_id = ?,
                        total_amount = ?,
                        delivery_fee = ?,
                        status = 'pending'";

            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("idd", 
                $data->user_id,
                $data->total,
                $data->delivery_fee
            );
            $stmt->execute();
            $order_id = $this->conn->insert_id;

            // Insert order items
            foreach ($data->items as $item) {
                $query = "INSERT INTO order_items
                        SET
                            order_id = ?,
                            product_id = ?,
                            quantity = ?,
                            price = ?";

                $stmt = $this->conn->prepare($query);
                $stmt->bind_param("iiid",
                    $order_id,
                    $item->id,
                    $item->quantity,
                    $item->price
                );
                $stmt->execute();
            }

            $this->conn->commit();
            return ["message" => "Order created successfully", "order_id" => $order_id];
        } catch (Exception $e) {
            $this->conn->rollback();
            return ["message" => "Failed to create order: " . $e->getMessage()];
        }
    }
}
?>