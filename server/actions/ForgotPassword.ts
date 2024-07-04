"use server"
import prisma from "@/lib/prisma";
import connectDB from "@/server/db";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { SendOTP } from "@/server/actions/SendOTP";

export const ForgotPassword = async (method: string, contact: string) => {
    try {
        await connectDB();
        if (method === 'email') {
            const userExists = await prisma.user.findFirst({ where: { email: contact } });
            if (!userExists) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }
            let otp;
            while (true) {
                otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
                const otpExists = await prisma.otpCode.findFirst({
                    where: { AND: [{ code: otp }, { email: contact }] }
                });
                if (!otpExists) {
                    break;
                }
            }
            let res = await SendOTP(method, contact, otp);
            if (!res) {
                return {
                    success: false,
                    message: "Cannot send OTP",
                };
            }
            const otpExists = await prisma.otpCode.findFirst({ where: { email: contact } });
            if (otpExists) {
                await prisma.otpCode.update({
                    data: {
                        email: contact,
                        phone: "null",
                        code: otp,
                    },
                    where: { id: otpExists.id }
                });
            } else {
                await prisma.otpCode.create({
                    data: {
                        email: contact,
                        phone: "null",
                        code: otp,
                        attempts: 1,
                        resendAfter: new Date(new Date().getTime() + 2 * 60 * 1000).toString(),
                    }
                });
            }
            const token = jwt.sign({ ...userExists, secret: "" }, process.env.JWT_SECRET || "zW4+55A2YSq/C1xm1v/6Nfge6geCBXQ==",
                { expiresIn: "5m" });
            return {
                success: true,
                token,
            }
        }
        if (method === 'phone') {
            const userExists = await prisma.user.findFirst({ where: { phone: contact } });
            if (!userExists) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }
            let otp;
            while (true) {
                otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
                const otpExists = await prisma.otpCode.findFirst({
                    where: { AND: [{ code: otp }, { email: contact }] }
                });
                if (!otpExists) {
                    break;
                }
            }
            let res = await SendOTP(method, contact, otp);
            if (!res) {
                return {
                    success: false,
                    message: "Cannot send OTP",
                };
            }
            const otpExists = await prisma.otpCode.findFirst({ where: { email: contact } });
            if (otpExists) {
                await prisma.otpCode.update({
                    data: {
                        email: contact,
                        phone: "null",
                        code: otp,
                    },
                    where: { id: otpExists.id }
                });
            } else {
                await prisma.otpCode.create({
                    data: {
                        email: contact,
                        phone: "null",
                        code: otp,
                        attempts: 1,
                        resendAfter: new Date(new Date().getTime() + 2 * 60 * 1000).toString(),
                    }
                });
            }
            const token = jwt.sign({ ...userExists, secret: "" }, process.env.JWT_SECRET || "zW4+55A2YSq/C1xm1v/6Nfge6geCBXQ==",
                { expiresIn: "5m" });
            return {
                success: true,
                token,
            }
        }
        return {
            success: false,
            message: "Wrong method"
        }
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return {
                success: false,
                message: e.message,
            };
        }
        return {
            success: false,
            message: "An error occurred",
        };
    } finally {
        prisma.$disconnect();
    }
}
