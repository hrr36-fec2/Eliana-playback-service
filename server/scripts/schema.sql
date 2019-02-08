DROP DATABASE IF EXISTS `playlist`;

CREATE DATABASE playlist;

USE playlist;

DROP TABLE IF EXISTS `playlist`;
		
CREATE TABLE `playlist` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `track_id` INTEGER NOT NULL,
  `track_title` VARCHAR(256),
  `artist_name` VARCHAR(256),
  `album_title` VARCHAR(256),
  `track_duration` INTEGER,
  `favorite` TINYINT(1) DEFAULT 0,
  `album_image_file` VARCHAR(256),
  `track_file_url` VARCHAR(256),
  PRIMARY KEY (`id`)
);
