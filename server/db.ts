import prisma from "@/lib/prisma";

const connectDB = async () => {
    try {
        await prisma.$connect();
        // console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Unable to connect to MongoDB");
        throw new Error("Unable to connect to MongoDB");
    }
}
export default connectDB;
