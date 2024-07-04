import { NextPage } from "next"

type Props = {}

const loading: NextPage = (props: Props) => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-start md:justify-center mt-8 md:mt-0 md:p-24">
            <div className="px-4 md:p-8 md:rounded-[4rem] md:shadow-lg md:border-2 md:border-[rgba(40,50,68)] w-full md:w-96">
                <div className="ml-2 mt-2 md:mt-0">
                    <div className="w-10 block">
                        <div className="w-[49px] h-[49px]" />
                    </div>
                </div>
                <h1 className="my-8 flex justify-center items-center">
                    <span className="loading py-3 w-3/5 rounded-lg"></span>
                </h1>
                <div className="h-[600px] md:h-full overflow-y-auto overflow-x-hidden custom-scroll">
                    {Array(6).fill('').map((_, i: number) => (
                        <div key={i} className="flex justify-start items-center rounded-[10px] bg-[rgba(7,7,7,0.16)] stockDaily-shadow my-3 md:my-4 p-1">
                            <div className="w-[50px] md:w-[60px] h-[38px] md:h-[45px] p-1 loading rounded-md ml-1" />
                            <div className="flex justify-between items-center mx-4 w-full">
                                <div className="my-1">
                                    <div className="w-[20vw] md:w-[6vw] py-[6px] md:py-2 rounded-md loading"></div>
                                    <div className="w-[24vw] md:w-[8vw] py-1 md:py-[6px] rounded-md loading mt-1"></div>
                                </div>
                                <div className="rounded-[5px] px-8 py-2 md:py-[10px] loading" />
                            </div>
                        </div>
                    ))}
                    <div className="my-56 block md:hidden"></div>
                </div>
            </div>
        </div>
    )
}

export default loading
