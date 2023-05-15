import{e as T,o as H,c as O,i as u,F as V,f as B,a as j,b as d,S as M,t as f,s as c,p as S}from"./index-3913827d.js";import{u as G,d as J,o as y}from"./connection-utils-49cf70d0.js";import{d as X}from"./delay-utils-7dae93d5.js";const K=`
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
`,q=`
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
`,W="_CPKExportImport_13php_1",Y="_header_13php_7",Q="_content_13php_15",b={CPKExportImport:W,header:Y,content:Q},z=f("<div><header><h2>Test CPK Export/Import</h2></header><div><pre><p></p></pre><ul>"),Z=f("<div><p>Artist: <!> Name: <!> uDeleted: <!> "),ee=f("<p>"),ae=()=>{const[A,a]=T([]),[_,l]=T(""),[L,w]=T([]);let o,g;const $=async()=>{a(t=>t.concat(`* Starting CPKExportImport *

`))},N=async t=>{t.length===0?a(s=>s.concat(`
* The set of tests was successful *
`)):(a(s=>s.concat(`${t}`)),a(s=>s.concat(`
* The set of tests failed *
`)))},h=async t=>{try{let s=await o.query("SELECT * FROM album");w([...s.values]),console.log(`**** Show Albums ${t} ****`);for(const e of s.values)console.log(`>>> artist: ${e.album_artist} name: ${e.album_name} sql_deleted: ${e.sql_deleted}`)}catch(s){let e=s.message?s.message:s;l(n=>n.concat(`Error: ${e}`))}},F=async()=>{try{let t=await c.echo("Hello from echo");if(t.value!=="Hello from echo"){const e=`Error: Echo not returning "Hello from echo"
`;return l(n=>n.concat(e)),Promise.reject()}a(e=>e.concat(`> Echo successful
`)),o=await y("db-cpk",!1,"no-encryption",1,!0);let s=await o.execute(K);if(console.log(`&&&& createSchema ret ${JSON.stringify(s)}`),s.changes.changes<0){const e="Error: Execute createSchema failed";l(n=>n.concat(e));return}if(a(e=>e.concat(`> Create DB Schema 'db-cpk' successful
`)),t=await o.getTableList(),console.log(`&&&& getTableList res ${JSON.stringify(t)}`),t=await o.execute(q),t.changes.changes!==20){const e="Execute insert someData changes != 20";return Promise.reject(e)}if(a(e=>e.concat(`> Execute insert someData successful
`)),S==="web"&&await c.saveToStore("db-cpk"),t=await o.query("SELECT * FROM album"),t.values.length!==4){const e="Query not returning 4 data";return Promise.reject(e)}if(t=await o.query("SELECT * FROM song"),t.values.length!==16){const e="Query not returning 16 data from song";return Promise.reject(e)}a(e=>e.concat(`> Select someData successful
`));return}catch(t){let s=t.message?t.message:t;return l(e=>e.concat(`Error: ${s}`)),Promise.reject()}},C=async t=>{try{if((await c.importFromJson(JSON.stringify(t))).changes.changes===-1){const e=`Error: ImportFromJson dataToImport changes < 0"
`;return l(n=>n.concat(e)),Promise.reject()}a(e=>e.concat(`> importFromJson Full successful
`)),o=await y("db-cpk",!1,"no-encryption",1,!1),a(e=>e.concat(`> Open connection 'db-cpk' successful
`)),S==="web"&&await c.saveToStore("db-cpk");return}catch(s){let e=s.message?s.message:s;return l(n=>n.concat(`Error: ${e}`)),Promise.reject()}},U=async()=>{try{if(g=(await o.exportToJson("full")).export,!(await c.isJsonValid(JSON.stringify(g))).result){let e="Error: isJsonValid Full returns false";return l(n=>n.concat(`Error: ${e}`)),Promise.reject()}if(console.log(`>>> Full export ${JSON.stringify(g)}`),g.tables.length!=2||g.tables[0].values.length!=4||g.tables[1].values.length!=16){let e="Error: Export Full Json not correct";return l(n=>n.concat(`Error: ${e}`)),Promise.reject()}a(e=>e.concat(`> Export Full 'db-cpk' successful
`));return}catch(t){let s=t.message?t.message:t;return l(e=>e.concat(`Error: ${s}`)),Promise.reject()}},x=async()=>{try{let t=await o.createSyncTable();if(t.changes.changes<0){const e='createSyncTable "db-cpk" changes < 0 ';return l(n=>n.concat(`Error: ${e}`)),Promise.reject()}if(a(e=>e.concat(`> createSyncTable  successful
`)),t=await o.getSyncDate(),t.syncDate<=0){const e="getSyncDate return 0 ";l(n=>n.concat(`Error: ${e}`));return}const s=`> getSyncDate "db-cpk" successful
`;a(e=>e.concat(s)),S==="web"&&await c.saveToStore("db-cpk");return}catch(t){let s=t.message?t.message:t;return l(e=>e.concat(`Error: ${s}`)),Promise.reject()}};return H(async()=>{try{await $(),await F(),await x(),await X(2,"before a full export");let t=await o.query("SELECT * from sync_table;",[]);console.log(`>>> retQuery before export full: ${JSON.stringify(t)}`),await U(),await h("after full export"),await J(o),(await c.isConnection("db-cpk",!1)).result&&await c.closeConnection("db-cpk",!1),await C(g),await h("after full import"),await N(_())}catch{await N(_())}}),O(M,{get children(){const t=z(),s=t.firstChild,e=s.nextSibling,n=e.firstChild,v=n.firstChild,D=n.nextSibling;return u(v,G(A)),u(D,O(V,{get each(){return L()},children:r=>(()=>{const i=Z(),m=i.firstChild,E=m.firstChild,I=E.nextSibling,P=I.nextSibling,R=P.nextSibling,k=R.nextSibling,p=k.nextSibling;return p.nextSibling,u(m,()=>r.album_artist,I),u(m,()=>r.album_name,R),u(m,()=>r.sql_deleted,p),i})()})),u(e,(()=>{const r=B(()=>_().length>0);return()=>r()&&(()=>{const i=ee();return u(i,_),i})()})(),null),j(r=>{const i=b.CPKExportImport,m=b.header,E=b.content;return i!==r._v$&&d(t,r._v$=i),m!==r._v$2&&d(s,r._v$2=m),E!==r._v$3&&d(e,r._v$3=E),r},{_v$:void 0,_v$2:void 0,_v$3:void 0}),t}})};export{ae as default};
