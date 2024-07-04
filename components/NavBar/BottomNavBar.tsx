import Image from "@/utils/Image"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProtectedNavLinks } from "@/components/NavBar/NavLinks";
import { LinkPath } from "@/types/types";
import { useAuth } from "@/contexts/authContext";

type Props = {}

const BottomNavBar = (props: Props) => {
    const { sessionStatus } = useAuth();
    const pathname = usePathname();

    return (
        <>
            {sessionStatus === 'authenticated' && !pathname.startsWith("/market/buy") && !pathname.startsWith("/account/transaction") && !pathname.startsWith("/account/password") && !pathname.startsWith("/account/contact") && !pathname.startsWith("/account/invite") && !pathname.startsWith("/dashboard/deposit") && !pathname.startsWith("/dashboard/withdraw") &&
                <nav className="block md:hidden shadow-lg fixed bottom-0 z-10 w-full rounded-[8px] bg-[rgba(51,56,62,0.96)]">
                    <div className="flex justify-around items-center py-1 bottom-nav">
                        {ProtectedNavLinks.map((link: LinkPath, i: number) => (
                            <Link href={link.path} key={i} className="flex flex-col items-center justify-center link">
                                <div className={`flex flex-col items-center justify-center ${pathname.startsWith(link.path) && 'shadow'}`}>
                                    {link.icon && link.width && link.height &&
                                        <Image className="w-[6] h-[6]" src={link.icon} alt={link.name} width={link.width} height={link.height} />}
                                </div>
                                <span className={`text-[#fff] text-[9px] font-semibold ${pathname.startsWith(link.path) && 'active-link -mt-2'}`}>{link.name}</span>
                            </Link>
                        ))}
                    </div>
                </nav>}
        </>
    )
}

export default BottomNavBar
