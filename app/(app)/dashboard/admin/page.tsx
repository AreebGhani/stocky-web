"use client"
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/(app)/dashboard/admin/loading";
import { sessionData } from "@/types/types";
import { CheckAdmin } from "@/server/actions/CheckAdmin";
import { ReleaseDailyStocksProfit } from "@/server/actions/ReleaseDailyStocksProfit";
import { ReleaseLongTermProfit } from "@/server/actions/ReleaseLongTermProfit";
import { useAuth } from "@/contexts/authContext";

const Admin: NextPage = () => {
  const router = useRouter();
  const { sessionStatus, session } = useAuth();
  const [user, setUser] = useState<sessionData>();
  const [loading, setLoading] = useState<boolean>(true);
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
    if (user) {
      fetchAdmin(user.user.id);
    }
  }, [user, sessionStatus, session, router]);

  useEffect(() => {
    document.querySelector('section section')?.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [messageLoading]);

  const releaseDailyProfit = async () => {
    const confirm = window.confirm('Are you sure you want to release daily profit?');
    if (!confirm) {
      return;
    }
    setMessageLoading(true);
    const res: { success: boolean, message: string } = await ReleaseDailyStocksProfit();
    if (res.success) {
      setMessage({ success: res.message, error: "" });
    } else {
      setMessage({ success: "", error: res.message });
    }
    setMessageLoading(false);
    setTimeout(() => { setMessage({ success: "", error: "" }) }, 5000);
  }

  const releaseLongProfit = async () => {
    const confirm = window.confirm('Are you sure you want to release long term profit?');
    if (!confirm) {
      return;
    }
    setMessageLoading(true);
    const res: { success: boolean, message: string } = await ReleaseLongTermProfit();
    if (res.success) {
      setMessage({ success: res.message, error: "" });
    } else {
      setMessage({ success: "", error: res.message });
    }
    setMessageLoading(false);
    setTimeout(() => { setMessage({ success: "", error: "" }) }, 5000);
  }

  const getAllUsersOfAdmin = () => {
    const username = window.prompt("Enter admin secret: ");
    if (!username) {
      return;
    }
    router.push(`/dashboard/admin/${username}`);
  }

  const getAllUsers = () => {
    router.push('/dashboard/admin/users');
  }

  const depositPage = () => {
    router.push('/dashboard/admin/deposit');
  }

  const withdrawPage = () => {
    router.push('/dashboard/admin/withdraw');
  }

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
            <div className="my-4 mx-2 max-w-fit">
              {messageLoading && <p className="loading-team rounded-lg p-2 bg-gray-500 text-gray-800 font-bold">Loading...</p>}
              {message.success !== '' && <p className="animate-pulse rounded-lg p-2 bg-green-400 text-green-800 font-bold">{message.success}</p>}
              {message.error !== '' && <p className="animate-pulse rounded-lg p-2 bg-red-400 text-red-800 font-bold">{message.error}</p>}
            </div>
            <h1 className="text-white mb-6 text-lg">Action Buttons:</h1>
            <div className="flex flex-col lg:flex-row gap-4 justify-around items-center w-full border p-8">
              <div className="">
                <button onClick={releaseDailyProfit} disabled={messageLoading} className={`${messageLoading ? 'cursor-not-allowed' : 'font-medium hover:text-black hover:bg-slate-300 hover:font-bold cursor-pointer'} text-white rounded-lg p-2 border border-white text-sm`}>
                  Release Daily Stock Profit
                </button>
              </div>
              <div className="">
                <button onClick={releaseLongProfit} disabled={messageLoading} className={`${messageLoading ? 'cursor-not-allowed' : 'font-medium hover:text-black hover:bg-slate-300 hover:font-bold cursor-pointer'} text-white rounded-lg p-2 border border-white text-sm`}>
                  Release Long Term Profit
                </button>
              </div>
              <div className="">
                <button onClick={getAllUsersOfAdmin} disabled={messageLoading} className={`${messageLoading ? 'cursor-not-allowed' : 'font-medium hover:text-black hover:bg-slate-300 hover:font-bold cursor-pointer'} text-white rounded-lg p-2 border border-white text-sm`}>
                  Get All Users Of Admin
                </button>
              </div>
              <div className="">
                <button onClick={getAllUsers} disabled={messageLoading} className={`${messageLoading ? 'cursor-not-allowed' : 'font-medium hover:text-black hover:bg-slate-300 hover:font-bold cursor-pointer'} text-white rounded-lg p-2 border border-white text-sm`}>
                  Get All Stocky Users
                </button>
              </div>
              <div className="">
                <button onClick={depositPage} disabled={messageLoading} className={`${messageLoading ? 'cursor-not-allowed' : 'font-medium hover:text-black hover:bg-slate-300 hover:font-bold cursor-pointer'} text-white rounded-lg p-2 border border-white text-sm`}>
                  Deposit Requests
                </button>
              </div>
              <div className="">
                <button onClick={withdrawPage} disabled={messageLoading} className={`${messageLoading ? 'cursor-not-allowed' : 'font-medium hover:text-black hover:bg-slate-300 hover:font-bold cursor-pointer'} text-white rounded-lg p-2 border border-white text-sm`}>
                  Withdraw Requests
                </button>
              </div>
            </div>
          </div>
          <br /><br /><br />
        </section >
      </>
    )
  );
};

export default Admin;
