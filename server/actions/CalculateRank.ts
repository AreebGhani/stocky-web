"use server"
import prisma from "@/lib/prisma";
import { GetReferralChain } from "@/server/actions/GetReferralChain";
import { TotalPurchaseCost } from "@/server/actions/TotalPurchaseCost";

export const CalculateRank = async (userID: string, type: 'WITHDRAW' | 'DEPOSIT') => {
    const user = await prisma.user.findUnique({ where: { id: userID } });
    if (!user) {
        return null;
    }

    const totalPurchases = await TotalPurchaseCost(user.id);
    let deposit = 0;

    if (type === 'DEPOSIT') {
        const totalDeposits = await prisma.transaction.findMany({
            where: {
                AND: [
                    { userId: userID },
                    { type: 'DEPOSIT' }
                ]
            }
        });
        
        if (!totalDeposits) {
            return null;
        }

        deposit = totalDeposits.reduce((accumulator, currentDeposit) => {
            return accumulator + currentDeposit.amount;
        }, 0);

        if (deposit < (user.balance + totalPurchases)) {
            return null;
        }

    } else {
        deposit = (user.balance + totalPurchases);
    }
    
    const referralChain = await GetReferralChain(user.id);
    if (!referralChain) {
        return null;
    }

    let referralRanks: number[] = [];
    if (referralChain.referrals) {
        for (const level1Referral of referralChain.referrals) {
            referralRanks.push(level1Referral.rank);
        };
    }

    const counts: Record<number, number> = {};
    referralRanks.forEach(element => {
        if (counts[element] === undefined) {
            counts[element] = 1;
        } else {
            counts[element]++;
        }
    });

    if (referralRanks.length === 0) {
        if (deposit < 50) {
            return 0;
        }
        return 1;
    }

    if (deposit < 50) {
        return 0;
    }

    if (deposit < 300 && deposit >= 50) {
        return 1;
    }

    if (deposit < 1000 && deposit >= 300) {
        if (counts[1] >= 3) {
            return 2;
        }
        return 1;
    }

    if (deposit < 2000 && deposit >= 1000) {
        if (counts[2] >= 2) {
            return 3;
        }
        return 2;
    }

    if (deposit < 5000 && deposit >= 2000) {
        if (counts[2] >= 3) {
            return 4;
        }
        return 3;
    }

    if (deposit >= 7000) {
        if (counts[3] >= 1) {
            return 6;
        }
        return 5;
    }

    return null;
}
