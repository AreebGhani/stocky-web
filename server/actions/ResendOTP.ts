"use server"
import prisma from "@/lib/prisma";
import connectDB from "@/server/db";
import { Prisma } from "@prisma/client";
import otpGenerator from "otp-generator";
import { SendOTP } from "@/server/actions/SendOTP";

export const ResendOTP = async (method: string, sendTo: string) => {
    try {
        await connectDB();
        if (method === 'email') {
            const savedOtp = await prisma.otpCode.findFirst({ where: { email: sendTo } });
            if (!savedOtp) {
                return {
                    success: false,
                    message: 'Cannot find the email address'
                }
            }
            const resendAfter = new Date(savedOtp.resendAfter);
            const currentTime = new Date();
            const attempts = savedOtp.attempts;
            if (!(resendAfter.getTime() < currentTime.getTime()) && attempts <= 4) {
                return {
                    success: false,
                    message: 'Try again later',
                }
            }
            if (attempts > 4) {
                await prisma.otpCode.deleteMany({ where: { email: sendTo } });
                return {
                    success: false,
                    message: 'To many attempts, please try again for verification',
                }
            }
            let otp;
            while (true) {
                otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
                const otpExists = await prisma.otpCode.findFirst({
                    where: { AND: [{ code: otp }, { email: sendTo }] }
                });
                if (!otpExists) {
                    break;
                }
            }
            let res = await SendOTP(method, sendTo, otp);
            if (!res) {
                return {
                    success: false,
                    message: "Cannot send OTP",
                };
            }
            const nextResendTime = calculateNextResendTime(attempts + 1);
            const updated = await prisma.otpCode.update({
                data: {
                    code: otp,
                    attempts: (attempts + 1),
                    resendAfter: nextResendTime,
                },
                where: { id: savedOtp?.id }
            });
            if (!updated) {
                return {
                    success: false,
                    message: 'Something went wrong',
                }
            }
            return {
                success: true,
                message: 'OTP sent',
            }
        }
        if (method === 'phone') {
            const savedOtp = await prisma.otpCode.findFirst({ where: { phone: sendTo } });
            if (!savedOtp) {
                return {
                    success: false,
                    message: 'Cannot find the phone address'
                }
            }
            const resendAfter = new Date(savedOtp.resendAfter);
            const currentTime = new Date();
            const attempts = savedOtp.attempts;
            if (!(resendAfter < currentTime) && attempts >= 4) {
                return {
                    success: false,
                    message: 'Try again later',
                }
            }
            if (attempts > 4) {
                await prisma.otpCode.deleteMany({ where: { phone: sendTo } });
                return {
                    success: false,
                    message: 'To many attempts, please try again for verification',
                }
            }
            let otp;
            while (true) {
                otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
                const otpExists = await prisma.otpCode.findFirst({
                    where: { AND: [{ code: otp }, { email: sendTo }] }
                });
                if (!otpExists) {
                    break;
                }
            }
            let res = await SendOTP(method, sendTo, otp);
            if (!res) {
                return {
                    success: false,
                    message: "Cannot send OTP",
                };
            }
            const nextResendTime = calculateNextResendTime(attempts + 1);
            const updated = await prisma.otpCode.update({
                data: {
                    code: otp,
                    attempts: (attempts + 1),
                    resendAfter: nextResendTime,
                },
                where: { id: savedOtp?.id }
            });
            if (!updated) {
                return {
                    success: false,
                    message: 'Something went wrong',
                }
            }
            return {
                success: true,
                message: 'OTP sent',
            }
        }
        return {
            success: false,
            message: "Wrong method",
        };
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

const calculateNextResendTime = (attempts: number) => {
    switch (attempts) {
        case 1:
            return new Date(new Date().getTime() + 2 * 60 * 1000).toString();
        case 2:
            return new Date(new Date().getTime() + 10 * 60 * 1000).toString();
        case 3:
            return new Date(new Date().getTime() + 60 * 60 * 1000).toString();
        case 4:
            return new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toString();
        default:
            return new Date().toString();
    }
};
