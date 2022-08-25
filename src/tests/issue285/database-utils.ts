

export const createSchema = `
CREATE TABLE IF NOT EXISTS sample_table (
    col1 INTEGER NOT NULL,
    col2 TEXT NOT NULL,
    col3 INTEGER NOT NULL,
    col4 TEXT,
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    PRIMARY KEY (col1,col2)
);

CREATE INDEX IF NOT EXISTS sample_table_index_last_modified ON sample_table (last_modified);
CREATE TRIGGER IF NOT EXISTS sample_table_trigger_last_modified
AFTER UPDATE ON sample_table
FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified
BEGIN
    UPDATE sample_table SET last_modified = (strftime('%s', 'now')) WHERE col1=OLD.col1 AND col2=OLD.col2;
END;
PRAGMA user_version = 1;
`;

export const someData = `
INSERT INTO sample_table (col1,col2,col3,col4) VALUES (1,'asd',1,'test1');
INSERT INTO sample_table (col1,col2,col3,col4) VALUES (2,'asd',2,'test2');
INSERT INTO sample_table (col1,col2,col3,col4) VALUES (2,'asd1',2,'test3');
INSERT INTO sample_table (col1,col2,col3,col4) VALUES (1,'asd1',3,'test4');
`;

export const createSchema1 = `
CREATE TABLE IF NOT EXISTS table1 (
    col1 INTEGER NOT NULL,
    col2 TEXT NOT NULL,
    col3 INTEGER NOT NULL,
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
    last_modified INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (col1) REFERENCES table2(id) ON DELETE CASCADE,
    FOREIGN KEY (col2) REFERENCES table3(id) ON DELETE CASCADE,
    PRIMARY KEY (col1,col2)
);

CREATE INDEX IF NOT EXISTS table1_index_last_modified ON table1 (last_modified);
CREATE TRIGGER IF NOT EXISTS table1_trigger_last_modified
AFTER UPDATE ON table1
FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified
BEGIN
    UPDATE table1 SET last_modified = (strftime('%s', 'now')) WHERE col1=OLD.col1 AND col2=OLD.col2;
END;
CREATE TABLE IF NOT EXISTS table2 (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
    last_modified INTEGER DEFAULT (strftime('%s', 'now'))
);
CREATE INDEX IF NOT EXISTS table2_index_last_modified ON table2 (last_modified);
CREATE TRIGGER IF NOT EXISTS table2_trigger_last_modified
AFTER UPDATE ON table2
FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified
BEGIN
    UPDATE table2 SET last_modified = (strftime('%s', 'now')) WHERE id=OLD.id;
END;
CREATE TABLE IF NOT EXISTS table3 (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
    last_modified INTEGER DEFAULT (strftime('%s', 'now'))
);
CREATE INDEX IF NOT EXISTS table3_index_last_modified ON table3 (last_modified);
CREATE TRIGGER IF NOT EXISTS table3_trigger_last_modified
AFTER UPDATE ON table3
FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified
BEGIN
    UPDATE table3 SET last_modified = (strftime('%s', 'now')) WHERE id=OLD.id;
END;

PRAGMA user_version = 1;
`;

export const someData1 = `
INSERT INTO table2 (id,name) VALUES (1,'asdasd1');
INSERT INTO table2 (id,name) VALUES (2,'asdasd2');
INSERT INTO table2 (id,name) VALUES (3,'asdasd3');
INSERT INTO table3 (id,name) VALUES ('ef5c57d5-b885-49a9-9c4d-8b340e4abdbc','bsdbsd1');
INSERT INTO table3 (id,name) VALUES ('bced3262-5d42-470a-9585-d3fd12c45452','bsdbsd2');
INSERT INTO table3 (id,name) VALUES ('cbed3263-5d43-480b-9585-k3fd12c53491','bsdbsd3');
INSERT INTO table1 (col1,col2,col3) VALUES (1,'ef5c57d5-b885-49a9-9c4d-8b340e4abdbc',1);
INSERT INTO table1 (col1,col2,col3) VALUES (2,'ef5c57d5-b885-49a9-9c4d-8b340e4abdbc',2);
INSERT INTO table1 (col1,col2,col3) VALUES (2,'bced3262-5d42-470a-9585-d3fd12c45452',2);
INSERT INTO table1 (col1,col2,col3) VALUES (1,'bced3262-5d42-470a-9585-d3fd12c45452',3);
`;

export const createSchema2 = `
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
    FOREIGN KEY (song_artist,song_album) REFERENCES album(album_artist, album_name) ON DELETE CASCADE
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
export const someData2 = `
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

