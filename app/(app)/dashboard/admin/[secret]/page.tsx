"use client"
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/app/(app)/dashboard/admin/loading";
import { sessionData, Referral } from "@/types/types";
import { CheckAdmin } from "@/server/actions/CheckAdmin";
import { formatDateTime } from "@/helper/formatDate";
import CopyToClipboardButton from "@/helper/CopyToClipboard";
import AutoFontSize from "@/helper/AutoFontSize";
import { GetUsersBySecret } from "@/server/actions/GetUsersBySecret";
import { useAuth } from "@/contexts/authContext";
import Spinner from "@/components/Loader/Spinner";

const Secret: NextPage = () => {
    const router = useRouter();
    const params = useParams();
    const { secret } = params;
    const { sessionStatus, session } = useAuth();
    const [user, setUser] = useState<sessionData>();
    const [loading, setLoading] = useState<boolean>(true);
    const [allUsers, setAllUsers] = useState<Referral[]>([]);
    const [loadingAllUsers, setLoadingAllUsers] = useState<boolean>(true);

    useEffect(() => {
        if (sessionStatus !== "loading" && sessionStatus !== "authenticated") {
            router.replace("/login");
        } else {
            if (session) {
                setUser(session as sessionData);
            }
        }
    }, [sessionStatus, router, session]);

    const fetchAllUsers = async (secret: string) => {
        setLoadingAllUsers(true);
        const res: { success: boolean, message?: string, data?: { users: Referral[] } } = await GetUsersBySecret(secret);
        if (res.success && res.data) {
            setAllUsers(res.data.users);
        }
        setLoadingAllUsers(false);
    }

    useEffect(() => {
        const fetchAdmin = async (userID: string) => {
            if (!sessionStorage.getItem('admin')) {
                const res: { success: boolean, message: string } = await CheckAdmin(userID);
                if (!res.success && res.message !== 'admin') {
                    router.replace("/dashboard");
                } else {
                    sessionStorage.setItem('admin', JSON.stringify(res));
                }
            }
            if (secret) {
                fetchAllUsers(secret as string);
            }
            setLoading(false);
        }
        if (user) {
            fetchAdmin(user.user.id);
        }
    }, [user, secret, sessionStatus, session, router]);

    if (loading || sessionStatus === 'loading') {
        return <Loading />;
    }

    return (
        sessionStatus === "authenticated" && !loading && (
            <>
                <section className="pt-10 md:pt-20 flex flex-col justify-start items-start w-full h-screen overflow-y-scroll overflow-x-hidden custom-scroll">
                    <div className="p-4 w-full">
                        <h1 className="text-white opacity-80 font-bold text-lg text-center underline">Admin Dashboard</h1>
                    </div>
                    <div className="px-8 md:px-20 mt-4 w-full">
                        <h1 className="text-white mb-6 text-lg">Summary:</h1>
                        <div className="flex flex-col md:flex-row gap-4 justify-around items-center w-full md:w-1/2">
                            <div className="w-full">
                                <h2 className="text-white text-base">
                                    Total Users: {allUsers.length}
                                </h2>
                            </div>
                            <div className="w-full">
                                <h2 className="text-white text-base">
                                    Total Balance: {allUsers ? allUsers.reduce((accumulator, user) => accumulator + user.balance, 0) : 0} <i className="text-[9px]">USDT</i>
                                </h2>
                            </div>
                        </div>
                        <div className="text-white mt-16">
                            <h1 className="text-white mb-6 text-lg">All Users:</h1>
                            <div className="table-scroll">
                                <table className="min-w-full text-left bg-transparent border border-gray-300">
                                    <thead className="bg-gray-800">
                                        <tr>
                                            <th className="py-2 px-4 border">User ID</th>
                                            <th className="py-2 px-4 border">Username</th>
                                            <th className="py-2 px-4 border">Contact</th>
                                            <th className="py-2 px-4 border">Balance</th>
                                            <th className="py-2 px-4 border">Diamonds</th>
                                            <th className="py-2 px-4 border">Team Commission</th>
                                            <th className="py-2 px-4 border">Date</th>
                                        </tr>
                                    </thead>
                                    {loadingAllUsers ? (
                                        <tbody><tr><td className="p-4"><Spinner /></td></tr></tbody>
                                    ) : (
                                        <tbody>
                                            {allUsers.map((user: any) => (
                                                <tr key={user.id}>
                                                    <td className="py-2 px-4 border">
                                                        <AutoFontSize content={user.id} />
                                                        <CopyToClipboardButton textToCopy={user.id} iconBlack={false} />
                                                    </td>
                                                    <td className="py-2 px-4 border">{user.username}</td>
                                                    <td className="py-2 px-4 border">
                                                        {user.phone === '' || user.phone === 'null' ? user.email : user.phone}
                                                    </td>
                                                    <td className="py-2 px-4 border">{user.balance} <i className="text-[9px]">USDT</i></td>
                                                    <td className="py-2 px-4 border">{user.diamonds}</td>
                                                    <td className="py-2 px-4 border">{user.teamCommission} <i className="text-[9px]">USDT</i></td>
                                                    <td className="py-2 px-4 border">{formatDateTime(user.createdAt)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    )}
                                </table>
                            </div>
                        </div>
                    </div>
                    <br /><br /><br />
                </section >
            </>
        )
    );
};

export default Secret;
