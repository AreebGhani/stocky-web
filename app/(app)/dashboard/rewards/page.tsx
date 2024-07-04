"use client"
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/(app)/dashboard/rewards/loading";
import Image from "@/utils/Image";
import Link from "next/link";
import { CheckRewardsResponse, Reward, sessionData } from "@/types/types";
import { CheckRewards } from "@/server/actions/CheckRewards";
import { ClaimRewards } from "@/server/actions/ClaimReward";
import { useAuth } from "@/contexts/authContext";

const initialState: Reward[] = [
    { reward: 3, purchase: 5, img: "/img/3-diamonds.png", btnText: "Incomplete" },
    { reward: 6, purchase: 30, img: "/img/6-diamonds.png", btnText: "Incomplete" },
    { reward: 10, purchase: 100, img: "/img/10-diamonds.png", btnText: "Incomplete" },
    { reward: 20, purchase: 200, img: "/img/20-diamonds.png", btnText: "Incomplete" },
    { reward: 50, purchase: 500, img: "/img/50-diamonds.png", btnText: "Incomplete" },
    { reward: 70, purchase: 700, img: "/img/70-diamonds.png", btnText: "Incomplete" },
];

const Rewards: NextPage = () => {
    const router = useRouter();
    const { sessionStatus, session } = useAuth();
    const [user, setUser] = useState<sessionData>();
    const [loading, setLoading] = useState<boolean>(true);
    const [claimLoading, setClaimLoading] = useState<boolean>(false);
    const [allRewards, setAllRewards] = useState<Reward[]>(initialState);

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

        const updateBtnText = (rewardValue: number, btnText: string) => {
            setAllRewards((prevRewards) => {
                const updatedRewards = prevRewards.map((reward) => {
                    if (reward.reward === rewardValue) {
                        return { ...reward, btnText };
                    }
                    return reward;
                });
                return updatedRewards;
            });
        };

        const fetchRewards = async (userID: string) => {
            const res: CheckRewardsResponse = await CheckRewards(userID);
            if (res.success && res.data && res.data.received) {
                if (res.data.received.claimDiamonds3) {
                    updateBtnText(3, "Received");
                }
                if (res.data.received.claimDiamonds6) {
                    updateBtnText(6, "Received");
                }
                if (res.data.received.claimDiamonds10) {
                    updateBtnText(10, "Received");
                }
                if (res.data.received.claimDiamonds20) {
                    updateBtnText(20, "Received");
                }
                if (res.data.received.claimDiamonds50) {
                    updateBtnText(50, "Received");
                }
                if (res.data.received.claimDiamonds70) {
                    updateBtnText(70, "Received");
                }
                if (res.data.rewards !== undefined) {
                    const rewardsArray = Array.isArray(res.data.rewards) ? res.data.rewards : [res.data.rewards];
                    setAllRewards((prevRewards: Reward[]) => {
                        const updatedRewards = prevRewards.map((reward) => {
                            if (res.data && rewardsArray.includes(reward.reward)) {
                                return { ...reward, btnText: "Claim" };
                            }
                            return reward;
                        });
                        return updatedRewards;
                    });
                }
            }

            setLoading(false);
        }
        if (user) {
            fetchRewards(user.user.id);
        }
    }, [user, sessionStatus, router, session]);

    const getReward = async (item: Reward) => {
        if (user && item.btnText === 'Claim') {
            setClaimLoading(true);
            const res: { success: boolean; message: string } = await ClaimRewards(user.user.id, item.reward);
            if (res.success) {
                setClaimLoading(false);
                router.replace('/dashboard');
            } else {
                setClaimLoading(false);
                router.replace('/dashboard');
            }
        }
    }

    if (loading || sessionStatus === 'loading') {
        return <Loading />;
    }

    return (
        sessionStatus === "authenticated" && (
            <div className="flex min-h-screen flex-col items-center justify-start md:justify-center mt-8 md:mt-0 md:p-24">
                <div className="px-4 md:p-8 md:rounded-[4rem] md:shadow-lg md:border-2 md:border-[rgba(40,50,68)] w-full md:w-96">
                    <div className="ml-2 mt-2 md:mt-0">
                        <Link href='/dashboard' className="w-10 block">
                            <Image src="/svg/goback.svg" alt="goback" width={49} height={49} />
                        </Link>
                    </div>
                    <h1 className="my-8 text-[28px] font-bold text-center custom-heading">Rewards</h1>
                    <div className="h-[600px] md:h-full overflow-y-auto overflow-x-hidden custom-scroll">
                        {allRewards.map((item: Reward, i: number) => (
                            <div key={i} className="flex justify-start items-center rounded-[10px] bg-[rgba(7,7,7,0.16)] stockDaily-shadow my-4">
                                <Image src={item.img} alt="3-diamonds" width={45} height={45} />
                                <div className="flex justify-between items-center mx-4 w-full">
                                    <div className="w-auto">
                                        <h1 className="text-[#fff] text-[16px] font-semibold">{item.reward} Diamonds</h1>
                                        <p className="text-[#fff] text-[10px] md:text-[12px] font-normal w-auto md:w-[96%]">Purchase {item.purchase} daily stock tickets </p>
                                    </div>
                                    <button onClick={() => getReward(item)} disabled={!(item.btnText === 'Claim') || (claimLoading)}
                                        className={`${item.btnText === 'Incomplete' ? 'bg-[#000000] bg-opacity-[0.3]' : item.btnText === 'Received' ? 'bg-[#000000] bg-opacity-[0.1] cursor-not-allowed' : claimLoading ? 'loading cursor-not-allowed' : 'bg-[#F2CC07] cursor-pointer'} rounded-[5px] px-3 py-1 text-[#fff] text-[12px] font-semibold`}>
                                        {item.btnText}
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="my-56 block md:hidden"></div>
                    </div>
                </div>
            </div>
        )
    );
};

export default Rewards;
