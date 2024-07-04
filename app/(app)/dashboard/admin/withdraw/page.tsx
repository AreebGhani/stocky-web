"use client"
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/(app)/dashboard/admin/loading";
import { Referral, sessionData } from "@/types/types";
import { CheckAdmin } from "@/server/actions/CheckAdmin";
import { GetUserRequests } from "@/server/actions/GetUserRequests";
import { AddTransaction } from "@/server/actions/AddTransaction";
import { formatDateTime } from "@/helper/formatDate";
import CopyToClipboardButton from "@/helper/CopyToClipboard";
import { DeleteTransaction } from "@/server/actions/DeleteTransaction";
import AutoFontSize from "@/helper/AutoFontSize";
import { useAuth } from "@/contexts/authContext";
import Spinner from "@/components/Loader/Spinner";

const WithdrawRequests: NextPage = () => {
  const router = useRouter();
  const { sessionStatus, session } = useAuth();
  const [user, setUser] = useState<sessionData>();
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingUserRequests, setLoadingUserRequests] = useState<boolean>(true);
  const [userRequests, setUserRequests] = useState([]);
  const [messageLoading, setMessageLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ success: string, error: string }>({ success: "", error: "" });

  useEffect(() => {
    if (sessionStatus !== "loading" && sessionStatus !== "authenticated") {
      router.replace("/login");
    } else {
      if (session) {
        setUser(session as sessionData);
      }
    }
  }, [sessionStatus, router, session]);

  const fetchRequests = async () => {
    setLoadingUserRequests(true);
    const res: { success: boolean, message?: string, data?: any } = await GetUserRequests("WITHDRAW");
    if (res.success && res.data) {
      setUserRequests(res.data.userRequests);
    }
    setLoadingUserRequests(false);
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
      fetchRequests();
      setLoading(false);
    }
    if (user) {
      fetchAdmin(user.user.id);
    }
  }, [user, sessionStatus, session, router]);

  useEffect(() => {
    const container = document.getElementById('scroll-to-top');
    if (container) {
      container.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }, [messageLoading]);

  const completed = async (type: 'WITHDRAW' | 'DEPOSIT', userID: string, amount: number, ID: string) => {
    const transactionID = window.prompt("Enter Transaction ID: ");
    if (!transactionID) {
      return;
    }
    if (type === 'DEPOSIT' && transactionID !== ID) {
      window.alert('Transaction ID does not match!');
      return;
    }
    setMessageLoading(true);
    const res: { success: boolean, message: string } = await AddTransaction(userID, transactionID, amount, ID, type);
    if (res.success) {
      setMessage({ success: res.message, error: '' });
    } else {
      setMessage({ success: '', error: res.message });
    }
    setMessageLoading(false);
    setTimeout(() => { setMessage({ success: "", error: "" }) }, 5000);
    await fetchRequests();
  }

  const Delete = async (type: 'WITHDRAW' | 'DEPOSIT', ID: string) => {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return;
    }
    setMessageLoading(true);
    const res: { success: boolean, message: string } = await DeleteTransaction(ID, type);
    if (res.success) {
      setMessage({ success: res.message, error: '' });
    } else {
      setMessage({ success: '', error: res.message });
    }
    setMessageLoading(false);
    setTimeout(() => { setMessage({ success: "", error: "" }) }, 5000);
    await fetchRequests();
  }

  if (loading || sessionStatus === 'loading') {
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
            <div className="my-4 mx-2 max-w-fit">
              {messageLoading && <p className="loading-team rounded-lg p-2 bg-gray-500 text-gray-800 font-bold">Loading...</p>}
              {message.success !== '' && <p className="animate-pulse rounded-lg p-2 bg-green-400 text-green-800 font-bold">{message.success}</p>}
              {message.error !== '' && <p className="animate-pulse rounded-lg p-2 bg-red-400 text-red-800 font-bold">{message.error}</p>}
            </div>
            <div className="text-white mt-16">
              <h1 className="text-white mb-6 text-lg">Withdraw Requests:</h1>
              <div className="table-scroll">
                <table className="min-w-full text-left bg-transparent border border-gray-300">
                  <thead className="bg-gray-800">
                    <tr>
                      {/* <th className="py-2 px-4 border">User ID</th> */}
                      <th className="py-2 px-4 border">Username</th>
                      <th className="py-2 px-4 border">Contact</th>
                      <th className="py-2 px-4 border">Register On</th>
                      <th className="py-2 px-4 border">Last Deposit On</th>
                      <th className="py-2 px-4 border">Referrer ID</th>
                      <th className="py-2 px-4 border">Team Members of Rank &gt; 1</th>
                      <th className="py-2 px-4 border">Amount</th>
                      <th className="py-2 px-4 border">Wallet</th>
                      <th className="py-2 px-4 border">Date</th>
                      <th className="py-2 px-4 border">Action</th>
                    </tr>
                  </thead>
                  {loadingUserRequests ? (
                    <tbody><tr><td className="p-4"><Spinner /></td></tr></tbody>
                  ) :
                    userRequests.length === 0 ? (
                      <tbody><tr><td className="p-4 text-white text-2xl">No Withdraw Request</td></tr></tbody>
                    ) :
                      (
                        <tbody>
                          {userRequests.map((withdrawal: any) => (
                            <tr key={withdrawal.id}>
                              <td className="py-2 px-4 border">{withdrawal.user.username}</td>
                              <td className="py-2 px-4 border">
                                {withdrawal.user.phone === '' || withdrawal.user.phone === 'null' ? withdrawal.user.email : withdrawal.user.phone}
                              </td>
                              <td className="py-2 px-4 border">{formatDateTime(withdrawal.user.createdAt)}</td>
                              <td className="py-2 px-4 border">{withdrawal.user.transactions.length > 0 && formatDateTime(withdrawal.user.transactions[0].createdAt)}</td>
                              <td className="py-2 px-4 border">{withdrawal.user.referrerId &&
                                <span className="flex flex-col justify-center items-start">
                                  <AutoFontSize content={withdrawal.user.referrerId} />
                                  <CopyToClipboardButton textToCopy={withdrawal.user.referrerId} iconBlack={false} />
                                </span>
                              }</td>
                              <td className="py-2 px-4 border">{withdrawal.user.teamMembers}</td>
                              <td className="py-2 px-4 border">
                                {withdrawal.amount} <i className="text-[9px]">USDT</i> - 10%  = {(withdrawal.amount - ((withdrawal.amount * 10) / 100))} <i className="text-[9px]">USDT</i>
                              </td>
                              <td className="py-2 px-4 border">
                                <span className="flex flex-col justify-center items-start">
                                  <AutoFontSize content={withdrawal.user.wallet.address} />
                                  <CopyToClipboardButton textToCopy={withdrawal.user.wallet.address} iconBlack={false} />
                                </span>
                              </td>
                              <td className="py-2 px-4 border">{formatDateTime(withdrawal.createdAt)}</td>
                              <td className="py-2 px-4 border">
                                <button
                                  onClick={() => completed('WITHDRAW', withdrawal.user.id, withdrawal.amount, withdrawal.id)}
                                  disabled={messageLoading}
                                  className={`${messageLoading ? 'cursor-not-allowed' : 'font-medium hover:text-black hover:bg-slate-300 hover:font-bold cursor-pointer'} text-white rounded-lg p-2 border border-white text-sm mr-2`}
                                >
                                  Completed
                                </button>
                                <button
                                  onClick={() => Delete('WITHDRAW', withdrawal.id)}
                                  disabled={messageLoading}
                                  className={`${messageLoading ? 'cursor-not-allowed' : 'font-medium hover:text-black hover:bg-slate-300 hover:font-bold cursor-pointer'} text-white rounded-lg p-2 border border-white text-sm ml-2`}
                                >
                                  Delete
                                </button>
                              </td>
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

export default WithdrawRequests;
