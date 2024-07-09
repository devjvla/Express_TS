// Enable usage of .env variables
import dotenv from "dotenv";
dotenv.config();

export const PORT = 3000;

// Database-related Constants
export const QUERY_YES = 1;
export const QUERY_NO  = 0;
export const DB_CONFIG = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT)
};