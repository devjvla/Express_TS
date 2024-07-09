import { Connection, format as mysqlFormat } from "mysql2";
import DatabaseModel from "./database.model";
import { ResponseDataInterface } from "../config/interfaces/ResponseData.interface";
import { User } from "../config/types/User.type";

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
    
    getUserByEmail = async (email: string): Promise<ResponseDataInterface<{ user?: User }>> => {
        let response_data: ResponseDataInterface<{ user?: User }> = { status: false, message: null, error: null };

        try {
            let get_user_query = mysqlFormat("SELECT * FROM users WHERE email_address = ? AND is_active = ?;", [email, 1]);
            let [get_user]     = await this.executeQuery<User[]>(get_user_query);
            
            if(get_user.id === null) {
                throw new Error("User does not exist");
            }

            response_data.status = true;
            response_data.result = { user: get_user };
        } catch (error) {
            response_data.error = error;
        }

        return response_data;
    }
}

export default UserModel;