import{e as d,o as b,c as $,i as h,F as M,a as F,b as v,S as D,t as x,s as g,p as w}from"./index-3913827d.js";import{u as J,o as B}from"./connection-utils-49cf70d0.js";const H=`
CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT
);
`,U=[{statement:"INSERT INTO contacts (name,email) VALUES (?,?);",values:[["Jackson","Jackson@example.com"],["Bush","Bush@example.com"],["Jones","Jones@example.com"]]},{statement:"INSERT INTO contacts (name,email) VALUES (?,?);",values:["Kennedy","Kennedy@example.com"]},{statement:"INSERT INTO contacts (name,email) VALUES (?,?);",values:[["Jeep","Jeep@example.com"],["Whiteley","Whiteley@example.com"],["Burton","Burton@example.com"],["Lewis","Lewis@example.com"]]}],W="_Issue271_758vt_1",A="_header_758vt_7",K="_content_758vt_15",T={Issue271:W,header:A,content:K},k=x("<div><header><h2>Test Issue271</h2></header><div><pre><p></p></pre><ul>"),q=x("<p>Name: <!> Email: <!> "),Q=()=>{const[C,a]=d([]),[_,o]=d(""),[p,I]=d([]);let r;const L=async()=>{a(e=>e.concat(`* Starting testDatabaseIssue271 *

`))},y=async e=>{e.length===0?a(t=>t.concat(`
* The set of tests was successful *
`)):(a(t=>t.concat(`${e}`)),a(t=>t.concat(`
* The set of tests failed *
`)))},R=async()=>{try{let e=await g.echo("Hello from echo");if(e.value!=="Hello from echo"){const n=`Error: Echo not returning "Hello from echo"
`;o(s=>s.concat(n));return}if(a(n=>n.concat(`> Echo successful
`)),r=await B("testContacts",!1,"no-encryption",1,!0),a(n=>n.concat(`> Open connection 'testContacts' successful
`)),(await r.execute(H)).changes.changes<0){const n="Error: Execute createSchema failed";o(s=>s.concat(n));return}a(n=>n.concat(`> Create DB Schema 'testContacts' successful
`));let c="DELETE FROM contacts;";if(e=await r.execute(c),e=await r.executeSet(U),e.changes.changes!==8){const n="ExecuteSet fiveContacts changes != 8";o(s=>s.concat(n));return}if(a(n=>n.concat(`> ExecuteSet eight contacts successful
`)),w==="web"&&await g.saveToStore("testContacts"),e=await r.query("SELECT * FROM contacts"),e.values.length!==8||e.values[0].name!=="Jackson"||e.values[1].name!=="Bush"||e.values[2].name!=="Jones"||e.values[3].name!=="Kennedy"||e.values[4].name!=="Jeep"||e.values[5].name!=="Whiteley"||e.values[6].name!=="Burton"||e.values[7].name!=="Lewis"){const n="Query not returning eight contacts";o(s=>s.concat(n));return}a(n=>n.concat(`> Select four contacts successful
`))}catch(e){let t=e.message?e.message:e;o(c=>c.concat(`Error: ${t}`))}},f=async e=>{try{let t=await r.query("SELECT * FROM contacts");I([...t.values]),console.log(`**** Show Contacts ${e} ****`);for(const c of t.values)console.log(`>>> id: ${c.id} name: ${c.name} email: ${c.email}`)}catch(t){let c=t.message?t.message:t;o(n=>n.concat(`Error: ${c}`))}},N=async()=>{try{let t="";t=`
            DELETE FROM contacts WHERE id = 2;
            `;var e=await r.execute(t);if(e.changes.changes!=1){const s='execute delete "testContacts" changes != 1 ';o(l=>l.concat(`Error: ${s}`));return}if(a(s=>s.concat(`> delete with execute successful
`)),t="DELETE FROM contacts WHERE id = ?;",e=await r.run(t,[4]),e.changes.changes!=1){const s='run delete "testContacts" changes != 1 ';o(l=>l.concat(`Error: ${s}`));return}a(s=>s.concat(`> delete with run  successful
`));const c=[{statement:"DELETE FROM contacts WHERE id = ?;",values:[[3],[1]]}];if(e=await r.executeSet(c),e.changes.changes!=2){const s='executeSet delete "testContacts" changes != 2 ';o(l=>l.concat(`Error: ${s}`));return}a(s=>s.concat(`> delete with executeSet successful
`)),t=`
            DELETE FROM contacts WHERE id = 6;
            `;var e=await r.execute(t);if(e.changes.changes!=1){const s='execute delete userId "testContacts" changes != 1 ';o(l=>l.concat(`Error: ${s}`));return}a(s=>s.concat(`> delete with execute userId successful
`)),await f("after DELETE issue#273"),t=`
            DELETE FROM contacts;`;var e=await r.execute(t);if(console.log(`delete execute res: ${JSON.stringify(e)}`),e.changes.changes!=3){const s='execute delete all "testContacts" changes != 3 ';o(l=>l.concat(`Error: ${s}`));return}a(s=>s.concat(`> delete from contactc successful
`)),w==="web"&&await g.saveToStore("testContacts")}catch(t){let c=t.message?t.message:t;o(n=>n.concat(`Error: ${c}`))}};return b(async()=>{await L(),await R(),await f("before DELETE"),await N(),await f("final"),await y(_()),await g.closeConnection("testContacts",!1)}),$(D,{get children(){const e=k(),t=e.firstChild,c=t.nextSibling,n=c.firstChild,s=n.firstChild,l=n.nextSibling;return h(s,J(C)),h(l,$(M,{get each(){return p()},children:i=>(()=>{const u=q(),E=u.firstChild,m=E.nextSibling,O=m.nextSibling,S=O.nextSibling;return S.nextSibling,h(u,()=>i.name,m),h(u,()=>i.email,S),u})()})),F(i=>{const u=T.Issue271,E=T.header,m=T.content;return u!==i._v$&&v(e,i._v$=u),E!==i._v$2&&v(t,i._v$2=E),m!==i._v$3&&v(c,i._v$3=m),i},{_v$:void 0,_v$2:void 0,_v$3:void 0}),e}})};export{Q as default};
