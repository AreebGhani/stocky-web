"use server"
import prisma from "@/lib/prisma";
import connectDB from "@/server/db";
import jwt, { JwtPayload } from "jsonwebtoken";

export const CheckUserSession = async (token?: string) => {
    if (token) {
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET || "zW4+55A2YSq/C1xm1v/6Nfge6geCBXQ==") as JwtPayload;
            await connectDB();
            const savedUser = await prisma.user.findFirst({ where: { id: user.id } });
            if (!savedUser) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }
            const updatedUser = {
                balance: savedUser.balance,
                diamonds: savedUser.diamonds,
                email: savedUser.email,
                id: savedUser.id,
                phone: savedUser.phone,
                referral: savedUser.referrerId || '',
                picture: savedUser.picture || '',
                role: savedUser.role,
                rank: savedUser.rank,
                teamCommission: savedUser.teamCommission,
                username: savedUser.username
            }
            const refreshToken = jwt.sign(updatedUser, process.env.JWT_SECRET || "zW4+55A2YSq/C1xm1v/6Nfge6geCBXQ==", {
                expiresIn: user.exp,
            });
            return {
                success: true,
                data: { token: refreshToken, user: updatedUser },
            }
        } catch (e) {
            return {
                success: false,
                message: "unauthenticated",
            };
        }
    }
    return {
        success: false,
        message: "Token not found",
    };
}
