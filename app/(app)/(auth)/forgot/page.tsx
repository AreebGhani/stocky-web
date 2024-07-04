"use client"
import { NextPage } from "next";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from '@/utils/Image';
import { useRouter } from "next/navigation";
import Loading from "@/app/(app)/(auth)/forgot/loading";
import ForgotForm from "@/components/Forms/Forgot/ForgotForm";
import { useAuth } from "@/contexts/authContext";

type Props = {};
const Forgot: NextPage = (props: Props) => {
  const router = useRouter();
  const { sessionStatus, session } = useAuth();
  const [forgotWith, setForgotWith] = useState<'email' | 'phone'>('email');

  const handleForgot = (newForgotWith: 'email' | 'phone') => {
    setForgotWith(newForgotWith);
  };

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus, router]);

  if (sessionStatus === "loading") {
    return <Loading />;
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="flex min-h-screen flex-col items-center justify-center md:mt-0 md:p-24">
        <div className="p-8 md:rounded-[4rem] md:shadow-lg md:border-2 md:border-[rgba(40,50,68)] w-96">
          <div className="overflow-hidden">
            <span className="text-[#fff] text-center">
              <h1 className="mb-8 flex items-baseline justify-center">
                <span className="stocky flex items-center justify-center">
                  St <Image src="/logo/stocky-logo.png" alt="logo" width={29} height={29} /> cky
                </span>
              </h1>
            </span>
            <h1 className="text-[#fff] text-center text-[20px] font-medium mb-20 md:mb-12">
              Don&apos;t Worry
              <div className="text-[14px] font-normal">You can eaily reset your password</div>
            </h1>
            <div className="text-[#fff] text-[16px] font-semibold mb-6">
              <button className={`mr-4 ${forgotWith === 'email' && 'active'}`} onClick={() => handleForgot("email")}>
                Email
              </button>
              <button className={`ml-4 ${forgotWith === 'phone' && 'active'}`} onClick={() => handleForgot("phone")}>Phone</button>
            </div>
            <ForgotForm forgotWith={forgotWith} />
            <div className="flex items-center justify-center mt-7 mb-8">
              <span className="text-[13px] text-[#fff] font-normal">
                New Member?
                <Link className="text-[#FFC60A] font-bold ml-1" href="/register">Register now</Link>
              </span>
            </div>
            <div className="absolute bottom-12 md:bottom-0 md:static md:mt-20">
              <Link href='/login' className="w-10 block">
                <Image src="/svg/goback.svg" alt="goback" width={49} height={49} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Forgot;
