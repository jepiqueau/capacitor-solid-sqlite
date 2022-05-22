import type { Component } from 'solid-js';
import { For, Suspense, createSignal, onMount } from "solid-js";
import { platform, sqlite } from '../../App';
import { SQLiteDBConnection, capSQLiteSet } from '@capacitor-community/sqlite';

import { openConnection } from '../../utils/connection-utils';
import { createKeyValueSchema, fiveKeysValues } from './database-utils';
import { delay } from '../../utils/delay-utils';
import styles from './Issue275.module.css';

const Issue275: Component = () => {
    const [log, setLog] =  createSignal<string[]>([]);
    const [errMsg, setErrMsg] = createSignal<string>("");
    const [keysValues, setKeysValues] = createSignal<any[]>([]);
    let db: SQLiteDBConnection;

    const startTest = async (): Promise<void> => {
        setLog((log) => log.concat('* Starting testDatabaseIssue275 *\n\n'))
    };
    const endTest = async(msg: string): Promise<void> => {
        if(msg.length === 0) {
            setLog((log) => log.concat("\n* The set of tests was successful *\n"));
        } else {
            setLog((log) => log.concat(`${msg}`));
            setLog((log) => log.concat("\n* The set of tests failed *\n"));
        }
    }
    const initializeTest = async(): Promise<void> => {
        try {
            // test the plugin with echo
            let res: any = await sqlite.echo("Hello from echo");
            if(res.value !== "Hello from echo"){
                const msg = `Error: Echo not returning "Hello from echo"\n`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            setLog((log) => log.concat("> Echo successful\n"));
            db = await openConnection('testKeysValues', false,
                                      'no-encryption', 1,true);
            setLog((log) => log.concat("> Open connection 'testKeysValues' successful\n"));
            // create tables in db
            let ret: any = await db.execute(createKeyValueSchema);
            if (ret.changes.changes < 0) {
                const msg = "Error: Execute createSchema failed";
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            setLog((log) => log.concat("> Create DB Schema 'testKeysValues' successful\n"));
            // Delete contacts if any
            let stmt = "DELETE FROM keysvalues;"
            res = await db.execute(stmt);
            // Insert five keysvalues with executeSet method
            res = await db.executeSet(fiveKeysValues);
            if (res.changes.changes !== 5) {
                const msg = `ExecuteSet five KeysValues changes != 5`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            setLog((log) => log.concat("> ExecuteSet five KeysValues successful\n"));

            if(platform === 'web') {
                // save the db to store
                await sqlite.saveToStore('testKeysValues');
            }
            // Query the KeysValues
            res = await db.query("SELECT * FROM keysvalues");
            if(res.values.length !== 5 ||
            res.values[0].key !== "key1" ||
                        res.values[1].key !== "key2" ||
                        res.values[2].key !== "key3" ||
                        res.values[3].key !== "key4" ||
                        res.values[4].key !== "key5" ) {
                const msg = `Query not returning five KeysValues`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            setLog((log) => log.concat("> Select five KeysValues successful\n"));
        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
        }
        return;
    }
    const showKeysValues = async(msg: string): Promise<void> => {
        try {
            // Query the KeysValues
            let res: any = await db.query("SELECT * FROM keysvalues");
            setKeysValues([...res.values]);
            console.log(`**** Show KeysValues ${msg} ****`)
            for( const keyvalue of res.values) {
              console.log(`>>> id: ${keyvalue.id} name: ${keyvalue.key} email: ${keyvalue.value}`);
            }
  

        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
        }
        return;
    }
    const deleteTest = async(): Promise<void> => {
        try {
            let stmt = "";
            // Delete KeysValues in an execute statement 
            stmt = `
            DELETE FROM keysvalues WHERE id = 'd9333a5-87d3-4675-8bc5-0c4e076fffa3';
            `;
            var res: any = await db.execute(stmt);
            if(res.changes.changes != 1) {
                const msg = `execute delete "testKeysValues" changes != 1 `;
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
                return;
            }
            setLog((log) => log.concat("> delete with execute successful\n"));

            // Delete one contact in a run statement
            stmt = "DELETE FROM keysvalues WHERE id = ?;";
            res = await db.run(stmt,['bbbadd00-1225-49b6-a9ad-038fc67e6718']);
            if(res.changes.changes != 1) {
                const msg = `run delete "testKeysValues" changes != 1 `;
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
                return;
            }

            setLog((log) => log.concat("> delete with run  successful\n"));

            // Delete a set of user in an executeSet statement
            const deleteSet: Array<capSQLiteSet> = [
                {
                    statement: "DELETE FROM keysvalues WHERE id = ?;",
                    values: [
                        ['5b085e5d-3d7d-431a-a1b0-379dbe08e18d'],
                        ['10c380e4-0d26-4fd3-b11f-f867b38ff3b6']
                    ]
                }
            ];
            res = await db.executeSet(deleteSet); 
            if(res.changes.changes != 2) {
                const msg = `executeSet delete "testKeysValues" changes != 2 `;
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
                return;
            }
            
            setLog((log) => log.concat("> delete with executeSet successful\n"));

            // Delete all KeysValues

            stmt = `
            DELETE FROM keysvalues;`;
            var res: any = await db.execute(stmt);
            console.log(`delete execute res: ${JSON.stringify(res)}`) 
            if(res.changes.changes != 1) {
                const msg = `execute delete all "testKeysValues" changes != 1 `;
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
                return;
            }
            setLog((log) => log.concat("> delete from keysvalues successful\n"));
            if(platform === 'web') {
                // save the db to store
                await sqlite.saveToStore('testKeysValues');
            }
        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
        }
        return;
    }

    onMount(async () => {
        await startTest();
        // initialize the database testKeysValues and fill some data
        await initializeTest();
        if(errMsg().length === 0) {
            // Show KeysValues before delete
            await showKeysValues('before DELETE');
            // test of deleting some data
            await deleteTest();
            // Show KeysValues final
            await showKeysValues('final');
        }
        await endTest(errMsg());
        // Close Connection testKeysValues        
        await sqlite.closeConnection("testKeysValues"); 

    });

    return (
        <Suspense>
            <div class={styles.Issue271}>
                <header class={styles.header}>
                    <h2>Test Issue275</h2>
                </header>
                <div class= {styles.content}>
                    <pre>
                        <p>{log}</p>
                    </pre>
                    <ul>
                        <For each={keysValues()}>
                            {(keyvalue) => <p>Name: {keyvalue.key}  Email: {keyvalue.value} </p>}
                        </For>
                    </ul>
                </div>
            </div>
        </Suspense>
    );
};

export default Issue275;
      