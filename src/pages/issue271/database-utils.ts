import { capSQLiteSet } from '@capacitor-community/sqlite';


export const createContactSchema: string = `
CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT
);
`;
// Insert a set of contactss
export const fiveContacts: Array<capSQLiteSet>  = [
  { statement:"INSERT INTO contacts (name,email) VALUES (?,?);",
    values:[
        ["Jackson","Jackson@example.com"],
        ["Bush","Bush@example.com"],
        ["Jones","Jones@example.com"]
    ]
  },
  { statement:"INSERT INTO contacts (name,email) VALUES (?,?);",
    values:["Kennedy","Kennedy@example.com"]
  },
  { statement:"INSERT INTO contacts (name,email) VALUES (?,?);",
    values:["Jeep","Jeep@example.com"]
  },
];