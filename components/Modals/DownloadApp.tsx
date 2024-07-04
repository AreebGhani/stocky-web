import { useState } from "react";
import Image from "next/image";

type Props = {
    show: boolean;
    closeModal: () => void;
}

const DownloadApp = ({ show, closeModal }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const download = () => {
        setIsLoading(true);
        window.location.href = "/downloads/app/Stocky.apk";
        closeModal();
        sessionStorage.setItem("downloadPopupState", JSON.stringify(false));
    }

    return (
        <div className={`${show ? 'block' : 'hidden'}`}>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                <div className={`relative px-20 py-12 max-w-md mx-auto rounded-[10px] shadow-lg border border-[#fff] logout-modal ${isLoading ? 'cursor-not-allowed loading' : ''}`}>
                    <button
                        className={`absolute top-6 right-6 ${isLoading ? 'cursor-not-allowed animate-pulse' : ''}`}
                        onClick={closeModal}
                        disabled={isLoading}
                    >
                        <Image src="/svg/close.svg" alt="close" width={15} height={15} />
                    </button>
                    <h2 className="text-[24px] font-bold text-[#fff] mb-4 text-center">Unlock a World of Possibilities with Stocky!</h2>
                    <p className="text-[16px] text-[#fff] mb-6 text-center">Elevate your investment journey – Download the Stocky app today for a seamless and empowering experience.</p>
                    <div className="flex justify-center items-center">
                        <button
                            className={`bg-[#3589EC] text-[#fff] text-[16px] font-semibold px-8 py-2 rounded-[20px] ${isLoading ? 'cursor-not-allowed animate-pulse' : ''}`}
                            onClick={download}
                            disabled={isLoading}
                        >
                            Download Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DownloadApp;
