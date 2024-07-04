"use server"
import prisma from "@/lib/prisma";
import connectDB from "@/server/db";
import { Prisma } from "@prisma/client";
import { CalculateRank } from "@/server/actions/CalculateRank";

export const AddWithdrawRequest = async (amount: number, pin: number, userID: string) => {
    try {
        await connectDB();
        if (amount < 10) {
            return {
                success: false,
                error: { key: "amount", message: "Minimum withdraw is of 10" },
            };
        }
        const findWallet = await prisma.wallet.findUnique({ where: { userId: userID } });
        if (!findWallet) {
            return {
                success: false,
                error: { key: "pin", message: "Something went wrong" },
            };
        }
        if (findWallet.pin !== pin) {
            return {
                success: false,
                error: { key: "pin", message: "Wrong PIN" },
            };
        }
        const findUser = await prisma.user.findUnique({ where: { id: userID } });
        if (!findUser) {
            return {
                success: false,
                error: { key: "pin", message: "Something went wrong" },
            };
        }
        if (findUser.balance < amount) {
            return {
                success: false,
                error: { key: "amount", message: "Insufficient balance" },
            };
        }
        const newWithdraw = await prisma.withdrawRequest.create({
            data: {
                amount: amount,
                userId: userID
            }
        });
        if (!newWithdraw) {
            return {
                success: false,
                error: { key: "pin", message: "Something went wrong" },
            };
        }
        const updateUser = await prisma.user.update({
            data: { balance: (findUser.balance - amount) },
            where: { id: userID }
        });
        if (!updateUser) {
            return {
                success: false,
                error: { key: "pin", message: "Something went wrong" },
            };
        }
        const newRank = await CalculateRank(userID, 'WITHDRAW');
        if (newRank !== null) {
            const updateUser = await prisma.user.update({
                data: { rank: newRank },
                where: { id: userID }
            });
            if (!updateUser) {
                return {
                    success: false,
                    error: { key: "pin", message: "Something went wrong" },
                };
            }
        }
        return {
            success: true,
            message: "Withdraw added successfully"
        };
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return {
                success: false,
                error: { key: "pin", message: e.message },
            };
        }
        return {
            success: false,
            error: { key: "pin", message: "An error occurred" }
        };
    } finally {
        await prisma.$disconnect();
    }
}
