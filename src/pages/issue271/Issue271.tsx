import type { Component } from 'solid-js';
import { For, Suspense, createSignal, onMount } from "solid-js";
import { platform, sqlite } from '../../App';
import { SQLiteDBConnection, capSQLiteSet } from '@capacitor-community/sqlite';

import { openConnection } from '../../utils/connection-utils';
import { createContactSchema, fiveContacts } from './database-utils';
import { delay } from '../../utils/delay-utils';
import styles from './Issue271.module.css';

const Issue271: Component = () => {
    const [log, setLog] =  createSignal<string[]>([]);
    const [errMsg, setErrMsg] = createSignal<string>("");
    const [contacts, setContacts] = createSignal<any[]>([]);
    let db: SQLiteDBConnection;

    const startTest = async (): Promise<void> => {
        setLog((log) => log.concat('* Starting testDatabaseIssue271 *\n\n'))
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
            db = await openConnection('testContacts', false,
                                      'no-encryption', 1,true);
            setLog((log) => log.concat("> Open connection 'testContacts' successful\n"));
            // create tables in db
            let ret: any = await db.execute(createContactSchema);
            if (ret.changes.changes < 0) {
                const msg = "Error: Execute createSchema failed";
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            setLog((log) => log.concat("> Create DB Schema 'testContacts' successful\n"));
            // Delete contacts if any
            let stmt = "DELETE FROM contacts;"
            res = await db.execute(stmt);
            // Insert four contacts with executeSet method
            res = await db.executeSet(fiveContacts);
            if (res.changes.changes !== 5) {
                const msg = `ExecuteSet fiveContacts changes != 5`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            setLog((log) => log.concat("> ExecuteSet five contacts successful\n"));

            if(platform === 'web') {
                // save the db to store
                await sqlite.saveToStore('testContacts');
            }
            // Query the contacts
            res = await db.query("SELECT * FROM contacts");
            if(res.values.length !== 5 ||
            res.values[0].name !== "Jackson" ||
                        res.values[1].name !== "Bush" ||
                        res.values[2].name !== "Jones" ||
                        res.values[3].name !== "Kennedy" ||
                        res.values[4].name !== "Jeep") {
                const msg = `Query not returning four contacts`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            setLog((log) => log.concat("> Select four contacts successful\n"));
        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
        }
        return;
    }
    const showContacts = async(msg: string): Promise<void> => {
        try {
            // Query the contacts
            let res: any = await db.query("SELECT * FROM contacts");
            setContacts([...res.values]);
            console.log(`**** Show Contacts ${msg} ****`)
            for( const contact of res.values) {
              console.log(`>>> id: ${contact.id} name: ${contact.name} email: ${contact.email}`);
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
            // Delete contacts in an execute statement 
            stmt = `
            DELETE FROM contacts WHERE id = 2;
            `;
            var res: any = await db.execute(stmt);
            console.log(`delete execute res: ${JSON.stringify(res)}`) 
            if(res.changes.changes != 1) {
                const msg = `execute delete "testContacts" changes != 1 `;
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
                return;
            }
            setLog((log) => log.concat("> delete with execute successful\n"));

            // Delete one contact in a run statement
            stmt = "DELETE FROM contacts WHERE id = ?;";
            res = await db.run(stmt,[4]);
            if(res.changes.changes != 1) {
                const msg = `run delete "testContacts" changes != 1 `;
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
                return;
            }

            setLog((log) => log.concat("> delete with run  successful\n"));

            // Delete a set of user in an executeSet statement
            const deleteSet: Array<capSQLiteSet> = [
                {
                    statement: "DELETE FROM contacts WHERE id = ?;",
                    values: [
                        [3],
                        [1]
                    ]
                }
            ];
            res = await db.executeSet(deleteSet); 
            if(res.changes.changes != 2) {
                const msg = `executeSet delete "testContacts" changes != 2 `;
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
                return;
            }
            
            setLog((log) => log.concat("> delete with executeSet successful\n"));

            if(platform === 'web') {
                // save the db to store
                await sqlite.saveToStore('testContacts');
            }
        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
        }
        return;
    }

    onMount(async () => {
        await startTest();
        // initialize the database testNew and fill some data
        await initializeTest();
        // Show contacts before delete
        await showContacts('before DELETE');
        // test of deleting some data
        await deleteTest();
        // Show contacts final
        await showContacts('final');

        await endTest(errMsg());
        // Close Connection testNew        
        await sqlite.closeConnection("testContacts"); 

    });

    return (
        <Suspense>
            <div class={styles.Issue271}>
                <header class={styles.header}>
                    <h2>Test Issue271</h2>
                </header>
                <div class= {styles.content}>
                    <pre>
                        <p>{log}</p>
                    </pre>
                    <ul>
                        <For each={contacts()}>
                            {(contact) => <p>Name: {contact.name}  Email: {contact.email} </p>}
                        </For>
                    </ul>
                </div>
            </div>
        </Suspense>
    );
};

export default Issue271;
      