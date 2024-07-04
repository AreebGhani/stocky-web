"use client"
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "@/utils/Image";
import Loading from "@/app/(app)/dashboard/withdraw/link-wallet/loading";
import { sessionData } from "@/types/types";
import Link from "next/link";
import styles from "@/components/Forms/styles.module.css";
import { CheckWalletLink } from "@/server/actions/CheckWalletLink";
import z from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { AddWallet } from "@/server/actions/AddWallet";
import { useAuth } from "@/contexts/authContext";

const LinkWallet: NextPage = () => {
  const router = useRouter();
  const { sessionStatus, session } = useAuth();
  const [user, setUser] = useState<sessionData>();
  const [loading, setLoading] = useState<boolean>(true);
  const [btnText, setBtnText] = useState<string>("Next");

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
    const fetchWallet = async (userID: string) => {
      const res: { success: boolean, data?: { address: string, pin: number }, message?: string } = await CheckWalletLink(userID);
      if (res.success && res.data) {
        router.replace("/dashboard/withdraw");
      }
      setLoading(false);
    }
    if (user) {
      fetchWallet(user.user.id);
    }
  }, [user, router]);

  const linkWalletSchema = z.object({
    address: z.string().refine((value) => {
      if (value.length < 10 || value.length > 80) {
        return false;
      }
      const hasNumber = /\d/.test(value);
      const hasAlphabet = /[a-zA-Z]/.test(value);
      const startsWithCapitalT = /^[T]/.test(value);
      return hasNumber && hasAlphabet && startsWithCapitalT;
    }, {
      message: "Invalid Address",
    }),
    pin: z.string().min(6, { message: 'Must be 6 to 20 digits' })
  }).refine((data) => {
    return /^\d{6,20}$/.test(data.pin);
  }, {
    message: 'Must be 6 to 20 digit numbers',
    path: ['pin'],
  });

  type linkWalletSchema = z.infer<typeof linkWalletSchema>;

  const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful }, reset, setError } = useForm<linkWalletSchema>({
    resolver: zodResolver(linkWalletSchema),
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<linkWalletSchema> = async (data: linkWalletSchema) => {
    if (user) {
      const res: { success: boolean, message?: string, error?: { key: string, message: string } } = await AddWallet(data.address, parseInt(data.pin), user.user.id);
      if (res.success && res.message === 'Wallet added successfully') {
        reset();
        router.replace('/dashboard/withdraw');
      } else {
        if (res.error) {
          setError(res.error.key as keyof linkWalletSchema, { message: res.error.message });
        }
      }
    }
  }

  useEffect(() => {
    if (isSubmitting || isSubmitSuccessful) {
      setBtnText('Loading...');
    } else {
      setBtnText('Next');
    }
  }, [isSubmitting, isSubmitSuccessful]);

  if (loading || sessionStatus === 'loading') {
    return <Loading />;
  }

  return (
    sessionStatus === "authenticated" && (
      <div className="flex md:min-h-screen h-[90vh] md:h-full pb-20 md:pb-0 overflow-y-auto flex-col items-center justify-start md:justify-center mt-8 md:mt-0 md:p-24">
        <div className="px-4 md:p-8 md:rounded-[4rem] md:shadow-lg md:border-2 md:border-[rgba(40,50,68)] w-full md:w-96">
          <div className="ml-2 mt-2 md:mt-0">
            <Link href='/dashboard' className="w-10 block">
              <Image src="/svg/goback.svg" alt="goback" width={49} height={49} />
            </Link>
          </div>
          <h1 className="my-8 text-[28px] font-bold text-center custom-heading">Link Your Wallet</h1>
          <form onSubmit={handleSubmit(onSubmit)} className={`mt-8 ${(isSubmitting || isSubmitSuccessful) && 'animate-pulse'}`}>
            <div className='mb-8'>
              <label className="text-[16px] text-[#fff] font-semibold">Enter Wallet Address</label>
              <div className={`relative mt-1 ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}>
                <input
                  type="text"
                  className={`w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}
                  placeholder=""
                  {...register('address')}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Image
                    className="cursor-pointer"
                    src="/svg/keyboard.svg"
                    alt="keyboard"
                    width={25}
                    height={17}
                  />
                </div>
              </div>
              {errors['address'] && (
                <p className="text-red-600 text-[14px]">
                  {errors['address']?.message}
                </p>
              )}
            </div>
            <div className='mb-8'>
              <label className="text-[16px] text-[#fff] font-semibold">Payment Type</label>
              <div className={`mt-2`}>
                <div className={`${(isSubmitting || isSubmitSuccessful) ? 'cursor-not-allowed' : 'cursor-pointer'} w-[62px] h-[40px] flex justify-center items-center rounded-[15px] bg-[#469BFF]`}>
                  <span className="text-[#fff] text-[16px] font-normal">TRC20</span>
                </div>
              </div>
            </div>
            <div className='mb-4'>
              <label className="text-[16px] text-[#fff] font-semibold">Enter Withdrawal PIN</label>
              <div className={`relative mt-1 ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}>
                <input
                  type="number"
                  min='0'
                  className={`w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}
                  placeholder="6-digit"
                  {...register('pin')}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Image
                    className="cursor-pointer"
                    src="/svg/key.svg"
                    alt="pin"
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              {errors['pin'] && (
                <p className="text-red-600 text-[14px]">
                  {errors['pin']?.message}
                </p>
              )}
            </div>
            <button disabled={(isSubmitting || isSubmitSuccessful)} type="submit" className={`mt-16 w-full custom-button ${(isSubmitting || isSubmitSuccessful) && 'disabled'}`}>
              {btnText} <Image className={`${(isSubmitting || isSubmitSuccessful) ? 'hidden' : 'ml-2'}`} src="/svg/arrow-right.svg" alt="next" width={8} height={14} />
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default LinkWallet;
