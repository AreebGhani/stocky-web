"use server"
import prisma from "@/lib/prisma";
import connectDB from "@/server/db";
import { Prisma } from "@prisma/client";
import { GetReferralChain } from "@/server/actions/GetReferralChain";
import { getDailyProfit } from "@/server/actions/ReleaseDailyStocksProfit";

export const ReleaseLongTermProfit = async () => {
    try {
        await connectDB();
        const users = await prisma.user.findMany({});

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        for (const user of users) {
            const stocks = await prisma.stockPurchase.findMany({
                where: {
                    AND: [
                        { userId: user.id },
                        { stockName: 'long-term-stocks' },
                        { createdAt: { lte: oneMonthAgo } },
                    ],
                },
            });

            if (!stocks) {
                return {
                    success: false,
                    message: "Something went wrong",
                };
            }

            let balanceProfit = 0;
            let diamondsProfit = 0;
            let totalPrice = 0;

            // const stockPrice = await GetStockPrice();
            // if (!stockPrice.data) {
            //     return {
            //         success: false,
            //         message: "Something went wrong",
            //     };
            // }

            const ProfitPerStock = calculateReturn(user.rank, true);

            stocks.forEach((stock) => {
                if (stock.paymentType === 'balance') {
                    balanceProfit += stock.quantity * ProfitPerStock;
                    totalPrice += stock.totalPrice;
                } else if (stock.paymentType === 'diamonds') {
                    diamondsProfit += stock.quantity * ProfitPerStock;
                }
            });

            const longTermProfit = balanceProfit + diamondsProfit;

            const userProfit = await prisma.dailyProfit.findUnique({ where: { userId: user.id } });

            if (!userProfit) {
                const profitAdded = await prisma.dailyProfit.create({
                    data: {
                        dailyProfit: longTermProfit,
                        userId: user.id
                    }
                });

                if (!profitAdded) {
                    return {
                        success: false,
                        message: "Something went wrong",
                    };
                }
            } else {
                const profitAdded = await prisma.dailyProfit.update({
                    data: { dailyProfit: longTermProfit },
                    where: { userId: user.id }
                });

                if (!profitAdded) {
                    return {
                        success: false,
                        message: "Something went wrong",
                    };
                }
            }

            const updatedUser = await prisma.user.update({
                data: { balance: (user.balance + longTermProfit + totalPrice) },
                where: { id: user.id }
            });

            if (!updatedUser) {
                return {
                    success: false,
                    message: "Something went wrong",
                };
            }

            const deleteStock = await prisma.stockPurchase.deleteMany({
                where: {
                    AND: [
                        { userId: user.id },
                        { stockName: 'long-term-stocks' },
                        { createdAt: { lte: oneMonthAgo } },
                    ]
                }
            });

            if (!deleteStock) {
                return {
                    success: false,
                    message: "Something went wrong",
                };
            }
        }

        const updatedUsers = await prisma.user.findMany({});

        for (const user of updatedUsers) {
            let totalCommission = 0;

            const referralChain = await GetReferralChain(user.id);
            if (!referralChain) {
                return {
                    success: false,
                    message: "Something went wrong",
                };
            }

            if (referralChain.referrals) {

                for (const level1Referral of referralChain.referrals) {

                    const todayProfit = await getDailyProfit(level1Referral.id);
                    totalCommission += ((todayProfit * 15) / 100);

                    if (level1Referral.referrals) {

                        for (const level2Referral of level1Referral.referrals) {

                            const todayProfit = await getDailyProfit(level2Referral.id);
                            totalCommission += ((todayProfit * 10) / 100);

                            if (level2Referral.referrals) {

                                for (const level3Referral of level2Referral.referrals) {

                                    const todayProfit = await getDailyProfit(level3Referral.id);
                                    totalCommission += ((todayProfit * 5) / 100);

                                };
                            }
                        };
                    }
                };
            }

            const updatedUser = await prisma.user.update({
                data: { balance: (user.balance + totalCommission), teamCommission: totalCommission },
                where: { id: user.id }
            });

            if (!updatedUser) {
                return {
                    success: false,
                    message: "Something went wrong",
                };
            }
        }

        return {
            success: true,
            message: "Profit added successfully",
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

export const calculateReturn = (rank: number, longTerm: boolean) => {
    switch (rank) {
        case 0:
            return longTerm ? 0.10 * 3 : 0.10;
        case 1:
            return longTerm ? 0.15 * 3 : 0.15;
        case 2:
            return longTerm ? 0.18 * 3 : 0.18;
        case 3:
            return longTerm ? 0.22 * 3 : 0.22;
        case 4:
            return longTerm ? 0.23 * 3 : 0.23;
        case 5:
            return longTerm ? 0.30 * 3 : 0.30;
        case 6:
            return longTerm ? 0.33 * 3 : 0.33;
        default:
            return 0;
    }
}
