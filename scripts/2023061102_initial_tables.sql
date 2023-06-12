CREATE TABLE scores (
  id BINARY(16) NOT NULL,
  name VARCHAR(50) NOT NULL UNIQUE,
  country VARCHAR(2),
  score INT UNSIGNED NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  queryable VARCHAR(255) GENERATED ALWAYS AS (
    UPPER(CONCAT(name, '|', score, '|', country))
  ),
  PRIMARY KEY (id)
);

CREATE TRIGGER bi_scores BEFORE
INSERT
  ON scores FOR EACH ROW
SET
  NEW.id = UUID_TO_BIN(UUID(), FALSE);

CREATE TRIGGER ai_scores
AFTER
INSERT
  ON scores FOR EACH ROW
SET
  @score_uuid = NEW.id;