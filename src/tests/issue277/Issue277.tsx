import type { Component } from 'solid-js';
import { For, Suspense, createSignal, onMount } from "solid-js";
import { useToString } from 'solidjs-use'
import { platform, sqlite } from '../../App';
import { SQLiteDBConnection, capSQLiteSet } from '@capacitor-community/sqlite';

import { openConnection } from '../../utils/connection-utils';
import { createKeyValueSchema, fiveKeysValues } from './database-utils';
import { delay } from '../../utils/delay-utils';
import styles from './Issue277.module.css';

const Issue277: Component = () => {
    const [log, setLog] =  createSignal<string[]>([]);
    const [errMsg, setErrMsg] = createSignal<string>("");
    const [keysValues, setKeysValues] = createSignal<any[]>([]);
    const dbName = "mfapp.global";
    let db: SQLiteDBConnection;

    const startTest = async (): Promise<void> => {
        setLog((log) => log.concat('* Starting testDatabaseIssue277 *\n\n'))
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
            const statement = "INSERT OR REPLACE INTO \"Test\" VALUES(?, ?)";
            const values = ["Key", "Value"];
            db = await openConnection(dbName, false,
                                      'no-encryption', 1,true);
            setLog((log) => log.concat(`> Open connection '${dbName}' successful\n`));

            // create tables in db
            let ret: any = await db.run(statement, values, false);
            console.log(`ret.changes.changes: ${ret.changes.changes}`)
            if (ret.changes.changes < 0) {
                const msg = "Error: Run";
                setErrMsg((errMsg) => errMsg.concat(msg));
                console.log(`errMsg: ${errMsg()}`)
                return;
            }
            setLog((log) => log.concat(`> Run '${dbName}' successful\n`));

        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            console.log(`catch message: ${msg}`)
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
        }
        return;
    }

    onMount(async () => {
        await startTest();
        // initialize the database dbName and fill some data
        await initializeTest();
        await endTest(errMsg());
        // Close Connection dbName        
        await sqlite.closeConnection(dbName, false); 

    });

    return (
        <Suspense>
            <div class={styles.Issue277}>
                <header class={styles.header}>
                    <h2>Test Issue277</h2>
                </header>
                <div class= {styles.content}>
                    <pre>
                        <p>{useToString(log)()}</p>
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

export default Issue277;
      