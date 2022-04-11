import type { Component } from 'solid-js';
import { For, Suspense, createSignal, onMount } from "solid-js";
import { platform, sqlite } from '../../App';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

import { openConnection } from '../../utils/connection-utils';
import { createSchema, twoUsers, fourUsers } from './database-utils';
import styles from './NoEncryption.module.css';

const NoEncryption: Component = () => {
    const [log, setLog] =  createSignal<string[]>([]);
    const [errMsg, setErrMsg] = createSignal<string>("");
    const [users, setUsers] = createSignal<any[]>([]);

    const startTest = async (): Promise<void> => {
        setLog((log) => log.concat('* Starting testDatabaseNoEncryption *\n\n'))
    };
    const endTest = async(msg: string): Promise<void> => {
        if(msg.length === 0) {
            setLog((log) => log.concat("\n* The set of tests was successful *\n"));
        } else {
            setLog((log) => log.concat(`${msg}`));
            setLog((log) => log.concat("\n* The set of tests failed *\n"));
        }
    }
    const runTest = async(): Promise<void> => {
        try {
            // test the plugin with echo
            let res: any = await sqlite.echo("Hello from echo");
            if(res.value !== "Hello from echo"){
                const msg = `Error: Echo not returning "Hello from echo"\n`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            setLog((log) => log.concat("> Echo successful\n"));
            const db: SQLiteDBConnection = await openConnection('testNew', false,
                                                                'no-encryption', 1,
                                                                true);
            setLog((log) => log.concat("> Open connection 'testNew' successful\n"));
            // create tables in db
            let ret: any = await db.execute(createSchema);
            if (ret.changes.changes < 0) {
                const msg = "Error: Execute createSchema failed";
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            setLog((log) => log.concat("> Create DB Schema 'testNew' successful\n"));
            // Insert two users with execute method
            res = await db.execute(twoUsers);
            if (res.changes.changes !== 2) {
                const msg = `Execute insert twoUsers changes != 2`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            setLog((log) => log.concat(" Execute insert two users successful\n"));

            if(platform === 'web') {
                // save the db to store
                await sqlite.saveToStore('testNew');
            }
            // Query the users
            res = await db.query("SELECT * FROM users");
            if(res.values.length !== 2 ||
            res.values[0].name !== "Whiteley" ||
                        res.values[1].name !== "Jones") {
                const msg = `Query not returning two users`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            setLog((log) => log.concat(" Select two users successful\n"));

            // insert one user with statement and values              
            const sqlcmd: string = 
                'INSERT INTO users (name,email,age) VALUES (?,?,?)';
            const values: Array<any>  = ["Simpson","Simpson@example.com",69];
            ret = await db.run(sqlcmd,values);
            if(ret.changes.lastId !== 3) {
                const msg = `Run insert one user lastId != 3`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
        
            // Insert for users with executeSet method
            res = await db.executeSet(fourUsers);
            if (res.changes.changes !== 4) {
                const msg = `Execute insert fourUsers changes != 4`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            setLog((log) => log.concat(" Execute insert four users successful\n"));

            // Query the users
            res = await db.query("SELECT * FROM users");
            if(res.values.length !== 7 ||
            res.values[0].name !== "Whiteley" ||
                        res.values[1].name !== "Jones"||
                        res.values[2].name !== "Simpson"||
                        res.values[3].name !== "Jackson"||
                        res.values[4].name !== "Bush"||
                        res.values[5].name !== "Kennedy"||
                        res.values[6].name !== "Jeep") {
                const msg = `Query not returning all users`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }

            setUsers([...res.values]);
            // Close Connection testNew        
            await sqlite.closeConnection("testNew"); 
                                                    
        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
        }
        return;
    }

    onMount(async () => {
        await startTest();
        await runTest();
        await endTest(errMsg());
    });

    return (
        <Suspense>
            <div class={styles.NoEncryption}>
                <header class={styles.header}>
                    <h2>Test No Encryption</h2>
                </header>
                <div class= {styles.content}>
                    <pre>
                        <p>{log}</p>
                    </pre>
                    <ul>
                        <For each={users()}>
                            {(user) => <p>Name: {user.name}  Email: {user.email} </p>}
                        </For>
                    </ul>
                </div>
            </div>
        </Suspense>
    );
};

export default NoEncryption;
      