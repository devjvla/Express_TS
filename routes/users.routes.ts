import { Router } from "express";

const UsersRouter = Router();

UsersRouter.get("/signin", (req, res) => {
    res.send("Users Sign in Page");
});

export default UsersRouter;