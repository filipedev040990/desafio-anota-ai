-- DropForeignKey
ALTER TABLE `catalog_items` DROP FOREIGN KEY `catalog_items_catalogId_fkey`;

-- DropForeignKey
ALTER TABLE `catalog_items` DROP FOREIGN KEY `catalog_items_productId_fkey`;

-- DropForeignKey
ALTER TABLE `catalogs` DROP FOREIGN KEY `catalogs_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `catalogs` DROP FOREIGN KEY `catalogs_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `categories` DROP FOREIGN KEY `categories_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_ownerId_fkey`;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `owners`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `owners`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `catalogs` ADD CONSTRAINT `catalogs_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `owners`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `catalogs` ADD CONSTRAINT `catalogs_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `catalog_items` ADD CONSTRAINT `catalog_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `catalog_items` ADD CONSTRAINT `catalog_items_catalogId_fkey` FOREIGN KEY (`catalogId`) REFERENCES `catalogs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
