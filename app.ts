import express      from "express";
import http         from "http";
import bodyParser   from "body-parser";
import cookieParser from "cookie-parser";
import compression  from "compression";
import cors         from "cors";
import dotenv       from "dotenv";

import { API_PREFIX, PORT }     from "./config/constants/constants";
import UsersRouter  from "./routes/users.routes";

// Allow app to use .env variables
dotenv.config();

// Setup Express App
const app = express();

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

// Setup CORS
app.use(cors({
    credentials: true,
}));

// Setup Routes
app.use(`/${API_PREFIX}/users`, UsersRouter);


// Setup Express Server
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});