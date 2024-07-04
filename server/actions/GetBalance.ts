"use server"
import prisma from "@/lib/prisma";
import connectDB from "@/server/db";
import { Prisma } from "@prisma/client";

export const GetBalance = async (userID: string) => {
    try {
        await connectDB();
        const userBalance = await prisma.user.findUnique({ where: { id: userID } });
        if (!userBalance) {
            return {
                success: false,
                message: "Something went wrong",
            };
        }
        return {
            success: true,
            data: { balance: userBalance.balance, diamonds: userBalance.diamonds }
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
}
