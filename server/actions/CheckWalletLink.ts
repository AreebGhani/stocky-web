"use server"
import prisma from "@/lib/prisma";
import connectDB from "@/server/db";
import { Prisma } from "@prisma/client";

export const CheckWalletLink = async (userID: string) => {
    try {
        await connectDB();
        const userWallet = await prisma.wallet.findUnique({ where: { userId: userID } });
        if (!userWallet) {
            return {
                success: false,
                message: "No wallet found",
            };
        }
        return {
            success: true,
            data: { address: userWallet.address, pin: userWallet.pin },
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
