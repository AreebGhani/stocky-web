"use client"
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/app/(app)/dashboard/admin/loading";
import {
  DepositRequest, Referral, UpdateUser,
  UserDataType, UserTransaction, WithdrawRequest,
  sessionData
} from "@/types/types";
import { CheckAdmin } from "@/server/actions/CheckAdmin";
import { GetUser } from "@/server/actions/GetUser";
import styles from "@/components/Forms/styles.module.css";
import { UpdateUserInfo } from "@/server/actions/UpdateUserInfo";
import { useAuth } from "@/contexts/authContext";
import Image from "@/utils/Image";
import Team from "@/components/Sections/Team";
import { GetTransaction } from "@/server/actions/GetTransaction";
import AutoFontSize from "@/helper/AutoFontSize";
import { formatDate } from "@/helper/formatDate";
import CopyToClipboardButton from "@/helper/CopyToClipboard";
import Spinner from "@/components/Loader/Spinner";

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
    password: '',
    picture: null,
    role: '',
    rank: 0,
    secret: '',
    balance: 0,
    diamonds: 0,
    teamCommission: 0,
    createdAt: new Date,
    updatedAt: new Date,
  },
  stockingBalance: 0,
  todayProfit: 0,
  walletAddress: '',
  walletPin: 0,
}

