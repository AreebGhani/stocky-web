"use server"
import { User } from "@/types/types";
import connectDB from "@/server/db";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { SendOTP } from "@/server/actions/SendOTP";

export const Signup = async (data: User) => {
    try {
        await connectDB();
        const existingUser = await prisma.user.findFirst({
            where: { username: data.username }
        });
        if (existingUser) {
            return {
                success: false,
                error: { key: 'username', message: "Username already exists" }
            };
        }
        if (data.email !== 'null') {
            const emailExists = await prisma.user.findFirst({
                where: { email: data.email }
            });
            if (emailExists) {
                return {
                    success: false,
                    error: { key: 'email', message: "Email already exists" }
                };
            }
        }
        if (data.phone !== 'null') {
            const phoneExists = await prisma.user.findFirst({
                where: { phone: data.phone }
            });
            if (phoneExists) {
                return {
                    success: false,
                    error: { key: 'phone', message: "Phone already exists" }
                };
            }
        }
        if (data.referral !== null && data.referral !== undefined && data.referral !== '') {
            const referralExists = await prisma.user.findFirst({
                where: { username: data.referral }
            });
            if (!referralExists) {
                return {
                    success: false,
                    error: { key: 'referral', message: "Invalid referral code" }
                };
            }
        }
        data.password = await bcrypt.hash(data.password, 10);
        let otp;
        while (true) {
            otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
            const otpExists = await prisma.otpCode.findFirst({
                where: {
                    OR: [
                        { AND: [{ code: otp }, { email: data.email }] },
                        { AND: [{ code: otp }, { phone: data.phone }] },
                    ]
                }
            });
            if (!otpExists) {
                break;
            }
        }
        if (data.email && data.email !== 'null') {
            const res = await SendOTP("email", data.email, otp);
            if (!res) {
                return {
                    success: false,
                    error: { key: '', message: "Cannot send OTP" }
                };
            }
            const otpExists = await prisma.otpCode.findFirst({ where: { email: data.email } });
            if (otpExists) {
                await prisma.otpCode.update({
                    data: {
                        email: data.email,
                        phone: "null",
                        code: otp,
                    },
                    where: { id: otpExists.id }
                });
            } else {
                await prisma.otpCode.create({
                    data: {
                        email: data.email,
                        phone: "null",
                        code: otp,
                        attempts: 1,
                        resendAfter: new Date(new Date().getTime() + 2 * 60 * 1000).toString(),
                    }
                });
            }
        }
        if (data.phone && data.phone !== 'null') {
            const res = await SendOTP("phone", data.phone, otp);
            if (!res) {
                return {
                    success: false,
                    error: { key: '', message: "Cannot send OTP" }
                };
            }
            const otpExists = await prisma.otpCode.findFirst({ where: { phone: data.phone } });
            if (otpExists) {
                await prisma.otpCode.update({
                    data: {
                        email: "null",
                        phone: data.phone,
                        code: otp,
                    },
                    where: { id: otpExists.id }
                });
            } else {
                await prisma.otpCode.create({
                    data: {
                        email: "null",
                        phone: data.phone,
                        code: otp,
                        attempts: 1,
                        resendAfter: new Date(new Date().getTime() + 2 * 60 * 1000).toString(),
                    }
                });
            }
        }
        const token = jwt.sign({
            username: data.username,
            email: data.email,
            phone: data.phone,
            password: data.password,
            referral: data.referral,
        }, process.env.JWT_SECRET || "zW4+55A2YSq/C1xm1v/6Nfge6geCBXQ==", {
            expiresIn: "1d",
        });
        return {
            success: true,
            data: { token, email: data.email, phone: data.phone },
        };
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return {
                success: false,
                error: { key: e.code as string, message: e.message }
            };
        }
        return {
            success: false,
            error: { key: '', message: "An error occurred" }
        };
    } finally {
        await prisma.$disconnect();
    }
};
