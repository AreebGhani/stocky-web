"use client"
import { NextPage } from "next";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "@/utils/Image";
import Loading from "@/app/(app)/dashboard/deposit/loading";
import { sessionData } from "@/types/types";
import Link from "next/link";
import styles from "@/components/Forms/styles.module.css";
import z from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { AddDepositRequest } from "@/server/actions/AddDepositRequest";
import CopyToClipboardButton from "@/helper/CopyToClipboard";
import { useAuth } from "@/contexts/authContext";

const Deposit: NextPage = () => {
  const router = useRouter();
  const { sessionStatus, session } = useAuth();
  const [user, setUser] = useState<sessionData>();
  const [btnText, setBtnText] = useState<string>("Next");
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [preview, setPreview] = useState<string | undefined>('');

  useEffect(() => {
    if (sessionStatus !== "loading" && sessionStatus !== "authenticated") {
      router.replace("/login");
    } else {
      if (session) {
        setUser(session as sessionData);
      }
    }
  }, [sessionStatus, router, session]);

  const depositSchema = z.object({
    transactionId: z.string().refine((value) => {
      if (value.length < 10 || value.length > 80) {
        return false;
      }
      return true;
      // const hasNumber = /\d/.test(value);
      // const hasAlphabet = /[a-zA-Z]/.test(value);
      // return hasNumber && hasAlphabet;
    }, {
      message: "Invalid Number",
    }),
    screenshot: z.string().optional(),
    amount: z.string().min(1, { message: 'Minimum 1' }),
  });

  type depositSchema = z.infer<typeof depositSchema>;

  const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful }, reset, setError } = useForm<depositSchema>({
    resolver: zodResolver(depositSchema),
    defaultValues: {},
  });

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
    setError('screenshot', { message: '' });
    if (isSubmitting || isSubmitSuccessful) return;
    const files = e.target.files;
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    if (files[0].size > maxSizeInBytes) {
      setSelectedFile(undefined);
      setError('screenshot', { message: 'File size must be less than 2 MB' });
      return;
    }
    setSelectedFile(files[0]);
  };

  const onSubmit: SubmitHandler<depositSchema> = async (data: depositSchema) => {
    if (user) {
      setBtnText('Loading...');
      if (!selectedFile) {
        setError('screenshot', { message: 'Screenshot is required' });
        setBtnText('Next');
        return;
      }
      const formData = new FormData();
      formData.append('picture', selectedFile);
      const res: { success: boolean, message?: string, error?: { key: string, message: string } } = await AddDepositRequest(data.transactionId, parseInt(data.amount), user.user.id, formData);
      if (res.success && res.message === 'Deposit added successfully') {
        reset();
        router.replace('/account/transaction');
      } else {
        if (res.error) {
          setError(res.error.key as keyof depositSchema, { message: res.error.message });
        }
      }
    }
    setBtnText('Next');
  }

  if (sessionStatus === "loading") {
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
          <h1 className="my-8 text-[28px] font-bold text-center custom-heading">Recharge Wallet</h1>
          <form onSubmit={handleSubmit(onSubmit)} className={`mt-8 ${(isSubmitting || isSubmitSuccessful) && 'animate-pulse'}`}>
            <div className='mb-4'>
              <label className="text-[16px] text-[#fff] font-semibold">Deposit Address</label>
              <div className={`relative mt-1 ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}>
                <input
                  type="text"
                  className={`w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}
                  placeholder=""
                  value="TDvxGRLF7XdB7USbSWZwzXuxm7UgkGYxhb"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <CopyToClipboardButton textToCopy="TPayy1kjq6iKjP9peDuKink8r91LbX7qCM" iconBlack={false} />
                </div>
              </div>
            </div>
            <div className='mb-4'>
              <label className="text-[16px] text-[#fff] font-semibold">Enter Transaction ID</label>
              <div className={`relative mt-1 ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}>
                <input
                  type="text"
                  className={`w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}
                  placeholder=""
                  {...register('transactionId')}
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
              {errors["transactionId"] && (
                <p className="text-red-600 text-[14px]">
                  {errors["transactionId"]?.message}
                </p>
              )}
            </div>
            <div className='mb-4'>
              <span className="text-[16px] text-[#fff] font-semibold">Screenshot of Recharge</span>
              <div className={`relative mt-1 ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}>
                {!(isSubmitting || isSubmitSuccessful) &&
                  <input
                    id="file"
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    className="hidden"
                    onChange={onSelectFile}
                  />
                }
                <div className="w-full h-[142px]"></div>
                {preview ? <label style={{ backgroundImage: `url('${preview}')` }} htmlFor="file"
                  className={`!bg-cover !bg-center !bg-no-repeat absolute inset-y-0 inset-x-0 flex justify-center items-center w-full h-[142px] ${styles.input} ${(isSubmitting || isSubmitSuccessful) ? styles.disabled : 'cursor-pointer '}`}
                ></label>
                  : <label htmlFor="file" className={`absolute inset-y-0 inset-x-0 flex justify-center items-center w-full h-[142px] ${styles.input} ${(isSubmitting || isSubmitSuccessful) ? styles.disabled : 'cursor-pointer '}`}>
                    <p className="text-[#EFF400] text-[16px] font-normal">Click to Upload</p>
                  </label>
                }
              </div>
              {errors["screenshot"] && (
                <p className="text-red-600 text-[14px]">
                  {errors["screenshot"]?.message}
                </p>
              )}
            </div>
            <div className='mb-4'>
              <label className="text-[16px] text-[#fff] font-semibold">Recharge Amount</label>
              <div className={`relative mt-1 ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}>
                <input
                  type="number"
                  min="0"
                  className={`w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}
                  placeholder=""
                  {...register('amount')}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Image
                    className="cursor-pointer"
                    src="/svg/dollar.svg"
                    alt="dollar"
                    width={11}
                    height={18}
                  />
                </div>
              </div>
              {errors["amount"] && (
                <p className="text-red-600 text-[14px]">
                  {errors["amount"]?.message}
                </p>
              )}
            </div>
            <div className='mb-4'>
              <label className="text-[16px] text-[#fff] font-semibold">Recharge Type</label>
              <div className={`mt-2`}>
                <div className={`${(isSubmitting || isSubmitSuccessful) ? 'cursor-not-allowed' : 'cursor-pointer'} w-[62px] h-[40px] flex justify-center items-center rounded-[15px] bg-[#469BFF]`}>
                  <span className="text-[#fff] text-[16px] font-normal">TRC20</span>
                </div>
              </div>
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

export default Deposit;
