import{e as S,o as B,c as w,i as _,F as W,a as q,b as N,S as P,t as D,s as E,p as T}from"./index-3913827d.js";import{u as K,o as J}from"./connection-utils-49cf70d0.js";const Y=`
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
`,k=`
INSERT INTO sample_table (col1,col2,col3,col4) VALUES (1,'asd',1,'test1');
INSERT INTO sample_table (col1,col2,col3,col4) VALUES (2,'asd',2,'test2');
INSERT INTO sample_table (col1,col2,col3,col4) VALUES (2,'asd1',2,'test3');
INSERT INTO sample_table (col1,col2,col3,col4) VALUES (1,'asd1',3,'test4');
`,z=`
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
`,Q=`
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
`,j=`
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
`,Z=`
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
`,ee="_Issue285_pxb3e_1",te="_header_pxb3e_7",se="_content_pxb3e_15",b={Issue285:ee,header:te,content:se},ae=D("<div><header><h2>Test Issue285</h2></header><div><pre><p></p></pre><ul>"),oe=D("<p>Name: <!> Email: <!> "),ie=()=>{const[F,c]=S([]),[g,l]=S(""),[y,le]=S([]),i="test285";let o;const $=async()=>{c(s=>s.concat(`* Starting testDatabaseIssue285 *

`))},U=async s=>{s.length===0?c(e=>e.concat(`
* The set of tests was successful *
`)):(c(e=>e.concat(`${s}`)),c(e=>e.concat(`
* The set of tests failed *
`)))},R=async s=>{try{let e=await o.query("SELECT * FROM sample_table");console.log(`**** Show Sample_Table ${s} ****`);for(const t of e.values)console.log(`>>> col1: ${t.col1} col2: ${t.col2} col3: ${t.col3} sql_deleted: ${t.sql_deleted}`)}catch(e){let t=e.message?e.message:e;l(a=>a.concat(t)),console.log(`errMsg: ${g()}`);return}},f=async s=>{try{let e=await o.query("SELECT * FROM table1");console.log(`**** Show Table1 ${s} ****`);for(const t of e.values)console.log(`>>> col1: ${t.col1} col2: ${t.col2} col3: ${t.col3} sql_deleted: ${t.sql_deleted}`)}catch(e){let t=e.message?e.message:e;l(a=>a.concat(t)),console.log(`errMsg: ${g()}`);return}},O=async s=>{try{let e=await o.query("SELECT * FROM table2");console.log(`**** Show Table2 ${s} ****`);for(const t of e.values)console.log(`>>> id: ${t.id} name: ${t.name} sql_deleted: ${t.sql_deleted}`)}catch(e){let t=e.message?e.message:e;l(a=>a.concat(t)),console.log(`errMsg: ${g()}`);return}},I=async s=>{try{let e=await o.query("SELECT * FROM table3");console.log(`**** Show Table3 ${s} ****`);for(const t of e.values)console.log(`>>> id: ${t.id} name: ${t.name} sql_deleted: ${t.sql_deleted}`)}catch(e){let t=e.message?e.message:e;l(a=>a.concat(t)),console.log(`errMsg: ${g()}`);return}},h=async s=>{try{let e=await o.query("SELECT * FROM album");console.log(`**** Show Album ${s} ****`);for(const t of e.values)console.log(`>>> album_artist: ${t.album_artist} album_name: ${t.album_name} sql_deleted: ${t.sql_deleted}`)}catch(e){let t=e.message?e.message:e;l(a=>a.concat(t)),console.log(`errMsg: ${g()}`);return}},L=async s=>{try{let e=await o.query("SELECT * FROM song");console.log(`**** Show Song ${s} ****`);for(const t of e.values)console.log(`>>> song_id: ${t.song_id} song_artist: ${t.song_artist} song_album: ${t.song_album} sql_deleted: ${t.sql_deleted}`)}catch(e){let t=e.message?e.message:e;l(a=>a.concat(t)),console.log(`errMsg: ${g()}`);return}},C=async()=>{try{let s=await E.echo("Hello from echo");if(s.value!=="Hello from echo"){const a=`Error: Echo not returning "Hello from echo"
`;l(n=>n.concat(a));return}c(a=>a.concat(`> Echo successful
`)),o=await J(i,!1,"no-encryption",1,!0),c(a=>a.concat(`> Open connection '${i}' successful
`));let e=await o.execute(Y);if(console.log(`&&&& createSchema ret ${JSON.stringify(e)}`),e.changes.changes<0){const a="Error: Execute createSchema failed";l(n=>n.concat(a));return}c(a=>a.concat(`> Create DB Schema 'test285 successful
`)),s=await o.getTableList(),console.log(`&&&& getTableList res ${JSON.stringify(s)}`);let t="DELETE FROM sample_table;";if(s=await o.execute(t),console.log(`&&& execute DELETE FROM sample_table res: ${JSON.stringify(s)}`),s=await o.execute(k),s.changes.changes!==4){const a="Execute insert someData changes != 4";l(n=>n.concat(a));return}c(a=>a.concat(`> Execute insert someData successful
`)),T==="web"&&await E.saveToStore(i);return}catch(s){let e=s.message?s.message:s;console.log(`catch message: ${e}`),l(t=>t.concat(`Error: ${e}`))}},x=async s=>{try{let e=await s.createSyncTable();if(e.changes.changes<0){const t="createSyncTable changes < 0 ";l(a=>a.concat(t));return}if(c(t=>t.concat(`> createSyncTable successful
`)),e=await s.getSyncDate(),e.syncDate===0){const t="getSyncDate return 0 ";l(a=>a.concat(t));return}c(t=>t.concat(`> getSyncDate successful
`)),T==="web"&&await E.saveToStore(i);return}catch(e){let t=e.message?e.message:e;l(a=>a.concat(`Error: ${t}`))}},M=async()=>{try{let s="";s=`
            DELETE FROM sample_table WHERE col1 = 1 AND col2 = 'asd';
            `;let e=await o.execute(s);if(c(a=>a.concat(`>>> delete execute res: ${JSON.stringify(e)}`)),e.changes.changes!=1){const a='execute delete "test285" changes !=1 ';l(n=>n.concat(`Error: ${a}`))}if(c(a=>a.concat(`> delete with execute successful
`)),s="DELETE FROM sample_table WHERE col1 = ? AND col2 = ?;",e=await o.run(s,[2,"asd1"]),e.changes.changes!=1){const a='run delete "test285" changes != 1 ';l(n=>n.concat(`Error: ${a}`))}c(a=>a.concat(`> delete with run successful
`));const t=[{statement:"DELETE FROM sample_table WHERE col1 = ? AND col2 = ?;",values:[[2,"asd"],[1,"asd1"]]}];if(e=await o.executeSet(t),e.changes.changes!=2){const a='executeSet delete "test285" changes != 2 ';l(n=>n.concat(`Error: ${a}`))}c(a=>a.concat(`> delete with executeSet successful
`)),T==="web"&&await E.saveToStore(i);return}catch(s){let e=s.message?s.message:s;l(t=>t.concat(`Error: ${e}`))}},H=async()=>{try{let s=await o.execute(z);if(console.log(`&&&& createSchema1 ret ${JSON.stringify(s)}`),s.changes.changes<0){const a="Error: Execute createSchema1 failed";l(n=>n.concat(a));return}c(a=>a.concat(`> Create DB Schema1 'test285 successful
`));let e=await o.getTableList();console.log(`&&&& getTableList res ${JSON.stringify(e)}`);let t="DELETE FROM table1;";if(e=await o.execute(t),console.log(`&&& execute DELETE FROM table1 res: ${JSON.stringify(e)}`),t="DELETE FROM table2;",e=await o.execute(t),console.log(`&&& execute DELETE FROM table2 res: ${JSON.stringify(e)}`),t="DELETE FROM table3;",e=await o.execute(t),console.log(`&&& execute DELETE FROM table3 res: ${JSON.stringify(e)}`),e=await o.execute(Q),e.changes.changes!==10){const a="Execute insert someData1 changes != 10";l(n=>n.concat(a));return}c(a=>a.concat(`> Execute insert someData1 successful
`)),T==="web"&&await E.saveToStore(i);return}catch(s){let e=s.message?s.message:s;console.log(`catch message: ${e}`),l(t=>t.concat(`Error: ${e}`))}},v=async()=>{try{let s="";s=`
            DELETE FROM table1 WHERE col1 = 1 AND col2 = 'ef5c57d5-b885-49a9-9c4d-8b340e4abdbc';
            `;let e=await o.execute(s);if(console.log(`>>> delete execute res: ${JSON.stringify(e)}`),e.changes.changes!=3){const a="Delete from table1 changes != 3";l(n=>n.concat(a));return}if(c(a=>a.concat(`> delete with execute successful
`)),s="DELETE FROM table1 WHERE col1 = ? AND col2 = ?;",e=await o.run(s,[2,"bced3262-5d42-470a-9585-d3fd12c45452"]),console.log(`>>> delete run res: ${JSON.stringify(e)}`),e.changes.changes!=3){const a='run delete "test285" changes != 3 ';l(n=>n.concat(a));return}c(a=>a.concat(`> delete with run successful
`));const t=[{statement:"DELETE FROM table1 WHERE col1 = ? AND col2 = ?;",values:[[2,"ef5c57d5-b885-49a9-9c4d-8b340e4abdbc"],[1,"bced3262-5d42-470a-9585-d3fd12c45452"]]}];if(e=await o.executeSet(t),console.log(`>>> delete executeSet res: ${JSON.stringify(e)}`),e.changes.changes!=6){const a='executeSet delete "test285" changes != 6 ';l(n=>n.concat(a));return}c(a=>a.concat(`> delete with executeSet successful
`)),T==="web"&&await E.saveToStore(i);return}catch(s){let e=s.message?s.message:s;l(t=>t.concat(`Error: ${e}`))}},p=async()=>{try{let s=await o.execute(j);if(console.log(`>>> createSchema2 ret ${JSON.stringify(s)}`),s.changes.changes<0){const t="Error: Execute createSchema2 failed";l(a=>a.concat(t));return}c(t=>t.concat(`> Create DB Schema2 successful
`)),s=await o.getTableList(),console.log(`>>> getTableList res ${JSON.stringify(s)}`);let e="DELETE FROM song;";if(s=await o.execute(e),console.log(`>>> execute DELETE FROM song res: ${JSON.stringify(s)}`),e="DELETE FROM album;",s=await o.execute(e),console.log(`>>> execute DELETE FROM album res: ${JSON.stringify(s)}`),s=await o.execute(Z),s.changes.changes!==20){const t="Execute insert someData2 changes != 20";l(a=>a.concat(t));return}if(c(t=>t.concat(`> Execute insert someData2 successful
`)),T==="web"&&await E.saveToStore(i),s=await o.query("SELECT * FROM album"),s.values.length!==4){const t="Query not returning 4 data";l(a=>a.concat(t));return}if(s=await o.query("SELECT * FROM song"),s.values.length!==16){const t="Query not returning 16 data from song";l(a=>a.concat(t));return}c(t=>t.concat(`> Select someData2 successful
`));return}catch(s){let e=s.message?s.message:s;console.log(`Error: ${e}`),l(t=>t.concat(e));return}},G=async()=>{try{let s="";s=`
            DELETE FROM album WHERE album_artist = 'The Beatles' AND album_name = 'Abbey Road';
            `;let e=await o.execute(s);if(console.log(`>>> delete execute res: ${JSON.stringify(e)}`),e.changes.changes!=4){const a='execute delete "test285" changes != 4 ';l(n=>n.concat(a));return}if(c(a=>a.concat(`> delete with execute successful
`)),s="DELETE FROM album WHERE album_artist = ? AND album_name = ?;",e=await o.run(s,["The Beatles","Help!"]),console.log(`>>> delete run res: ${JSON.stringify(e)}`),e.changes.changes!=4){const a='run delete "test285" changes != 4 ';l(n=>n.concat(a));return}c(a=>a.concat(`> delete with run successful
`));const t=[{statement:"DELETE FROM album WHERE album_artist = ? AND album_name = ?;",values:[["The Rolling Stones","Sticky Fingers"],["The Rolling Stones","Hyde Park Live"]]}];if(e=await o.executeSet(t),console.log(`>>> delete executeSet res: ${JSON.stringify(e)}`),e.changes.changes!=12){const a='executeSet delete "test285" changes != 12 ';l(n=>n.concat(a));return}c(a=>a.concat(`> delete with executeSet successful
`)),T==="web"&&await E.saveToStore(i);return}catch(s){let e=s.message?s.message:s;l(t=>t.concat(e));return}};return B(async()=>{await $(),await C(),await x(o),await R("initial data"),await M(),await R("after delete data"),await H(),await f("initial data"),await O("initial data"),await I("initial data"),await v(),await f("after delete data"),await O("after delete data"),await I("after delete data"),await p(),await h("initial data"),await L("initial data"),await G(),await h("after delete data"),await L("after delete data"),await U(g()),await E.closeConnection(i,!1)}),w(P,{get children(){const s=ae(),e=s.firstChild,t=e.nextSibling,a=t.firstChild,n=a.firstChild,V=a.nextSibling;return _(n,K(F)),_(V,w(W,{get each(){return y()},children:r=>(()=>{const d=oe(),u=d.firstChild,m=u.nextSibling,X=m.nextSibling,A=X.nextSibling;return A.nextSibling,_(d,()=>r.key,m),_(d,()=>r.value,A),d})()})),q(r=>{const d=b.Issue2857,u=b.header,m=b.content;return d!==r._v$&&N(s,r._v$=d),u!==r._v$2&&N(e,r._v$2=u),m!==r._v$3&&N(t,r._v$3=m),r},{_v$:void 0,_v$2:void 0,_v$3:void 0}),s}})};export{ie as default};
