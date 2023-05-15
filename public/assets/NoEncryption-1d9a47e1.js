import{e as O,o as H,c as y,i as f,F as M,a as W,b as _,S as q,t as A,s as g,p as S}from"./index-3913827d.js";import{u as B,o as $}from"./connection-utils-49cf70d0.js";import{d as P}from"./delay-utils-7dae93d5.js";const V=`
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
`,N=[["Whiteley","Whiteley.com",30],["Jones","Jones.com",44]],K=`
INSERT INTO users (name,email,age) VALUES ("${N[0][0]}","${N[0][1]}",${N[0][2]});
INSERT INTO users (name,email,age) VALUES ("${N[1][0]}","${N[1][1]}",${N[1][2]});
`,Y=[{statement:"INSERT INTO users (name,email,company,size,age) VALUES (?,?,?,?,?);",values:[["Jackson","Jackson@example.com",null,null,18],["Bush","Bush@example.com",null,null,null]]},{statement:"INSERT INTO users (name,email,age) VALUES (?,?,?);",values:["Kennedy","Kennedy@example.com",25]},{statement:"INSERT INTO users (name,email,company,size,age) VALUES (?,?,?,?,?);",values:["Jeep","Jeep@example.com","example",null,null]}],z="_NoEncryption_hdh1k_1",k="_header_hdh1k_7",Q="_content_hdh1k_15",R={NoEncryption:z,header:k,content:Q},j=A("<div><header><h2>Test No Encryption</h2></header><div><pre><p></p></pre><ul>"),Z=A("<p>Name: <!> Email: <!> Deleted: <!> "),ae=()=>{const[x,c]=O([]),[I,r]=O(""),[p,D]=O([]);let i,d;const U=async()=>{c(e=>e.concat(`* Starting testDatabaseNoEncryption *

`))},F=async e=>{e.length===0?c(t=>t.concat(`
* The set of tests was successful *
`)):(c(t=>t.concat(`${e}`)),c(t=>t.concat(`
* The set of tests failed *
`)))},b=async()=>{try{let e=await g.echo("Hello from echo");if(e.value!=="Hello from echo"){const a=`Error: Echo not returning "Hello from echo"
`;r(o=>o.concat(a));return}c(a=>a.concat(`> Echo successful
`)),i=await $("testNew",!1,"no-encryption",1,!0),c(a=>a.concat(`> Open connection 'testNew' successful
`));let t=await i.execute(V);if(console.log(`&&&& createSchema ret ${JSON.stringify(t)}`),t.changes.changes<0){const a="Error: Execute createSchema failed";r(o=>o.concat(a));return}c(a=>a.concat(`> Create DB Schema 'testNew' successful
`)),e=await i.getTableList(),console.log(`&&&& getTableList res ${JSON.stringify(e)}`);let s="DELETE FROM users;";if(e=await i.execute(s),console.log(`&&& execute DELETE FROM users res: ${JSON.stringify(e)}`),e=await i.execute(K),e.changes.changes!==2){const a="Execute insert twoUsers changes != 2";r(o=>o.concat(a));return}if(c(a=>a.concat(`> Execute insert two users successful
`)),S==="web"&&await g.saveToStore("testNew"),e=await i.query("SELECT * FROM users"),e.values.length!==2||e.values[0].name!=="Whiteley"||e.values[1].name!=="Jones"){const a="Query not returning two users";r(o=>o.concat(a));return}c(a=>a.concat(`> Select two users successful
`));const n="INSERT INTO users (name,email,age) VALUES (?,?,?)",m=["Simpson","Simpson@example.com",69];if(t=await i.run(n,m),t.changes.lastId!==3){const a="Run insert one user lastId != 3";r(o=>o.concat(a));return}if(e=await i.executeSet(Y),e.changes.changes!==4){const a="Execute insert fourUsers changes != 4";r(o=>o.concat(a));return}c(a=>a.concat(`> Execute insert four users successful
`)),S==="web"&&await g.saveToStore("testNew"),d=await $("db_tab3",!1,"no-encryption",1,!0),c(a=>a.concat(`> Open connection 'db_tab3' successful
`));const h=`
                CREATE TABLE IF NOT EXISTS test (
                userId INTEGER PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                country TEXT NOT NULL
                );
            `;if(t=await d.execute(h),console.log(`&&&& createSchema 'db_tab3' ret ${JSON.stringify(t)}`),t.changes.changes<0){const a="Error: Execute createSchema 'db_tab3' failed";r(o=>o.concat(a));return}c(a=>a.concat(`> Create DB Schema 'db_tab3' successful
`)),e=await d.getTableList(),console.log(`&&&& getTableList res ${JSON.stringify(e)}`);const l="SELECT * FROM test;",E=[];let u=await d.query(l,E);console.log(`&&&& select result ${JSON.stringify(u.values)};`);let T="INSERT INTO test (userId, name, email, country) VALUES(1, 'Jeep', 'jeep@email.com', 'france');";if(e=await d.run(T,[]),e.changes.lastId!==1){const a="Run insert one user lastId != 1";r(o=>o.concat(a));return}console.log(`&&&& INSERT res.changes.changes: ${e.changes.changes}`),u=await d.query(l,E),console.log(`&&&& after INSERT select result ${JSON.stringify(u.values)};`),T="REPLACE INTO test (userId, name, email, country) VALUES(1, 'Maria', 'maria@email.com', 'france');",e=await d.run(T,[]),console.log(`&&&& REPLACE res.changes: ${JSON.stringify(e.changes)}`),u=await d.query(l,E),console.log(`&&&& after REPLACE select result ${JSON.stringify(u.values)};`),await g.closeConnection("db_tab3",!1)}catch(e){let t=e.message?e.message:e;r(s=>s.concat(`Error: ${t}`))}},w=async e=>{try{let t=await i.query("SELECT * FROM users");D([...t.values]),console.log(`**** Show Users ${e} ****`);for(const s of t.values)console.log(`>>> id: ${s.id} name: ${s.name} sql_deleted: ${s.sql_deleted}`)}catch(t){let s=t.message?t.message:t;r(n=>n.concat(`Error: ${s}`))}},C=async()=>{try{let e=await i.createSyncTable();if(e.changes.changes<0){const s='createSyncTable "testNew" changes < 0 ';r(n=>n.concat(`Error: ${s}`));return}if(c(s=>s.concat(`> createSyncTable  successful
`)),e=await i.getSyncDate(),e.syncDate===0){const s="getSyncDate return 0 ";r(n=>n.concat(`Error: ${s}`));return}const t=`> getSyncDate "testNew" successful
`;c(s=>s.concat(t)),S==="web"&&await g.saveToStore("testNew")}catch(e){let t=e.message?e.message:e;r(s=>s.concat(`Error: ${t}`))}},v=async()=>{try{let t="";t=`
            DELETE FROM users WHERE id = 4;
            DELETE FROM users WHERE id = 5;
            `,console.log(`in deleteTest stmt: ${t}`);var e=await i.execute(t);if(console.log(`delete execute res: ${JSON.stringify(e)}`),e.changes.changes!=2){const n='execute delete "testNew" changes != 2 ';r(m=>m.concat(`Error: ${n}`));return}if(c(n=>n.concat(`> delete with execute successful
`)),t="DELETE FROM users WHERE id = ?;",e=await i.run(t,[2]),e.changes.changes!=1){const n='run delete "testNew" changes != 2 ';r(m=>m.concat(`Error: ${n}`));return}c(n=>n.concat(`> delete with run  successful
`));const s=[{statement:"DELETE FROM users WHERE id = ?;",values:[[3],[1]]}];if(e=await i.executeSet(s),e.changes.changes!=2){const n='executeSet delete "testNew" changes != 2 ';r(m=>m.concat(`Error: ${n}`));return}c(n=>n.concat(`> delete with executeSet successful
`)),S==="web"&&await g.saveToStore("testNew")}catch(t){let s=t.message?t.message:t;r(n=>n.concat(`Error: ${s}`))}},X=async()=>{try{let e=await i.exportToJson("full");if(!(await g.isJsonValid(JSON.stringify(e.export))).result){let s="Error: isJsonValid Full returns false";r(n=>n.concat(`Error: ${s}`));return}c(s=>s.concat(`> export full successful
`))}catch(e){let t=e.message?e.message:e;r(s=>s.concat(`Error: ${t}`))}},J=async()=>{try{await i.setSyncDate(new Date().toISOString()),c(e=>e.concat(`> localSynchronization setSyncDate successful
`)),await i.deleteExportedRows(),c(e=>e.concat(`> localSynchronization deleteExportedRows successful
`));return}catch(e){let t=e.message?e.message:e;r(s=>s.concat(`Error: ${t}`)),console.log(`>>> errMsg: ${I()}`)}};return H(async()=>{await U(),await b(),await C(),await v(),await w("before full export"),await P(2,"before a full export"),await X(),await J(),await w("final"),await F(I()),await g.closeConnection("testNew",!1)}),y(q,{get children(){const e=j(),t=e.firstChild,s=t.nextSibling,n=s.firstChild,m=n.firstChild,h=n.nextSibling;return f(m,B(x)),f(h,y(M,{get each(){return p()},children:l=>(()=>{const E=Z(),u=E.firstChild,T=u.nextSibling,a=T.nextSibling,o=a.nextSibling,G=o.nextSibling,L=G.nextSibling;return L.nextSibling,f(E,()=>l.name,T),f(E,()=>l.email,o),f(E,()=>l.sql_deleted,L),E})()})),W(l=>{const E=R.NoEncryption,u=R.header,T=R.content;return E!==l._v$&&_(e,l._v$=E),u!==l._v$2&&_(t,l._v$2=u),T!==l._v$3&&_(s,l._v$3=T),l},{_v$:void 0,_v$2:void 0,_v$3:void 0}),e}})};export{ae as default};
