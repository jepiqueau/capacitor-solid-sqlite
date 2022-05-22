import { capSQLiteSet } from '@capacitor-community/sqlite';


export const createKeyValueSchema: string = `
CREATE TABLE IF NOT EXISTS keysvalues (
    id TEXT PRIMARY KEY NOT NULL,
    key TEXT UNIQUE NOT NULL,
    value TEXT
);
CREATE INDEX IF NOT EXISTS keysvalues_index_key ON keysvalues (key);
`;
// Insert a set of key/value
export const fiveKeysValues: Array<capSQLiteSet>  = [
  { statement:"INSERT INTO keysvalues (id,key,value) VALUES (?,?,?);",
    values:[
        ['10c380e4-0d26-4fd3-b11f-f867b38ff3b6','key1','{"a":5,"b":"Hello from World"}'],
        ['d9333a5-87d3-4675-8bc5-0c4e076fffa3','key2','"Hello World from Jeep"'],
        ['79a8b8ab-f93d-4be0-8ef0-18652c4bb2a4','key3','{"title":"title test","data":{"page":500,"author":"myAuthor"}}'],
        ['5b085e5d-3d7d-431a-a1b0-379dbe08e18d','key4','45'],
        ['bbbadd00-1225-49b6-a9ad-038fc67e6718','key5','{"session":"opened}']
    ]
  },
];