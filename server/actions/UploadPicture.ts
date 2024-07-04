"use server"
import prisma from "@/lib/prisma";
import connectDB from "@/server/db";
import { Prisma } from "@prisma/client";
import { unlink, writeFile } from "fs/promises";
import { join } from "path";

export const UploadPicture = async (data: FormData, userID: string) => {
    try {
        const file: File | null = data.get('picture') as unknown as File;
        if (!file) {
            throw new Error('No file uploaded')
        }
        await connectDB();
        const existingUser = await prisma.user.findUnique({
            where: { id: userID }
        });
        if (!existingUser) {
            return {
                success: false,
                message: "User not found"
            };
        }
        const prevPicture = existingUser.picture as string;
        if (prevPicture !== '') {
            const prevPicturePath = join(process.cwd(), 'public/uploads/user-profile-pictures', prevPicture);
            try {
                await unlink(prevPicturePath);
            } catch (error) {
                console.log("🚀 ~ UploadPicture ~ error:", error);   
            }
        }
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const timestamp = Date.now();
        const uniqueFilename = `${timestamp}-${file.name}`;
        const path = join(process.cwd(), 'public/uploads/user-profile-pictures', uniqueFilename);
        await writeFile(path, buffer);
        const updated = await prisma.user.update({
            data: {
                picture: uniqueFilename,
            },
            where: { id: userID }
        });
        if (!updated) {
            return {
                success: false,
                message: 'Something went wrong',
            }
        }
        return {
            success: true,
            message: "Picture has been uploaded",
            data: uniqueFilename
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