const ViewUser: NextPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { sessionStatus, session } = useAuth();
  const [user, setUser] = useState<sessionData>();
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardLoading, setDashboardLoading] = useState<boolean>(true);
  const [transactionLoading, setTransactionLoading] = useState<boolean>(true);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [formData, setFormData] = useState<UpdateUser>({
    username: '',
    email: '',
    phone: '',
    role: '',
    rank: 0,
    secret: '',
    balance: 0,
    diamonds: 0,
    teamCommission: 0,
  });
  const [userData, setUserData] = useState<UserDataType & { walletAddress: string; walletPin: number; }>(initialUserData);
  const [levelOne, setLevelOne] = useState<Referral[]>([]);
  const [levelTwo, setLevelTwo] = useState<Referral[]>([]);
  const [levelThree, setLevelThree] = useState<Referral[]>([]);
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequest[]>([]);
  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>([]);

  useEffect(() => {
    if (sessionStatus !== "loading" && sessionStatus !== "authenticated") {
      router.replace("/login");
    } else {
      if (session) {
        setUser(session as sessionData);
      }
    }
  }, [sessionStatus, router, session]);

  const fetchUser = async (id: string) => {
    setLoadingUser(true);
    const res: {
      success: boolean, message?: string, data?: {
        user: UpdateUser, stockingBalance: number;
        todayProfit: number;
        referralChain: Referral;
        wallet: { address?: string; pin?: number }
      }
    } = await GetUser(id);
    setLoadingUser(false);
    if (res.success && res.data) {
      setFormData(res.data.user);
      setUserData({
        balance: res.data.user.balance,
        diamonds: res.data.user.diamonds,
        picture: null,
        rank: res.data.user.rank,
        referralChain: res.data.referralChain,
        stockingBalance: res.data.stockingBalance,
        todayProfit: res.data.todayProfit,
        walletAddress: res.data.wallet.address || "",
        walletPin: res.data.wallet.pin || 0,
      });
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
      setDashboardLoading(false);
    }
    setDashboardLoading(false);
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
      setLoading(false);
    }
    const fetchTransaction = async (userID: string) => {
      const res: {
        success: boolean; data?: {
          userTransactions: UserTransaction[],
          userWithdrawRequests: WithdrawRequest[],
          userDepositRequests: DepositRequest[]
        }; message?: string
      } = await GetTransaction(userID);
      if (res.success && res.data) {
        setTransactions(res.data.userTransactions);
        setWithdrawRequests(res.data.userWithdrawRequests);
        setDepositRequests(res.data.userDepositRequests);
        setTransactionLoading(false);
      }
    }
    if (user) {
      fetchAdmin(user.user.id);
      if (id) {
        fetchUser(id as string);
        fetchTransaction(id as string);
      }
    }
  }, [user, sessionStatus, session, router, id]);

  const handleEditUserDetail = () => {
    router.push(`/dashboard/admin/users/edit/${id}`);
  };


  if (loading || sessionStatus === "loading") {
    return <Loading />;
  }

  return (
    sessionStatus === "authenticated" && !loading && (
      <>
        <section className="pt-10 md:pt-20 flex flex-col justify-start items-start w-full h-screen overflow-y-scroll overflow-x-hidden custom-scroll">
          <div id="scroll-to-top"></div>
          <div className="p-4 w-full">
            <h1 className="text-white opacity-80 font-bold text-lg text-center underline">Admin Dashboard</h1>
          </div>
          <div className="px-8 md:px-20 mt-4 w-full">
            {loadingUser ? (
              <div className="p-4"><Spinner /></div>
            ) : (
              <div className="mt-6">
                <div className="flex justify-center items-center">
                  <div className={`text-white w-full lg:w-1/2 rounded-2xl shadow-2xl p-2 md:p-8`}>
                    Edit User Detail: <button className={`hover:bg-blue-300 hover:font-bold cursor-pointer rounded-lg p-1 border border-blue-600 w-[30px] h-[30px] mx-2 mb-6`}
                      onClick={handleEditUserDetail}><Image src='/svg/edit.svg' alt='edit' width={26} height={23} /></button>
                    <div className={`mb-4 ${styles.disabled}`}>
                      <label htmlFor="username" className="block text-sm font-medium">Username</label>
                      <input id="username" name="username" type="text" className={`mt-2 text-black w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${styles.disabled}`}
                        value={formData.username} disabled={true}
                        pattern="^[a-zA-Z0-9]{6,20}$" title="At least 6 characters that must contain letters and numbers" placeholder="At least 6 characters that must contain letters and numbers" />
                    </div>
                    <div className={`my-4 ${styles.disabled}`}>
                      <label htmlFor="email" className="block text-sm font-medium">Email</label>
                      <input id="email" name="email" type="email" className={`mt-2 text-black w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${styles.disabled}`}
                        value={formData.email} disabled={true}
                        title="Enter valid email" placeholder="something@example.com" />
                    </div>
                    <div className={`my-4 ${styles.disabled}`}>
                      <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
                      <input id="phone" name="phone" type="tel" className={`mt-2 text-black w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${styles.disabled}`}
                        value={formData.phone} disabled={true}
                        title="Enter valid phone number" placeholder="+923001234567" />
                    </div>
                    <div className={`my-4 ${styles.disabled}`}>
                      <label htmlFor="role" className="block text-sm font-medium">Role</label>
                      <select id="role" name="role" className={`mt-2 text-black w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${styles.disabled}`}
                        value={formData.role} disabled={true}
                        title="Enter valid role">
                        <option className="text-black" value="admin">Admin</option>
                        <option className="text-black" value="user">User</option>
                      </select>
                    </div>
                    <div className={`my-4 ${styles.disabled}`}>
                      <label htmlFor="rank" className="block text-sm font-medium">Rank</label>
                      <input id="rank" name="rank" type="number" min="0" max="6" className={`mt-2 text-black w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${styles.disabled}`}
                        value={formData.rank} disabled={true}
                        title="Enter valid rank" placeholder="Between 0 to 6" />
                    </div>
                    <div className={`my-4 ${styles.disabled}`}>
                      <label htmlFor="secret" className="block text-sm font-medium">Secret</label>
                      <input id="secret" name="secret" type="text" className={`mt-2 text-black w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${styles.disabled}`}
                        value={formData.secret} disabled={true}
                        title="Enter valid secret" placeholder="Admin Referral Chain Secret" />
                    </div>
                    <div className={`my-4 ${styles.disabled}`}>
                      <label htmlFor="balance" className="block text-sm font-medium">Balance</label>
                      <input id="balance" name="balance" type="number" min="0" className={`mt-2 text-black w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${styles.disabled}`}
                        value={formData.balance} disabled={true}
                        title="Enter valid balance amount" placeholder="Amount in USDT" />
                    </div>
                    <div className={`my-4 ${styles.disabled}`}>
                      <label htmlFor="diamonds" className="block text-sm font-medium">Diamonds</label>
                      <input id="diamonds" name="diamonds" type="number" min="0" className={`mt-2 text-black w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${styles.disabled}`}
                        value={formData.diamonds} disabled={true}
                        title="Enter valid number of diamonds" placeholder="Number of Diamonds" />
                    </div>
                    <div className={`my-4 ${styles.disabled}`}>
                      <label htmlFor="teamCommission" className="block text-sm font-medium">Team Commission</label>
                      <input id="teamCommission" name="teamCommission" type="number" min="0" className={`mt-2 text-black w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${styles.disabled}`}
                        value={formData.teamCommission} disabled={true}
                        title="Enter valid team commission amount" placeholder="Total Team Commission Amount" />
                    </div>
                    <div className={`mt-16 mb-4 ${styles.disabled}`}></div>
                  </div>
                </div>
                {dashboardLoading ? <div className="text-white text-xl animate-pulse p-4">Dashboard Loading...</div>
                  : <div className="pt-10 md:pt-32 flex flex-col lg:flex-row justify-start lg:justify-center items-center lg:items-start">
                    <div className="px-4 md:px-0 w-full md:w-[330px] mr-0 md:mr-10">
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
                      </div>
                    </div>
                    <Team levelOne={levelOne} levelTwo={levelTwo} levelThree={levelThree} loading={loading} />
                  </div>
                }
                <div className="my-8">
                  <h1 className="my-8 text-[28px] font-bold text-center custom-heading">Wallet</h1>
                  <h1 className="text-[#fff] text-center">Wallet Address: {userData.walletAddress && <><strong>{userData.walletAddress}</strong> <CopyToClipboardButton textToCopy={userData.walletAddress} iconBlack={false} /></>}</h1>
                  <h1 className="text-[#fff] text-center">Wallet Pin: {userData.walletPin && <><strong>{userData.walletPin}</strong> <CopyToClipboardButton textToCopy={userData.walletPin.toString()} iconBlack={false} /></>}</h1>
                </div>
                <h1 className="my-8 text-[28px] font-bold text-center custom-heading">Transaction</h1>
                {transactionLoading && <div className="p-4"><Spinner /></div>}
                <div>
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
            )}
          </div>
          <br /><br /><br />
        </section >
      </>
    )
  );
};

export default ViewUser;
