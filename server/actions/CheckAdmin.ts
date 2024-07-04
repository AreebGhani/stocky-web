"use server"
import prisma from "@/lib/prisma";
import connectDB from "@/server/db";
import { Prisma } from "@prisma/client";

export const CheckAdmin = async (userID: string) => {
    try {
        await connectDB();
        const user = await prisma.user.findFirst({
            where: {
                AND: [
                    { id: userID },
                    { role: 'admin' },
                ],
            },
        });
        if (!user) {
            return {
                success: false,
                message: "Something went wrong",
            };
        }
        return {
            success: true,
            message: user.role
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
