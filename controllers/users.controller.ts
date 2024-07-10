import { Request, Response } from "express";

// Models
import UserModel from "../models/user.model";

// Types and Interfaces
import { User, SignupUserParams, SigninUserParams } from "../config/types/User.type";
import { ResponseDataInterface } from "../config/interfaces/ResponseData.interface";

// Helpers
import GlobalHelper from "../helpers/index";

// Constants
import { HTTP } from "../config/constants/constants";

class UsersController {
    /**
    * DOCU: This function will create a new User record.<br>
    * Triggered: When user signs up.<br>
    * Last Updated Date: July 10, 2024
    * @param req - Required: { params: first_name, last_name, email_address, password }
    * @param res
    * @returns 
    * Sends an http response json object: { status: true, result: { User }, error: null }
    * @author Jovic
    */
    signup = async (req: Request, res: Response): Promise<void> => {
        let response_data: ResponseDataInterface< User | {} > = { status: false, message: null, error: null };

        try {
            // Check if required fields are valid
            let check_fields = GlobalHelper.checkFields(["first_name", "last_name", "email_address"], ["password", "confirm_password"], req.body);

            if(!check_fields.status) {
                response_data.message = check_fields.message;

                throw new Error(check_fields.message);
            }

            // Destructure check_fields result
            let { password, confirm_password } = check_fields.result;

            if(password != confirm_password) {
                throw new Error("Passwords doesn't match");
            }

            let userModel   = new UserModel();
            response_data = await userModel.signupUser({ ...check_fields.result } as SignupUserParams);
        } catch (error) {
            response_data.message = error.message;
            response_data.error   = error;
        }
        
        res.status(response_data.code).json(response_data);
    }
    
    /**
    * DOCU: This function will get User record.<br>
    * Triggered: When user signs up.<br>
    * Last Updated Date: July 10, 2024
    * @param req - Required: { params: email_address, password }
    * @param res
    * @returns 
    * Sends an http response json object: { status: true, result: { User }, error: null }
    * @author Jovic
    */
    signin = async (req: Request, res: Response): Promise<void> => {
        let response_data: ResponseDataInterface<User> = { status: false, message: null, error: null };
        
        try {
            // check if required fields are valid
            let check_fields = GlobalHelper.checkFields(["email_address", "password"], [], req.body);

            if(!check_fields.status) {
                response_data.message = check_fields.message;

                throw new Error(check_fields.message);
            }

            let userModel = new UserModel();
            response_data = await userModel.signinUser({ ...check_fields.result } as SigninUserParams);

        } catch (error) {
            response_data.message = error.message;
            response_data.error   = error;
        }

        res.status(HTTP.OK).json(response_data);
    }
}

export default new UsersController();