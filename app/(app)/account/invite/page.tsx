"use client"
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/(app)/account/invite/loading";
import Link from "next/link";
import Image from "@/utils/Image";
import { sessionData } from "@/types/types";
import CopyToClipboardButton from "@/helper/CopyToClipboard";
import { useAuth } from "@/contexts/authContext";

const Invite: NextPage = () => {
    const router = useRouter();
    const { sessionStatus, session } = useAuth();
    const [user, setUser] = useState<sessionData>();

    useEffect(() => {
        if (sessionStatus !== "loading" && sessionStatus !== "authenticated") {
            router.replace("/login");
        } else {
            if (session) {
                setUser(session as sessionData);
            }
        }
    }, [sessionStatus, router, session]);

    if (!user || sessionStatus === 'loading') {
        return <Loading />;
    }

    return (
        sessionStatus === "authenticated" && user && (
            <div className="flex min-h-screen flex-col items-center justify-start md:justify-center pt-8 md:p-24">
                <div className="px-4 md:p-8 md:rounded-[4rem] md:shadow-lg md:border-2 md:border-[rgba(40,50,68)] w-full md:w-96">
                    <div className="ml-2 mt-2 md:mt-0">
                        <Link href='/account' className="w-10 block">
                            <Image src="/svg/goback.svg" alt="goback" width={49} height={49} />
                        </Link>
                    </div>
                    <h1 className="mt-8 mb-6 text-[28px] font-bold text-center custom-heading">Your Referral Code</h1>
                    <p className="flex justify-center items-center mb-6 text-[#fff] text-[18px]"><b className="mt-1 mr-2">{user.user.username}</b> <CopyToClipboardButton textToCopy={user.user.username} iconBlack={false} /></p>
                    <div className="flex flex-col justify-center items-center">
                        <div className="bg-[#fff] w-fit h-fit rounded-[25px] p-0 m-0 invite-shadow">
                            <div className="h-[134px] w-[266px] p-0 m-0 flex flex-col justify-center items-center invite-bg">
                                <h1 className="text-[#000] text-[18px] font-semibold mt-2 mb-1">{user.user.teamCommission.toFixed(2)} <span className="text-[18px]"> USDT</span></h1>
                                <h1 className="text-[#000] text-[20px] font-normal">Rewards Earned</h1>
                            </div>
                        </div>
                        <div className="mx-8 md:mx-0 w-full flex justify-start items-start mt-12">
                            <Image src="/svg/star.svg" alt="star" width={24} height={22} />
                            <p className="ml-4 text-[#fff] text-[12px] font-light">Invite friends to join and boost your earnings with every referral.<br />
                                - 15% profit from Level 1 <br />
                                - 10% profit from Level 2 <br />
                                - 5% profit from Level 3 <br />
                            </p>
                        </div>
                        <div className="mx-8 md:mx-0 w-full flex justify-start items-start mt-4">
                            <Image src="/svg/star.svg" alt="star" width={24} height={22} />
                            <p className="ml-4 text-[#fff] text-[12px] font-light">Your friends receive a welcome bonus of 10 USDT, and you earn a referral reward of 5 USDT.</p>
                        </div>
                        <div className="mx-8 md:mx-0 w-full flex justify-start items-start mt-4">
                            <Image src="/svg/star.svg" alt="star" width={24} height={22} />
                            <p className="ml-4 text-[#fff] text-[12px] font-light">Inviting is simple and quick, leading to effortless additional income.</p>
                        </div>
                        <div className="mx-8 md:mx-0 w-full flex justify-start items-start mt-4">
                            <Image src="/svg/star.svg" alt="star" width={24} height={22} />
                            <p className="ml-4 text-[#fff] text-[12px] font-light">More referrals lead to unlocking higher-tier rewards and bonuses.</p>
                        </div>
                        <div className="my-4" />
                    </div>
                </div>
            </div >
        )
    );
};

export default Invite;
