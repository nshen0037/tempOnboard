CREATE TABLE `australian_postcodes` (
  `id` int NOT NULL,
  `postcode` text,
  `locality` text,
  `state` text,
  `long` double DEFAULT NULL,
  `lat` double DEFAULT NULL,
  `Lat_precise` double DEFAULT NULL,
  `Long_precise` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
