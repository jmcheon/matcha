CREATE TABLE `match`.account (
    account_id INTEGER UNSIGNED auto_increment NOT NULL,
    email varchar(100) NOT NULL,
    password varchar(100) NOT NULL,
    google_username varchar(100) NULL,
    `42intra_username` varchar(100) NULL,
    status ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'inactive', -- Default value set to 'inactive'
    CONSTRAINT account_id PRIMARY KEY (account_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
