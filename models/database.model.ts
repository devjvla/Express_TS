import mysql, { Connection, ConnectionOptions } from "mysql2";
import { ResponseDataInterface } from "../config/interfaces/ResponseData.interface";

import { DB_CONFIG } from "../config/constants/constants";

/**
 * Class representing Database Model
 */
class DatabaseModel {
    /** The active transaction connection. */
    activeTransaction: Connection | null;

    /**
    * Default Constructor.<br>
    * Triggered: By all models.<br>
    * Last Updated Date: April 09, 2024
    * @author Jerick
    */
    constructor(transaction_connection: Connection | null = null){
        this.activeTransaction = transaction_connection;
    }

    /**
    * DOCU: This function returns a mysql connection.<br>
    * Triggered: When query will be executed.<br>
    * Last Updated Date: July 9, 2024
    * @returns The mysql database connection
    * @author Jerick, updated by Jovic
    */
    getConnection = (): Promise<Connection> => {
        return new Promise(async (resolve, reject) => {
			if(this.activeTransaction){
                resolve(this.activeTransaction);
            }
			else{
                try{
                    let connection: Connection = mysql.createConnection(<ConnectionOptions>DB_CONFIG);
                    
                    // Set active transaction
                    this.activeTransaction = connection;
                    resolve(connection);
                }
                catch(error){
                    reject(error);
                }
			}
		});
    }

    /**
    * DOCU: This function executes the given query.<br>
    * Triggered: Triggered by all models.<br>
    * Last Updated Date: April 16, 2024
    * @param query - Query to be executed
    * @returns Result or error
    * @author Jerick
    */
    executeQuery = <QueryResult>(query: string): Promise<QueryResult> => {
        return new Promise(async (resolve, reject) => {
            let connection = await this.getConnection();

            connection.query(query, (error, result) => {
                if(error){
                    reject(error);
                }
                else{
                    if(!this.activeTransaction){
                        connection.end();
                    }
                    resolve(result as QueryResult);
                }
            });
        });
    }

    /**
    * Function to start a transaction.<br>
    * Triggered by models with multiple insert/update queries.<br>
    * Last updated at: April 11, 2024 
	* @returns Connection or error
    * @author Jerick, Updated By Kirt
	*/
	startTransaction = (): Promise<Connection | mysql.QueryError> => {
		return new Promise(async (resolve, reject) => {		
			let connection = await this.getConnection();
    
            connection.beginTransaction(async (err) => {
                if(err){
                    await this.cancelTransaction(err, connection, "Something went wrong on trying to start a transaction");
                    reject(err);
                }
                else{
                    resolve(connection);
                }
            });
		});
	}

    /**
    * DOCU: This function will set the active transaction.<br>
    * Triggered by All models.<br>
    * Last updated at: April 09, 2024
    * @param transaction_connection - transaction connection to be used
    * @author Jerick
	*/
	setActiveTransaction = (transaction_connection: Connection) => {
        this.activeTransaction = transaction_connection || null;
	}

    /**
    * Function to commit transaction when all queries was successfully executed.<br>
    * Triggered by models with multiple insert/update queries.<br>
    * Last updated at: April 09, 2024
    * @param connection - transaction connection to be commited
    * @returns
    * @author Jerick
    */
	commitTransaction = (connection: Connection): Promise<boolean | mysql.QueryError> => {	
		return new Promise((resolve, reject) => {
			connection.commit(async (transaction_err) => {
				if(transaction_err){
					await this.cancelTransaction(transaction_err, connection, "Something went wrong on trying to commit the transaction");
					reject(transaction_err);
				}
				else{
					this.activeTransaction = null;

					connection.end();          
					resolve(true);
				}
			});
		});
    }

    /**
    * Function to rollback/cancel a connection.<br>
    * Triggered by models with multiple insert/update queries and when a query was not successful.<br>
    * Last updated at: April 16, 2024
    * @param error - Error message
    * @param connection - transaction connection to cancelled
    * @param message - Message to be displayed
    * @returns response object { status: false, message, error }
    * @author Jerick, Updated By: Kirt
	*/
	cancelTransaction = (error: unknown, connection: Connection, message: string | null): Promise<ResponseDataInterface<undefined>> => {
		return new Promise((resolve, reject) => {
			connection.rollback(() => {
				this.activeTransaction = null;

                connection.end();       
				resolve({status: false, error, message});
			});
		});
	}
}

export default DatabaseModel;