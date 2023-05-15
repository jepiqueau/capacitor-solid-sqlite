import{e as _,o as R,c as S,i as h,F as N,a as M,b as $,S as V,t as E,s as p}from"./index-3913827d.js";import{u as H,o as L}from"./connection-utils-49cf70d0.js";const O="_Issue277_g6ly3_1",A="_header_g6ly3_7",F="_content_g6ly3_15",d={Issue277:O,header:A,content:F},K=E("<div><header><h2>Test Issue277</h2></header><div><pre><p></p></pre><ul>"),k=E("<p>Name: <!> Email: <!> "),P=()=>{const[b,a]=_([]),[m,f]=_(""),[T,q]=_([]),u="mfapp.global";let v;const I=async()=>{a(e=>e.concat(`* Starting testDatabaseIssue277 *

`))},w=async e=>{e.length===0?a(s=>s.concat(`
* The set of tests was successful *
`)):(a(s=>s.concat(`${e}`)),a(s=>s.concat(`
* The set of tests failed *
`)))},C=async()=>{try{if((await p.echo("Hello from echo")).value!=="Hello from echo"){const t=`Error: Echo not returning "Hello from echo"
`;f(l=>l.concat(t));return}a(t=>t.concat(`> Echo successful
`));const s='INSERT OR REPLACE INTO "Test" VALUES(?, ?)',o=["Key","Value"];v=await L(u,!1,"no-encryption",1,!0),a(t=>t.concat(`> Open connection '${u}' successful
`));let r=await v.run(s,o,!1);if(console.log(`ret.changes.changes: ${r.changes.changes}`),r.changes.changes<0){const t="Error: Run";f(l=>l.concat(t)),console.log(`errMsg: ${m()}`);return}a(t=>t.concat(`> Run '${u}' successful
`))}catch(e){let s=e.message?e.message:e;console.log(`catch message: ${s}`),f(o=>o.concat(`Error: ${s}`))}};return R(async()=>{await I(),await C(),await w(m()),await p.closeConnection(u,!1)}),S(V,{get children(){const e=K(),s=e.firstChild,o=s.nextSibling,r=o.firstChild,t=r.firstChild,l=r.nextSibling;return h(t,H(b)),h(l,S(N,{get each(){return T()},children:n=>(()=>{const c=k(),g=c.firstChild,i=g.nextSibling,x=i.nextSibling,y=x.nextSibling;return y.nextSibling,h(c,()=>n.key,i),h(c,()=>n.value,y),c})()})),M(n=>{const c=d.Issue277,g=d.header,i=d.content;return c!==n._v$&&$(e,n._v$=c),g!==n._v$2&&$(s,n._v$2=g),i!==n._v$3&&$(o,n._v$3=i),n},{_v$:void 0,_v$2:void 0,_v$3:void 0}),e}})};export{P as default};
