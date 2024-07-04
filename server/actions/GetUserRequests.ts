"use server"
import prisma from "@/lib/prisma";
import connectDB from "@/server/db";
import { Prisma } from "@prisma/client";
import { GetReferralChain } from "./GetReferralChain";
import { Referral } from "@/types/types";

export const GetUserRequests = async (type: 'WITHDRAW' | 'DEPOSIT') => {
    try {
        await connectDB();
        let userRequests;
        if (type === 'DEPOSIT') {
            userRequests = await prisma.depositRequest.findMany({
                where: { complete: false },
                include: {
                    user: true
                }
            });
        } else {
            userRequests = await prisma.withdrawRequest.findMany({
                where: { complete: false },
                include: {
                    user: {
                        include: {
                            wallet: true,
                            transactions: {
                                where: { type: 'DEPOSIT' },
                                orderBy: { createdAt: 'desc' },
                                take: 1
                            },
                        }
                    },
                }
            });
            if (!userRequests) {
                return {
                    success: false,
                    message: "Something went wrong",
                };
            }
            const updatedUserRequests = await Promise.all(userRequests.map(async (request) => {
                let countTeamMembers: number = 0;
                const referralChain = await GetReferralChain(request.userId, 4, 1);
                if (referralChain && referralChain.referrals) {
                    referralChain.referrals.forEach((level1Referral: Referral) => {
                        countTeamMembers += 1;
                        if (level1Referral.referrals) {
                            level1Referral.referrals.forEach((level2Referral: Referral) => {
                                countTeamMembers += 1;
                                if (level2Referral.referrals) {
                                    level2Referral.referrals.forEach((level3Referral: Referral) => {
                                        countTeamMembers += 1;
                                    });
                                }
                            });
                        }
                    });
                }
                return {
                    ...request,
                    user: {
                        ...request.user,
                        teamMembers: countTeamMembers
                    }
                };
            }));
            userRequests = updatedUserRequests;
        }
        if (!userRequests) {
            return {
                success: false,
                message: "Something went wrong",
            };
        }
        return {
            success: true,
            data: { userRequests }
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
