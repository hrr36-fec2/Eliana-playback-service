CREATE DATABASE playlist;

USE playlist;

DROP TABLE IF EXISTS `playlist`;
		
CREATE TABLE `playlist` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `title` VARCHAR(256) NOT NULL,
  `albumartist` VARCHAR(256) NOT NULL,
  `album` VARCHAR(256) NOT NULL,
  `duration` INTEGER NOT NULL,
  `favorite` TINYINT(1) NOT NULL DEFAULT 0,
  `thumbnail` VARCHAR(256) NOT NULL,
  `source` VARCHAR(256) NOT NULL,
  PRIMARY KEY (`id`)
);

-- INSERT INTO `playlist` (`id`,`title`,`albumartist`,`album`,`duration`,`favorite`,`thumbnail`,`source`) VALUES
-- ('','','','','','','','');

/*  Execute this file from the command line by typing:
 *    mysql -u root < server/scripts/schema.sql
 *  to create the database and the tables.*/