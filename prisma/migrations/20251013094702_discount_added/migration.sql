-- AlterTable
ALTER TABLE `products` ADD COLUMN `discountType` ENUM('PERCENT', 'FIXED') NOT NULL DEFAULT 'PERCENT';
    