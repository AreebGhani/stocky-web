"use server"
import prisma from "@/lib/prisma";
import connectDB from "@/server/db";
import { Prisma } from "@prisma/client";

export const GetAllUsers = async () => {
    try {
        await connectDB();
        const users = await prisma.user.findMany({});
        if (!users) {
            return {
                success: false,
                message: "Something went wrong",
            };
        }
        return {
            success: true,
            data: { users }
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
