import { Router } from "express";
import UsersController from "../controllers/users.controller";

const UsersRouter = Router();

UsersRouter.post("/signin", UsersController.signin);

export default UsersRouter;