import{e as E,o as R,c as S,i as f,F as L,a as p,b as v,S as C,t as $,s as g,p as T}from"./index-3913827d.js";import{u as F,o as M}from"./connection-utils-49cf70d0.js";const D=`
CREATE TABLE IF NOT EXISTS keysvalues (
    id TEXT PRIMARY KEY NOT NULL,
    key TEXT UNIQUE NOT NULL,
    value TEXT
);
CREATE INDEX IF NOT EXISTS keysvalues_index_key ON keysvalues (key);
`,A=[{statement:"INSERT INTO keysvalues (id,key,value) VALUES (?,?,?);",values:[["10c380e4-0d26-4fd3-b11f-f867b38ff3b6","key1",'{"a":5,"b":"Hello from World"}'],["d9333a5-87d3-4675-8bc5-0c4e076fffa3","key2",'"Hello World from Jeep"'],["79a8b8ab-f93d-4be0-8ef0-18652c4bb2a4","key3",'{"title":"title test","data":{"page":500,"author":"myAuthor"}}'],["5b085e5d-3d7d-431a-a1b0-379dbe08e18d","key4","45"],["bbbadd00-1225-49b6-a9ad-038fc67e6718","key5",'{"session":"opened}']]}],H="_Issue275_163zv_1",U="_header_163zv_7",J="_content_163zv_15",h={Issue275:H,header:U,content:J},X=$("<div><header><h2>Test Issue275</h2></header><div><pre><p></p></pre><ul>"),W=$("<p>Name: <!> Email: <!> "),B=()=>{const[w,l]=E([]),[k,r]=E(""),[_,x]=E([]);let o;const V=async()=>{l(e=>e.concat(`* Starting testDatabaseIssue275 *

`))},I=async e=>{e.length===0?l(s=>s.concat(`
* The set of tests was successful *
`)):(l(s=>s.concat(`${e}`)),l(s=>s.concat(`
* The set of tests failed *
`)))},N=async()=>{try{let e=await g.echo("Hello from echo");if(e.value!=="Hello from echo"){const a=`Error: Echo not returning "Hello from echo"
`;r(n=>n.concat(a));return}if(l(a=>a.concat(`> Echo successful
`)),o=await M("testKeysValues",!1,"no-encryption",1,!0),l(a=>a.concat(`> Open connection 'testKeysValues' successful
`)),(await o.execute(D)).changes.changes<0){const a="Error: Execute createSchema failed";r(n=>n.concat(a));return}l(a=>a.concat(`> Create DB Schema 'testKeysValues' successful
`));let c="DELETE FROM keysvalues;";if(e=await o.execute(c),console.log(`Delete from ${JSON.stringify(e)}`),e=await o.executeSet(A),console.log(`ExecuteSet ${JSON.stringify(e)}`),e.changes.changes!==5){const a="ExecuteSet five KeysValues changes != 5";r(n=>n.concat(a));return}l(a=>a.concat(`> ExecuteSet five KeysValues successful
`));let t='INSERT INTO keysvalues (id,key,value) VALUES ("5b085e5d-3d7d-431a-a1b0-379dbe08k25d","key6","32");';e=await o.execute(t),console.log(`Execute Insert ${JSON.stringify(e)}`),t="INSERT INTO keysvalues (id,key,value) VALUES (?,?,?);";let u=["5c095e5d-3d7d-431a-a1b0-379dbe08k25d","key7","38"];if(e=await o.run(t,u),console.log(`Run Insert ${JSON.stringify(e)}`),T==="web"&&await g.saveToStore("testKeysValues"),e=await o.query("SELECT * FROM keysvalues"),e.values.length!==7||e.values[0].key!=="key1"||e.values[1].key!=="key2"||e.values[2].key!=="key3"||e.values[3].key!=="key4"||e.values[4].key!=="key5"||e.values[5].key!=="key6"||e.values[6].key!=="key7"){const a="Query not returning seven KeysValues";r(n=>n.concat(a));return}l(a=>a.concat(`> Select seven KeysValues successful
`))}catch(e){let s=e.message?e.message:e;r(c=>c.concat(`Error: ${s}`))}},m=async e=>{try{let s=await o.query("SELECT * FROM keysvalues");x([...s.values]),console.log(`**** Show KeysValues ${e} ****`);for(const c of s.values)console.log(`>>> id: ${c.id} name: ${c.key} email: ${c.value}`)}catch(s){let c=s.message?s.message:s;r(t=>t.concat(`Error: ${c}`))}},O=async()=>{try{let s="";s=`
            DELETE FROM keysvalues WHERE id = 'd9333a5-87d3-4675-8bc5-0c4e076fffa3';
            `;var e=await o.execute(s);if(e.changes.changes!=1){const t='execute delete "testKeysValues" changes != 1 ';r(u=>u.concat(`Error: ${t}`));return}if(l(t=>t.concat(`> delete with execute successful
`)),s="DELETE FROM keysvalues WHERE id = ?;",e=await o.run(s,["bbbadd00-1225-49b6-a9ad-038fc67e6718"]),e.changes.changes!=1){const t='run delete "testKeysValues" changes != 1 ';r(u=>u.concat(`Error: ${t}`));return}l(t=>t.concat(`> delete with run  successful
`));const c=[{statement:"DELETE FROM keysvalues WHERE id = ?;",values:[["5b085e5d-3d7d-431a-a1b0-379dbe08e18d"],["10c380e4-0d26-4fd3-b11f-f867b38ff3b6"]]}];if(e=await o.executeSet(c),e.changes.changes!=2){const t='executeSet delete "testKeysValues" changes != 2 ';r(u=>u.concat(`Error: ${t}`));return}l(t=>t.concat(`> delete with executeSet successful
`)),s=`
            DELETE FROM keysvalues;`;var e=await o.execute(s);if(console.log(`delete execute res: ${JSON.stringify(e)}`),e.changes.changes!=3){const t='execute delete all "testKeysValues" changes != 3 ';r(u=>u.concat(`Error: ${t}`));return}l(t=>t.concat(`> delete from keysvalues successful
`)),T==="web"&&await g.saveToStore("testKeysValues")}catch(s){let c=s.message?s.message:s;r(t=>t.concat(`Error: ${c}`))}};return R(async()=>{await V(),await N(),k().length===0&&(await m("before DELETE"),await O(),await m("final")),await I(k()),await g.closeConnection("testKeysValues",!1)}),S(C,{get children(){const e=X(),s=e.firstChild,c=s.nextSibling,t=c.firstChild,u=t.firstChild,a=t.nextSibling;return f(u,F(w)),f(a,S(L,{get each(){return _()},children:n=>(()=>{const i=W(),y=i.firstChild,d=y.nextSibling,K=d.nextSibling,b=K.nextSibling;return b.nextSibling,f(i,()=>n.key,d),f(i,()=>n.value,b),i})()})),p(n=>{const i=h.Issue275,y=h.header,d=h.content;return i!==n._v$&&v(e,n._v$=i),y!==n._v$2&&v(s,n._v$2=y),d!==n._v$3&&v(c,n._v$3=d),n},{_v$:void 0,_v$2:void 0,_v$3:void 0}),e}})};export{B as default};
