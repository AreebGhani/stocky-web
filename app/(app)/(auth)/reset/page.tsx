"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/(app)/(auth)/reset/loading";
import { useAuth } from "@/contexts/authContext";

const Reset = () => {
    const router = useRouter();
    const { sessionStatus, session } = useAuth();

    useEffect(() => {
        if (sessionStatus !== "authenticated") {
            router.replace("/login");
        } else {
            router.replace("/dashboard");
        }
    }, [sessionStatus, router]);

    if (sessionStatus === "loading") {
        return <Loading />;
    }

    return;
};

export default Reset;
