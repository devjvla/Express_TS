import { Request, Response } from "express";

class UsersController {
    signin = (req: Request, res: Response) => {
        console.log(req.body);

        res.json("Users Controller!");
    }
}

export default new UsersController();