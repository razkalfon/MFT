import { createTransport } from "nodemailer";

const sendEmail = async (to, subject, message) => {
    try {
        let transport = createTransport({
            service: 'gmail',
            auth: {
                user: 'razh10@gmail.com',
                pass: "broq vxwl qunz dvah",
            },
        });
        await transport.sendMail({
            from: 'razh10@gmail.com',
            to,
            subject,
            html: message,
        });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export default sendEmail;
