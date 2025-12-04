import nodemailer from 'nodemailer';

const isSecure = process.env.SMTP_SECURE === 'true';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: isSecure,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    },
})

export default transporter;
