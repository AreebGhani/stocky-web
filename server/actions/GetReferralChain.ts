"use server"
import prisma from "@/lib/prisma";
import { Referral } from "@/types/types";

export async function GetReferralChain(userId: string, depth: number = 4, rank?: number): Promise<Referral | null> {
    let user;
    if (rank) {
        user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                referrals: { where: { rank: { gte: rank } } },
            },
        });
    } else {
        user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                referrals: true,
            },
        });
    }

    if (!user) {
        return null;
    }

    const referral: Referral = {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        picture: user.picture,
        rank: user.rank,
        referrerId: user.referrerId,
        balance: user.balance,
        diamonds: user.diamonds,
        teamCommission: user.teamCommission,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };

    if (depth > 1 && user.referrals) {
        const subReferrals = await Promise.all(
            user.referrals.map(async (subReferral) => {
                const subReferralHierarchy = await GetReferralChain(subReferral.id, depth - 1, rank);
                return subReferralHierarchy;
            })
        );

        referral.referrals = subReferrals.filter((subReferral): subReferral is Referral => subReferral !== null);
    }

    return referral;
}
