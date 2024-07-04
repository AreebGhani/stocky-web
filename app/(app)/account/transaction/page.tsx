"use client"
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/(app)/account/transaction/loading";
import Image from "@/utils/Image";
import Link from "next/link";
import { DepositRequest, UserTransaction, WithdrawRequest, sessionData } from "@/types/types";
import { GetTransaction } from "@/server/actions/GetTransaction";
import { formatDate } from "@/helper/formatDate";
import AutoFontSize from "@/helper/AutoFontSize";
import { useAuth } from "@/contexts/authContext";

const Transaction: NextPage = () => {
    const router = useRouter();
    const { sessionStatus, session } = useAuth();
    const [user, setUser] = useState<sessionData>();
    const [transactions, setTransactions] = useState<UserTransaction[]>([]);
    const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequest[]>([]);
    const [depositRequests, setDepositRequests] = useState<DepositRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (sessionStatus !== "loading" && sessionStatus !== "authenticated") {
            router.replace("/login");
        } else {
            if (session) {
                setUser(session as sessionData);
            }
        }
    }, [sessionStatus, router, session]);

    useEffect(() => {
        const fetchTransaction = async (userID: string) => {
            const res: { success: boolean; data?: { userTransactions: UserTransaction[], userWithdrawRequests: WithdrawRequest[], userDepositRequests: DepositRequest[] }; message?: string } = await GetTransaction(userID);
            if (res.success && res.data) {
                setTransactions(res.data.userTransactions);
                setWithdrawRequests(res.data.userWithdrawRequests);
                setDepositRequests(res.data.userDepositRequests);
                setLoading(false);
            }
        }
        if (user) {
            fetchTransaction(user.user.id);
        }
    }, [user, sessionStatus, router, session]);

    if (loading || sessionStatus === 'loading') {
        return <Loading />;
    }

    return (
        sessionStatus === "authenticated" && (
            <div className="flex min-h-screen flex-col items-center justify-start md:justify-center pt-8 md:p-24">
                <div className="px-4 md:p-8 md:rounded-[4rem] md:shadow-lg md:border-2 md:border-[rgba(40,50,68)] w-full md:w-96">
                    <div className="ml-2 mt-2 md:mt-0">
                        <Link href='/account' className="w-10 block">
                            <Image src="/svg/goback.svg" alt="goback" width={49} height={49} />
                        </Link>
                    </div>
                    <h1 className="my-8 text-[28px] font-bold text-center custom-heading">Transaction</h1>
                    <div className="h-[600px] md:h-full overflow-y-auto overflow-x-hidden custom-scroll">
                        {depositRequests.map((deposit: DepositRequest, i: number) => (
                            <div key={i} className="flex flex-col justify-center items-center">
                                <div className="flex justify-between items-center w-full">
                                    <h3 className="text-gray-400 text-[18px] font-semibold capitalize">Pending</h3>
                                    <p className="text-[16px] font-semibold text-gray-400">+{deposit.amount}</p>
                                </div>
                                <div className="flex justify-between items-center w-full">
                                    <h4 className="text-gray-400 font-light">
                                        <AutoFontSize content={deposit.transactionId} />
                                    </h4>
                                    <h4 className="text-gray-400 text-[16px] font-light">{formatDate(deposit.createdAt.toString())}</h4>
                                </div>
                                <div className="w-full h-[2px] bg-[rgba(255,255,255,0.40)]" />
                            </div>
                        ))}
                        {withdrawRequests.map((withdraw: WithdrawRequest, i: number) => (
                            <div key={i} className="flex flex-col justify-center items-center">
                                <div className="flex justify-between items-center w-full">
                                    <h3 className="text-gray-400 text-[18px] font-semibold capitalize">Pending</h3>
                                    <p className="text-[16px] font-semibold text-gray-400">-{withdraw.amount}</p>
                                </div>
                                <div className="flex justify-between items-center w-full">
                                    <h4 className="text-gray-400 font-light">
                                        <AutoFontSize content={withdraw.id} />
                                    </h4>
                                    <h4 className="text-gray-400 text-[16px] font-light">{formatDate(withdraw.createdAt.toString())}</h4>
                                </div>
                                <div className="w-full h-[2px] bg-[rgba(255,255,255,0.40)]" />
                            </div>
                        ))}
                        {transactions.map((transaction: UserTransaction, i: number) => (
                            <div key={i} className="flex flex-col justify-center items-center">
                                <div className="flex justify-between items-center w-full">
                                    <h3 className="text-[#fff] text-[18px] font-semibold capitalize">{transaction.type === 'WITHDRAW' ? 'Withdraw' : 'Recharge'}</h3>
                                    <p className={`text-[16px] font-semibold ${transaction.type === 'WITHDRAW' ? 'text-[#FA0000]' : 'text-[#00FA0A]'}`}>{transaction.type === 'WITHDRAW' ? '-' + transaction.amount : '+' + transaction.amount}</p>
                                </div>
                                <div className="flex justify-between items-center w-full">
                                    <h4 className="text-[#fff] font-light">
                                        <AutoFontSize content={transaction.transactionId} />
                                    </h4>
                                    <h4 className="text-[#fff] text-[16px] font-light">{formatDate(transaction.createdAt.toString())}</h4>
                                </div>
                                <div className="w-full h-[2px] bg-[rgba(255,255,255,0.40)]" />
                            </div>
                        ))}
                        <div className="my-56 block md:hidden"></div>
                    </div>
                </div>
            </div>
        )
    );
};

export default Transaction;
