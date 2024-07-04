import { NextPage } from "next"

type Props = {}

const Loading: NextPage = (props: Props) => {
    return (
        <div className="pt-14 md:pt-32 flex flex-col lg:flex-row justify-start lg:justify-center items-center lg:items-start w-full h-screen">
            <div className="px-4 md:px-0 w-full md:w-[330px] mr-0 md:mr-10">
                <div className="flex justify-between items-center px-4 md:px-0 w-full">
                    <div className="flex justify-center items-center">
                        <div className="w-[50px] h-[50px] rounded-full border-2 border-[#FF21CE] loading" />
                        <div className="flex flex-col justify-center items-start ml-4">
                            <p className="loading py-1 w-16 mb-2 rounded-sm"></p>
                            <h4 className="loading py-2 w-24 rounded-lg"></h4>
                        </div>
                    </div>
                    <div className="w-[20.942px] h-[20.942px] loading rounded-2xl" />
                </div>
                <div className="mt-6 flex flex-col justify-center items-center">
                    <div className="w-full rounded-[2px] dashboard-balance loading h-[195px]"></div>
                    <div className="w-full flex justify-between items-center">
                        <div className="w-[128px] h-[55px] rounded-[2px] dashboard-button loading"></div>
                        <div className="w-[128px] h-[55px] rounded-[2px] dashboard-button loading"></div>
                    </div>
                </div>
            </div>
            <div className="w-full lg:w-3/5 pt-5 md:pt-10 lg:pt-0">
                <div className="px-0 md:px-10">
                    <h1 className="text-[24px] font-bold ml-6 md:ml-2 loading w-28 py-4 rounded-lg mb-2"></h1>
                    <div className="bg-[#469BFF] h-[3px] w-full" />
                    <div className="team -mt-1 h-[370px] w-full loading"></div>
                </div>
            </div>
        </div>
    )
}

export default Loading
