-- * Create the `sfrio_db`.
-- * Switch to or use the `sfrio_db`.
-- * Create a `Searches` table with these fields:
--   * **id**: an auto incrementing int that serves as the primary key.
--   * **burger_name**: a string.
--   * **devoured**: a boolean.
--   * **date**: a TIMESTAMP.

### Schema
DROP DATABASE IF EXISTS sfrio_db;
CREATE DATABASE sfrio_db;

-- -- following not used in a sequelized database
-- USE sfrio_db;
--
-- DROP TABLE Searches;
-- CREATE TABLE Searches
-- (
-- 	id int NOT NULL AUTO_INCREMENT,
-- 	burger_name varchar(255) NOT NULL,
-- 	devoured BOOLEAN DEFAULT false,
--   date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
-- 	PRIMARY KEY (id)
-- );
--
-- -- write insert queries to seed the `Searches` table with an entry.
-- INSERT INTO Searches (burger_name, devoured) VALUES ('Hamburguesa', false);
