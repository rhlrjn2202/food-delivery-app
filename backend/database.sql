CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id INT,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Insert sample data
INSERT INTO categories (name, slug) VALUES
('Main Course', 'main-course'),
('Starters', 'starters'),
('Desserts', 'desserts');

INSERT INTO products (name, description, price, category_id, image) VALUES
('Butter Chicken', 'Creamy, rich and mildly spiced chicken curry', 299.00, 1, '/images/butter-chicken.jpg'),
('Paneer Tikka', 'Grilled cottage cheese with spices', 249.00, 2, '/images/paneer-tikka.jpg'),
('Gulab Jamun', 'Sweet milk dumplings soaked in sugar syrup', 149.00, 3, '/images/gulab-jamun.jpg');