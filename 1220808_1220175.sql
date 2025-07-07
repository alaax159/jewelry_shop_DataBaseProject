use jewelry_shop;

CREATE TABLE `account_phone` (
  `phone_id` int NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `branch_phone` (
  `phone_id` int NOT NULL,
  `branch_id` int DEFAULT NULL,
  `phone_num` int DEFAULT NULL,
  PRIMARY KEY (`phone_id`),
  KEY `branch_phone_ibfk_1` (`branch_id`),
  CONSTRAINT `branch_phone_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `jewelry_branch` (`branch_id`)
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
CREATE TABLE `cart_items` (
  `cart_item_id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int DEFAULT NULL,
  `unit_price` float DEFAULT NULL,
  `subtotal` float DEFAULT NULL,
  PRIMARY KEY (`cart_item_id`),
  KEY `cart_id` (`cart_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`Product_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `customer` (
  `acc_id` int NOT NULL AUTO_INCREMENT,
  `is_verified` tinyint(1) DEFAULT NULL,
  `wallet_balance` float DEFAULT NULL,
  `visa_num` varchar(16) DEFAULT NULL,
  `vcc` int DEFAULT NULL,
  `name_on_card` varchar(32) DEFAULT NULL,
  `Expiration_date` date DEFAULT NULL,
  `Blocked` tinyint(1) DEFAULT NULL,
  `points` int DEFAULT NULL,
  PRIMARY KEY (`acc_id`),
  UNIQUE KEY `visa_num` (`visa_num`),
  CONSTRAINT `fk_acc_id` FOREIGN KEY (`acc_id`) REFERENCES `p_account` (`acc_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `employee` (
  `emp_id` int DEFAULT NULL,
  `position` varchar(32) DEFAULT NULL,
  `salary` float DEFAULT NULL,
  `transfer_id` int DEFAULT NULL,
  `hired_at` varchar(32) DEFAULT NULL,
  `emp_active` tinyint(1) DEFAULT NULL,
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
  `Manager_id` int DEFAULT NULL,
  PRIMARY KEY (`branch_id`),
  KEY `fk_storage` (`storage_id`),
  KEY `JB_managerIDFK` (`Manager_id`),
  CONSTRAINT `fk_storage` FOREIGN KEY (`storage_id`) REFERENCES `b_storage` (`storage_id`),
  CONSTRAINT `JB_managerIDFK` FOREIGN KEY (`Manager_id`) REFERENCES `manager` (`Manager_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `manager` (
  `Manager_id` int NOT NULL,
  `salary` float DEFAULT NULL,
  `hire_data` date DEFAULT NULL,
  PRIMARY KEY (`Manager_id`),
  CONSTRAINT `manager_ibfk_1` FOREIGN KEY (`Manager_id`) REFERENCES `p_account` (`acc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `order_` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `order_status` varchar(32) DEFAULT NULL,
  `order_price` float DEFAULT NULL,
  `payment_method` varchar(32) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `delivery_data` date DEFAULT NULL,
  `customer_id` int NOT NULL,
  `monthOredered` int DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `order__ibfk_1` (`customer_id`),
  CONSTRAINT `order__ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`acc_id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `order_line` (
  `Order_id` int NOT NULL,
  `Product_id` int NOT NULL,
  `quantity` int DEFAULT NULL,
  `unit_price` float DEFAULT NULL,
  `subtotal` float DEFAULT NULL,
  `cart_id` int DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT NULL,
  PRIMARY KEY (`Order_id`,`Product_id`),
  KEY `Product_id` (`Product_id`),
  KEY `order_line` (`cart_id`),
  CONSTRAINT `order_line_ibfk_1` FOREIGN KEY (`Product_id`) REFERENCES `product` (`Product_id`),
  CONSTRAINT `order_line_ibfk_2` FOREIGN KEY (`Order_id`) REFERENCES `order_` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `payroll` (
  `emp_id` int NOT NULL,
  `Bonus` float DEFAULT NULL,
  `amount` float DEFAULT NULL,
  `created_at` date NOT NULL,
  PRIMARY KEY (`emp_id`,`created_at`),
  CONSTRAINT `payroll_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employee` (`emp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `product` (
  `Product_id` int NOT NULL AUTO_INCREMENT,
  `Product_name` varchar(32) DEFAULT NULL,
  `product_type` varchar(32) DEFAULT NULL,
  `kerat` int DEFAULT NULL,
  `main_factor_type` varchar(32) DEFAULT NULL,
  `weight` float DEFAULT NULL,
  `price_per_gram` float DEFAULT NULL,
  `discount` float DEFAULT NULL,
  `total_price` float DEFAULT NULL,
  `labour_cost` float DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`Product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `product_image` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`image_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_image_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`Product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `purchase_order` (
  `Purchase_Order_id` int NOT NULL AUTO_INCREMENT,
  `Purchase_Order_status` varchar(32) DEFAULT NULL,
  `total_cost` float DEFAULT NULL,
  `expected_delivery` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `branch_id` int DEFAULT NULL,
  PRIMARY KEY (`Purchase_Order_id`),
  KEY `fk_branch_id` (`branch_id`),
  CONSTRAINT `fk_branch_id` FOREIGN KEY (`branch_id`) REFERENCES `jewelry_branch` (`branch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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















