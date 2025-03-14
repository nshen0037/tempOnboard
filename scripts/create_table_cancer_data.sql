CREATE TABLE cancer_data (
    cancer_id INT NOT NULL PRIMARY KEY, 
    cancer_group VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    sex VARCHAR(10) NOT NULL,
    age_group VARCHAR(20) NOT NULL,
    count INT DEFAULT NULL,
    count_type VARCHAR(20) NOT NULL,
    age_specific_rate FLOAT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;