"use server"
import prisma from "@/lib/prisma";
import connectDB from "@/server/db";
import { Prisma } from "@prisma/client";
import { CalculateRank } from "@/server/actions/CalculateRank";

export const AddTransaction = async (userID: string, transactionID: string, amount: number, ID: string, type: 'WITHDRAW' | 'DEPOSIT') => {
    try {
        await connectDB();
        const user = await prisma.user.findUnique({ where: { id: userID } });
        if (!user) {
            return {
                success: false,
                message: "Something went wrong",
            };
        }
        const added = await prisma.transaction.create({
            data: {
                transactionId: transactionID,
                userId: userID,
                amount: amount,
                type: type
            }
        });
        if (!added) {
            return {
                success: false,
                message: "Something went wrong",
            };
        }
        if (type === 'WITHDRAW') {
            const updateRequest = await prisma.withdrawRequest.update({
                data: {
                    complete: true,
                    completedAt: new Date()
                },
                where: { id: ID }
            });
            if (!updateRequest) {
                return {
                    success: false,
                    message: "Something went wrong",
                };
            }
        } else {
            const updateRequest = await prisma.depositRequest.update({
                data: {
                    complete: true,
                    completedAt: new Date()
                },
                where: { transactionId: ID }
            });
            if (!updateRequest) {
                return {
                    success: false,
                    message: "Something went wrong",
                };
            }
            const updateUser = await prisma.user.update({
                data: { balance: (user.balance + amount) },
                where: { id: userID }
            });
            if (!updateUser) {
                return {
                    success: false,
                    message: "Something went wrong"
                };
            }
            const getRank = await CalculateRank(userID, 'DEPOSIT');
            const newRank = getRank ? getRank : 0;
            if (newRank) {
                const updateUser = await prisma.user.update({
                    data: { rank: newRank },
                    where: { id: userID }
                });
                if (!updateUser) {
                    return {
                        success: false,
                        message: "Something went wrong"
                    };
                }
            }
        }
        return {
            success: true,
            message: "Transaction added successfully"
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
