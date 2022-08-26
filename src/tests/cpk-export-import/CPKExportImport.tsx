import type { Component } from 'solid-js';
import { For, Suspense, createSignal, onMount } from "solid-js";
import { platform, sqlite } from '../../App';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { createSchema, someData } from './database-utils';

import { openConnection, deleteDatabase} from '../../utils/connection-utils';
import styles from './CPKExportImport.module.css';
import { delay } from '../../utils/delay-utils';

const CPKExportImport: Component = () => {
    const [log, setLog] =  createSignal<string[]>([]);
    const [errMsg, setErrMsg] = createSignal<string>("");
    const [albums, setAlbums] = createSignal<any[]>([]);
    let db: SQLiteDBConnection;
    let exJsonObj: any;

    const startTest = async (): Promise<void> => {
        setLog((log) => log.concat('* Starting CPKExportImport *\n\n'));
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
    const showAlbums = async(msg: string): Promise<void> => {
        try {
            // Query the albums
            let res: any = await db.query("SELECT * FROM album");
            setAlbums([...res.values]);
            console.log(`**** Show Albums ${msg} ****`)
            for( const album of res.values) {
              console.log(`>>> artist: ${album.album_artist} name: ${album.album_name} sql_deleted: ${album.sql_deleted}`);
            }
  

        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
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
            
            // delete the database if exists
            db = await openConnection('db-cpk', false,
                                        'no-encryption', 1, true);
            // create tables in db
            let ret: any = await db.execute(createSchema);
            console.log(`&&&& createSchema ret ${JSON.stringify(ret)}`)
            if (ret.changes.changes < 0) {
                const msg = "Error: Execute createSchema failed";
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            setLog((log) => log.concat("> Create DB Schema 'db-cpk' successful\n"));
            res = await db.getTableList();
            console.log(`&&&& getTableList res ${JSON.stringify(res)}`)

            // Insert some data
            res = await db.execute(someData);
            if (res.changes.changes !== 20) {
                const msg = `Execute insert someData changes != 20`;
                return Promise.reject(msg);
            }
            setLog((log) => log.concat("> Execute insert someData successful\n"));

            if(platform === 'web') {
                // save the db to store
                await sqlite.saveToStore('db-cpk');
            }
            // Query the album
            res = await db.query("SELECT * FROM album");
            if(res.values.length !== 4 ) {
                const msg = `Query not returning 4 data`;
                return Promise.reject(msg);
            }
            // Query the song
            res = await db.query("SELECT * FROM song");
            if(res.values.length !== 16 ) {
                const msg = `Query not returning 16 data from song`;
                return Promise.reject(msg);
            }
            setLog((log) => log.concat("> Select someData successful\n"));
            return;                                     
        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
            return Promise.reject();
        }
    }
    const importFull = async(jsonObj: any): Promise<void> => {
        try {
            // test import from Json Object
            const res: any = await sqlite.importFromJson(JSON.stringify(jsonObj)); 
            if(res.changes.changes === -1 ) {
                const msg = `Error: ImportFromJson dataToImport changes < 0"\n`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return Promise.reject();
            }
            setLog((log) => log.concat("> importFromJson Full successful\n"));


            db = await openConnection('db-cpk', false,
                                      'no-encryption', 1, false);
            setLog((log) => log.concat("> Open connection 'db-cpk' successful\n"));

            if(platform === 'web') {
                // save the db to store
                await sqlite.saveToStore('db-cpk');
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
            exJsonObj = jsonObj.export;
            // test Json object validity
            let res: any = await sqlite.isJsonValid(JSON.stringify(exJsonObj));
            if(!res.result) {
                let msg: string = "Error: isJsonValid Full returns false";
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
                return Promise.reject();
            }
            console.log(`>>> Full export ${JSON.stringify(exJsonObj)}`);
            if (exJsonObj.tables.length != 2 ||
                exJsonObj.tables[0].values.length != 4 ||
                exJsonObj.tables[1].values.length != 16) {
                let msg: string = "Error: Export Full Json not correct";
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
                return Promise.reject();
            }
            setLog((log) => log.concat("> Export Full 'db-cpk' successful\n"));
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
                const msg = `createSyncTable "db-cpk" changes < 0 `;
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
            const msg = `> getSyncDate "db-cpk" successful\n`;
            setLog((log) => log.concat(msg));

            if(platform === 'web') {
                // save the db to store
                await sqlite.saveToStore('db-cpk');
            }
            return;
        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
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
            await exportFull();
            // Show albums
            await showAlbums('after full export');

            // delete the database
            await deleteDatabase(db);
            // Close Connection db-from-json
            const res = (await sqlite.isConnection('db-cpk')).result;
            if(res) {
                await sqlite.closeConnection('db-cpk'); 
            } 
            // Full Import
            await importFull(exJsonObj);
            // Show albums
            await showAlbums('after full import');
            await endTest(errMsg());
        } catch (err) {
            await endTest(errMsg());
        }     
    });

    return (
        <Suspense>
            <div class={styles.CPKExportImport}>
                <header class={styles.header}>
                    <h2>Test CPK Export/Import</h2>
                </header>
                <div class= {styles.content}>
                    <pre>
                        <p>{log}</p>
                    </pre>
                    <ul>
                        <For each={albums()}>
                            {(album) => <div>
                                <p>Artist: {album.album_artist} Name: {album.album_name} uDeleted: {album.sql_deleted} </p>
                                </div>}
                        </For>
                    </ul>
                    {errMsg().length > 0 && <p>{errMsg()}</p>}
                </div>
            </div>
        </Suspense>
    );
};

export default CPKExportImport;
      