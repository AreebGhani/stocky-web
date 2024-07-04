"use client"
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/app/(app)/dashboard/admin/loading";
import { Referral, UpdateUser, sessionData } from "@/types/types";
import { CheckAdmin } from "@/server/actions/CheckAdmin";
import { GetUser } from "@/server/actions/GetUser";
import styles from "@/components/Forms/styles.module.css";
import { UpdateUserInfo } from "@/server/actions/UpdateUserInfo";
import { useAuth } from "@/contexts/authContext";
import Spinner from "@/components/Loader/Spinner";

const EditUser: NextPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { sessionStatus, session } = useAuth();
  const [user, setUser] = useState<sessionData>();
  const [loading, setLoading] = useState<boolean>(true);
  const [messageLoading, setMessageLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ success: string, error: string }>({ success: "", error: "" });
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
    if (res.success && res.data) {
      setFormData(res.data.user);
    }
    setLoadingUser(false);
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

    if (user) {
      fetchAdmin(user.user.id);
      if (id) {
        fetchUser(id as string);
      }
    }
  }, [user, sessionStatus, session, router, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const parsedValue = ['rank', 'balance', 'diamonds', 'teamCommission'].includes(name)
      ? parseFloat(value)
      : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const container = document.getElementById('scroll-to-top');
    if (container) {
      container.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }, [messageLoading]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessageLoading(true);
    const email = formData.email === '' ? 'null' : formData.email;
    const phone = formData.phone === '' ? 'null' : formData.phone;
    setFormData((prevData) => ({ ...prevData, email, phone }));
    const res: { success: boolean; message: string } = await UpdateUserInfo(id as string, formData);
    if (res.success) {
      setMessage({ success: res.message, error: '' });
      setTimeout(() => {
        router.replace("/dashboard/admin/users");
      }, 5000);
    } else {
      const email = formData.email === 'null' ? '' : formData.email;
      const phone = formData.phone === 'null' ? '' : formData.phone;
      setFormData((prevData) => ({ ...prevData, email, phone }));
      setMessage({ success: '', error: res.message });
    }
    setMessageLoading(false);
    setTimeout(() => {
      setMessage({ success: "", error: "" });
    }, 5000);
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
            <div className="my-4 mx-2 max-w-fit">
              {messageLoading && <p className="loading-team rounded-lg p-2 bg-gray-500 text-gray-800 font-bold">Loading...</p>}
              {message.success !== '' && <p className="animate-pulse rounded-lg p-2 bg-green-400 text-green-800 font-bold">{message.success}</p>}
              {message.error !== '' && <p className="animate-pulse rounded-lg p-2 bg-red-400 text-red-800 font-bold">{message.error}</p>}
            </div>
            {loadingUser ? (
              <div className="p-4"><Spinner /></div>
            ) : (
              <div className="mt-6">
                <div className="flex justify-center items-center">
                  <form onSubmit={handleSubmit} className={`text-white w-full lg:w-1/2 rounded-2xl shadow-2xl p-2 md:p-8 ${messageLoading && 'animate-pulse'}`}>
                    <div className={`mb-4 ${messageLoading && styles.disabled}`}>
                      <label htmlFor="username" className="block text-sm font-medium">Username</label>
                      <input id="username" name="username" type="text" className={`mt-2 text-black w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${messageLoading && styles.disabled}`}
                        value={formData.username} onChange={handleChange} required
                        pattern="^[a-zA-Z0-9]{6,20}$" title="At least 6 characters that must contain letters and numbers" placeholder="At least 6 characters that must contain letters and numbers" />
                    </div>
                    <div className={`my-4 ${messageLoading && styles.disabled}`}>
                      <label htmlFor="email" className="block text-sm font-medium">Email</label>
                      <input id="email" name="email" type="email" className={`mt-2 text-black w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${messageLoading && styles.disabled}`}
                        value={formData.email} onChange={handleChange}
                        title="Enter valid email" placeholder="something@example.com" />
                    </div>
                    <div className={`my-4 ${messageLoading && styles.disabled}`}>
                      <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
                      <input id="phone" name="phone" type="tel" className={`mt-2 text-black w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${messageLoading && styles.disabled}`}
                        value={formData.phone} onChange={handleChange}
                        title="Enter valid phone number" placeholder="+923001234567" />
                    </div>
                    <div className={`my-4 ${messageLoading && styles.disabled}`}>
                      <label htmlFor="role" className="block text-sm font-medium">Role</label>
                      <select id="role" name="role" className={`mt-2 text-black w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${messageLoading && styles.disabled}`}
                        value={formData.role} onChange={handleRoleChange} required
                        title="Enter valid role">
                        <option className="text-black" value="admin">Admin</option>
                        <option className="text-black" value="user">User</option>
                      </select>
                    </div>
                    <div className={`my-4 ${messageLoading && styles.disabled}`}>
                      <label htmlFor="rank" className="block text-sm font-medium">Rank</label>
                      <input id="rank" name="rank" type="number" min="0" max="6" className={`mt-2 text-black w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${messageLoading && styles.disabled}`}
                        value={formData.rank} onChange={handleChange} required
                        title="Enter valid rank" placeholder="Between 0 to 6" />
                    </div>
                    <div className={`my-4 ${messageLoading && styles.disabled}`}>
                      <label htmlFor="secret" className="block text-sm font-medium">Secret</label>
                      <input id="secret" name="secret" type="text" className={`mt-2 text-black w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${messageLoading && styles.disabled}`}
                        value={formData.secret} onChange={handleChange} required
                        title="Enter valid secret" placeholder="Admin Referral Chain Secret" />
                    </div>
                    <div className={`my-4 ${messageLoading && styles.disabled}`}>
                      <label htmlFor="balance" className="block text-sm font-medium">Balance</label>
                      <input id="balance" name="balance" type="number" min="0" className={`mt-2 text-black w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${messageLoading && styles.disabled}`}
                        value={formData.balance} onChange={handleChange} required
                        title="Enter valid balance amount" placeholder="Amount in USDT" />
                    </div>
                    <div className={`my-4 ${messageLoading && styles.disabled}`}>
                      <label htmlFor="diamonds" className="block text-sm font-medium">Diamonds</label>
                      <input id="diamonds" name="diamonds" type="number" min="0" className={`mt-2 text-black w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${messageLoading && styles.disabled}`}
                        value={formData.diamonds} onChange={handleChange} required
                        title="Enter valid number of diamonds" placeholder="Number of Diamonds" />
                    </div>
                    <div className={`my-4 ${messageLoading && styles.disabled}`}>
                      <label htmlFor="teamCommission" className="block text-sm font-medium">Team Commission</label>
                      <input id="teamCommission" name="teamCommission" type="number" min="0" className={`mt-2 text-black w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${messageLoading && styles.disabled}`}
                        value={formData.teamCommission} onChange={handleChange} required
                        title="Enter valid team commission amount" placeholder="Total Team Commission Amount" />
                    </div>
                    <div className={`mt-16 mb-4 ${messageLoading && styles.disabled}`}>
                      <button type="submit" disabled={messageLoading} className={`w-full custom-button ${messageLoading && 'disabled'}`}>
                        {messageLoading ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </form>
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

export default EditUser;
