import { capSQLiteSet } from '@capacitor-community/sqlite';

/*****************
 * The columns sql_deleted & last_modified
 * are only required when you want to synchronize
 * the database to a remote server
 * In that case you also needs to define a
 * _trigger_last_modified trigger for each table
 * of your database
 */
export const createSchema: string = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    company TEXT,
    size REAL,
    age INTEGER,
    sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
    last_modified INTEGER DEFAULT (strftime('%s', 'now'))
);
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY NOT NULL,
  userid INTEGER,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
  last_modified INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (userid) REFERENCES users(id) ON DELETE SET DEFAULT
);
CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY NOT NULL,
  name TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  size INTEGER,
  img BLOB,
  sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
  last_modified INTEGER DEFAULT (strftime('%s', 'now'))
);
CREATE INDEX IF NOT EXISTS users_index_name ON users (name);
CREATE INDEX IF NOT EXISTS users_index_last_modified ON users (last_modified);
CREATE INDEX IF NOT EXISTS messages_index_name ON messages (title);
CREATE INDEX IF NOT EXISTS messages_index_last_modified ON messages (last_modified);
CREATE INDEX IF NOT EXISTS images_index_name ON images (name);
CREATE INDEX IF NOT EXISTS images_index_last_modified ON images (last_modified);
CREATE TRIGGER IF NOT EXISTS users_trigger_last_modified
AFTER UPDATE ON users
FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified
BEGIN
    UPDATE users SET last_modified = (strftime('%s', 'now')) WHERE id=OLD.id;
END;
CREATE TRIGGER IF NOT EXISTS messages_trigger_last_modified
AFTER UPDATE ON messages
FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified
BEGIN
    UPDATE messages SET last_modified = (strftime('%s', 'now')) WHERE id=OLD.id;
END;
CREATE TRIGGER IF NOT EXISTS images_trigger_last_modified
AFTER UPDATE ON images
FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified
BEGIN
    UPDATE images SET last_modified = (strftime('%s', 'now')) WHERE id=OLD.id;
END;
PRAGMA user_version = 1;
`;    

// Insert some Users
const row: Array<Array<any>> = [["Whiteley","Whiteley.com",30],["Jones","Jones.com",44]];
export const twoUsers: string = `
INSERT INTO users (name,email,age) VALUES ("${row[0][0]}","${row[0][1]}",${row[0][2]});
INSERT INTO users (name,email,age) VALUES ("${row[1][0]}","${row[1][1]}",${row[1][2]});
`;
// Insert a set of users
export const fourUsers: Array<capSQLiteSet>  = [
  { statement:"INSERT INTO users (name,email,company,size,age) VALUES (?,?,?,?,?);",
    values:[
        ["Jackson","Jackson@example.com",null,null,18],
        ["Bush","Bush@example.com",null,null,null]
    ]
  },
  { statement:"INSERT INTO users (name,email,age) VALUES (?,?,?);",
    values:["Kennedy","Kennedy@example.com",25]
  },
  { statement:"INSERT INTO users (name,email,company,size,age) VALUES (?,?,?,?,?);",
    values:["Jeep","Jeep@example.com","example",null,null]
  },
];

export const createContactSchema: string = `
CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT
};
`;
