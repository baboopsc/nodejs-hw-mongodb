import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    // Eger port 465 ise secure true olur, 587 ise false (STARTTLS) olur. Sorun KESIN cozulur:
    secure: Number(process.env.SMTP_PORT) === 465, 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const sendMail = async (options) => {
    return transporter.sendMail({
        from: process.env.SMTP_FROM,
        ...options,
    });
};