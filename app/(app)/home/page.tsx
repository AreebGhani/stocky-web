"use client"
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Slider from "@/components/Sections/Slider";
import News from "@/components/Sections/News";
import Loading from "@/app/(app)/home/loading";
import DownloadApp from "@/components/Modals/DownloadApp";
import { useAuth } from "@/contexts/authContext";
import { useWindow } from "@/contexts/windowContext";

const Home: NextPage = () => {
  const router = useRouter();
  const { sessionStatus, session } = useAuth();
  const { isReactNativeWebView } = useWindow();
  const [show, setShow] = useState<boolean>(true);

  const closeModal = () => {
    setShow(false);
    sessionStorage.setItem("downloadPopupState", JSON.stringify(true));

  }
  useEffect(() => {
    if (sessionStatus !== "loading" && sessionStatus !== "authenticated") {
      router.replace("/login");
    }
  }, [sessionStatus, router]);

  useEffect(() => {
    const storedShowState = sessionStorage.getItem("downloadPopupState");
    if (storedShowState) {
      setShow(JSON.parse(storedShowState));
    }
  }, []);

  if (sessionStatus === "loading") {
    return <Loading />;
  }

  return (
    sessionStatus === "authenticated" && (
      <div className="overflow-hidden md:overflow-y-auto">
        {!isReactNativeWebView && <DownloadApp show={show} closeModal={closeModal} />}
        <section className="md:pt-20">
          <Slider />
        </section>
        <section className="pt-5 md:pt-20">
          <News />
        </section>
      </div>
    )
  );
};

export default Home
