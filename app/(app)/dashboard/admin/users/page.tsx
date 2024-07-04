"use client"
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/(app)/dashboard/admin/loading";
import { sessionData } from "@/types/types";
import { CheckAdmin } from "@/server/actions/CheckAdmin";
import { DataGrid, GridColDef, GridRenderCellParams, GridValueFormatterParams } from '@mui/x-data-grid';
import AutoFontSize from "@/helper/AutoFontSize";
import { GetAllUsers } from "@/server/actions/GetAllUsers";
import CopyToClipboardButton from "@/helper/CopyToClipboard";
import { DeleteUser } from "@/server/actions/DeleteUser";
import { useAuth } from "@/contexts/authContext";
import Image from "@/utils/Image";
import Spinner from "@/components/Loader/Spinner";

type allUser = {
  id: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  picture: string | null;
  role: string;
  rank: number;
  referrerId: string | null;
  secret: string | null;
  balance: number;
  diamonds: number;
  teamCommission: number;
  createdAt: Date;
  updatedAt: Date;
}

const User: NextPage = () => {
  const router = useRouter();
  const { sessionStatus, session } = useAuth();
  const [user, setUser] = useState<sessionData>();
  const [loading, setLoading] = useState<boolean>(true);
  const [allUsers, setAllUsers] = useState<allUser[]>([]);
  const [messageLoading, setMessageLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ success: string, error: string }>({ success: "", error: "" });
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

  const fetchAllUsers = async () => {
    setLoadingAllUsers(true);
    const res: { success: boolean, message?: string, data?: { users: allUser[] } } = await GetAllUsers();
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
      setLoading(false);
    }
    if (user) {
      fetchAdmin(user.user.id);
      fetchAllUsers();
    }
  }, [user, sessionStatus, session, router]);

  useEffect(() => {
    const container = document.getElementById('scroll-to-top');
    if (container) {
      container.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }, [messageLoading]);

  const handleEdit = (userId: string) => {
    router.push(`/dashboard/admin/users/edit/${userId}`);
  };

  const handleView = (userId: string) => {
    router.push(`/dashboard/admin/users/${userId}`);
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?\nAll data will be lost!')) {
      return;
    }
    setMessageLoading(true);
    const res: { success: boolean, message: string } = await DeleteUser(userId);
    if (res.success) {
      setMessage({ success: res.message, error: '' });
    } else {
      setMessage({ success: '', error: res.message });
    }
    setMessageLoading(false);
    setTimeout(() => { setMessage({ success: "", error: "" }) }, 5000);
    await fetchAllUsers();
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 150,
      renderCell: (params: GridRenderCellParams<any, any>) => (
        <>
          <AutoFontSize content={params.row.id} />
          <CopyToClipboardButton textToCopy={params.row.id} iconBlack={true} />
        </>
      ),
    },
    { field: 'username', headerName: 'Username', width: 150 },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
      valueFormatter: (params: GridValueFormatterParams) => params.value === 'null' ? '' : params.value,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 150,
      valueFormatter: (params: GridValueFormatterParams) => params.value === 'null' ? '' : params.value,
    },
    { field: 'role', headerName: 'Role', width: 120 },
    { field: 'rank', headerName: 'Rank', width: 120 },
    {
      field: 'referrerId',
      headerName: 'Referrer ID',
      width: 150,
      renderCell: (params: GridRenderCellParams<any, any>) => (
        <>
          {params.row.referrerId &&
            <>
              <AutoFontSize content={params.row.referrerId} />
              <CopyToClipboardButton textToCopy={params.row.referrerId} iconBlack={true} />
            </>
          }
        </>
      ),
    },
    { field: 'secret', headerName: 'Secret', width: 150 },
    {
      field: 'balance',
      headerName: 'Balance',
      width: 120,
      renderCell: (params: GridRenderCellParams<any, any>) => (
        <>
          {params.row.balance} <i className="ml-1 text-[9px]">USDT</i>
        </>
      ),
    },
    { field: 'diamonds', headerName: 'Diamonds', width: 120 },
    {
      field: 'teamCommission',
      headerName: 'Team Commission',
      width: 180,
      renderCell: (params: GridRenderCellParams<any, any>) => (
        <>
          {params.row.teamCommission} <i className="ml-1 text-[9px]">USDT</i>
        </>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 180,
      valueFormatter: (params: GridValueFormatterParams) => new Date(params.value as string).toLocaleString(),
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      width: 180,
      valueFormatter: (params: GridValueFormatterParams) => new Date(params.value as string).toLocaleString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params: GridRenderCellParams<any, any>) => (
        <>
          <button className={`${messageLoading ? 'cursor-not-allowed' : 'hover:bg-green-300 hover:font-bold cursor-pointer'} rounded-lg p-1 border border-green-600 w-[25px] h-[25px] mr-2`}
            onClick={() => handleView(params.row.id)} disabled={messageLoading}><Image src='/svg/view.svg' alt='view' width={26} height={23} /></button>
          <button className={`${messageLoading ? 'cursor-not-allowed' : 'hover:bg-blue-300 hover:font-bold cursor-pointer'} rounded-lg p-1 border border-blue-600 w-[25px] h-[25px] mx-2`}
            onClick={() => handleEdit(params.row.id)} disabled={messageLoading}><Image src='/svg/edit.svg' alt='edit' width={26} height={23} /></button>
          <button className={`${messageLoading ? 'cursor-not-allowed' : 'hover:bg-red-300 hover:font-bold cursor-pointer'} rounded-lg p-1 border border-red-600 w-[25px] h-[25px] ml-2`}
            onClick={() => handleDelete(params.row.id)} disabled={messageLoading}><Image src='/svg/delete.svg' alt='delete' width={22} height={25} /></button>
        </>
      ),
    },
  ];

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
            {loadingAllUsers ? (
              <div className="p-4"><Spinner /></div>
            ) : (
              <div className="text-white mt-6">
                <div className="bg-white rounded-2xl shadow-lg p-2 md:p-8">
                  <DataGrid
                    rows={allUsers}
                    columns={columns}
                    sortingOrder={['asc', 'desc']}
                    sx={{
                      '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
                        width: '0.1rem',
                      },
                      '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track': {
                        background: 'rgb(0, 0, 0, 0.3)',
                      },
                      '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
                        backgroundColor: '#1E2830',
                        border: '5px solid transparent',
                        borderRadius: '9px',
                      },
                    }}
                  />
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

export default User;
