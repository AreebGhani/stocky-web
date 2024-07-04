"use server"
import nodemailer from "nodemailer";
import { HTMLTemplate } from "@/server/HTMLTemplate";
import axios from "axios";

export const SendOTP = async (method: string, sendTo: string, otp: string) => {
    if (method === "email") {
        try {
            await sendMail({
                email: sendTo,
                subject: "Verification Code",
                message: otp,
            });
            return true;
        } catch (error) {
            throw error;
        }
    } else {
        try {
            const res = await axios.post("https://api.veevotech.com/v3/sendsms", {
                hash: process.env.VEEVOTECH_API_KEY,
                receivernum: sendTo,
                medium: 1,
                sendernum: "Default",
                textmessage: `Your Verification Code is: ${otp}`,
            })
            if (res.data.STATUS === "SUCCESSFUL") {
                return true;
            }
            throw new Error(res.data);
        } catch (error) {
            throw error;
        }
    }
}

const sendMail = async (options: { email: string, subject: string, message: string }) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: HTMLTemplate(options.message),
    };

    await transporter.sendMail(mailOptions);
};
