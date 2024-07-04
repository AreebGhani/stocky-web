"use server"
import prisma from "@/lib/prisma";
import connectDB from "@/server/db";
import { Prisma } from "@prisma/client";

export const GetTransaction = async (userID: string) => {
    try {
        await connectDB();
        const userTransactions = (await prisma.transaction.findMany({
            where: { userId: userID },
            orderBy: { createdAt: 'desc' }
        }));
        if (!userTransactions) {
            return {
                success: false,
                message: "Something went wrong",
            };
        }
        const userWithdrawRequests = await prisma.withdrawRequest.findMany({
            where: { AND: [{ userId: userID }, { complete: false }] },
            orderBy: { createdAt: 'desc' }
        });
        if (!userWithdrawRequests) {
            return {
                success: false,
                message: "Something went wrong",
            };
        }
        const userDepositRequests = await prisma.depositRequest.findMany({
            where: { AND: [{ userId: userID }, { complete: false }] },
            orderBy: { createdAt: 'desc' }
        });
        if (!userDepositRequests) {
            return {
                success: false,
                message: "Something went wrong",
            };
        }
        return {
            success: true,
            data: { userTransactions, userWithdrawRequests, userDepositRequests }
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
