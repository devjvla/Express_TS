import express from "express";
import { PORT } from "./config/constants/constants";
import UsersRouter from "./routes/users.routes";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(`/${process.env.API_PREFIX}/users`, UsersRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
