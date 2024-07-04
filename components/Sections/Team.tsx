import { Referral } from "@/types/types";
import { useEffect, useState } from "react";

type ActiveLevels = {
    levelName: string,
    active: boolean,
}

const initialActiveLevels: ActiveLevels[] = [
    { levelName: "level1", active: true },
    { levelName: "level2", active: false },
    { levelName: "level3", active: false },
];

type Props = {
    levelOne: Referral[];
    levelTwo: Referral[];
    levelThree: Referral[];
    loading: boolean;
}

const Team = ({ levelOne, levelTwo, levelThree, loading }: Props) => {
    const [activeLevels, setActiveLevels] = useState<ActiveLevels[]>(initialActiveLevels);
    const [levelData, setLevelData] = useState<Referral[]>(levelOne);

    useEffect(() => {
        setLevelData(levelOne);
    }, [levelOne]);

    const changeLevel = (level: string) => {
        const updatedActiveLevels = initialActiveLevels.map((item) => ({
            ...item,
            active: item.levelName === level,
        }));
        setActiveLevels(updatedActiveLevels);
        if (level === "level1") {
            setLevelData(levelOne);
        } else if (level === "level2") {
            setLevelData(levelTwo);
        } else if (level === "level3") {
            setLevelData(levelThree);
        }
    };

    const maskEmailAndPhone = (input: string) => {
        if (input.includes('@')) {
            const [username, domain] = input.split('@');
            const maskedUsername = username.substring(0, 3) + '*'.repeat((username.length >= 10 ? 10 : 4));
            return `${maskedUsername}@${domain}`;
        } else {
            const maskedPhone = '*'.repeat(input.length - 4) + input.substring(input.length - 4);
            return maskedPhone;
        }
    };

    return (
        <div className="w-full lg:w-3/5 pt-5 md:pt-10 lg:pt-0">
            <div className="px-0 md:px-10">
                <h1 className="text-[#fff] text-[24px] font-bold ml-6 md:ml-2">Team</h1>
                <div className="bg-[#469BFF] h-[3px] w-full" />
                <div className="team -mt-1">
                    <div className="flex justify-around items-center border-b-2 border-b-black">
                        <div className={`w-[90px] h-[36px] pl-1 pb-2 flex justify-center items-center ${activeLevels[0].active ? 'active-level' : ''}`}>
                            <h4 onClick={() => changeLevel('level1')} className="cursor-pointer text-[#fff] text-[14px] font-bold text-shadow">Level 1</h4>
                        </div>
                        <div className={`w-[90px] h-[36px] pl-1 pb-2 flex justify-center items-center ${activeLevels[1].active ? 'active-level' : ''}`}>
                            <h4 onClick={() => changeLevel('level2')} className="cursor-pointer text-[#fff] text-[14px] font-bold text-shadow">Level 2</h4>
                        </div>
                        <div className={`w-[90px] h-[36px] pl-1 pb-2 flex justify-center items-center ${activeLevels[2].active ? 'active-level' : ''}`}>
                            <h4 onClick={() => changeLevel('level3')} className="cursor-pointer text-[#fff] text-[14px] font-bold text-shadow">Level 3</h4>
                        </div>
                    </div>
                    <div className="table-container h-[370px] md:h-full overflow-y-auto custom-scroll">
                        <table className="text-[#fff] text-center w-full border-b border-b-black">
                            <thead className="text-[12px] font-semibold border-b border-b-black">
                                <tr>
                                    <th className="border-r border-r-black p-1">Sr#</th>
                                    <th className="border-r border-r-black p-1">Username</th>
                                    <th className="border-r border-r-black p-1">Account</th>
                                    <th className="p-1">Balance</th>
                                </tr>
                            </thead>
                            <tbody className="text-[11px] font-normal">
                                {loading ? <tr className="h-[370px] w-full loading-team"></tr>
                                    : levelData.map((data: Referral, i: number) => (
                                        <tr key={i}>
                                            <td className="border-r border-r-black py-2">{(i + 1)}</td>
                                            <td className="border-r border-r-black py-2">{data.username}</td>
                                            <td className="border-r border-r-black py-2">{data.email === 'null' ? maskEmailAndPhone(data.phone) : maskEmailAndPhone(data.email)}</td>
                                            <td className="py-2">{data.balance.toFixed(2)} <i className="text-[8px]">USDT</i></td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        <div className="my-56 block md:hidden"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Team
