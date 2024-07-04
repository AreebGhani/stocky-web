import { NextPage } from "next"

type Props = {}

const Loading: NextPage = (props: Props) => {
    return (
        <>
            <div className="pt-10 md:pt-32">
                <div className="flex flex-col items-center justify-center">
                    <span className="loading rounded-3xl py-12 md:py-16 w-2/3 md:w-1/4"></span>
                </div>
                <div className="pt-5 md:pt-10">
                    <div className="px-0 md:px-10">
                        <h1 className="loading w-64 py-4 mb-2 ml-4 md:ml-2 rounded-lg"></h1>
                        <div className="bg-[#469BFF] h-[3px] w-full" />
                        <div className="mx-6 md:mx-2">
                            <div className="mt-5 mb-10 md:my-10 flex justify-around items-center">
                                {Array(3).fill('').map((_, i: number) => (
                                    <div key={i} className="relative mb-4 md:mb-6">
                                        <div className="loading img-shadow rounded-[10px] md:rounded-[20px] w-[100px] md:w-[100px] h-[100px] md:h-[100px]" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-10 md:pt-10">
                    <div className="px-0 md:px-10">
                        <h1 className="loading w-44 py-4 mb-2 ml-4 md:ml-2 rounded-lg"></h1>
                        <div className="bg-[#469BFF] h-[3px] w-full" />
                        <div className="h-[420px] md:h-full my-6 overflow-y-scroll overflow-x-hidden news-scroll">
                            {Array(5).fill('').map((_, i: number) => (
                                <div key={i} className={`${i === 2 ? 'mb-12' : 'mb-4'} rounded-[10px] bg-[rgba(7,7,7,0.16)] flex justify-start items-center stockDaily-shadow`}>
                                    <div className="loading rounded-[10px] ml-2 my-1 w-[105px] h-[100px] news-img"></div>
                                    <div className="flex justify-between items-center ml-2 w-2/3 md:w-full p-2">
                                        <div className="w-1/2 lg:w-5/6">
                                            <h1 className="loading py-3 mb-4 w-1/3"></h1>
                                            <p className="loading w-2/3 py-2 mb-1"></p>
                                            <p className="loading w-1/2 py-2"></p>
                                        </div>
                                        <p className="loading mx-4 py-1 px-3"></p>
                                        <div className="mr-0 md:mr-4">
                                            <div className="loading px-8 py-4 flex justify-center items-center rounded-[8px] buyBtn-shadow"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Loading
