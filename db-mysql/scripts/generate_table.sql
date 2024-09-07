CREATE TABLE IF NOT EXISTS `account` (
    `account_id` INT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(50) NULL,
    `password` VARCHAR(50) NULL,
    `google_username` VARCHAR(50) NULL,
    `intra_username` VARCHAR(50) NULL,
    `status` ENUM('incomplete', 'online', 'offline') NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `last_modified_at` DATETIME NULL,
    `deleted_at` DATETIME NULL,
    PRIMARY KEY (`account_id`)
);

CREATE TABLE IF NOT EXISTS `profile` (
    `profile_id` INT NOT NULL AUTO_INCREMENT,
    `account_id` INT NOT NULL,
    `firstname` VARCHAR(50) NULL,
    `lastname` VARCHAR(50) NULL,
    `image_paths` JSON NULL,
    `location` VARCHAR(50) NULL,
    `gender` ENUM('male', 'female', 'other') NULL,
    `like_gender` ENUM('male', 'female', 'other') NULL,
    `height` INT NULL,
    `user_language` VARCHAR(50) NULL,
    `interests` TEXT NULL,
    `bio` VARCHAR(140) NULL,
    `fame_score` INT NULL,
    PRIMARY KEY (`profile_id`),
    UNIQUE (`account_id`),
    FOREIGN KEY (`account_id`) REFERENCES `account` (`account_id`)
);

CREATE TABLE IF NOT EXISTS `date_match` (
    `match_id` INT NOT NULL AUTO_INCREMENT,
    `sender_id` INT NOT NULL,
    `receiver_id` INT NOT NULL,
    `status` VARCHAR(20) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `last_modified_at` DATETIME NULL,
    `deleted_at` DATETIME NULL,
    PRIMARY KEY (`match_id`),
    FOREIGN KEY (`sender_id`) REFERENCES `account` (`account_id`),
    FOREIGN KEY (`receiver_id`) REFERENCES `account` (`account_id`)
);

CREATE TABLE IF NOT EXISTS `dm` (
    `dm_id` INT NOT NULL AUTO_INCREMENT,
    `sender_id` INT NOT NULL,
    `receiver_id` INT NOT NULL,
    `content` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `last_modified_at` DATETIME NULL,
    `deleted_at` DATETIME NULL,
    PRIMARY KEY (`dm_id`),
    FOREIGN KEY (`sender_id`) REFERENCES `account` (`account_id`),
    FOREIGN KEY (`receiver_id`) REFERENCES `account` (`account_id`)
);

CREATE TABLE IF NOT EXISTS `notification` (
    `notification_id` INT NOT NULL AUTO_INCREMENT,
    `sender_id` INT NOT NULL,
    `content` VARCHAR(100) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `last_modified_at` DATETIME NULL,
    `deleted_at` DATETIME NULL,
    PRIMARY KEY (`notification_id`),
    FOREIGN KEY (`sender_id`) REFERENCES `account` (`account_id`)
);

CREATE TABLE IF NOT EXISTS `block` (
    `block_id` INT NOT NULL AUTO_INCREMENT,
    `account_id` INT NOT NULL,
    `blocked_account_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL,
    PRIMARY KEY (`block_id`),
    FOREIGN KEY (`account_id`) REFERENCES `account` (`account_id`),
    FOREIGN KEY (`blocked_account_id`) REFERENCES `account` (`account_id`)
);
