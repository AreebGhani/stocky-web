"use client"
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "@/utils/Image";
import { useRouter, useSearchParams } from 'next/navigation';
import styles from "@/components/Forms/styles.module.css";
import OTPInput from "@/components/Forms/OTPInput";
import { Verify } from "@/server/actions/Verify";
import Timer from "@/components/Forms/OTPInput/Timer";
import { ResendOTP } from "@/server/actions/ResendOTP";
import { CheckResendTime } from "@/server/actions/CheckResendTime";
import Loading from "@/app/(app)/(auth)/verify/loading";
import { useAuth } from "@/contexts/authContext";

type Props = {};
const Verification: NextPage = (props: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from: string = searchParams.get('from') as string;
  const callback: string = searchParams.get('callback') as string;
  const { sessionStatus, session } = useAuth();
  const [pageLoad, setPageLoad] = useState<boolean>(true);
  const [token, setToken] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [changeOTPValues, setChangeOTPValues] = useState<string[]>(Array<string>(6).fill(''));
  const [disable, setDisable] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [verifyWith, setVerifyWith] = useState<{ method: string, contact: string }>({
    method: 'null',
    contact: 'null',
  });
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [isResend, setIsResend] = useState<boolean>(false);
  const [resendTime, setResendTime] = useState<{ min?: number, sec?: number }>({ min: 0, sec: 0 });

  useEffect(() => {
    if (localStorage.getItem("temp")) {
      const tempRaw = localStorage.getItem("temp");
      if (tempRaw !== null) {
        const temp: {
          method: 'email' | 'phone', email?: string, phone?: string, token: string
        } = JSON.parse(tempRaw);
        if (temp.token.length < 300) {
          router.replace(from);
        }
        setToken(temp.token);
        if (temp.email && temp.email !== null && temp.email !== "null") {
          setVerifyWith({ method: 'email', contact: temp.email });
        }
        if (temp.phone && temp.phone !== null && temp.phone !== "null") {
          setVerifyWith({ method: 'phone', contact: temp.phone });
        }
      } else {
        router.replace(from);
      }
    } else {
      router.replace(from);
    }
  }, [sessionStatus, router, isResend, error, from]);

  useEffect(() => {
    const fetchResendTime = async () => {
      const res = await CheckResendTime(verifyWith.method, verifyWith.contact);
      if (res.success && res.time) {
        setResendTime(res.time);
        if (res.time.min === 0 && res.time.sec === 0) {
          setIsResend(false);
        } else {
          setIsResend(true);
        }
      }
      setResendLoading(false);
      setPageLoad(false);
    };
    if (verifyWith.method !== 'null' && verifyWith.contact !== 'null') {
      fetchResendTime();
    }
  }, [verifyWith, isResend]);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
    if (!from || !callback) {
      router.replace("/");
    }
    const validFromValues = ['/register', '/login'];
    const validCallbackValues = ['/login', '/reset'];
    if (
      !(validFromValues.includes(from) && validCallbackValues.includes(callback)) &&
      !(validFromValues.includes(callback) && validCallbackValues.includes(from))
    ) {
      router.replace("/");
    }
  }, [sessionStatus, router, token, from, callback]);

  useEffect(() => {
    if (otp.length === 6) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [otp]);

  const handleResend = async () => {
    if (isResend || submitting) {
      return;
    }
    setResendLoading(true);
    setError("");
    setChangeOTPValues(Array<string>(6).fill(''));
    setDisable(true);
    if (!isResend) {
      const res: { success: boolean, message: string } = await ResendOTP(verifyWith.method, verifyWith.contact);
      if (res.success) {
        setIsResend(true);
      } else {
        setError(res.message);
        setResendLoading(false);
        setTimeout(() => {
          localStorage.removeItem("temp");
          router.replace(from);
        }, 3000);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) {
      setError("Invalid OTP");
      setDisable(true);
      setSubmitting(false);
      return;
    }
    setSubmitting(true);
    if (callback === '/reset') {
      const res: { success: boolean, message: string } = await Verify(otp, token, false);
      if (res.success) {
        localStorage.removeItem("temp");
        setSubmitting(false);
        router.replace(`${callback}/${token}`);
      } else {
        setError(res.message);
        setSubmitting(false);
        if (res.message !== "Invalid OTP") {
          setTimeout(() => {
            localStorage.removeItem("temp");
            router.replace(from);
          }, 3000);
        }
      }
    } else if (callback === '/login') {
      const res: { success: boolean, message: string } = await Verify(otp, token, true);
      if (res.success) {
        localStorage.removeItem("temp");
        setSubmitting(false);
        router.replace(callback);
      } else {
        setError(res.message);
        setSubmitting(false);
        if (res.message !== "Invalid OTP") {
          setTimeout(() => {
            localStorage.removeItem("temp");
            router.replace(from);
          }, 3000);
        }
      }
    } else {
      throw new Error('Invalid callback value');
    }
  }

  if (sessionStatus === "loading") {
    return <Loading />;
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="flex min-h-screen flex-col items-center justify-center md:mt-0 md:p-24">
        <div className="p-8 md:rounded-[4rem] md:shadow-lg md:border-2 md:border-[rgba(40,50,68)] w-96">
          <span className="text-[#fff]">
            <h1 className="text-[24px] font-medium mt-12 md:mt-8">Almost there</h1>
          </span>
          <span className="text-[#fff]">
            <p className="text-[14px] font-light mt-6">Please enter the 6-digit code sent to your {verifyWith.method} <Link href={verifyWith.method === 'email' ? 'https://mail.google.com/mail/u/0/#inbox' : `sms:${verifyWith.contact}`} target="_blank" className="font-bold">{verifyWith.contact}</Link> for verification.</p>
          </span>
          <form onSubmit={handleSubmit} className={`${submitting && 'animate-pulse'}`}>
            <div className="mt-8">
              <OTPInput
                autoFocus
                length={6}
                isNumberInput={true}
                className={styles.otpContainer}
                inputClassName={styles.otpInput}
                onChangeOTP={(otp) => { setOtp(otp) }}
                changeOTPValues={changeOTPValues}
              />
              <p className="text-red-600 text-[14px] text-center mt-4 -mb-4">{error}</p>
            </div>
            <button disabled={disable || submitting} type="submit" className={`w-full mt-12 md:mt-8 custom-button ${(disable || submitting) && 'disabled'}`}>
              {submitting ? 'Loading...' : 'Verfiy'} <Image className={`${submitting ? 'hidden' : 'ml-2'}`} src="/svg/arrow-right.svg" alt="next" width={8} height={14} />
            </button>
          </form>
          <span className="text-[#fff] text-[13px] text-center mb-80 md:mb-0">
            {pageLoad ?
              <div className="flex flex-col items-center justify-center">
                <div className="mb-1 mt-12 md:mt-8 loading py-2 rounded-md w-56"></div>
                <div className="mt-1 loading py-2 rounded-md w-56"></div>
              </div>
              :
              <>
                <p className="font-bold mt-12 md:mt-8">Didn’t receive any code? {" "}
                  <button disabled={isResend || submitting} className={`text-[#469BFF] ${(isResend || submitting) && styles.disabled} ${resendLoading && `${styles.disabled} animate-pulse`}`} onClick={handleResend}>
                    {resendLoading ? 'Loading...' : 'Resend Again'}
                  </button>
                </p>
                {isResend && (
                  <p className="font-normal">
                    Request new code in <Timer initialSeconds={resendTime.sec} initialMinute={resendTime.min} onTimerEnd={() => setIsResend(false)} />
                  </p>
                )}
              </>}
          </span>
          <div className="absolute bottom-12 md:bottom-0 md:static md:mt-20">
            <Link href='/register' className="w-10 block">
              <Image src="/svg/goback.svg" alt="goback" width={49} height={49} />
            </Link>
          </div>
        </div>
      </div>
    )
  );
};

export default Verification;
