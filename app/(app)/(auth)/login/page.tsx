"use client"
import { NextPage } from "next";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from '@/utils/Image';
import { useRouter } from "next/navigation";
import LoginForm from "@/components/Forms/Login/LoginForm";
import Loading from "@/app/(app)/(auth)/login/loading";
import { useAuth } from "@/contexts/authContext";

type Props = {};
const Login: NextPage = (props: Props) => {
  const router = useRouter();
  const { sessionStatus, session } = useAuth();
  const [loginWith, setLoginWith] = useState<'email' | 'phone'>('email');

  const handleLogin = (newLoginWith: 'email' | 'phone') => {
    setLoginWith(newLoginWith);
  };

  useEffect(() => {
    if (localStorage.getItem("temp")) {
      const tempRaw = localStorage.getItem("temp");
      if (tempRaw !== null) {
        const temp: {
          method: 'email' | 'phone', email?: string, phone?: string, token: string
        } = JSON.parse(tempRaw);
        if (temp.token.length < 300) {
          if (sessionStatus === "authenticated") {
            router.replace("/dashboard");
          }
        } else {
          router.replace("/verify?from=/register&callback=/login");
        }
      } else {
        if (sessionStatus === "authenticated") {
          router.replace("/dashboard");
        }
      }
    } else {
      if (sessionStatus === "authenticated") {
        router.replace("/dashboard");
      }
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
              Welcome Back
              <div className="text-[14px] font-normal">Sign in to access your account</div>
            </h1>
            <div className="text-[#fff] text-[16px] font-semibold mb-6">
              <button className={`mr-4 ${loginWith === 'email' && 'active'}`} onClick={() => handleLogin("email")}>
                Email
              </button>
              <button className={`ml-4 ${loginWith === 'phone' && 'active'}`} onClick={() => handleLogin("phone")}>Phone</button>
            </div>
            <LoginForm loginWith={loginWith} />
            <div className="flex items-center justify-center mt-7 mb-8">
              <span className="text-[13px] text-[#fff] font-normal">
                New Member?
                <Link className="text-[#FFC60A] font-bold ml-1" href="/register">Register now</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Login;
