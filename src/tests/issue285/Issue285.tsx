import type { Component } from 'solid-js';
import { For, Suspense, createSignal, onMount } from "solid-js";
import { useToString } from 'solidjs-use'
import { platform, sqlite } from '../../App';
import { SQLiteDBConnection, capSQLiteSet } from '@capacitor-community/sqlite';

import { openConnection } from '../../utils/connection-utils';
import { createSchema, someData, createSchema1, someData1, createSchema2, someData2 } from './database-utils';
import { delay } from '../../utils/delay-utils';
import styles from './Issue285.module.css';

const Issue285: Component = () => {
    const [log, setLog] =  createSignal<string[]>([]);
    const [errMsg, setErrMsg] = createSignal<string>("");
    const [keysValues, setKeysValues] = createSignal<any[]>([]);
    const dbName = "test285";
    let db: SQLiteDBConnection;

    const startTest = async (): Promise<void> => {
        setLog((log) => log.concat('* Starting testDatabaseIssue285 *\n\n'))
    };
    const endTest = async(msg: string): Promise<void> => {
        if(msg.length === 0) {
            setLog((log) => log.concat("\n* The set of tests was successful *\n"));
        } else {
            setLog((log) => log.concat(`${msg}`));
            setLog((log) => log.concat("\n* The set of tests failed *\n"));
        }
    }
    const showSampleTable = async (message: string) => {
        try {
            let res: any = await db.query('SELECT * FROM sample_table');
            console.log(`**** Show Sample_Table ${message} ****`)
            for( const row of res.values) {
              console.log(`>>> col1: ${row.col1} col2: ${row.col2} col3: ${row.col3} sql_deleted: ${row.sql_deleted}`);
            }
          } catch(err: any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(msg));
            console.log(`errMsg: ${errMsg()}`)
            return;
      }
  
    }
    const showTable1 = async (message: string) => {
        try {
            let res: any = await db.query('SELECT * FROM table1');
            console.log(`**** Show Table1 ${message} ****`)
            for( const row of res.values) {
              console.log(`>>> col1: ${row.col1} col2: ${row.col2} col3: ${row.col3} sql_deleted: ${row.sql_deleted}`);
            }
          } catch(err: any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(msg));
            console.log(`errMsg: ${errMsg()}`)
            return;
      }
  
    }
    const showTable2 = async (message: string) => {
        try {
            let res: any = await db.query('SELECT * FROM table2');
            console.log(`**** Show Table2 ${message} ****`)
            for( const row of res.values) {
                console.log(`>>> id: ${row.id} name: ${row.name} sql_deleted: ${row.sql_deleted}`);
            }
          } catch(err: any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(msg));
            console.log(`errMsg: ${errMsg()}`)
            return;
      }
  
    }    
    const showTable3 = async (message: string) => {
        try {
            let res: any = await db.query('SELECT * FROM table3');
            console.log(`**** Show Table3 ${message} ****`)
            for( const row of res.values) {
                console.log(`>>> id: ${row.id} name: ${row.name} sql_deleted: ${row.sql_deleted}`);
            }
          } catch(err: any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(msg));
            console.log(`errMsg: ${errMsg()}`)
            return;
      }
  
    }    
    const showAlbum = async (message: string) => {
        try {
            let res: any = await db.query('SELECT * FROM album');
            console.log(`**** Show Album ${message} ****`)
            for( const row of res.values) {
                console.log(`>>> album_artist: ${row.album_artist} album_name: ${row.album_name} sql_deleted: ${row.sql_deleted}`);
            }
          } catch(err: any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(msg));
            console.log(`errMsg: ${errMsg()}`)
            return;
      }
  
    }    
    const showSong = async (message: string) => {
        try {
            let res: any = await db.query('SELECT * FROM song');
            console.log(`**** Show Song ${message} ****`)
            for( const row of res.values) {
                console.log(`>>> song_id: ${row.song_id} song_artist: ${row.song_artist} song_album: ${row.song_album} sql_deleted: ${row.sql_deleted}`);
            }
          } catch(err: any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(msg));
            console.log(`errMsg: ${errMsg()}`)
            return;
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
            db = await openConnection(dbName, false,
                                      'no-encryption', 1,true);
            setLog((log) => log.concat(`> Open connection '${dbName}' successful\n`));

            // create tables in db
            let ret: any = await db.execute(createSchema);
            console.log(`&&&& createSchema ret ${JSON.stringify(ret)}`)
            if (ret.changes.changes < 0) {
                const msg = "Error: Execute createSchema failed";
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            setLog((log) => log.concat("> Create DB Schema 'test285 successful\n"));
            res = await db.getTableList();
            console.log(`&&&& getTableList res ${JSON.stringify(res)}`)
            // Delete users if any
            let stmt = "DELETE FROM sample_table;"
            res = await db.execute(stmt);
            console.log(`&&& execute DELETE FROM sample_table res: ${JSON.stringify(res)}`);
            // Insert someData with execute method
            res = await db.execute(someData);
            if (res.changes.changes !== 4) {
                const msg = `Execute insert someData changes != 4`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            setLog((log) => log.concat("> Execute insert someData successful\n"));
            if(platform === 'web') {
                // save the db to store
                await sqlite.saveToStore(dbName);
            }
            return;
        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            console.log(`catch message: ${msg}`)
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
        }
        return;
    }
    const createSyncTable = async(db: any) => {
        try {
            // create synchronization table
            let res = await db.createSyncTable();
            if (res.changes.changes < 0) {
                const msg = `createSyncTable changes < 0 `;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            setLog((log) => log.concat("> createSyncTable successful\n"));
            // get the synchronization date
            res = await db.getSyncDate();
            if(res.syncDate === 0) {
                const msg = `getSyncDate return 0 `;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            setLog((log) => log.concat("> getSyncDate successful\n"));
            if(platform === 'web') {
                // save the db to store
                await sqlite.saveToStore(dbName);
            }

            return;
        } catch (err: any) {
            let msg: string = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
        }
      }
      const deleteTest = async() => {
        try {
            let stmt = "";
            // Delete in an execute statement
            stmt = `
            DELETE FROM sample_table WHERE col1 = 1 AND col2 = 'asd';
            `;
            let res: any = await db.execute(stmt);
            setLog((log) => log.concat(`>>> delete execute res: ${JSON.stringify(res)}`));
            if(res.changes.changes != 1) {
                const msg = `execute delete "test285" changes !=1 `;
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
            }
            setLog((log) => log.concat(`> delete with execute successful\n`));

            // Delete in a run statement
            stmt = "DELETE FROM sample_table WHERE col1 = ? AND col2 = ?;";
            res = await db.run(stmt,[2,'asd1']);
            if(res.changes.changes != 1) {
                const msg = `run delete "test285" changes != 1 `;
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
            }

            setLog((log) => log.concat(`> delete with run successful\n`));

            // Delete in an executeSet statement
            const deleteSet = [
                {
                    statement: "DELETE FROM sample_table WHERE col1 = ? AND col2 = ?;",
                    values: [
                        [2, 'asd'],
                        [1, 'asd1']
                    ]
                }
            ];
            res = await db.executeSet(deleteSet);
            if(res.changes.changes != 2) {
                const msg = `executeSet delete "test285" changes != 2 `;
                setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
            }

            setLog((log) => log.concat(`> delete with executeSet successful\n`));

            if(platform === 'web') {
                // save the db to store
                await sqlite.saveToStore(dbName);
            }
            return;
        } catch (err: any) {
            let msg = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
        }
      }
      const initializeTestFK = async(): Promise<void> => {
        try {
            // create tables in db
            let ret: any = await db.execute(createSchema1);
            console.log(`&&&& createSchema1 ret ${JSON.stringify(ret)}`)
            if (ret.changes.changes < 0) {
                const msg = "Error: Execute createSchema1 failed";
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            setLog((log) => log.concat("> Create DB Schema1 'test285 successful\n"));
            let res: any = await db.getTableList();
            console.log(`&&&& getTableList res ${JSON.stringify(res)}`)
            // Delete table1 if any
            let stmt = "DELETE FROM table1;"
            res = await db.execute(stmt);
            console.log(`&&& execute DELETE FROM table1 res: ${JSON.stringify(res)}`);
            // Delete table2 if any
            stmt = "DELETE FROM table2;"
            res = await db.execute(stmt);
            console.log(`&&& execute DELETE FROM table2 res: ${JSON.stringify(res)}`);
            // Delete table3 if any
            stmt = "DELETE FROM table3;"
            res = await db.execute(stmt);
            console.log(`&&& execute DELETE FROM table3 res: ${JSON.stringify(res)}`);
            // Insert someData with execute method
            res = await db.execute(someData1);
            if (res.changes.changes !== 10) {
                const msg = `Execute insert someData1 changes != 10`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            setLog((log) => log.concat("> Execute insert someData1 successful\n"));
            if(platform === 'web') {
                // save the db to store
                await sqlite.saveToStore(dbName);
            }
            return;
        } catch (err:any) {
            let msg: string = err.message ? err.message : err;
            console.log(`catch message: ${msg}`)
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
        }
        return;
    }
    const deleteTestFK = async() => {
        try {
            let stmt = "";
            // Delete in an execute statement
            stmt = `
            DELETE FROM table1 WHERE col1 = 1 AND col2 = 'ef5c57d5-b885-49a9-9c4d-8b340e4abdbc';
            `;
            let res: any = await db.execute(stmt);
            console.log(`>>> delete execute res: ${JSON.stringify(res)}`)
            if(res.changes.changes != 3) {
                const msg = `Delete from table1 changes != 3`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            setLog((log) => log.concat("> delete with execute successful\n"));

            // Delete in a run statement
            stmt = "DELETE FROM table1 WHERE col1 = ? AND col2 = ?;";
            res = await db.run(stmt,[2,'bced3262-5d42-470a-9585-d3fd12c45452']);
            console.log(`>>> delete run res: ${JSON.stringify(res)}`)
            if(res.changes.changes != 3) {
                const msg = `run delete "test285" changes != 3 `;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            setLog((log) => log.concat("> delete with run successful\n"));

            // Delete in an executeSet statement
            const deleteSet = [
                {
                    statement: "DELETE FROM table1 WHERE col1 = ? AND col2 = ?;",
                    values: [
                        [2, 'ef5c57d5-b885-49a9-9c4d-8b340e4abdbc'],
                        [1, 'bced3262-5d42-470a-9585-d3fd12c45452']
                    ]
                }
            ];
            res = await db.executeSet(deleteSet);
            console.log(`>>> delete executeSet res: ${JSON.stringify(res)}`)
            if(res.changes.changes != 6) {
                const msg = `executeSet delete "test285" changes != 6 `;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }

            setLog((log) => log.concat("> delete with executeSet successful\n"));

            if(platform === 'web') {
                // save the db to store
                await sqlite.saveToStore(dbName);
            }
            return;
        } catch (err:any) {
            let msg = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(`Error: ${msg}`));
        }
    }
    const initializeTestFKCPK = async() => {
        // test with Foreign Keys and Composite Primary Key
        try {
            // create tables in db
            let res: any = await db.execute(createSchema2);
            console.log(`>>> createSchema2 ret ${JSON.stringify(res)}`)
            if (res.changes.changes < 0) {
              const msg = "Error: Execute createSchema2 failed";
              setErrMsg((errMsg) => errMsg.concat(msg));
              return;
            }
            setLog((log) => log.concat("> Create DB Schema2 successful\n"));
            res = await db.getTableList();
            console.log(`>>> getTableList res ${JSON.stringify(res)}`)
            // Delete album, song if any
            let stmt = "DELETE FROM song;"
            res = await db.execute(stmt);
            console.log(`>>> execute DELETE FROM song res: ${JSON.stringify(res)}`);
            stmt = "DELETE FROM album;"
            res = await db.execute(stmt);
            console.log(`>>> execute DELETE FROM album res: ${JSON.stringify(res)}`);
            // Insert some data
            res = await db.execute(someData2);
            if (res.changes.changes !== 20) {
              const msg = `Execute insert someData2 changes != 20`;
              setErrMsg((errMsg) => errMsg.concat(msg));
              return;
            }
            setLog((log) => log.concat("> Execute insert someData2 successful\n"));

            if(platform === 'web') {
                // save the db to store
                await sqlite.saveToStore(dbName);
            }
            // Query the album
            res = await db.query("SELECT * FROM album");
            if(res.values.length !== 4 ) {
                const msg = `Query not returning 4 data`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            // Query the song
            res = await db.query("SELECT * FROM song");
            if(res.values.length !== 16 ) {
                const msg = `Query not returning 16 data from song`;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            setLog((log) => log.concat("> Select someData2 successful\n"));

            return;
        } catch (err: any) {
            let msg = err.message ? err.message : err;
            console.log(`Error: ${msg}`);
            setErrMsg((errMsg) => errMsg.concat(msg));
            return;
        }
    }
    const deleteTestFKCPK = async() => {
        try {
            let stmt = "";
            // Delete in an execute statement
            stmt = `
            DELETE FROM album WHERE album_artist = 'The Beatles' AND album_name = 'Abbey Road';
            `;
            let res: any = await db.execute(stmt);
            console.log(`>>> delete execute res: ${JSON.stringify(res)}`)
            if(res.changes.changes != 4) {
                const msg = `execute delete "test285" changes != 4 `;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }
            setLog((log) => log.concat("> delete with execute successful\n"));

            // Delete in a run statement
            stmt = "DELETE FROM album WHERE album_artist = ? AND album_name = ?;";
            res = await db.run(stmt,['The Beatles','Help!']);
            console.log(`>>> delete run res: ${JSON.stringify(res)}`)
            if(res.changes.changes != 4) {
                const msg = `run delete "test285" changes != 4 `;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }

            setLog((log) => log.concat("> delete with run successful\n"));

            // Delete in an executeSet statement
            const deleteSet = [
                {
                    statement: "DELETE FROM album WHERE album_artist = ? AND album_name = ?;",
                    values: [
                        ['The Rolling Stones','Sticky Fingers'],
                        ['The Rolling Stones','Hyde Park Live']
                    ]
                }
            ];
            res = await db.executeSet(deleteSet);
            console.log(`>>> delete executeSet res: ${JSON.stringify(res)}`)
            if(res.changes.changes != 12) {
                const msg = `executeSet delete "test285" changes != 12 `;
                setErrMsg((errMsg) => errMsg.concat(msg));
                return;
            }

            setLog((log) => log.concat("> delete with executeSet successful\n"));

            // save the db to store
            if(platform === 'web') {
                // save the db to store
                await sqlite.saveToStore(dbName);
            }
            return;
        } catch (err: any) {
            let msg = err.message ? err.message : err;
            setErrMsg((errMsg) => errMsg.concat(msg));
            return;
    }
      }

    onMount(async () => {
        await startTest();
        // initialize the database dbName and fill some data
        await initializeTest();
        // create synchronization table
        await createSyncTable(db);
        // Show the initial sample_table
        await showSampleTable('initial data');
        await deleteTest();
        // Show the after delete sample_table
        await showSampleTable('after delete data');
        // Test with Foreign Keys
        await initializeTestFK();
        // Show the initial table1
        await showTable1('initial data');
        // Show the initial table2
        await showTable2('initial data');
        // Show the initial table3
        await showTable3('initial data');
        // Delete some data from table1
        await deleteTestFK();
        // Show the after delete table1
        await showTable1('after delete data');
        // Show the after delete table2
        await showTable2('after delete data');
        // Show the after delete table3
        await showTable3('after delete data');
        // test with Foreign keys and Composite Primary Keys
        await initializeTestFKCPK();
        // Show the initial album
        await showAlbum('initial data');
        // Show the initial song
        await showSong('initial data');
        // Delete some album
        await deleteTestFKCPK()
        // Show the after delete album
        await showAlbum('after delete data');
        // Show the after delete song
        await showSong('after delete data');

        await endTest(errMsg());
        // Close Connection dbName        
        await sqlite.closeConnection(dbName, false); 

    });

    return (
        <Suspense>
            <div class={styles.Issue2857}>
                <header class={styles.header}>
                    <h2>Test Issue285</h2>
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

export default Issue285;
      