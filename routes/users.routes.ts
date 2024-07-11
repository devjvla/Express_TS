import { Router } from "express";
import UsersController from "../controllers/users.controller";

// Helpers
import AuthHelper from "../helpers/auth.helper";

// Setup Users Router
const UsersRouter = Router();

UsersRouter.post("/signup", UsersController.signup);
UsersRouter.post("/signin", UsersController.signin);

// TODO: Delete later on. This is just to test if JWT is verified correctly.
UsersRouter.get("/tryjwt", AuthHelper.verityToken, UsersController.tryjwt);

export default UsersRouter;