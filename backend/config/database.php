<?php
class Database {
    private $host = 'localhost';
    private $dbname = 'food_delivery';
    private $username = 'root';
    private $password = '';
    private $conn;

    public function connect() {
        try {
            if ($this->conn === null) {
                $this->conn = new mysqli($this->host, $this->username, $this->password, $this->dbname);

                if ($this->conn->connect_error) {
                    throw new Exception("Connection failed: " . $this->conn->connect_error);
                }

                $this->conn->set_charset("utf8mb4");
                $this->conn->query("SET time_zone = '+05:30'");
            }

            return $this->conn;
        } catch (Exception $e) {
            error_log("Database connection error: " . $e->getMessage());
            return null;
        }
    }
}