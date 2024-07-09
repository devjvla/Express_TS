import { Request, Response } from "express";

// Models
import UserModel from "../models/user.model";

// Types and Interfaces
import { User } from "../config/types/User.type";
import { ResponseDataInterface } from "../config/interfaces/ResponseData.interface";

class UsersController {
    signin = async (req: Request, res: Response): Promise<void> => {
        let response_data: ResponseDataInterface<{ user?: User }> = { status: false, message: null, error: null };

        try {
            let userModel = new UserModel();
            
            response_data = await userModel.getUserByEmail(req.body.email);
        } catch (error) {
            response_data.error = error;
        }

        res.status(200).json(response_data);
    }
}

export default new UsersController();