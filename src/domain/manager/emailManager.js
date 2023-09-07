import nodemailer from "nodemailer";
import { resolve } from 'path';
import fs from "fs";
import Handlebars from 'handlebars';

class EmailManager
{
    constructor()
    {
        this.smtp_config = {
            service : 'gmail',
            port : process.env.SMTP_PORT,
            auth : {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            },
            secure: false,
            tls: {
                rejectUnauthorized: false
              }
        };
    }

    async send(templateFile)
    {
        const transporter = nodemailer.createTransport(this.smtp_config);

        const templatePath = resolve(`src/presentation/templates/${templateFile}`);
        const source = fs.readFileSync(templatePath).toString();
        const template = Handlebars.compile(source);
        const html = template({
            userName: 'Usuario.'
        });

        const mailOptions = {
            from: `"From" <${process.env.SMTP_FROM}>`,
            to:  `"To" <${process.env.SMTP_TO}>`,
            subject: 'Forgot your password',
            html
        };

        await transporter.sendMail(mailOptions);
    }
}

export default EmailManager;
