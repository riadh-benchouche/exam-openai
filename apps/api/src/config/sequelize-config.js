import fs from "node:fs";
import {Sequelize} from "sequelize";
import dotenv from "dotenv";

let envFile = ".env";
if (fs.existsSync(".env.local")) {
    envFile = ".env.local";
}

dotenv.config({path: envFile});

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
    logging: false,
});

export default sequelize;
