CREATE TABLE `recommendations` (
  `id` int NOT NULL,
  `uv` text,
  `skin_type` text,
  `rec_sunscreen` text,
  `rec_clothing` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
