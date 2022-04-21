import { IDBPDatabase, openDB } from 'idb';

class IndexedDb {
     database: string;
	 db: any;
	

    constructor(database: string) {
		this.database = database;
		
    }

	 

       async createObjectStore(tableNames: string[]){
        try {
            this.db = await openDB(this.database, 1, {
                upgrade(db: IDBPDatabase) {
                    for (const tableName of tableNames) {
                        if (db.objectStoreNames.contains(tableName)) {
                            continue;
                        }
                        db.createObjectStore(tableName, { autoIncrement: false});
					}
					
				},
				
			});
			return true;
        } catch (error) {
            return false;
        }
    }

     async getValue(tableName: string, id: number) {
		 if(this.db){
			 try {
        const tx = this.db.transaction(tableName, 'readonly');
        const store = tx.objectStore(tableName);
        const result = await store.get(id);
        console.log('Get Data ', JSON.stringify(result));
		return result;
		} catch (error) {
            return null;
        }
		}
		return null;
    }

     async getAllValue(tableName: string) {
        const tx = this.db.transaction(tableName, 'readonly');
        const store = tx.objectStore(tableName);
        const result = await store.getAll();
        console.log('Get All Data', JSON.stringify(result));
        return result;
    }

     async putValue(tableName: string, value: object) {
		 if(!this.db){
			 await this.createObjectStore([tableName]);
		 }
		 try{
		
        const tx = this.db.transaction(tableName, 'readwrite');
		const store = tx.objectStore(tableName);
		//await store.clear();
        const result = await store.put(value, 1);
        //console.log('Put Data ', JSON.stringify(result));
		return result;
		 }
		 catch(error)
		 {
			// await this.deleteValue(tableName, 1);
			console.log(error);

		 }
    }

     async putBulkValue(tableName: string, values: object[]) {
        const tx = this.db.transaction(tableName, 'readwrite');
        const store = tx.objectStore(tableName);
        for (const value of values) {
            const result = await store.put(value);
            console.log('Put Bulk Data ', JSON.stringify(result));
        }
        return this.getAllValue(tableName);
    }

     async deleteValue(tableName: string, id: number) {
		 if(this.db){
        const tx = this.db.transaction(tableName, 'readwrite');
        const store = tx.objectStore(tableName);
        const result = await store.get(id);
        if (!result) {
            console.log('Id not found', id);
            return result;
        }
        await store.delete(id);
        console.log('Deleted Data', id);
		
		}
		return id;
    }
}

export default IndexedDb;