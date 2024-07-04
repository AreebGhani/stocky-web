"use server"

export const GetStockPrice = async () => {
    try {
        if (!process.env.STOCK_COST_FOR_BALANCE || !process.env.STOCK_COST_FOR_DIAMONDS) {
            throw new Error("Please specify the stock price in the environment");
        }
        const STOCK_COST_FOR_BALANCE: number = parseInt(process.env.STOCK_COST_FOR_BALANCE);
        const STOCK_COST_FOR_DIAMONDS: number = parseInt(process.env.STOCK_COST_FOR_DIAMONDS);
        return {
            success: true,
            data: { balance: STOCK_COST_FOR_BALANCE, diamonds: STOCK_COST_FOR_DIAMONDS }
        };
    } catch (e) {
        return {
            success: false,
            message: "An error occurred",
        };
    }
}
