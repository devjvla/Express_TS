import { OkPacketParams, format as mysqlFormat } from "mysql2";
import { validate } from "email-validator";
import { format } from "date-fns";
import DatabaseModel from "./database.model";

// Constants
import { QUERY_YES, QUERY_NO, HTTP } from "../config/constants/constants";

// Types and Interfaces
import { User, UserParams, UserHashPasswordsParams } from "../config/types/User.type";
import { ResponseDataInterface } from "../config/interfaces/ResponseData.interface";

class UserModel extends DatabaseModel {
    /**
    * Default constructor.<br>
    * Triggered: This is being called by models and controllers.<br>
    * Last Updated Date: April 17, 2024
    * @author Jerick
    */
    constructor(){
        super();
    }

    /**
    * This function will create a new User record with a hashed password.<br>
    * Triggered by: signIn() function in users.controller.ts.<br>
    * Last updated at: July 9, 2024
    * @param first_name: string
    * @param last_name: string
    * @param email_address: string
    * @param password: string
    * @returns response_data - { status: true, result: { User }, error: null, message: null }
    * @author Jovic
	*/
    signupUser = async (params: UserParams): Promise<ResponseDataInterface< User | {} >> => {
        let response_data: ResponseDataInterface< User | {} > = { code: HTTP.BAD_REQUEST, status: false, message: null, error: null };
        
        try {
            await this.startTransaction();

            // Destructure params
            let { first_name, last_name, email_address, password } = params;

            // Check if email is valid
            if(!validate(email_address)) {
                throw new Error("Invalid Email Address");
            }

            // Check if User record exists
            let get_user = await this.#getUserByEmail(email_address);

            if(!get_user.status) {
                throw new Error(get_user.message);
            }

            // Throw an error if get_user.result has any property because it means a user record exists
            if(Object.keys(get_user.result).length) {
                throw new Error("Email Address is already registered.");
            }

            let created_at        = format(new Date(), "yyyy-MM-dd HH:mm:ss");
            let create_user_query = mysqlFormat(`
                INSERT INTO users (first_name, last_name, email_address, is_active, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, NOW());`,
                [first_name, last_name, email_address, QUERY_YES, created_at]
            );

            let create_user = await this.executeQuery<OkPacketParams>(create_user_query);

            if(!create_user) {
                throw new Error("An error occurred while creating a User record");
            }

            // Create a hashed password if User signs up using form
            if(password) {
                let hash_user_password = await this.#hashPassword({ user_id: create_user.insertId, salt: created_at, password });
  
                if(!hash_user_password.status) {
                    throw new Error(hash_user_password.message);
                }
            }

            // Create User Profile
            let create_profile_query = mysqlFormat("INSERT INTO profiles (user_id, is_private, created_at, updated_at) VALUES (?, ?, NOW(), NOW());", [create_user.insertId, QUERY_NO]);
            let create_profile       = await this.executeQuery<OkPacketParams>(create_profile_query);

            if(!create_profile) {
                throw new Error("And error occurred while creating User Profile record.");
            }

            await this.commitTransaction(this.activeTransaction);

            response_data.code   = HTTP.CREATED;
            response_data.status = true;
            response_data.result = {
                id: create_user.insertId,
                profile_id: create_profile.insertId,
                first_name, last_name, email_address, 
            }
        } catch (error) {
            await this.cancelTransaction(error, this.activeTransaction, error.message);

            response_data.message = error.message;
            response_data.error   = error;
        }
        
        return response_data;
    }
    
    /**
    * This function will fetch a specific user based on the email provided.<br>
    * Triggered by: UserModel > signupUser()<br>
    * Last updated at: July 9, 2024
    * @param email: string
    * @returns response_data - { status: true, result: { User }, error: null, message: null }
    * @author Jovic
	*/
    #getUserByEmail = async (email: string): Promise<ResponseDataInterface< User | {} >> => {
        let response_data: ResponseDataInterface< User | {} > = { status: false, message: null, error: null };

        try {
            let get_user_query = mysqlFormat("SELECT * FROM users WHERE email_address = ? AND is_active = ?;", [email, QUERY_YES]);
            let [get_user]     = await this.executeQuery<User[]>(get_user_query);
            
            response_data.status = true;
            response_data.result = { ...get_user };
        } catch (error) {
            response_data.message = error.message;
            response_data.error   = error;
        }

        return response_data;
    }

    /**
     * DOCU: Function will update user record with an hashed password
     * Triggered by: this.signupUser <br>
     * Last Updated Date: July 9, 2024
     * @async
     * @function
     * @memberOf QueryModel
     * @param user_id: string
     * @param salt: string
     * @param password: string
     * @returns response_data - { status: true, result: {}, error: null, message: null }
     * @author Jovic
     */
    #hashPassword = async (params: UserHashPasswordsParams): Promise<ResponseDataInterface<{}>> => {
        let response_data: ResponseDataInterface<{}> = { code: HTTP.BAD_REQUEST, status: false, message: null, error: null };

        try {
            let { user_id, salt, password } = params;

            let hash_user_password_query = mysqlFormat("UPDATE users SET password = SHA2(CONCAT(?, ?), 256) WHERE id = ?;", [salt, password, user_id]);
            let hash_user_password       = await this.executeQuery(hash_user_password_query);

            if(!hash_user_password) {
                throw new Error("An error occured while updating user password.");
            }

            response_data.status = true;
        } catch (error) {
            response_data.message = error.message;
            response_data.error   = error;
        }

        return response_data;
    }
}

export default UserModel;