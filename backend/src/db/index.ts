import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';


/**
 * Creates a node-json-db database config
 * @param {string} name - name of the JSON storage file
 * @param {boolean} Tells the to save on each push otherwise the save() mthod has to be called.
 * @param {boolean} Instructs JsonDB to save the database in human readable format
 * @param {string} separator - the separator to use when accessing database values
 */
 const dbConfig = new Config("myDataBase", true, false, '/')

 /**
  * Creates a Node-json-db JSON storage file
  * @param {instance} dbConfig - Node-json-db configuration
  */
 const db = new JsonDB(dbConfig);
 
 export default db;