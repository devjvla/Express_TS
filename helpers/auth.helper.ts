import { Request, Response, NextFunction } from "express";
import JWT, { VerifyErrors } from "jsonwebtoken";

// Constants
import { JWT_SECRET, JWT_TOKEN_EXPIRATION } from "../config/constants/constants";

// Types and Interfaces
import { User, UserCredentials } from "../config/types/User.type";
import { ResponseDataInterface } from "../config/interfaces/ResponseData.interface";

class AuthHelper {
    /**
    * This function is used for creating JWT using User credentials and JWT Secret.<br>
    * Last updated at: July 11, 2024
    * @param {Object} credentials - User Credentials to be converted to token.
    * @returns {String} token - JWT created from the given credentials.
    * @author JV
    */
    createToken = (credentials: UserCredentials): ResponseDataInterface<string> => {
        let response_data: ResponseDataInterface<string> = { status: false, message: null, error: null };

        try {
            if(!credentials || !Object.keys(credentials).length) {
                throw new Error("A token cannot be created because of invalid credentials.");
            }

            let token = JWT.sign(credentials, JWT_SECRET, { expiresIn: JWT_TOKEN_EXPIRATION });

            response_data.status = true;
            response_data.result = token;
        } catch (error) {
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
    * This function is used for verifying JWT.<br>
    * Last updated at: July 11, 2024
    * @author JV
    */
    verityToken = (req: Request & { user: JWT.JwtPayload | string }, res: Response, next: NextFunction): void => {
        try {
            const userToken = req.cookies.userToken;
      
            if(!userToken) {
                throw new Error("You are unauthorized.");
            }

            /* Verify login token */
            JWT.verify(userToken, JWT_SECRET, (error: VerifyErrors | null, decodedUserToken: JWT.JwtPayload | string | undefined) => {
                /* If there are error encountered. e.g. tokenExpiredError. Destroy the cookie. */
                if(error){
                    res.cookie("userToken", "", { maxAge: 1 });
                    return res.json({ status: false, error, message: error.message });
                }
                /* If the token is verified succesfully. */
                else{
                    req.user = decodedUserToken;
                    next();
                }
            });
        } catch (error) {
            res.clearCookie("userToken");
            res.status(401).json(error.name === "TokenExpiredError" ? "Your session has expired. Please re-login." : "You are unauthorized.");
        }
    }
}

export default new AuthHelper();