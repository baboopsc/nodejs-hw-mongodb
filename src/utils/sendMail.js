import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const sendMail = async (options) => {
    try {
        console.log("Mail gonderimi deneniyor... Hedef:", options.to);
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM,
            ...options,
        });
        console.log("MAIL BASARIYLA GITTI:", info.messageId);
        return info;
    } catch (error) {
        console.error("MAIL GONDERME HATASI PATLADI DETAYI:", error);
        throw error;
    }
};