"use server"
import prisma from "@/lib/prisma";
import connectDB from "@/server/db";
import { Prisma } from "@prisma/client";
import { writeFile } from "fs/promises";
import { join } from "path";

export const AddDepositRequest = async (transactionID: string, amount: number, userID: string, data: FormData) => {
    try {
        const file: File | null = data.get('picture') as unknown as File;
        if (!file) {
            throw new Error('No file uploaded')
        }
        await connectDB();
        const user = await prisma.user.findUnique({ where: { id: userID } });
        if (!user) {
            return {
                success: false,
                error: { key: "amount", message: "Something went wrong" }
            };
        }
        if (amount < 1) {
            return {
                success: false,
                error: { key: "amount", message: "Minimum deposit is of 1" }
            };
        }
        const checkId = await prisma.depositRequest.findFirst({ where: { transactionId: transactionID } });
        if(checkId){
            return {
                success: false,
                error: { key: "transactionId", message: "Already used" }
            };
        }
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const timestamp = Date.now();
        const uniqueFilename = `${timestamp}-${file.name}`;
        const path = join(process.cwd(), 'public/uploads/deposit-pictures', uniqueFilename);
        await writeFile(path, buffer);
        const added = await prisma.depositRequest.create({
            data: {
                userId: userID,
                amount: amount,
                transactionId: transactionID,
                screenshot: uniqueFilename,
            }
        });
        if (!added) {
            return {
                success: false,
                error: { key: "amount", message: "Something went wrong" }
            };
        }
        return {
            success: true,
            message: "Deposit added successfully"
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
