"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/(app)/market/buy/loading";
import { useAuth } from "@/contexts/authContext";

const Buy = () => {
    const router = useRouter();
    const { sessionStatus, session } = useAuth();

    useEffect(() => {
        if (sessionStatus !== "loading" && sessionStatus !== "authenticated") {
            router.replace("/login");
        } else {
            router.replace("/market");
        }
    }, [sessionStatus, router]);

    if (sessionStatus === "loading") {
        return <Loading />;
    }

    return;
};

export default Buy;
