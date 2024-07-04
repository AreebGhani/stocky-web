import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LinkPath } from '@/types/types';
import Loading from '@/components/NavBar/Loading';
import { useAuth } from '@/contexts/authContext';

type Props = {
    toggleMenu: () => void,
    showModal: () => void,
}

const PublicNavLinks: LinkPath[] = [
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" }
];
export const ProtectedNavLinks: LinkPath[] = [
    { name: "Home", path: "/home", icon: "/svg/home.svg", width: 22, height: 24 },
    { name: "Market", path: "/market", icon: "/svg/market.svg", width: 28, height: 26 },
    { name: "Dashboard", path: "/dashboard", icon: "/svg/dashboard.svg", width: 27, height: 23 },
    { name: "Account", path: "/account", icon: "/svg/account.svg", width: 25, height: 26 }
];

const NavLinks = ({ toggleMenu, showModal }: Props) => {
    const { sessionStatus, session } = useAuth();
    const pathname = usePathname();

    if (sessionStatus === "loading") {
        return <Loading />;
    }

    return (
        <>
            {sessionStatus !== "authenticated" ? (
                <>
                    {PublicNavLinks.map((link: LinkPath, i: number) => (
                        <Link key={i} href={link.path}>
                            <button className={`${pathname.startsWith(link.path) && 'active'} text-[#fff]`} onClick={toggleMenu}>
                                {link.name}
                            </button>
                        </Link>
                    ))}
                </>
            ) : (
                <>
                    {ProtectedNavLinks.map((link: LinkPath, i: number) => (
                        <Link key={i} href={link.path}>
                            <button className={`${pathname.startsWith(link.path) && 'active'} text-[#fff]`} onClick={toggleMenu}>
                                {link.name}
                            </button>
                        </Link>
                    ))}
                    <span>
                        <button className="text-[#fff]" onClick={showModal}>
                            Logout
                        </button>
                    </span>
                </>
            )
            }
        </>
    );
}

export default NavLinks
