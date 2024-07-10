import { Router } from "express";
import UsersController from "../controllers/users.controller";

const UsersRouter = Router();

UsersRouter.post("/signup", UsersController.signup);
UsersRouter.post("/signin", UsersController.signin);

export default UsersRouter;