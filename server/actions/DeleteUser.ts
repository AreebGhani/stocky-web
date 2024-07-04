"use server"
import prisma from "@/lib/prisma";
import connectDB from "@/server/db";
import { Prisma } from "@prisma/client";

export const DeleteUser = async (userID: string) => {
    try {
        await connectDB();
        await prisma.$transaction([
            prisma.dailyProfit.deleteMany({ where: { userId: userID } }),
            prisma.stockPurchase.deleteMany({ where: { userId: userID } }),
            prisma.wallet.deleteMany({ where: { userId: userID } }),
            prisma.transaction.deleteMany({ where: { userId: userID } }),
            prisma.withdrawRequest.deleteMany({ where: { userId: userID } }),
            prisma.depositRequest.deleteMany({ where: { userId: userID } }),
            prisma.reward.deleteMany({ where: { userId: userID } }),
        ]);
        const deleted = await prisma.user.delete({
            where: { id: userID },
            include: {
                referrals: true,
            },
        });
        if (!deleted) {
            return {
                success: false,
                message: "Something went wrong",
            };
        }
        return {
            success: true,
            message: "User deleted successfully"
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
