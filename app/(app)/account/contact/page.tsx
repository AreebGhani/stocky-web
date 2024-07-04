"use client"
import { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/(app)/account/contact/loading";
import Link from "next/link";
import Image from "@/utils/Image";
import { useAuth } from "@/contexts/authContext";

const Contact: NextPage = () => {
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
            <div className="flex min-h-screen flex-col items-center justify-start md:justify-center pt-8 md:p-24">
                <div className="px-4 md:p-8 md:rounded-[4rem] md:shadow-lg md:border-2 md:border-[rgba(40,50,68)] w-full md:w-96">
                    <div className="ml-2 mt-2 md:mt-0">
                        <Link href='/account' className="w-10 block">
                            <Image src="/svg/goback.svg" alt="goback" width={49} height={49} />
                        </Link>
                    </div>
                    <div className="mt-20 mx-4">
                        <Link href="https://wa.me/447441357009" target="_blank" className="flex justify-start items-center">
                            <Image src="/svg/whatsapp.svg" alt="whatsapp" width={41} height={40} />
                            <div className="text-[#fff] ml-4">
                                <h4 className="text-[14px] font-semibold">Admin</h4>
                                <p className="text-[14px] font-light">+44 7441 357009</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        )
    );
};

export default Contact;
