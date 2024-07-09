import { Connection, format as mysqlFormat } from "mysql2";
import { validate } from "email-validator";
import DatabaseModel from "./database.model";

// Types and Interfaces
import { User, UserParams } from "../config/types/User.type";
import { ResponseDataInterface } from "../config/interfaces/ResponseData.interface";

class UserModel extends DatabaseModel {
    /**
    * Default constructor.<br>
    * Triggered: This is being called by models and controllers.<br>
    * Last Updated Date: April 17, 2024
    * @author Jerick
    */
    constructor(transaction_connection: Connection | null = null){
        super(transaction_connection);
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
        let response_data: ResponseDataInterface< User | {} > = { status: false, message: null, error: null };
        
        try {
            // Destructure params
            let { first_name, last_name, email_address, password } = params;

            // Check if email is valid
            if(!validate(email_address)) {
                throw new Error("Invalid Email Address");
            }

            // Check if User record exists
            let get_user = await this.getUserByEmail(email_address);

            if(!get_user.status) {
                throw new Error(get_user.message);
            }

            // Throw an error if get_user.result has any property because it means a user record exists
            if(Object.keys(get_user.result).length) {
                throw new Error("Email Address is already registered.");
            }
        } catch (error) {
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
    getUserByEmail = async (email: string): Promise<ResponseDataInterface< User | {} >> => {
        let response_data: ResponseDataInterface< User | {} > = { status: false, message: null, error: null };

        try {
            let get_user_query = mysqlFormat("SELECT * FROM users WHERE email_address = ? AND is_active = ?;", [email, 1]);
            let [get_user]     = await this.executeQuery<User[]>(get_user_query);
            
            response_data.status = true;
            response_data.result = { ...get_user };
        } catch (error) {
            response_data.message = error.message;
            response_data.error   = error;
        }

        return response_data;
    }
}

export default UserModel;