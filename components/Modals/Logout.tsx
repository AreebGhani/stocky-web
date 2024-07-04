import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";

type Props = {
    show: boolean;
    closeModal: () => void;
}

const Logout = ({ show, closeModal }: Props) => {
    const { deleteSession } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const logOut = async () => {
        setIsLoading(true);
        deleteSession();
        router.replace('/login');
        setTimeout(() => {
            setIsLoading(false);
            closeModal()
        }, 2000);
    }

    return (
        <div className={`${show ? 'block' : 'hidden'}`}>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                <div className={`px-20 py-12 max-w-md mx-auto rounded-[10px] shadow-lg border border-[#fff] logout-modal ${isLoading ? 'cursor-not-allowed loading' : ''}`}>
                    <h2 className="text-[16px] text-[#fff] font-normal mb-6 text-center">Are you sure you want <br /> logout?</h2>
                    <div className="flex justify-center items-center">
                        <button
                            className={`bg-[#3589EC] text-[#fff] text-[16px] font-normal px-4 py-1 rounded-[4px] mr-8 ${isLoading ? 'cursor-not-allowed animate-pulse' : ''}`}
                            onClick={logOut}
                            disabled={isLoading}
                        >
                            Yes
                        </button>
                        <button
                            className={`bg-[#3589EC] text-[#fff] text-[16px] font-normal px-4 py-1 rounded-[4px] ${isLoading ? 'cursor-not-allowed animate-pulse' : ''}`}
                            onClick={closeModal}
                            disabled={isLoading}
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Logout
