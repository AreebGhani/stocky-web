"use server"
import prisma from "@/lib/prisma";
import connectDB from "@/server/db";
import { Prisma } from "@prisma/client";

export const CheckResendTime = async (method: string, sendTo: string) => {
    try {
        await connectDB();
        if (method === 'email') {
            const savedOtp = await prisma.otpCode.findFirst({ where: { email: sendTo } });
            if (!savedOtp) {
                return {
                    success: false,
                    message: "Email not found",
                }
            }
            let time: { min: number, sec: number } = { min: 0, sec: 0 };
            const resendAfter = new Date(savedOtp.resendAfter);
            const currentTime = new Date();
            if (resendAfter.getTime() > currentTime.getTime()) {
                time = {
                    min: Math.floor((resendAfter.getTime() - currentTime.getTime()) / (60 * 1000)),
                    sec: Math.floor(((resendAfter.getTime() - currentTime.getTime()) / 1000) % 60),
                }
            }
            return {
                success: true,
                time: time,
            };
        }
        if (method === 'phone') {
            const savedOtp = await prisma.otpCode.findFirst({ where: { phone: sendTo } });
            if (!savedOtp) {
                return {
                    success: false,
                    message: "Phone not found",
                }
            }
            const currentTime: number = new Date().getTime();
            const resendAfter: number = new Date(savedOtp.resendAfter).getTime();
            return {
                success: true,
                time: {
                    min: Math.floor((resendAfter - currentTime) / (60 * 1000)),
                    sec: Math.floor(((resendAfter - currentTime) / 1000) % 60),
                },
            };
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
