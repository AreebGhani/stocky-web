"use server"
import prisma from "@/lib/prisma";
import connectDB from "@/server/db";
import { Prisma } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";

export const Verify = async (otp: string, token: string, createUser: boolean) => {
    try {
        let user;
        try {
            user = jwt.verify(token, process.env.JWT_SECRET || "zW4+55A2YSq/C1xm1v/6Nfge6geCBXQ==") as JwtPayload;
        } catch (error) {
            return {
                success: false,
                message: "OTP Expired",
            };
        }
        await connectDB();
        const savedOtp = await prisma.otpCode.findFirst({
            where: {
                AND: [
                    { email: user.email },
                    { phone: user.phone }
                ]
            }
        });
        if (!savedOtp) {
            return {
                success: false,
                message: "User not found",
            };
        }
        if (otp !== savedOtp?.code) {
            return {
                success: false,
                message: "Invalid OTP",
            };
        }
        await prisma.otpCode.deleteMany({ where: { id: savedOtp.id } });
        if (createUser) {
            if (user.referral !== null && user.referral !== undefined && user.referral !== '') {
                const referralExists = await prisma.user.findFirst({
                    where: { username: user.referral }
                });
                if (!referralExists) {
                    return {
                        success: false,
                        message: "Invalid referral code"
                    };
                }
                const newUser = await prisma.user.create({
                    data: {
                        username: user.username,
                        email: user?.email,
                        phone: user?.phone,
                        password: user.password,
                        picture: '',
                        role: "user",
                        referrerId: referralExists.id,
                        secret: referralExists.secret,
                    }
                });
                if (!newUser) {
                    return {
                        success: false,
                        message: "Something went wrong",
                    };
                }
                const newReward = await prisma.reward.create({
                    data: { userId: newUser.id }
                });
                if (!newReward) {
                    return {
                        success: false,
                        message: "Something went wrong",
                    };
                }
            } else {
                const newUser = await prisma.user.create({
                    data: {
                        username: user.username,
                        email: user?.email,
                        phone: user?.phone,
                        password: user.password,
                        picture: '',
                        role: "user",
                    }
                });
                if (!newUser) {
                    return {
                        success: false,
                        message: "Something went wrong",
                    };
                }
                const newReward = await prisma.reward.create({
                    data: { userId: newUser.id }
                });
                if (!newReward) {
                    return {
                        success: false,
                        message: "Something went wrong",
                    };
                }
            }
        }
        return {
            success: true,
            message: "User verified successfully",
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
        await prisma.$disconnect();
    }
};
