"use server"
import connectDB from "@/server/db";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const Login = async (data: {
    password: string;
    phone?: string;
    email?: string;
    checkbox?: boolean;
}) => {
    try {
        await connectDB();
        let user;
        if (data.email !== 'null') {
            user = await prisma.user.findFirst({
                where: { email: data.email }
            });
            if (!user) {
                return {
                    success: false,
                    error: { key: 'email', message: "Email not found" }
                };
            }
        }
        if (data.phone !== 'null') {
            user = await prisma.user.findFirst({
                where: { phone: data.phone }
            });
            if (!user) {
                return {
                    success: false,
                    error: { key: 'phone', message: "Phone number not found" }
                };
            }
        }
        if (!user) {
            return {
                success: false,
                error: { key: 'password', message: "User not found" }
            }
        }
        const match = await bcrypt.compare(data.password, user.password);
        if (!match) {
            return {
                success: false,
                error: { key: 'password', message: "Wrong password" }
            };
        }
        const token = jwt.sign({
            balance: user.balance,
            diamonds: user.diamonds,
            email: user.email,
            id: user.id,
            phone: user.phone,
            referral: user.referrerId,
            picture: user.picture,
            role: user.role,
            rank: user.rank,
            teamCommission: user.teamCommission,
            username: user.username
        }, process.env.JWT_SECRET || "zW4+55A2YSq/C1xm1v/6Nfge6geCBXQ==", {
            expiresIn: data.checkbox ? "7d" : "1d",
        });
        return {
            success: true,
            data: { token },
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
