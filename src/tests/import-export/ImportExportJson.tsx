import type { Component } from 'solid-js';
import { For, Suspense, createSignal, onMount } from "solid-js";
import { useToString } from 'solidjs-use'
import { platform, sqlite } from '../../App';
import { SQLiteDBConnection, capSQLiteSet } from '@capacitor-community/sqlite';

import { openConnection } from '../../utils/connection-utils';
import { dataToImport, partialImport1, partialImport2, dataToImport265 } from './json-objects-utils';
import styles from './ImportExportJson.module.css';
import { delay } from '../../utils/delay-utils';
import { sitesData } from './sites-data'

const ImportExportJson: Component = () => {
    const [log, setLog] =  createSignal<string[]>([]);
    const [errMsg, setErrMsg] = createSignal<string>("");
    const [users, setUsers] = createSignal<any[]>([]);
    let db: SQLiteDBConnection;
    const startTest = async (): Promise<void> => {
        setLog((log) => log.concat('* Starting testImportExportJson *\n\n'));
        return;
    };
    const endTest = async(msg: string): Promise<void> => {
        if(msg.length === 0) {
            setLog((log) => log.concat("\n* The set of tests was successful *\n"));
        } else {
            setLog((log) => log.concat(`${msg}`));
            setLog((log) => log.concat("\n* The set of tests failed *\n"));
        }
        return;
    }
    const initializeTest = async(): Promise<void> => {
        try {
            // test the plugin with echo
            let res: any = await sqlite.echo("Hello from echo");
            if(res.value !== "Hello from echo"){
                const msg = `Error: Echo not returning "Hello from echo"\n`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return Promise.reject();
            }
            setLog((log) => log.concat("> Echo successful\n"));
            
            // ->> for development and multiple successive tests
            // check if database "db-from-json" exists 
            res = (await sqlite.isDatabase('db-from-json')).result;
            if(res) {
                // delete the database
                db = await openConnection('db-from-json', false,
                                          'no-encryption', 1, true);
                // Close Connection testNew        
                await sqlite.closeConnection('db-from-json',false); 
            }
            // end of for development <<-

            // test Json object validity
            res = await sqlite.isJsonValid(JSON.stringify(dataToImport));
            if(!res.result) { 
                const msg = `Error: Json Object dataToImport not valid"\n`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return Promise.reject();
            }
            setLog((log) => log.concat("> isJsonValid dataToImport successful\n"));

            // test import from Json Object
            res = await sqlite.importFromJson(JSON.stringify(dataToImport)); 
            if(res.changes.changes === -1 ) {
                const msg = `Error: ImportFromJson dataToImport changes < 0"\n`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return Promise.reject();
            }
            setLog((log) => log.concat("> importFromJson Full successful\n"));


            db = await openConnection('db-from-json', false,
                                      'no-encryption', 1, false);
            setLog((log) => log.concat("> Open connection 'db-from-json' successful\n"));

            if(platform === 'web') {
                // save the db to store
                await sqlite.saveToStore('db-from-json');
            }
            return;                                     
        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
            return Promise.reject();
        }
    }
    const exportFull = async(): Promise<void> => {
        try {
            // export to json full
            let jsonObj: any = await db.exportToJson('full');
            // test Json object validity
            let res: any = await sqlite.isJsonValid(JSON.stringify(jsonObj.export));
            if(!res.result) {
                let msg: string = "Error: isJsonValid Full returns false";
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
                return Promise.reject();
            }
            console.log(`>>> Full export ${JSON.stringify(jsonObj.export)}`);
            if (jsonObj.export.tables.length != 3 ||
                    jsonObj.export.tables[0].values.length != 4 ||
                    jsonObj.export.tables[1].values.length != 2 ||
                    jsonObj.export.tables[2].values.length != 2) {
                let msg: string = "Error: Export Full Json not correct";
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
                return Promise.reject();
            }
            setLog((log) => log.concat("> Export Full 'db-from-json' successful\n"));
            return;                                     
        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
            return Promise.reject();
        }
    }
    const showUsers = async(title: string): Promise<void> => {
        try {
            // Query the users and associated messages
            const query = `
            SELECT users.id AS uid, users.name AS uname, messages.title AS mtitle, 
            users.sql_deleted AS udeleted, users.last_modified AS ulast,
            messages.sql_deleted AS mdeleted , messages.last_modified AS mlast
            FROM users
            LEFT OUTER JOIN messages ON messages.userid = users.id 
            `

            let res: any = await db.query(query);

            setUsers([...res.values]);
            console.log(`&&&&&& users ${title} &&&&&&`);
            for(const result of users()) {
                console.log(`uid: ${result.uid} uname: ${result.uname} udeleted: ${result.udeleted} ulast: ${result.ulast}`);
                if(result.mtitle != null) {
                    console.log(`       mtitle: ${result.mtitle} mdeleted: ${result.mdeleted} mlast: ${result.mlast}`);
                }
            }
            return;
        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
            return Promise.reject();
        }
    }
    const createSyncTable = async(): Promise<void> => {
        try {
            // create synchronization table 
            let res: any = await db.createSyncTable();
            if (res.changes.changes < 0) {
                const msg = `createSyncTable "db-from-json" changes < 0 `;
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
                return Promise.reject();
            }
            setLog((log) => log.concat("> createSyncTable  successful\n"));
            // get the synchronization date
            res = await db.getSyncDate();
            if(res.syncDate <= 0) {
                const msg = `getSyncDate return 0 `;
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));                return;
                return Promise.reject();
            }
            const msg = `> getSyncDate "db-from-json" successful\n`;
            setLog((log) => log.concat(msg));

            if(platform === 'web') {
                // save the db to store
                await sqlite.saveToStore('db-from-json');
            }
            return;
        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
            return Promise.reject();
        }
    }
    const importPartial = async(partialImport: any, importName: string): Promise<void> => {
        try {
            // Close Connection testNew        
            await sqlite.closeConnection('db-from-json', false); 
            // test Json object validity
            let res: any = await sqlite.isJsonValid(JSON.stringify(partialImport));
            if(!res.result) { 
                const msg = `Error: Json Object ${importName} not valid"\n`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return Promise.reject();
            }
            setLog((log) => log.concat(`> isJsonValid ${importName} successful\n`));

            // test import from Json Object
            res = await sqlite.importFromJson(JSON.stringify(partialImport)); 
            if(res.changes.changes === -1 ) {
                const msg = `Error: ImportFromJson ${importName} changes < 0"\n`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return Promise.reject();
            }
            setLog((log) => log.concat(`> importFromJson ${importName} successful\n`));


            db = await openConnection('db-from-json', false,
                                      'no-encryption', 1, false);
            setLog((log) => log.concat("> Open connection 'db-from-json' successful\n"));
            // Set the Synchronization Date
            const d = new Date();    
            await db.setSyncDate(d.toISOString());

            if(platform === 'web') {
                // save the db to store
                await sqlite.saveToStore('db-from-json');
            }
            return;
        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
            return Promise.reject();
        }
    }
    const doSomeStuff = async(): Promise<void> => {
        try {
            const stuffSet: Array<capSQLiteSet>  = [
                { statement:"INSERT INTO users (name,email,age) VALUES (?,?,?);",
                  values:[
                      ["Jackson","Jackson@example.com",18],
                      ["Bush","Bush@example.com",25]
                  ]
                },
                { statement:"INSERT INTO users (name,email,age) VALUES (?,?,?);",
                  values:["Kennedy","Kennedy@example.com",45]
                },
                { statement:"INSERT INTO users (name,email,age) VALUES (?,?,?);",
                  values:["Jeep","Jeep@example.com",65]
                },
                { statement:"UPDATE users SET email = ? WHERE id = ?",
                  values: [
                    ["Addington@example.com",5],
                    ["Bannister@example.com",6]
                  ]
                },
                { statement:"INSERT INTO messages (userid, title, body) VALUES (?,?,?);",
                  values: [
                    [2,"test post 5","content test post 5"],
                    [4,"test post 6","content test post 6"]
                  ]
                },
                { statement: "DELETE FROM users WHERE id = ?;",
                  values: [4]
                }
            ];
            let res: any = await db.executeSet(stuffSet); 
            console.log(`>>> executeSet res: ${JSON.stringify(res)}`);
            if(res.changes.changes != 10) {
                const msg = `executeSet delete "db-from-json" changes != 10 `;
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
                return Promise.reject();
            }
            const delExecute = `
            DELETE FROM users WHERE id = 2;
            `
            res = await db.execute(delExecute);
            console.log(`>>> execute res: ${JSON.stringify(res)}`);
            if(res.changes.changes != 3) {
                const msg = `execute delete "db-from-json" changes != 3 `;
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
                return Promise.reject();
            }

        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
            return Promise.reject();
        }
    }
    const exportPartial = async(): Promise<void> => {
        try {
            // export to json partial
            let jsonObj: any = await db.exportToJson('partial');
            console.log(`>>> export partial ${JSON.stringify(jsonObj.export)}`);
            // test Json object validity
            if(Object.keys(jsonObj.export).length <= 0) {
                let msg: string = "Returned Json Object is empty, nothing to synchronize";
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
                return Promise.reject();
            }
            let res: any = await sqlite.isJsonValid(JSON.stringify(jsonObj.export));
            if(!res.result) {
                let msg: string = "Error: isJsonValid Full returns false";
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
                return Promise.reject();
            }
            
            setLog((log) => log.concat("> Export Partial 'db-from-json' successful\n"));
            return;                                     
        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
            return Promise.reject();
        }
    }
    const localSynchronization = async (): Promise<void> => {
        try {
          // set the synchronization date
          await db.setSyncDate((new Date()).toISOString());
          // remove all rows having sql_deleted = 1
          await db.deleteExportedRows();
          return;

        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
            console.log(`${errMsg()}`)
            return Promise.reject();
        }
    }
    const insertOnConflict = async (): Promise<void> => {
        try {
            const stuffSet: Array<capSQLiteSet>  = [
                { statement:`INSERT INTO users (name,email,age) VALUES (?,?,?)
                 ON CONFLICT (email) 
                 DO UPDATE SET email = "testconflict@example.com", name="TestConflict", last_modified=(strftime('%s', 'now'));`,
                  values:["Addington","Addington@example.com",22]
                },
                { statement:`INSERT INTO users (name,email,age) VALUES (?,?,?)
                 ON CONFLICT (email) 
                 DO UPDATE SET email = "testconflict1@example.com", name="TestConflict1", last_modified=(strftime('%s', 'now'));`,
                  values:["Jeep","Jeep@example.com",65]
                },
                { statement:`INSERT INTO users (name,email,age) VALUES (?,?,?)
                 ON CONFLICT (email) 
                 DO UPDATE SET email = "testconflict2@example.com", name="TestConflict2", last_modified=(strftime('%s', 'now'));`,
                  values:["Test1","Test1@example.com",45]
                },
                { statement:`INSERT INTO users (name,email,age) VALUES (?,?,?)
                 ON CONFLICT (email) 
                 DO UPDATE SET email = "testconflict3@example.com", name="TestConflict3", last_modified=(strftime('%s', 'now'));`,
                  values:["Test2","Test2@example.com",60]
                },
                { statement:`INSERT INTO users (name,email,age) VALUES (?,?,?)
                 ON CONFLICT (email) 
                 DO UPDATE SET email = "testconflict4@example.com", name="TestConflict4", last_modified=(strftime('%s', 'now'));`,
                  values:["Test3","Test3@example.com",15]
                },
            ];
            let res: any = await db.executeSet(stuffSet); 
            if(res.changes.changes != 5 || res.changes.lastId != 13) {
                const msg = 'changes !=5 or lastId != 13';
                console.log(`${msg}`)
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
                return Promise.reject();
            }
            console.log(`>>> insertOnConflict executeSet res: ${JSON.stringify(res)}`);

        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
            console.log(`${errMsg()}`)
            return Promise.reject();
        }
    }
    const testIssue265 = async (): Promise<void> => {
        try {
            // test Json object validity
            let res: any = await sqlite.isJsonValid(JSON.stringify(dataToImport265));
            if(!res.result) { 
                const msg = `Error: Json Object dataToImport265 not valid"\n`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return Promise.reject();
            }
            setLog((log) => log.concat(`> isJsonValid dataToImport265 successful\n`));

            // test import from Json Object
            res = await sqlite.importFromJson(JSON.stringify(dataToImport265)); 
            if(res.changes.changes === -1 ) {
                const msg = `Error: ImportFromJson dataToImport265 changes < 0"\n`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return Promise.reject();
            }
            setLog((log) => log.concat(`> importFromJson dataToImport265 successful\n`));


            db = await openConnection('db-issue265', false,
                                      'no-encryption', 1, false);
            setLog((log) => log.concat("> Open connection 'db-issue265' successful\n"));
            const twoSitesSet:Array<capSQLiteSet>  = [
                {   statement:`INSERT INTO sites (siteId,code,officeCode,name,address,city,province,country,zip,email,telephone,lat,lng) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    values: [
                        ["01FA1B4AB79B6D43C1257FD90056219C","ANT012","ANT012","PORTA DI ROMA","Via Alberto Lionello, 201, Località Bufalotta","ROMA","RM","","","prolocofossaltina@gmail.com","0690233474","41,9716623","12,5401904"],
                        ["01FA1B4AB79B6D43C1257FD90056220C","ANT013","ANT013","TEST1","Via Test1 , 180","Test1City1","BK","","","protest1@gmail.com","0690233475","40,9716623","11,5401904"]
                    ]
                },
            ]
            const query = `DELETE FROM sites;`
            res = await db.execute(query);
            res = await db.executeSet(twoSitesSet); 
            if(res.changes.changes != 2 || res.changes.lastId != 2) {
                const msg = `Error: twoSitesSet changes != 2 || lastId != 2"\n`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return Promise.reject();

            }
            const statement = `
            INSERT INTO sites (siteId,code,officeCode,name,address,city,province,country,zip,email,telephone,lat,lng) 
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
            ON CONFLICT(siteId) DO UPDATE 
            SET code=excluded.code,officeCode=excluded.officeCode,name=excluded.name,address=excluded.address,city=excluded.city,province=excluded.province,country=excluded.country,zip=excluded.zip,email=excluded.email,telephone=excluded.telephone,lat=excluded.lat,lng=excluded.lng;
            `
            const fullSitesSet: capSQLiteSet[] = [];
            sitesData.forEach(site => {
                const values = [
                    site.siteId
                    ,site.code
                    ,site.officeCode
                    ,site.name
                    ,site.address
                    ,site.city
                    ,site.province
                    ,site.country
                    ,site.zip
                    ,site.email
                    ,site.telephone
                    ,site.lat
                    ,site.lng
                  ]
                  fullSitesSet.push({
                    statement,
                    values,
                  })                  
            });
            res = await db.executeSet(fullSitesSet); 
            if(res.changes.changes != 7 || res.changes.lastId != 7) {
                const msg = `Error: fullSitesSet changes != 7 || lastId != 7"\n`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return Promise.reject();

            }
            let retQuery = await db.query("SELECT total_changes();", []);
            console.log(`>>> retQuery total_changes: ${JSON.stringify(retQuery)}`)
            retQuery = await db.query("SELECT last_insert_rowid();", []);
            console.log(`>>> retQuery last_insert_rowid(): ${JSON.stringify(retQuery)}`)

            // Close Connection db-from-json
            res = (await sqlite.isConnection('db-issue265',false)).result;
            if(res) {
                await sqlite.closeConnection('db-issue265',false); 
            } 
        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
            console.log(`${errMsg()}`)
            return Promise.reject();
        }
    }
    onMount(async () => {
        try {
            await startTest();
            // initialize the database testNew and fill some data
            await initializeTest();
            // only requires for database synchronization with remote server
            await createSyncTable();
            // delay before to do an export full
            await delay(2, 'before a full export');
            let retQuery = await db.query("SELECT * from sync_table;", [])
            console.log(`>>> retQuery before export full: ${JSON.stringify(retQuery)}`)
            // export full
            await showUsers('before export full');
            await exportFull();
            retQuery = await db.query("SELECT * from sync_table;", [])
            console.log(`>>> retQuery after export full: ${JSON.stringify(retQuery)}`)
            // test importing partial with delete
            await importPartial(partialImport1, "partialImport1");
            // delay before to do an export full
            await delay(2, 'before capturing new data');
            // do some stuff
            await doSomeStuff();
            await showUsers('after capturing some stuff');
            // export partial
            retQuery = await db.query("SELECT * from sync_table;", [])
            console.log(`>>> retQuery before export partial: ${JSON.stringify(retQuery)}`)
            await exportPartial();
            retQuery = await db.query("SELECT * from sync_table;", [])
            console.log(`>>> retQuery after export partial: ${JSON.stringify(retQuery)}`)
            // localSynchronization
            await localSynchronization();
            // test importing partial with delete
            await importPartial(partialImport2, "partialImport2");
            await showUsers('after partialImport2 ');
            await delay(2, 'before INSERT ON CONFLICT UPDATE');
            // test INSERT ON CONFLICT UPDATE
            await insertOnConflict();
            // Show users
            if(errMsg().length === 0) {
                await showUsers('after final');
            }
            // Close Connection db-from-json
            const res = (await sqlite.isConnection('db-from-json',false)).result;
            if(res) {
                await sqlite.closeConnection('db-from-json',false); 
            } 
            // test issue 256
            await testIssue265();
            await endTest(errMsg());
        } catch (err) {
            await endTest(errMsg());
        }     
    });

    return (
        <Suspense>
            <div class={styles.ImportExportJson}>
                <header class={styles.header}>
                    <h2>Test Import/Export Json</h2>
                </header>
                <div class= {styles.content}>
                    <pre>
                        <p>{useToString(log)()}</p>
                    </pre>
                    <ul>
                        <For each={users()}>
                            {(user) => <div>
                                <p>Name: {user.uname} uDeleted: {user.udeleted} </p>
                                {(user.mtitle != null) &&
                                <p>-   mTitle: {user.mtitle} mDeleted: {user.mdeleted}</p>}
                                </div>}
                        </For>
                    </ul>
                    {errMsg().length > 0 && <p>{errMsg()}</p>}
                </div>
            </div>
        </Suspense>
    );
};

export default ImportExportJson;
      