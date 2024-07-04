"use client"
import { NextPage } from "next";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "@/utils/Image";
import Version from "@/components/Sections/Version";
import Loading from "@/app/(app)/account/loading";
import Logout from "@/components/Modals/Logout";
import Link from "next/link";
import { sessionData } from "@/types/types";
import { UploadPicture } from "@/server/actions/UploadPicture";
import { GetUserPicture } from "@/server/actions/GetUserPicture";
import { useAuth } from "@/contexts/authContext";

const Account: NextPage = () => {
  const router = useRouter();
  const { sessionStatus, session, updateSession } = useAuth();
  const [user, setUser] = useState<sessionData>();
  const [show, setShow] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [preview, setPreview] = useState<string | undefined>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [userPicture, setUserPicture] = useState<string>("");
  const [pictureLoading, setPictureLoading] = useState<boolean>(false);

  const showModal = () => {
    setShow(true);
  }
  const closeModal = () => {
    setShow(false);
  }

  useEffect(() => {
    if (sessionStatus !== "loading" && sessionStatus !== "authenticated") {
      router.replace("/login");
    } else {
      if (session) {
        setUser(session as sessionData);
      }
    }
  }, [sessionStatus, router, session, updateSession]);

  const fetchUserPicture = async (userID: string) => {
    setUserPicture("");
    setPictureLoading(true);
    if (!sessionStorage.getItem('picture')) {
      const res: { success: boolean, data?: { picture: string | null }, message?: string } = await GetUserPicture(userID);
      if (res.success && res.data && res.data.picture) {
        setUserPicture(res.data.picture);
        sessionStorage.setItem('picture', JSON.stringify(res.data.picture));
      } else {
        sessionStorage.setItem('picture', JSON.stringify(''));
      }
    } else {
      const picture: string = JSON.parse(sessionStorage.getItem('picture') || "");
      setUserPicture(picture);
    }
    setPictureLoading(false);
  }

  useEffect(() => {
    if (user) {
      fetchUserPicture(user.user.id);
    }
  }, [user, sessionStatus, router, session]);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = async (e: ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (loading || pictureLoading) return;
    const files = e.target.files;
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    if (files[0].size > maxSizeInBytes) {
      setSelectedFile(undefined);
      setError('File size must be less than 2 MB');
      setTimeout(() => { setError("") }, 5000)
      return;
    }
    setSelectedFile(files[0]);
    await handleSubmit(files[0]);
  };

  const handleSubmit = async (file: File) => {
    setLoading(true);
    if (user) {
      const formData = new FormData();
      formData.append('picture', file);
      const res: { success: boolean, message: string, data?: string } = await UploadPicture(formData, user.user.id);
      if (res.success && res.data) {
        let newSession = updateSession({ ...session.user, picture: res.data });
        setUser(newSession as sessionData);
        sessionStorage.removeItem('picture');
        await fetchUserPicture(user.user.id);
      } else {
        setError(res.message);
      }
    }
    setSelectedFile(undefined);
    setPreview(undefined);
    setLoading(false);
    setTimeout(() => { setError("") }, 5000)
  }

  if (sessionStatus === "loading") {
    return <Loading />;
  }

  return (
    sessionStatus === "authenticated" && (
      <section className="pt-14 md:pt-32 flex flex-col justify-start items-center w-full h-screen">
        <div className="relative flex flex-col md:flex-row justify-around items-start md:w-3/4">
          <div className="w-full md:w-auto flex flex-col justify-center items-center">
            <form onSubmit={(e: React.FormEvent) => { e.preventDefault() }} className={typeof preview === 'undefined' ? 'relative mb-[5.5rem] -ml-24' : ''}>
              {(!loading || !pictureLoading) && <input id="file" type="file" accept=".png,.jpg,.jpeg" className="hidden" onChange={onSelectFile} />}
              <label htmlFor="file" className={`${loading || pictureLoading ? 'cursor-not-allowed' : 'cursor-pointer'} w-[93px] h-[88px] rounded-full ${typeof preview === 'undefined' ? 'absolute inset-y-0 inset-x-0' : ''}`}>
                {preview ? <div className={loading ? 'loading cursor-not-allowed w-[93px] h-[87px] rounded-full' : ''}><Image src={preview} alt="Preview" width={93} height={88} className={`rounded-full border-2 border-[#FF21CE] ${loading ? 'opacity-30' : ''}`} /></div>
                  : <>
                    {userPicture !== "" && !pictureLoading ?
                      <Image src={`/uploads/user-profile-pictures/${userPicture}`} alt={userPicture} width={93} height={88} className="w-[93px] h-[88px] rounded-full border-2 border-[#FF21CE]" />
                      : <div className={`w-[93px] h-[88px] rounded-full border-2 border-[#FF21CE] ${pictureLoading ? 'loading' : 'user-profile'}`} />}
                  </>}
              </label>
            </form>
            {error !== '' && <p className="mt-4 rounded-lg p-[2px] bg-red-400 text-red-800 font-bold">{error}</p>}
            <div className="mt-4 text-[#fff] text-center">
              <h1 className="text-[20px] font-semibold">{user?.user.username}</h1>
              <h3 className="text-[14px] font-normal">
                {user?.user.phone === '' || user?.user.phone === 'null' ? user?.user.email : user?.user.phone}
              </h3>
            </div>
          </div>
          <div className="mt-16 md:mt-0 flex flex-col justify-center items-center">
            <div>
              <Link href="/account/transaction" className="flex justify-start items-center cursor-pointer">
                <Image src="/svg/history.svg" alt="history" width={25} height={25} />
                <h3 className="text-[#fff] text-[16px] font-semibold ml-4 mr-2">Transaction History</h3>
                <Image src="/svg/arrow-right.svg" alt="aroow" width={8} height={14} />
              </Link>
              <Link href="/account/password" className="flex justify-start items-center cursor-pointer mt-6">
                <Image src="/svg/password.svg" alt="history" width={25} height={20} />
                <h3 className="text-[#fff] text-[16px] font-semibold ml-4 mr-2">Change Password</h3>
                <Image src="/svg/arrow-right.svg" alt="aroow" width={8} height={14} />
              </Link>
              <Link href="/account/contact" className="flex justify-start items-center cursor-pointer mt-6">
                <Image src="/svg/contact.svg" alt="history" width={25} height={25} />
                <h3 className="text-[#fff] text-[16px] font-semibold ml-4 mr-2">Contact US</h3>
                <Image src="/svg/arrow-right.svg" alt="aroow" width={8} height={14} />
              </Link>
              <Link href="/account/invite" className="flex justify-start items-center cursor-pointer mt-6">
                <Image src="/svg/invite.svg" alt="history" width={26} height={27} />
                <h3 className="text-[#fff] text-[16px] font-semibold ml-4 mr-2">Invite and Earn</h3>
                <Image src="/svg/arrow-right.svg" alt="aroow" width={8} height={14} />
              </Link>
            </div>
          </div>
        </div>
        <div className="md:hidden absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-3/4">
          <div className="flex justify-center items-center cursor-pointer" onClick={showModal}>
            <h4 className="text-[#fff] text-[18px] font-bold mr-2">Log Out</h4>
            <Image src="/svg/logout.svg" alt="logout" width={25} height={19} />
          </div>
        </div>
        <Version />
        <Logout show={show} closeModal={closeModal} />
      </section>
    )
  );
};

export default Account;
