"use server"
import prisma from "@/lib/prisma";
import connectDB from "@/server/db";
import { Prisma } from "@prisma/client";

export const BuyStock = async (userID: string, stockName: string, quantity: number, price: number, useDiamond: boolean) => {
    try {
        await connectDB();
        const savedUser = await prisma.user.findUnique({ where: { id: userID } });
        if (!savedUser) {
            return {
                success: false,
                message: 'User not found'
            };
        }
        if (!useDiamond && savedUser.balance < price) {
            return {
                success: false,
                message: 'Insufficient balance'
            };
        }
        if (useDiamond && savedUser.diamonds < price) {
            return {
                success: false,
                message: 'Insufficient diamonds'
            };
        }
        const addStock = await prisma.stockPurchase.create({
            data: {
                userId: userID,
                stockName: stockName,
                quantity: quantity,
                totalPrice: price,
                paymentType: useDiamond ? 'diamonds' : 'balance'
            }
        });
        if (!addStock) {
            return {
                success: false,
                message: "Something went wrong",
            };
        }
        let updatedUser;
        if (useDiamond) {
            updatedUser = await prisma.user.update({
                data: { diamonds: (savedUser.diamonds - price) },
                where: { id: savedUser.id }
            });
        } else {
            updatedUser = await prisma.user.update({
                data: { balance: (savedUser.balance - price) },
                where: { id: savedUser.id }
            });
        }
        if (!updatedUser) {
            return {
                success: false,
                message: "Something went wrong",
            };
        }
        return {
            success: true,
            message: "Stock added successfully",
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
