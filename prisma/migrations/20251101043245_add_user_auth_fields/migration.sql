/*
  Warnings:

  - You are about to drop the column `discountType` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `products` DROP COLUMN `discountType`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `resetOtp` VARCHAR(191) NULL,
    ADD COLUMN `resetOtpExpiresAt` DATETIME(3) NULL,
    ADD COLUMN `verificationToken` TEXT NULL,
    ADD COLUMN `verifiedAt` DATETIME(3) NULL;
