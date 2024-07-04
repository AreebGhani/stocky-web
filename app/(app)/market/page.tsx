"use client"
import { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "@/utils/Image";
import LongTermStocks from "@/components/Sections/LongTermStocks";
import DailyStocks from "@/components/Sections/DailyStocks";
import Loading from "@/app/(app)/market/loading";
import { useAuth } from "@/contexts/authContext";

const Market: NextPage = () => {
  const router = useRouter();
  const { sessionStatus, session } = useAuth();

  useEffect(() => {
    if (sessionStatus !== "loading" && sessionStatus !== "authenticated") {
      router.replace("/login");
    }
  }, [sessionStatus, router]);

  if (sessionStatus === "loading") {
    return <Loading />;
  }

  return (
    sessionStatus === "authenticated" && (
      <div className="h-[900px] md:h-full overflow-y-auto overflow-x-hidden custom-scroll">
        <section className="pt-10 md:pt-32">
          <div className="flex flex-col items-center justify-center">
            <span className="text-[#fff]">
              <h1 className="flex items-baseline">
                <span className="text-[26px] font-bold mr-4">Become </span>
                <span className="stocky flex items-center justify-center">
                  St <Image src="/logo/stocky-logo.png" alt="logo" width={29} height={29} /> cky
                </span>
              </h1>
              <h1 className="text-[26px] font-bold">Profit Partner</h1>
              <div className="ml-60 -mt-8">
                <Image src="/svg/hands.svg" alt="hands" width={60.08} height={56.04} />
              </div>
            </span>
          </div>
          <LongTermStocks />
          <DailyStocks />
        </section >
      </div >
    )
  );
};

export default Market;
