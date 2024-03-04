-- --------------------------------------------------------
-- Host:                         192.168.0.109
-- Server version:               PostgreSQL 16.1 on armv7l-unknown-linux-gnueabihf, compiled by armv7l-unknown-linux-gnueabihf-gcc (GCC) 12.1.0, 32-bit
-- Server OS:                    
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES  */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table public.planerp_project
CREATE TABLE IF NOT EXISTS "planerp_project" (
	"project_id" INTEGER NOT NULL,
	"name" VARCHAR(100) NOT NULL,
	"created_date" DATE NOT NULL DEFAULT CURRENT_DATE,
	"deadline_date" DATE NULL DEFAULT NULL,
	"lastupdated_date" DATE NOT NULL DEFAULT CURRENT_DATE,
	"finished_date" DATE NULL DEFAULT NULL,
	"sell_price" DOUBLE PRECISION NULL DEFAULT NULL,
	"capital" DOUBLE PRECISION NOT NULL,
	"fail" BOOLEAN NOT NULL DEFAULT false,
	"finish" BOOLEAN NOT NULL DEFAULT false,
	"profit_inpersen" DOUBLE PRECISION NULL DEFAULT NULL,
	"description" VARCHAR(2000) NULL DEFAULT NULL,
	PRIMARY KEY ("project_id")
);

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
