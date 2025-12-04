import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT), // 587
    secure: false, // Для порту 587 завжди false
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false // Щоб уникнути проблем з сертифікатом
    }
});

export default transporter;

