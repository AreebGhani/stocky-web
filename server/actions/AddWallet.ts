"use server"
import prisma from "@/lib/prisma";
import connectDB from "@/server/db";
import { Prisma } from "@prisma/client";

export const AddWallet = async (address: string, pin: number, userID: string) => {
    try {
        await connectDB();
        const existingWallet = await prisma.wallet.findUnique({ where: { address: address } });
        if (existingWallet) {
            return {
                success: false,
                error: { key: 'address', message: 'Address already exists' }
            };
        }
        const newWallet = await prisma.wallet.create({
            data: {
                address: address,
                pin: pin,
                userId: userID
            }
        });
        if (!newWallet) {
            return {
                success: false,
                error: { key: 'pin', message: "Something went wrong" }
            };
        }
        return {
            success: true,
            message: "Wallet added successfully"
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
