"use client"
import { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { useAuth } from "@/contexts/authContext";

const Index: NextPage = () => {
  const router = useRouter();
  const { sessionStatus, session } = useAuth();

  useEffect(() => {
    if (sessionStatus !== "loading" && sessionStatus !== "authenticated") {
      router.replace("/login");
    }
    if (sessionStatus !== "loading" && sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus, router]);

  if (sessionStatus === "loading") {
    return <Loading />;
  }

  return (
    sessionStatus === "authenticated" && (
      <div className="overflow-hidden md:overflow-y-auto"></div>
    )
  );
};

export default Index
