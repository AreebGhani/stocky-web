"use server"
import prisma from "@/lib/prisma";
import connectDB from "@/server/db";
import { UpdateUser } from "@/types/types";
import { Prisma } from "@prisma/client";

export const UpdateUserInfo = async (userID: string, user: UpdateUser) => {
    try {
        await connectDB();
        if (user.email !== 'null' || user.phone !== 'null') {

            const existingUserWithEmail = user.email !== 'null'
                ? await prisma.user.findFirst({ where: { email: user.email } })
                : null;
            const existingUserWithPhone = user.phone !== 'null'
                ? await prisma.user.findFirst({ where: { phone: user.phone } })
                : null;

            if (existingUserWithEmail && existingUserWithEmail.id !== userID) {
                return {
                    success: false,
                    message: "Email already exists"
                };
            }
            if (existingUserWithPhone && existingUserWithPhone.id !== userID) {
                return {
                    success: false,
                    message: "Phone already exists"
                };
            }
        }

        const updated = await prisma.user.update({
            where: { id: userID },
            data: { ...user },
        });
        if (!updated) {
            return {
                success: false,
                message: "User not found",
            };
        }
        return {
            success: true,
            message: "User updated successfully"
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
