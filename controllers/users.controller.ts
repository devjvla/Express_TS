import { Request, Response } from "express";

class UsersController {
    signin = (req: Request, res: Response) => {
        res.json("Users Controller!");
    }
}

export default new UsersController();