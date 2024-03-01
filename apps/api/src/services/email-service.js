import fs from "node:fs";
import {fileURLToPath} from "node:url";
import path from "node:path";
import mailTransporter from "../config/mail-config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendEmail = async (email, subject, template) => {
    try {
        await mailTransporter.sendMail({
            from: process.env.MAIL_SMTP_USER,
            to: email,
            subject,
            html: template,
        });
    } catch (error) {
        console.error(error);
    }
};

export const sendEmailConfirmation = async (email, token) => {
    try {
        const confirmationLink = `${process.env.HOST_API}/auth/confirm?email=${email}&authentificationToken=${token}`;

        const subject = "Confirmation de votre compte";

        const htmlTemplate = fs.readFileSync(
            path.join(__dirname, "../templates/email-confirmation.html"),
            "utf8"
        );

        const template = htmlTemplate.replace(
            "{{confirmationLink}}",
            confirmationLink
        );

        await sendEmail(email, subject, template);

        return true;
    } catch (error) {
        console.error(`Error sending confirmation email : ${error.message}`);
    }
};

export const sendBlockedAccountEmail = async (email) => {
    try {
        const htmlTemplate = fs.readFileSync(
            path.join(__dirname, "../templates/blocked-user-notification.html"),
            "utf8"
        );

        const subject = "Compte temporairement bloqué";

        await sendEmail(email, subject, htmlTemplate);

        return true;
    } catch (error) {
        console.error(`Error sending blocked account email : ${error.message}`);
    }
};

export const sendPasswordChangeReminderEmail = async (email) => {
    try {
        const htmlTemplate = fs.readFileSync(
            path.join(__dirname, "../templates/password-change-reminder.html"),
            "utf8"
        );

        const subject = "Changement de mot de passe nécessaire";

        const passwordResetLink = `${process.env.HOST_API}/users/reset-password?email=${email}`;

        const template = htmlTemplate.replace(
            "{{passwordResetLink}}",
            passwordResetLink
        );

        await sendEmail(email, subject, template);

        return true;
    } catch (error) {
        console.error(
            `Error sending password change reminder email : ${error.message}`
        );
    }
};

export const sendResetPasswordEmail = async (email, passwordResetToken) => {
    try {
        const htmlTemplate = fs.readFileSync(
            path.join(__dirname, "../templates/reset-password.html"),
            "utf8"
        );

        // TODO: replace with frontend url
        const passwordResetLink = `${process.env.HOST_CLIENT}/password-reset?email=${email}&token=${passwordResetToken}`;

        const subject = "Réinitialisation de votre mot de passe";

        const template = htmlTemplate.replace(
            "{{passwordResetLink}}",
            passwordResetLink
        );

        await sendEmail(email, subject, template);

        return true;
    } catch (error) {
        console.error(`Error sending reset password email : ${error.message}`);
    }
}