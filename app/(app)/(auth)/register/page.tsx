"use client"
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "@/utils/Image";
import { useRouter } from "next/navigation";
import SignupForm from "@/components/Forms/Signup/SignupForm";
import Loading from "@/app/(app)/(auth)/register/loading";
import { useAuth } from "@/contexts/authContext";

type Props = {};
const Register: NextPage = (props: Props) => {
  const router = useRouter();
  const { sessionStatus, session } = useAuth();
  const [signupWith, setSignupWith] = useState<'email' | 'phone'>('email');

  const handleSignup = (newSignupWith: 'email' | 'phone') => {
    setSignupWith(newSignupWith);
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
              <h1 className="text-[20px] font-medium">Get Started</h1>
              <h1 className="flex items-baseline justify-center mb-20 md:mb-12">
                <span className="text-[14px] font-bold mr-2">With </span>
                <span className="stocky flex items-center justify-center">
                  St <Image src="/logo/stocky-logo.png" alt="logo" width={29} height={29} /> cky
                </span>
              </h1>
            </span>
            <div className="text-[#fff] text-[16px] font-semibold mb-6">
              <button className={`mr-4 ${signupWith === 'email' && 'active'}`} onClick={() => handleSignup("email")}>
                Email
              </button>
              <button className={`ml-4 ${signupWith === 'phone' && 'active'}`} onClick={() => handleSignup("phone")}>Phone</button>
            </div>
            <SignupForm signupWith={signupWith} />
            <div className="flex items-center justify-center mt-7 mb-8">
              <span className="text-[13px] text-[#fff] font-normal">
                Already a member?
                <Link className="text-[#FFC60A] font-bold ml-1" href="/login">Login</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Register;
