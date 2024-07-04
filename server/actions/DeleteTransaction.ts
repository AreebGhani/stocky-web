"use server"
import prisma from "@/lib/prisma";
import connectDB from "@/server/db";
import { Prisma } from "@prisma/client";

export const DeleteTransaction = async (ID: string, type: 'WITHDRAW' | 'DEPOSIT') => {
    try {
        await connectDB();
        if (type === 'WITHDRAW') {
            const deleteRequest = await prisma.withdrawRequest.delete({ where: { id: ID } });
            if (!deleteRequest) {
                return {
                    success: false,
                    message: "Something went wrong",
                };
            }
        } else {
            const deleteRequest = await prisma.depositRequest.delete({ where: { id: ID } });
            if (!deleteRequest) {
                return {
                    success: false,
                    message: "Something went wrong",
                };
            }
        }
        return {
            success: true,
            message: "Transaction deleted successfully"
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
