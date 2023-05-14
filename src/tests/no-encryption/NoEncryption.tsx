import type { Component } from 'solid-js';
import { For, Suspense, createSignal, onMount } from "solid-js";
import { useToString } from 'solidjs-use'
import { platform, sqlite } from '../../App';
import { SQLiteDBConnection, capSQLiteSet } from '@capacitor-community/sqlite';

import { openConnection } from '../../utils/connection-utils';
import { createSchema, twoUsers, fourUsers } from './database-utils';
import { delay } from '../../utils/delay-utils';
import styles from './NoEncryption.module.css';

const NoEncryption: Component = () => {
    const [log, setLog] =  createSignal<string[]>([]);
    const [errMsg, setErrMsg] = createSignal<string>("");
    const [users, setUsers] = createSignal<any[]>([]);
    let db: SQLiteDBConnection;
    let db1: SQLiteDBConnection;

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
            db = await openConnection('testNew', false,
                                      'no-encryption', 1,true);
            setLog((log) => log.concat("> Open connection 'testNew' successful\n"));
            // create tables in db
            let ret: any = await db.execute(createSchema);
            console.log(`&&&& createSchema ret ${JSON.stringify(ret)}`)
            if (ret.changes.changes < 0) {
                const msg = "Error: Execute createSchema failed";
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            setLog((log) => log.concat("> Create DB Schema 'testNew' successful\n"));
            res = await db.getTableList();
            console.log(`&&&& getTableList res ${JSON.stringify(res)}`)
            // Delete users if any
            let stmt = "DELETE FROM users;"
            res = await db.execute(stmt);
            console.log(`&&& execute DELETE FROM users res: ${JSON.stringify(res)}`);
            // Insert two users with execute method
            res = await db.execute(twoUsers);
            if (res.changes.changes !== 2) {
                const msg = `Execute insert twoUsers changes != 2`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            setLog((log) => log.concat("> Execute insert two users successful\n"));

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
            setLog((log) => log.concat("> Select two users successful\n"));

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
            setLog((log) => log.concat("> Execute insert four users successful\n"));

            if(platform === 'web') {
                // save the db to store
                await sqlite.saveToStore('testNew');
            }
            db1 = await openConnection('db_tab3', false,
            'no-encryption', 1,true);
            setLog((log) => log.concat("> Open connection 'db_tab3' successful\n"));
            // create tables in db1
            const query = `
                CREATE TABLE IF NOT EXISTS test (
                userId INTEGER PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                country TEXT NOT NULL
                );
            `        
            ret = await db1.execute(query);
            console.log(`&&&& createSchema 'db_tab3' ret ${JSON.stringify(ret)}`)
            if (ret.changes.changes < 0) {
            const msg = "Error: Execute createSchema 'db_tab3' failed";
            setErrMsg((errMsg) => errMsg.concat(msg));
            return;
            }
            setLog((log) => log.concat("> Create DB Schema 'db_tab3' successful\n"));
            res = await db1.getTableList();
            console.log(`&&&& getTableList res ${JSON.stringify(res)}`)
            const statement = 'SELECT * FROM test;';
            const qValues: any[] = [];
            let result = await db1.query(statement, qValues);
            console.log(`&&&& select result ${JSON.stringify(result.values)};`);
            let sQuery = "INSERT INTO test (userId, name, email, country) VALUES(1, 'Jeep', 'jeep@email.com', 'france');";
            res = await db1.run(sQuery,[]);
            if(res.changes.lastId !== 1) {
                const msg = `Run insert one user lastId != 1`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            console.log(`&&&& INSERT res.changes.changes: ${res.changes.changes}`)
            result = await db1.query(statement, qValues);
            console.log(`&&&& after INSERT select result ${JSON.stringify(result.values)};`);

            sQuery = "REPLACE INTO test (userId, name, email, country) VALUES(1, 'Maria', 'maria@email.com', 'france');";
            res = await db1.run(sQuery,[]);
            console.log(`&&&& REPLACE res.changes: ${JSON.stringify(res.changes)}`)
            result = await db1.query(statement, qValues);
            console.log(`&&&& after REPLACE select result ${JSON.stringify(result.values)};`);
        
            await sqlite.closeConnection("db_tab3",false); 

        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
        }
        return;
    }
    const showUsers = async(msg: string): Promise<void> => {
        try {
            // Query the users
            let res: any = await db.query("SELECT * FROM users");
            setUsers([...res.values]);
            console.log(`**** Show Users ${msg} ****`)
            for( const user of res.values) {
              console.log(`>>> id: ${user.id} name: ${user.name} sql_deleted: ${user.sql_deleted}`);
            }
  

        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
        }
        return;
    }
    const createSyncTable = async(): Promise<void> => {
        try {
            // create synchronization table 
            let res: any = await db.createSyncTable();
            if (res.changes.changes < 0) {
                const msg = `createSyncTable "testNew" changes < 0 `;
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
                return;
            }
            setLog((log) => log.concat("> createSyncTable  successful\n"));
            // get the synchronization date
            res = await db.getSyncDate();
            if(res.syncDate === 0) {
                const msg = `getSyncDate return 0 `;
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));                return;
                return;
            }
            const msg = `> getSyncDate "testNew" successful\n`;
            setLog((log) => log.concat(msg));

            if(platform === 'web') {
                // save the db to store
                await sqlite.saveToStore('testNew');
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
            // Delete users in an execute statement 
            stmt = `
            DELETE FROM users WHERE id = 4;
            DELETE FROM users WHERE id = 5;
            `;
            console.log(`in deleteTest stmt: ${stmt}`);
            var res: any = await db.execute(stmt);
            console.log(`delete execute res: ${JSON.stringify(res)}`) 
            if(res.changes.changes != 2) {
                const msg = `execute delete "testNew" changes != 2 `;
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
                return;
            }
            setLog((log) => log.concat("> delete with execute successful\n"));

            // Delete one user in a run statement
            stmt = "DELETE FROM users WHERE id = ?;";
            res = await db.run(stmt,[2]);
            if(res.changes.changes != 1) {
                const msg = `run delete "testNew" changes != 2 `;
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
                return;
            }

            setLog((log) => log.concat("> delete with run  successful\n"));

            // Delete a set of user in an executeSet statement
            const deleteSet: Array<capSQLiteSet> = [
                {
                    statement: "DELETE FROM users WHERE id = ?;",
                    values: [
                        [3],
                        [1]
                    ]
                }
            ];
            res = await db.executeSet(deleteSet); 
            if(res.changes.changes != 2) {
                const msg = `executeSet delete "testNew" changes != 2 `;
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
                return;
            }
            
            setLog((log) => log.concat("> delete with executeSet successful\n"));

            if(platform === 'web') {
                // save the db to store
                await sqlite.saveToStore('testNew');
            }
        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
        }
        return;
    }
    const exportFull = async (): Promise<void> => {
        try {
            // export to json full
            let jsonObj: any = await db.exportToJson('full');
            // test Json object validity
            let res: any = await sqlite.isJsonValid(JSON.stringify(jsonObj.export));
            if(!res.result) {
                let msg: string = "Error: isJsonValid Full returns false";
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
                return;
            }
            setLog((log) => log.concat("> export full successful\n"));
        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
        }
        return;
    
    }
    const localSynchronization = async (): Promise<void> => {
        try {
          // set the synchronization date
          await db.setSyncDate((new Date()).toISOString());
          setLog((log) => log.concat("> localSynchronization setSyncDate successful\n"));
          // remove all rows having sql_deleted = 1
          await db.deleteExportedRows();
          setLog((log) => log.concat("> localSynchronization deleteExportedRows successful\n"));
          return;

        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
            console.log(`>>> errMsg: ${errMsg()}`)
        }
    }

    onMount(async () => {
        await startTest();
        // initialize the database testNew and fill some data
        await initializeTest();
        // only requires for database synchronization with remote server
        await createSyncTable();
        // test of deleting some data
        await deleteTest();
        // Show users
        await showUsers('before full export');
        // delay before to do an export full
        await delay(2, 'before a full export');
        // export full
        await exportFull();
        // after loading to remote server set local new synchronization date
        await localSynchronization();
        
        // Show users final
        await showUsers('final');

        await endTest(errMsg());
        // Close Connection testNew        
        await sqlite.closeConnection("testNew", false); 

    });

    return (
        <Suspense>
            <div class={styles.NoEncryption}>
                <header class={styles.header}>
                    <h2>Test No Encryption</h2>
                </header>
                <div class= {styles.content}>
                    <pre>
                        <p>{useToString(log)()}</p>
                    </pre>
                    <ul>
                        <For each={users()}>
                            {(user) => <p>Name: {user.name}  Email: {user.email} Deleted: {user.sql_deleted} </p>}
                        </For>
                    </ul>
                </div>
            </div>
        </Suspense>
    );
};

export default NoEncryption;
      