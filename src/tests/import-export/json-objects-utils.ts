import { capSQLiteSet } from '@capacitor-community/sqlite';
import { Images } from './base64Images';

/*****************
 * The columns sql_deleted & last_modified
 * are only required when you want to synchronize
 * the database to a remote server
 * In that case you also needs to define a
 * _trigger_last_modified trigger for each table
 * of your database
 */

export const dataToImport: any = {
    database : "db-from-json",
    version : 1,
    encrypted : false,
    mode : "full",
    tables :[
        {
            name: "users",
            schema: [
                {column:"id", value: "INTEGER PRIMARY KEY NOT NULL"},
                {column:"email", value:"TEXT UNIQUE NOT NULL"},
                {column:"name", value:"TEXT"},
                {column:"age", value:"INTEGER"},
                {column:"sql_deleted", value:"BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"},
                {column:"last_modified", value:"INTEGER DEFAULT (strftime('%s', 'now'))"}
            ],
            indexes: [
                {name: "index_user_on_name",value: "name"},
                {name: "index_user_on_last_modified",value: "last_modified DESC"},
                {name: "index_user_on_email_name", value: "email ASC, name", mode: "UNIQUE"}
            ],
            values: [
                [1,"Whiteley.com","Whiteley",30,0,1582536810],
                [2,"Jones.com","Jones",44,0,1582812800],
                [3,"Simpson@example.com","Simpson",69,0,1583570630],
                [4,"Brown@example.com","Brown",15,0,1590383895]
            ]
        },
        {
          name: "messages",
          schema: [
            {column:"id", value: "INTEGER PRIMARY KEY NOT NULL"},
            {column:"userid", value: "INTEGER"},
            {column:"title", value:"TEXT NOT NULL"},
            {column:"body", value:"TEXT NOT NULL"},
            {column:"sql_deleted", value:"BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"},
            {column:"last_modified", value:"INTEGER DEFAULT (strftime('%s', 'now'))"},
            {foreignkey: "userid", value:"REFERENCES users(id) ON DELETE CASCADE"}
          ],
          values: [
              [1,3,"test post 1","content test post 1",0,1587310030],
              [2,1,"test post 2","content test post 2",0,1590388125]
          ]
        },
        {
          name: "images",
          schema: [
            {column:"id", value: "INTEGER PRIMARY KEY NOT NULL"},
            {column:"name", value:"TEXT UNIQUE NOT NULL"},
            {column:"type", value:"TEXT NOT NULL"},
            {column:"size", value:"INTEGER"},
            {column:"img", value:"BLOB"},
            {column:"sql_deleted", value:"BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"},
            {column:"last_modified", value:"INTEGER DEFAULT (strftime('%s', 'now'))"}
          ],
          values: [
            [1,"feather","png",null,Images[1],0,1582536810],
            [2,"meowth","png",null,Images[0],0,1590151132]
          ]
        }

    ]
}; 
export const partialImport1: any = {
  database : "db-from-json",
  version : 1,
  encrypted : false,
  mode : "partial",
  tables :[
      {
        name: "messages",
        indexes: [
          {name: "index_messages_on_title",value: "title"},
          {name: "index_messages_on_last_modified",value: "last_modified DESC"}

        ],
        values: [
            [2,1,"test post 2","content test post 2",1,1590388125],
            [3,3,"test post 3","content test post 3",0,1590396146],
            [4,2,"test post 4","content test post 4",0,1590396288]
        ]
      },
      {
        name: "users",
        values: [
            [5,"Addington.com","Addington",22,0,1590388335],
            [1,"Whiteley.com","Whiteley",30,1,1590388335],
            [6,"Bannister.com","Bannister",59,0,1590393015],
            [2,"Jones@example.com","Jones",45,0,1590393325],
            [3,"Simpson@example.com","Simpson",69,0,1583570630]
        ]
      }
  ]
};

export const partialImport2: any = {
  database : "db-from-json",
  version : 1,
  encrypted : false,
  mode : "partial",
  tables :[
    {
      name: "users",
      values: [
          [3,"Simpson@example.com","Simpson",69,1,1583570630]
      ]
    },

    {
      name: "messages",
      values: [
        [1,3,"test post 1","content test post 1",1,1587310030],
        [3,3,"test post 3","content test post 3",1,1590396146],
      ]
    }
  ]
};

export const dataToImport265: any = {
  database : "db-issue265",
  version : 1,
  encrypted : false,
  mode : "full",
  tables :[
      {
        name: "sites",
        schema: [
          { column: "id", value: "INTEGER PRIMARY KEY NOT NULL" },
          { column: "siteId", value: "TEXT UNIQUE NOT NULL" },
          { column: "code", value: "TEXT NOT NULL" },
          { column: "officeCode", value: "TEXT NOT NULL" },
          { column: "name", value: "TEXT NOT NULL" },
          { column: "address", value: "TEXT" },
          { column: "city", value: "TEXT" },
          { column: "province", value: "TEXT" },
          { column: "country", value: "TEXT" },
          { column: "zip", value: "TEXT" },
          { column: "email", value: "TEXT" },
          { column: "telephone", value: "TEXT" },
          { column: "lat", value: "TEXT" },
          { column: "lng", value: "TEXT" },
          { column:"sql_deleted", value:"BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"},
          { column:"last_modified", value:"INTEGER DEFAULT (strftime('%s', 'now'))"}
        ],
      }
  ]
}