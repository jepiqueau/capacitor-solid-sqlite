export const createSchema: string = `
CREATE TABLE IF NOT EXISTS album (
    album_artist TEXT NOT NULL,
    album_name TEXT NOT NULL,
    album_date TEXT,
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    PRIMARY KEY (album_artist, album_name)
);
CREATE INDEX IF NOT EXISTS album_index_last_modified ON album (last_modified);
CREATE TRIGGER IF NOT EXISTS album_trigger_last_modified
AFTER UPDATE ON album
FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified
BEGIN
    UPDATE album SET last_modified = (strftime('%s', 'now')) WHERE album_artist=OLD.album_artist AND album_name=OLD.album_name;
END;
CREATE TABLE IF NOT EXISTS song (
    song_id INTEGER PRIMARY KEY NOT NULL,
    song_artist TEXT NOT NULL,
    song_album TEXT NOT NULL,
    song_name TEXT NOT NULL,
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (song_artist, song_album) REFERENCES album(album_artist,album_name) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS song_index_last_modified ON song (last_modified);
CREATE TRIGGER IF NOT EXISTS song_trigger_last_modified
AFTER UPDATE ON song
FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified
BEGIN
    UPDATE song SET last_modified = (strftime('%s', 'now')) WHERE song_id=OLD.song_id;
END;
PRAGMA user_version = 1;
`;
export const someData: string = `
INSERT INTO album (album_artist,album_name,album_date) VALUES ('The Rolling Stones','Sticky Fingers','1971');
INSERT INTO album (album_artist,album_name,album_date) VALUES ('The Rolling Stones','Hyde Park Live','2013');
INSERT INTO album (album_artist,album_name,album_date) VALUES ('The Beatles','Abbey Road','1969');
INSERT INTO album (album_artist,album_name,album_date) VALUES ('The Beatles','Help!','1965');
INSERT INTO song (song_id,song_artist,song_album,song_name) VALUES (1,'The Rolling Stones','Sticky Fingers','Brown Sugar');
INSERT INTO song (song_id,song_artist,song_album,song_name) VALUES (2,'The Rolling Stones','Sticky Fingers','Sway');
INSERT INTO song (song_id,song_artist,song_album,song_name) VALUES (3,'The Rolling Stones','Sticky Fingers','Wild Horses');
INSERT INTO song (song_id,song_artist,song_album,song_name) VALUES (4,'The Rolling Stones','Sticky Fingers',"Can't You Hear Me Knock");
INSERT INTO song (song_id,song_artist,song_album,song_name) VALUES (5,'The Rolling Stones','Sticky Fingers','You Gotta Move');
INSERT INTO song (song_id,song_artist,song_album,song_name) VALUES (6,'The Rolling Stones','Sticky Fingers','Bitch');
INSERT INTO song (song_id,song_artist,song_album,song_name) VALUES (7,'The Rolling Stones','Sticky Fingers','I Got The Blues');
INSERT INTO song (song_id,song_artist,song_album,song_name) VALUES (8,'The Rolling Stones','Sticky Fingers','Sister Morphine');
INSERT INTO song (song_id,song_artist,song_album,song_name) VALUES (9,'The Rolling Stones','Hyde Park Live','Start Me Up');
INSERT INTO song (song_id,song_artist,song_album,song_name) VALUES (10,'The Rolling Stones','Hyde Park Live',"It's Only Rock 'n' Roll");
INSERT INTO song (song_id,song_artist,song_album,song_name) VALUES (11,'The Beatles','Abbey Road','Come Together');
INSERT INTO song (song_id,song_artist,song_album,song_name) VALUES (12,'The Beatles','Abbey Road','Something');
INSERT INTO song (song_id,song_artist,song_album,song_name) VALUES (13,'The Beatles','Abbey Road',"Maxwell's Silver Hammer");
INSERT INTO song (song_id,song_artist,song_album,song_name) VALUES (14,'The Beatles','Help!','Help!');
INSERT INTO song (song_id,song_artist,song_album,song_name) VALUES (15,'The Beatles','Help!','The Night Before');
INSERT INTO song (song_id,song_artist,song_album,song_name) VALUES (16,'The Beatles','Help!',"You’ve Got To Hide Your Love Away");
`;

