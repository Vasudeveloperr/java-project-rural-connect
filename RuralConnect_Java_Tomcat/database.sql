CREATE DATABASE IF NOT EXISTS ruralconnect;
USE ruralconnect;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(20),
  location VARCHAR(150),
  role ENUM('buyer','producer') NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  unit VARCHAR(30) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  category VARCHAR(80),
  emoji VARCHAR(20),
  description VARCHAR(500),
  producer VARCHAR(100),
  location VARCHAR(150)
);

CREATE TABLE IF NOT EXISTS auctions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  producer_id INT,
  starting_bid DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  ends_at DATETIME NOT NULL,
  FOREIGN KEY(product_id) REFERENCES products(id),
  FOREIGN KEY(producer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS bids (
  id INT PRIMARY KEY AUTO_INCREMENT,
  auction_id INT NOT NULL,
  buyer_id INT,
  bidder_name VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  bid_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(auction_id) REFERENCES auctions(id),
  FOREIGN KEY(buyer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  buyer_id INT,
  total DECIMAL(12,2) NOT NULL,
  status VARCHAR(40) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(buyer_id) REFERENCES users(id)
);

INSERT INTO products(name,price,unit,stock,category,emoji,description,producer,location)
SELECT 'Organic Rice',55,'kg',500,'Agriculture','🌾','Fresh organic rice supplied directly by the producer.','Ram Kumar','Bihar'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Organic Rice');
INSERT INTO products(name,price,unit,stock,category,emoji,description,producer,location)
SELECT 'Wheat',40,'kg',800,'Agriculture','🌾','Quality wheat from a rural farm.','Suresh Farms','Uttar Pradesh'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Wheat');
INSERT INTO products(name,price,unit,stock,category,emoji,description,producer,location)
SELECT 'Cotton Saree',800,'piece',120,'Handloom','🧵','Handwoven cotton saree.','Sita Weavers','Tamil Nadu'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Cotton Saree');
