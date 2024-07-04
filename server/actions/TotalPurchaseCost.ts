"use server"
import prisma from "@/lib/prisma";

export const TotalPurchaseCost = async (userID: string) => {
    const purchases = await prisma.stockPurchase.findMany({
        where: {
            userId: userID,
            paymentType: "balance",
        },
    });
    if (!purchases) {
        return 0;
    } else {
        return purchases.reduce((total, stock) => total + stock.totalPrice, 0);
    }
}
