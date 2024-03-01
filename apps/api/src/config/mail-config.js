import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";

let envFile = ".env";
if (fs.existsSync(".env.local")) {
    envFile = ".env.local";
}

dotenv.config({ path: envFile });

const mailTransporter = nodemailer.createTransport({
    host: process.env.MAIL_SMTP_HOST,
    port: process.env.MAIL_SMTP_PORT,
    auth: {
        user: process.env.MAIL_SMTP_USER,
        pass: process.env.MAIL_SMTP_KEY,
    },
});

export default mailTransporter;
