USE jewelry_shop;
select * from product;
select * from product_image;
CREATE TABLE `account_phone` (
  `phone_id` int AUTO_INCREMENT,
  `acc_id` int DEFAULT NULL,
  `phone_num` int DEFAULT NULL,
  PRIMARY KEY (`phone_id`),
  KEY `acc_id` (`acc_id`),
  CONSTRAINT `account_phone_ibfk_1` FOREIGN KEY (`acc_id`) REFERENCES `p_account` (`acc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `b_storage` (
  `storage_id` int NOT NULL AUTO_INCREMENT,
  `capacity` int DEFAULT NULL,
  `amount` int DEFAULT NULL,
  `last_inventory_check` date DEFAULT NULL,
  PRIMARY KEY (`storage_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `branch_phone` (
  `phone_id` int NOT NULL,
  `branch_id` int DEFAULT NULL,
  `phone_num` int DEFAULT NULL,
  PRIMARY KEY (`phone_id`),
  KEY `branch_phone_ibfk_1` (`branch_id`),
  CONSTRAINT `branch_phone_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `jewelry_branch` (`branch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE order_ (
  order_id int NOT NULL AUTO_INCREMENT,
  order_status varchar(32) DEFAULT NULL,
  order_price float DEFAULT NULL,
  payment_method varchar(32) DEFAULT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  delivery_data date DEFAULT NULL,
  customer_id int NOT NULL,
  monthOredered int,
  PRIMARY KEY (order_id),
  KEY order__ibfk_1 (customer_id),
  CONSTRAINT order__ibfk_1 FOREIGN KEY (customer_id) REFERENCES customer (acc_id)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
select * from order_;
select * from order_;
CREATE TABLE order_line (
  Order_id int NOT NULL AUTO_INCREMENT,
  Product_id int NOT NULL,
  quantity int DEFAULT NULL,
  unit_price float DEFAULT NULL,
  subtotal float DEFAULT NULL,
  PRIMARY KEY (Order_id,Product_id),
  rating DECIMAL(2,1) DEFAULT 0,
  KEY Product_id (Product_id),
  CONSTRAINT order_line_ibfk_1 FOREIGN KEY (Product_id) REFERENCES product (Product_id),
  CONSTRAINT order_line_ibfk_2 FOREIGN KEY (Order_id) REFERENCES order_ (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `cart` (
  `cart_id` int NOT NULL AUTO_INCREMENT,
  `acc_id` int DEFAULT NULL,
  `order_status` varchar(32) DEFAULT NULL,
  `total` float DEFAULT NULL,
  `last_modified` date DEFAULT NULL,
  `payment_method` varchar(32) DEFAULT NULL,
   `discount` int DEFAULT NULL,
  PRIMARY KEY (`cart_id`),
  UNIQUE KEY `acc_id` (`acc_id`),
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`acc_id`) REFERENCES `customer` (`acc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE cart_items (
    cart_item_id INT PRIMARY KEY AUTO_INCREMENT,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    `quantity` int DEFAULT NULL,
    `unit_price` float DEFAULT NULL,
	`subtotal` float DEFAULT NULL,
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
);
CREATE TABLE `customer` (
  `acc_id` int NOT NULL AUTO_INCREMENT,
  `is_verified` tinyint(1) DEFAULT NULL,
  `wallet_balance` float DEFAULT NULL,
  `visa_num` varchar(16) DEFAULT NULL,
  `vcc` int DEFAULT NULL,
  `name_on_card` varchar(32) DEFAULT NULL,
  `Expiration_date` varchar(32) DEFAULT NULL,
  points int,
  PRIMARY KEY (`acc_id`),
  UNIQUE KEY `visa_num` (`visa_num`),
  CONSTRAINT `fk_acc_id` FOREIGN KEY (`acc_id`) REFERENCES `p_account` (`acc_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `employee` (
  `emp_id` int DEFAULT NULL,
  `position` varchar(32) DEFAULT NULL,
  `salary` float DEFAULT NULL,
  `transfer_id` int DEFAULT NULL,
  `hired_at` varchar(32) DEFAULT NULL,
  `branch_id` int DEFAULT NULL,
  `Manager_id` int DEFAULT NULL,
  KEY `emp_id` (`emp_id`),
  KEY `fk_Manager` (`Manager_id`),
  KEY `fk_employee_branch` (`branch_id`),
  CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `p_account` (`acc_id`),
  CONSTRAINT `fk_employee_branch` FOREIGN KEY (`branch_id`) REFERENCES `jewelry_branch` (`branch_id`),
  CONSTRAINT `fk_Manager` FOREIGN KEY (`Manager_id`) REFERENCES `manager` (`Manager_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `jewelry_branch` (
  `branch_id` int NOT NULL AUTO_INCREMENT,
  `street_num` int DEFAULT NULL,
  `street_name` varchar(32) DEFAULT NULL,
  `created_at` date DEFAULT NULL,
  `storage_id` int DEFAULT NULL,
  PRIMARY KEY (`branch_id`),
  KEY `fk_storage` (`storage_id`),
  CONSTRAINT `fk_storage` FOREIGN KEY (`storage_id`) REFERENCES `b_storage` (`storage_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `manager` (
  `Manager_id` int NOT NULL,
  `salary` float DEFAULT NULL,
  `hire_data` date DEFAULT NULL,
  PRIMARY KEY (`Manager_id`),
  UNIQUE KEY `branch_id` (`branch_id`),
  CONSTRAINT `manager_ibfk_1` FOREIGN KEY (`Manager_id`) REFERENCES `p_account` (`acc_id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `p_account` (
  `acc_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(32) NOT NULL,
  `first_name` varchar(20) NOT NULL,
  `last_name` varchar(32) NOT NULL,
  `age` int DEFAULT NULL,
  `email` varchar(64) NOT NULL,
  `acc_password` varchar(16) NOT NULL,
  `street_num` int DEFAULT NULL,
  `street_name` varchar(32) DEFAULT NULL,
  `city` varchar(32) DEFAULT NULL,
  `zip_code` int DEFAULT NULL,
  `gender` varchar(16) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `role` varchar(16) DEFAULT NULL,
  PRIMARY KEY (`acc_id`),
  UNIQUE KEY `user_name` (`user_name`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `product` (
  `Product_id` int NOT NULL AUTO_INCREMENT,
  `Product_name` varchar(32) DEFAULT NULL,
  `Product_type` varchar(32) DEFAULT NULL,
  `kerat` int DEFAULT NULL,
  `main_factor_type` varchar(32) DEFAULT NULL,
  `weight` float DEFAULT NULL,
  `price_per_gram` float DEFAULT NULL,
  `total_price` float DEFAULT NULL,
  `labour_cost` float DEFAULT NULL,
  PRIMARY KEY (`Product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- INSERT INTO `product` (
--   `Product_name`, `Product_type`, `kerat`, `main_factor_type`,
--   `weight`, `price_per_gram`, `total_price`, `labour_cost`
-- ) VALUES
-- ('Classic Ring', 'Ring', 21, 'Gold', 5.2, 250.0, 1300.0, 150.0),
-- ('Elegant Necklace', 'Necklace', 18, 'Gold', 15.5, 240.0, 3720.0, 300.0),
-- ('Diamond Studs', 'Earrings', 21, 'Gold', 2.8, 260.0, 728.0, 200.0),
-- ('Ruby Bracelet', 'Bracelet', 22, 'Gold', 12.3, 255.0, 3136.5, 275.0),
-- ('Pearl Pendant', 'Pendant', 18, 'Gold', 4.0, 235.0, 940.0, 180.0),
-- ('Men\'s Chain', 'Chain', 21, 'Gold', 20.0, 250.0, 5000.0, 400.0),
-- ('Wedding Band', 'Ring', 22, 'Gold', 6.0, 260.0, 1560.0, 175.0),
-- ('Hoop Earrings', 'Earrings', 21, 'Gold', 3.5, 250.0, 875.0, 160.0),
-- ('Charm Bracelet', 'Bracelet', 18, 'Gold', 10.2, 230.0, 2346.0, 210.0),
-- ('Cross Pendant', 'Pendant', 21, 'Gold', 3.0, 245.0, 735.0, 150.0);
-- INSERT INTO `product` (
--   `Product_name`, `Product_type`, `kerat`, `main_factor_type`,
--   `weight`, `price_per_gram`, `total_price`, `labour_cost`
-- ) VALUES
-- ('Diamond Ring', 'Ring', 22, 'Gold', 4.8, 270.0, 1296.0, 220.0),
-- ('Gold Bangle', 'Bracelet', 21, 'Gold', 13.5, 250.0, 3375.0, 280.0),
-- ('Elegant Chain', 'Chain', 18, 'Gold', 18.0, 230.0, 4140.0, 360.0),
-- ('Stud Earrings', 'Earrings', 22, 'Gold', 2.2, 265.0, 583.0, 140.0),
-- ('Luxury Necklace', 'Necklace', 21, 'Gold', 22.0, 260.0, 5720.0, 420.0),
-- ('Gemstone Ring', 'Ring', 18, 'Gold', 3.7, 240.0, 888.0, 160.0),
-- ('Engraved Pendant', 'Pendant', 21, 'Gold', 5.0, 255.0, 1275.0, 200.0),
-- ('Thin Bracelet', 'Bracelet', 18, 'Gold', 7.5, 235.0, 1762.5, 190.0),
-- ('Heavy Chain', 'Chain', 22, 'Gold', 25.0, 275.0, 6875.0, 500.0),
-- ('Pearl Earrings', 'Earrings', 18, 'Gold', 2.5, 230.0, 575.0, 130.0);		
-- select * from product where product_type = "Ring";
-- select * from product where product_type = "Necklace";
-- select * from product where product_type = "Earrings";
-- select * from product where product_type = "Bracelet";
-- select * from product where product_type = "Pendant";
-- select * from product where product_type = "Chain";
-- insert into product_image (product_id, image_path) values 
-- (2, "https://i.postimg.cc/L4zTF4xd/ring-item1.jpg"),
-- (8, "https://i.postimg.cc/YqMxrcPv/ring-item2.jpg"),
-- (12, "https://i.postimg.cc/RZb1LWZt/ring-item3.jpg"),
-- (17, "https://i.postimg.cc/vmgrqG4N/ring-item4.jpg");
-- insert into product_image (product_id, image_path) values 
-- (3, "https://i.postimg.cc/Wb8CPJqp/Necklace-item1.jpg"),
-- (16, "https://i.postimg.cc/8zqqygrL/Necklace-item2.jpg");
-- insert into product_image (product_id, image_path) values 
-- (4, "https://i.postimg.cc/NFm2thxh/Earrings-item1.jpg"),
-- (9, "https://i.postimg.cc/L6FZTXHm/Earrings-item2.jpg"),
-- (15, "https://i.postimg.cc/WpG4s7vP/Earrings-item3.jpg"),
-- (21, "https://i.postimg.cc/W13p6LJ2/Earrings-item4.jpg");
-- insert into product_image (product_id, image_path) values 
-- (5, "https://i.postimg.cc/rptKLXj8/Bracelet-item1.jpg"),
-- (10, "https://i.postimg.cc/85RcjRx9/Bracelet-item2.jpg"),
-- (13, "https://i.postimg.cc/wMFBk6qk/Bracelet-item3.jpg"),
-- (19, "https://i.postimg.cc/XNDS9G3z/Bracelet-item4.jpg");
-- insert into product_image (product_id, image_path) values 
-- (7, "https://i.postimg.cc/kgN7NJTR/Chain-item1.jpg"),
-- (14, "https://i.postimg.cc/hPTXwqCc/Chain-item2.jpg"),
-- (20, "https://i.postimg.cc/VkwJPHTM/Chain-item3.jpg");
CREATE TABLE `product_image` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`image_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_image_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`Product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE payroll (
  emp_id int NOT NULL,
  Bonus float DEFAULT NULL,
  amount float DEFAULT NULL,
  created_at date NOT NULL,
  PRIMARY KEY (emp_id,created_at),
  CONSTRAINT payroll_ibfk_1 FOREIGN KEY (emp_id) REFERENCES employee (emp_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `purchase_order` (
  `Purchase_Order_id` int NOT NULL AUTO_INCREMENT,
  `Order_date` date DEFAULT NULL,
  `Purchase_Order_status` varchar(32) DEFAULT NULL,
  `total_cost` float DEFAULT NULL,
  `expected_delivery` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Supplier_id` int DEFAULT NULL,
  `branch_id` int DEFAULT NULL,
  PRIMARY KEY (`Purchase_Order_id`),
  KEY `Supplier_id` (`Supplier_id`),
  KEY `fk_branch_id` (`branch_id`),
  CONSTRAINT `fk_branch_id` FOREIGN KEY (`branch_id`) REFERENCES `jewelry_branch` (`branch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `purchase_order_line` (
  `Purchase_Order` int NOT NULL,
  `Product_id` int NOT NULL,
  `quantity` int DEFAULT NULL,
  `unit_price` float DEFAULT NULL,
  `subtotal` float DEFAULT NULL,
  PRIMARY KEY (`Purchase_Order`,`Product_id`),
  KEY `Product_id` (`Product_id`),
  CONSTRAINT `purchase_order_line_ibfk_1` FOREIGN KEY (`Product_id`) REFERENCES `product` (`Product_id`),
  CONSTRAINT `purchase_order_line_ibfk_2` FOREIGN KEY (`Purchase_Order`) REFERENCES `purchase_order` (`Purchase_Order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `store_product` (
  `storge_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`storge_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `store_product_ibfk_1` FOREIGN KEY (`storge_id`) REFERENCES `b_storage` (`storage_id`),
  CONSTRAINT `store_product_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`Product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- INSERT INTO p_account (user_name, first_name, last_name, age, email, acc_password, street_num, street_name, city, zip_code, gender, date_of_birth, role) VALUES
-- ('john_doe', 'John', 'Doe', 32, 'john.doe@email.com', 'pass123', 123, 'Main St', 'New York', 10001, 'Male', '1990-05-15', 'customer'),
-- ('sara_smith', 'Sara', 'Smith', 28, 'sara.smith@email.com', 'sara123', 456, 'Oak Ave', 'Los Angeles', 90001, 'Female', '1994-11-22', 'customer'),
-- ('mike_jones', 'Mike', 'Jones', 45, 'mike.j@email.com', 'mikePass', 789, 'Pine Rd', 'Chicago', 60601, 'Male', '1977-02-10', 'customer'),
-- ('emily_wilson', 'Emily', 'Wilson', 29, 'emily.w@email.com', 'emilyPass1', 101, 'Elm St', 'Miami', 33101, 'Female', '1993-08-30', 'customer'),
-- ('david_brown', 'David', 'Brown', 37, 'david.b@email.com', 'dbrown123', 222, 'Maple Dr', 'Seattle', 98101, 'Male', '1985-12-05', 'customer'),
-- ('lisa_taylor', 'Lisa', 'Taylor', 41, 'lisa.t@email.com', 'lisaPass', 333, 'Cedar Ln', 'Boston', 02101, 'Female', '1981-03-18', 'customer'),
-- ('robert_clark', 'Robert', 'Clark', 26, 'robert.c@email.com', 'robPass', 444, 'Birch St', 'Austin', 73301, 'Male', '1996-07-21', 'customer'),
-- ('amy_adams', 'Amy', 'Adams', 33, 'amy.a@email.com', 'amy12345', 555, 'Spruce Ave', 'Denver', 80201, 'Female', '1989-09-12', 'customer'),
-- ('kevin_martin', 'Kevin', 'Martin', 31, 'kevin.m@email.com', 'kevinPass', 666, 'Willow Way', 'Atlanta', 30301, 'Male', '1991-04-25', 'customer'),
-- ('jessica_lee', 'Jessica', 'Lee', 24, 'jessica.l@email.com', 'jessPass', 777, 'Redwood Rd', 'San Francisco', 94101, 'Female', '1998-01-07', 'customer');
select * from p_account;	
-- INSERT INTO customer (acc_id, is_verified, wallet_balance, visa_num, vcc, name_on_card, Expiration_date, points) VALUES
-- (19, 1, 250.50, '4111111111111111', 123, 'JOHN DOE', '2025-12-01', 1200),
-- (20, 1, 100.00, '4222222222222222', 456, 'SARA SMITH', '2024-10-01', 800),
-- (21, 0, 500.75, '4333333333333333', 789, 'MIKE JONES', '2026-05-01', 2500),
-- (22, 1, 75.25, '4444444444444444', 321, 'EMILY WILSON', '2023-08-01', 150),
-- (23, 1, 1200.00, '4555555555555555', 654, 'DAVID BROWN', '2027-02-01', 3500),
-- (24, 0, 50.00, '4666666666666666', 987, 'LISA TAYLOR', '2024-11-01', 600),
-- (25, 1, 300.25, '4777777777777777', 147, 'ROBERT CLARK', '2025-07-01', 900),
-- (26, 1, 850.50, '4888888888888888', 258, 'AMY ADAMS', '2026-03-01', 2100),
-- (27, 0, 150.75, '4999999999999999', 369, 'KEVIN MARTIN', '2024-09-01', 400),
-- (28, 1, 2000.00, '4000111122223333', 159, 'JESSICA LEE', '2028-01-01', 5000);