"use server"
import prisma from "@/lib/prisma";
import connectDB from "@/server/db";
import { Prisma } from "@prisma/client";
import { TotalPurchaseCost } from "@/server/actions/TotalPurchaseCost";
import { getDailyProfit } from "@/server/actions/ReleaseDailyStocksProfit";
import { GetReferralChain } from "@/server/actions/GetReferralChain";

export const UserDashboardData = async (userID: string) => {
    try {
        await connectDB();
        const user = await prisma.user.findUnique({ where: { id: userID } });
        if (!user) {
            return {
                success: false,
                message: "Something went wrong",
            };
        }

        const totalPurchases = await TotalPurchaseCost(userID);
        const todayProfit = await getDailyProfit(userID);

        const referralChain = await GetReferralChain(userID);
        if (!referralChain) {
            return {
                success: false,
                message: "Something went wrong",
            };
        }

        return {
            success: true,
            data: {
                balance: user.balance,
                diamonds: user.diamonds,
                picture: user.picture,
                rank: user.rank,
                stockingBalance: totalPurchases,
                todayProfit,
                referralChain
            }
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
