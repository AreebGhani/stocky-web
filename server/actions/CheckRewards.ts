"use server"
import prisma from "@/lib/prisma";
import connectDB from "@/server/db";
import { Prisma } from "@prisma/client";

export const CheckRewards = async (userID: string) => {
    try {
        await connectDB();
        const user = await prisma.user.findUnique({ where: { id: userID }, include: { reward: true } });
        if (!user || !user.reward) {
            return {
                success: false,
                message: "Something went wrong",
            };
        }
        const purchases = await prisma.stockPurchase.findMany({
            where: {
                AND: [
                    { userId: user.id },
                    { stockName: 'daily-stocks' }
                ],
            },
        });
        if (!purchases) {
            return {
                success: true,
                data: { rewards: -1, received: user.reward }
            };
        }
        const dailyStocks = purchases.reduce((total, stock) => total + stock.quantity, 0);
        const rewards = calculateReward(dailyStocks, user.reward);
        return {
            success: true,
            data: { rewards, received: user.reward }
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

const calculateReward = (dailyStocks: number, reward: {
    id: string;
    claimDiamonds3: boolean;
    claimDiamonds6: boolean;
    claimDiamonds10: boolean;
    claimDiamonds20: boolean;
    claimDiamonds50: boolean;
    claimDiamonds70: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}) => {
    const result: number[] = [];
    switch (true) {
        case dailyStocks >= 5 && !reward.claimDiamonds3:
            result.push(3);
            break;
        case dailyStocks >= 30 && !reward.claimDiamonds6:
            result.push(6);
            break;
        case dailyStocks >= 100 && !reward.claimDiamonds10:
            result.push(10);
            break;
        case dailyStocks >= 200 && !reward.claimDiamonds20:
            result.push(20);
            break;
        case dailyStocks >= 500 && !reward.claimDiamonds50:
            result.push(50);
            break;
        case dailyStocks >= 700 && !reward.claimDiamonds70:
            result.push(70);
            break;
        default:
            return -1;
    }
    return result;
}
