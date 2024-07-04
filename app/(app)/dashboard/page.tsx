"use client"
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "@/utils/Image";
import Link from "next/link";
import Team from "@/components/Sections/Team";
import Loading from "@/app/(app)/dashboard/loading";
import { Referral, UserDataResponse, UserDataType, sessionData } from "@/types/types";
import { UserDashboardData } from "@/server/actions/UserDashboardData";
import { useAuth } from "@/contexts/authContext";
import { usePullToRefresh } from 'use-pull-to-refresh';

const initialUserData = {
  balance: 0,
  diamonds: 0,
  picture: '',
  rank: 0,
  referralChain: {
    id: '',
    username: '',
    email: '',
    phone: '',
    picture: null,
    rank: 0,
    balance: 0,
    diamonds: 0,
    teamCommission: 0,
    createdAt: new Date,
    updatedAt: new Date,
  },
  stockingBalance: 0,
  todayProfit: 0,
}

const MAXIMUM_PULL_LENGTH = 240;
const REFRESH_THRESHOLD = 180;

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { sessionStatus, session } = useAuth();
  const [user, setUser] = useState<sessionData>();
  const [userData, setUserData] = useState<UserDataType>(initialUserData);
  const [loading, setLoading] = useState<boolean>(true);
  const [levelOne, setLevelOne] = useState<Referral[]>([]);
  const [levelTwo, setLevelTwo] = useState<Referral[]>([]);
  const [levelThree, setLevelThree] = useState<Referral[]>([]);

  useEffect(() => {
    if (sessionStatus !== "loading" && sessionStatus !== "authenticated") {
      router.replace("/login");
    } else {
      if (session) {
        setUser(session as sessionData);
      }
    }
  }, [sessionStatus, router, session]);

  const fetchUserData = async (userID: string) => {
    setLoading(true);
    if (!sessionStorage.getItem('user')) {
      const res: UserDataResponse = await UserDashboardData(userID);
      if (res.success && res.data) {
        const storeData: { userData?: UserDataType, levelOne?: Referral[], levelTwo?: Referral[], levelThree?: Referral[] } = {};
        setUserData(res.data);
        storeData.userData = res.data;
        if (res.data.referralChain.referrals) {
          res.data.referralChain.referrals.forEach((level1Referral: Referral) => {
            setLevelOne((prev) => {
              if (prev.some((referral) => referral.id === level1Referral.id)) {
                return prev;
              }
              return [...prev, level1Referral];
            });

            if (level1Referral.referrals) {
              level1Referral.referrals.forEach((level2Referral: Referral) => {
                setLevelTwo((prev) => {
                  if (prev.some((referral) => referral.id === level2Referral.id)) {
                    return prev;
                  }
                  return [...prev, level2Referral];
                });

                if (level2Referral.referrals) {
                  level2Referral.referrals.forEach((level3Referral: Referral) => {
                    setLevelThree((prev) => {
                      if (prev.some((referral) => referral.id === level3Referral.id)) {
                        return prev;
                      }
                      return [...prev, level3Referral];
                    });
                  });
                }
              });
            }
          });
        }
        storeData.levelOne = levelOne;
        storeData.levelTwo = levelTwo;
        storeData.levelThree = levelThree;
        sessionStorage.setItem('user', JSON.stringify(storeData));
      }
    } else {
      const storeData: { userData: UserDataType, levelOne: Referral[], levelTwo: Referral[], levelThree: Referral[] }
        = JSON.parse(sessionStorage.getItem('user') || '');
      setUserData(storeData.userData);
      setLevelOne(storeData.levelOne);
      setLevelTwo(storeData.levelTwo);
      setLevelThree(storeData.levelThree);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (user) {
      fetchUserData(user.user.id);
    }
  }, [user, sessionStatus, router, session]);

  const { isRefreshing, pullPosition } = usePullToRefresh({
    onRefresh: async () => {
      sessionStorage.removeItem('user');
      if (user) {
        await fetchUserData(user.user.id);
      }
    },
    maximumPullLength: MAXIMUM_PULL_LENGTH,
    refreshThreshold: REFRESH_THRESHOLD
  });

  if (sessionStatus === "loading") {
    return <Loading />;
  }

  return (
    sessionStatus === "authenticated" && (
      <>
        <section className="pt-10 md:pt-32 flex flex-col lg:flex-row justify-start lg:justify-center items-center lg:items-start w-full h-screen">
          <div
            style={{
              top: (isRefreshing ? REFRESH_THRESHOLD : pullPosition) / 3,
              opacity: isRefreshing || pullPosition > 0 ? 1 : 0,
            }}
            className='bg-base-100 fixed inset-x-1/2 z-30 h-8 w-8 -translate-x-1/2 rounded-full p-2 shadow -ml-2'
          >
            <div
              className={`h-[30px] w-[30px] ${isRefreshing ? 'animate-spin' : ''}`}
              style={!isRefreshing ? { transform: `rotate(${pullPosition}deg)` } : {}}
            >
              <Image src="/svg/refresh.svg" alt="refresh" width={30} height={30} />
            </div>
          </div>
          {!isRefreshing && <p className="text-white text-2xl rotate-90 ml-1 -mt-2 absolute md:hidden">»</p>}
          <i onClick={async () => {
            sessionStorage.removeItem('user');
            if (user) {
              await fetchUserData(user.user.id);
            }
          }}
            className="text-white lg:text-[9px] xl:text-[11px] border border-white p-1 rounded-2xl cursor-pointer hidden absolute md:block -mt-8">
            Refresh</i>
          <div className="px-4 mt-4 md:px-0 w-full md:w-[330px] mr-0 md:mr-10">
            <div className="flex justify-between items-center px-4 md:px-0 w-full">
              <div className="flex justify-center items-center">
                <Link href="/account">
                  {sessionStorage.getItem('picture') && JSON.parse(sessionStorage.getItem('picture') || '') !== '' ?
                    <Image src={`/uploads/user-profile-pictures/${JSON.parse(sessionStorage.getItem('picture') || '')}`} alt={user?.user.username || 'user'} width={50} height={50} className="rounded-full border-2 border-[#FF21CE]" />
                    : userData.picture !== "" && !loading ?
                      <Image src={`/uploads/user-profile-pictures/${userData.picture}`} alt={user?.user.username || 'user'} width={50} height={50} className="rounded-full border-2 border-[#FF21CE]" />
                      : <div className={`w-[50px] h-[50px] rounded-full border-2 border-[#FF21CE] ${loading ? 'loading' : 'user-profile'}`} />}
                </Link>
                <div className="flex flex-col justify-center items-start ml-4">
                  <h4 className="text-[#fff] text-[16px] font-semibold">{user?.user.username}</h4>
                  {loading ? <span className="loading-team rounded-2xl py-[6px] px-6 mt-1"></span> : <i className="text-white text-[12px]">Rank {userData.rank}</i>}
                </div>
              </div>
              {user?.user.role === "admin" && <Link href={'/dashboard/admin'} className="mx-4 text-white rounded-lg font-medium p-1 border border-white text-[9px] hover:text-black hover:bg-slate-300 hover:font-bold">Admin Dashboard</Link>}
              <Link href="/dashboard/rewards" className="relative animate-pulse bg-[rgba()]">
                <Image src="/svg/bell.svg" alt="notification" className="cursor-pointer" width={20.942} height={27.169} />
                {true && (
                  <span className="absolute top-[-10px] right-[-8px] text-red-500 rounded-full p-[5px] animate-bounce">●</span>
                )}
              </Link>
            </div>
            <div className="mt-6 flex flex-col justify-center items-center">
              <div className="w-full rounded-[2px] dashboard-balance">
                <div className="pt-4 px-4 text-[#fff] flex justify-between items-center">
                  <div className="flex justify-center items-baseline">
                    {loading ? <div className="mt-1 loading-team rounded-2xl py-4 px-10"></div>
                      : <p className="text-[30px] font-bold">{userData.balance.toFixed(2)}</p>}
                    <span className="text-[14px] font-normal ml-1">USDT</span>
                  </div>
                  <div className="flex justify-center items-center">
                    {loading ? <div className="mt-1 loading-team rounded-2xl py-3 px-6"></div>
                      : <p className="text-[21px] font-bold text-shadow">{userData.diamonds}</p>}
                    <Image loading="lazy" className="ml-2 w-[20px] h-[16px]" src="/img/diamond.png" alt="diamond" width={1833} height={1474} />
                  </div>
                </div>
                <h4 className="px-4 text-[rgba(255,255,255,0.81)] text-[15px] font-normal">Current Balance</h4>
                <div className="flex justify-center w-full my-4">
                  <div className="bg-[rgba(255,255,255,0.46)] w-[98%] h-[1px]" />
                </div>
                <div className="px-8 mb-6 flex justify-between items-center">
                  <div className="flex justify-center items-end">
                    <div className="text-[#fff] flex flex-col justify-center items-center">
                      {loading ? <div className="mb-2 loading-team rounded-2xl py-3 px-6"></div>
                        : <h4 className="text-[20px] font-bold">{userData.todayProfit.toFixed(2)}</h4>}
                      <div className="my-1 w-[57px] h-[1px] bg-[rgba(255,255,255,0.55)]" />
                      <p className="text-[10px] font-normal">Today Profit</p>
                    </div>
                    {/* <p className="ml-2 text-[rgba(21,235,81,0.80)] text-[12px] font-normal">(+2.3%)</p> */}
                  </div>
                  <div className="flex justify-center items-end">
                    <div className="text-[#fff] flex flex-col justify-center items-center">
                      {loading ? <div className="mb-2 loading-team rounded-2xl py-3 px-6"></div>
                        : <h4 className="text-[20px] font-bold">{userData.stockingBalance.toFixed(2)}</h4>}
                      <div className="my-1 w-[57px] h-[1px] bg-[rgba(255,255,255,0.55)]" />
                      <p className="text-[10px] font-normal">Stocking Balance</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-between items-center">
                <Link href="/dashboard/deposit" className="w-[128px] h-[55px] rounded-[2px] flex flex-col justify-center items-center cursor-pointer dashboard-button">
                  <Image className="mt-2" src="/svg/balance.svg" alt="balance" width={21.91} height={29.735} />
                  <h2 className="mb-1 text-[rgba(255,255,255,0.78)] text-[18px] font-bold  font-moul">Deposit</h2>
                </Link>
                <Link href="/dashboard/withdraw" className="w-[128px] h-[55px] rounded-[2px] flex flex-col justify-center items-center cursor-pointer dashboard-button">
                  <Image className="mt-2 rotate-180" src="/svg/balance.svg" alt="balance" width={21.91} height={29.735} />
                  <h2 className="mb-1 text-[rgba(255,255,255,0.78)] text-[18px] font-bold  font-moul">Withdraw</h2>
                </Link>
              </div>
            </div>
          </div>
          <Team levelOne={levelOne} levelTwo={levelTwo} levelThree={levelThree} loading={loading} />
        </section>
      </>
    )
  );
};

export default Dashboard;
