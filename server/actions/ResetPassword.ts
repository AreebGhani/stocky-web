"use server"
import prisma from "@/lib/prisma";
import connectDB from "@/server/db";
import { Prisma } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const ResetPassword = async (password: string, token?: string, userId?: string, oldPassword?: string) => {
    if (token) {
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
            const savedUser = await prisma.user.findUnique({ where: { id: user.id } });
            if (!savedUser) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }
            password = await bcrypt.hash(password, 10);
            const updated = await prisma.user.update({
                data: { password: password }, where: { id: savedUser.id }
            });
            if (!updated) {
                return {
                    success: false,
                    message: "Something went wrong",
                };
            }
            return {
                success: true,
                message: "Password updated successfully",
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
    if (userId && oldPassword) {
        try {
            await connectDB();
            const savedUser = await prisma.user.findUnique({ where: { id: userId } });
            if (!savedUser) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }
            const isPasswordCorrect = await bcrypt.compare(
                oldPassword,
                savedUser.password
            );
            if (!isPasswordCorrect) {
                return {
                    success: false,
                    message: "Wrong Password"
                };
            }
            password = await bcrypt.hash(password, 10);
            const updated = await prisma.user.update({
                data: { password: password }, where: { id: savedUser.id }
            });
            if (!updated) {
                return {
                    success: false,
                    message: "Something went wrong",
                };
            }
            return {
                success: true,
                message: "Password updated successfully",
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
    return {
        success: false,
        message: "Reset must have either token or userId",
    };
}
