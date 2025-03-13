CREATE TABLE `recommendations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uv` int DEFAULT NULL,
  `skin_tone` int DEFAULT NULL,
  `rec_sunscreen` text,
  `rec_clothing` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
