"use server"
import prisma from "@/lib/prisma";
import connectDB from "@/server/db";
import { Prisma } from "@prisma/client";

export const ClaimRewards = async (userID: string, reward: number) => {
    try {
        await connectDB();
        const user = await prisma.user.findUnique({ where: { id: userID }, include: { reward: true } });
        if (!user || !user.reward) {
            return {
                success: false,
                message: "Something went wrong",
            };
        }
        if (reward === 3) {
            const rewardAdded = await prisma.reward.update({
                data: { claimDiamonds3: true },
                where: { userId: user.id }
            });
            if (!rewardAdded) {
                return {
                    success: false,
                    message: "Something went wrong"
                }
            }
            const updatedUser = await prisma.user.update({
                data: { diamonds: (user.diamonds + 3) },
                where: { id: user.id }
            });
            if (!updatedUser) {
                return {
                    success: false,
                    message: "Something went wrong"
                }
            }
        }
        if (reward === 6) {
            const rewardAdded = await prisma.reward.update({
                data: { claimDiamonds6: true },
                where: { userId: user.id }
            });
            if (!rewardAdded) {
                return {
                    success: false,
                    message: "Something went wrong"
                }
            }
            const updatedUser = await prisma.user.update({
                data: { diamonds: (user.diamonds + 6) },
                where: { id: user.id }
            });
            if (!updatedUser) {
                return {
                    success: false,
                    message: "Something went wrong"
                }
            }
        }
        if (reward === 10) {
            const rewardAdded = await prisma.reward.update({
                data: { claimDiamonds10: true },
                where: { userId: user.id }
            });
            if (!rewardAdded) {
                return {
                    success: false,
                    message: "Something went wrong"
                }
            }
            const updatedUser = await prisma.user.update({
                data: { diamonds: (user.diamonds + 10) },
                where: { id: user.id }
            });
            if (!updatedUser) {
                return {
                    success: false,
                    message: "Something went wrong"
                }
            }
        }
        if (reward === 20) {
            const rewardAdded = await prisma.reward.update({
                data: { claimDiamonds20: true },
                where: { userId: user.id }
            });
            if (!rewardAdded) {
                return {
                    success: false,
                    message: "Something went wrong"
                }
            }
            const updatedUser = await prisma.user.update({
                data: { diamonds: (user.diamonds + 20) },
                where: { id: user.id }
            });
            if (!updatedUser) {
                return {
                    success: false,
                    message: "Something went wrong"
                }
            }
        }
        if (reward === 50) {
            const rewardAdded = await prisma.reward.update({
                data: { claimDiamonds50: true },
                where: { userId: user.id }
            });
            if (!rewardAdded) {
                return {
                    success: false,
                    message: "Something went wrong"
                }
            }
            const updatedUser = await prisma.user.update({
                data: { diamonds: (user.diamonds + 50) },
                where: { id: user.id }
            });
            if (!updatedUser) {
                return {
                    success: false,
                    message: "Something went wrong"
                }
            }
        }
        if (reward === 70) {
            const rewardAdded = await prisma.reward.update({
                data: { claimDiamonds70: true },
                where: { userId: user.id }
            });
            if (!rewardAdded) {
                return {
                    success: false,
                    message: "Something went wrong"
                }
            }
            const updatedUser = await prisma.user.update({
                data: { diamonds: (user.diamonds + 70) },
                where: { id: user.id }
            });
            if (!updatedUser) {
                return {
                    success: false,
                    message: "Something went wrong"
                }
            }
        }
        return {
            success: true,
            message: "Reward added successfully"
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
