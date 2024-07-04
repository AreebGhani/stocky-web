"use server"
import prisma from "@/lib/prisma";
import connectDB from "@/server/db";
import { Prisma } from "@prisma/client";
import { TotalPurchaseCost } from "@/server/actions/TotalPurchaseCost";
import { getDailyProfit } from "@/server/actions/ReleaseDailyStocksProfit";
import { GetReferralChain } from "@/server/actions/GetReferralChain";

export const GetUser = async (userId: string) => {
    try {
        await connectDB();
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                wallet: true,
            }
        });
        if (!user) {
            return {
                success: false,
                message: "Something went wrong",
            };
        }
        const totalPurchases = await TotalPurchaseCost(userId);
        const todayProfit = await getDailyProfit(userId);

        const referralChain = await GetReferralChain(userId);
        if (!referralChain) {
            return {
                success: false,
                message: "Something went wrong",
            };
        }
        return {
            success: true,
            data: {
                user: {
                    username: user.username,
                    email: user.email !== 'null' ? user.email : '',
                    phone: user.phone !== 'null' ? user.phone : '',
                    role: user.role,
                    rank: user.rank,
                    secret: user.secret ? user.secret : '',
                    balance: user.balance,
                    diamonds: user.diamonds,
                    teamCommission: user.teamCommission,
                },
                stockingBalance: totalPurchases,
                todayProfit,
                referralChain,
                wallet: {
                    address: user.wallet?.address,
                    pin: user.wallet?.pin,
                },
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
