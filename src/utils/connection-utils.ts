import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { sqlite } from '../App';
/**
 * 
 * @param conName  database name
 * @param isDelete delete the database if exists  
 */
export const openConnection = async (dbName: string, encrypted: boolean,
                                     mode: string, version: number,
                                     isDelete: boolean): Promise<SQLiteDBConnection> => {
    let db: SQLiteDBConnection;
    try {
        const retCC = (await sqlite.checkConnectionsConsistency()).result;
        let isConn = (await sqlite.isConnection(dbName)).result;
        if(retCC && isConn) {
            db = await sqlite.retrieveConnection(dbName);
        } else {
            db = await sqlite
                    .createConnection(dbName, encrypted, mode, version);
        }
        if (isDelete) {
            await deleteDatabase(db);
        }
        await db.open();
        return db;
    } catch (err) {
        return Promise.reject(err);
    }
}
export const deleteDatabase = async (db: SQLiteDBConnection): Promise<void> => {
    try {
        const ret = (await db.isExists()).result;
        if(ret) {
            const dbName = db.getConnectionDBName();
            await db.delete();
            return Promise.resolve();
        } else {
            return Promise.resolve();
        }
    } catch(err) {
        return Promise.reject(err);
    }
}