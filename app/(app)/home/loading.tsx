import { NextPage } from "next"

type Props = {}

const Loading: NextPage = (props: Props) => {
    return (
        <>
            <div className="md:pt-20">
                <div className="my-10">
                    <div className="flex items-center justify-center rounded-[5px]">
                        <div className="loading rounded-[5px] md:rounded-[15px] w-[362px] md:w-[1156px] h-[176px] md:h-[504px]" />
                    </div>
                </div>
            </div>
            <div className="pt-5 md:pt-20">
                <div className="px-0 md:px-10">
                    <h1 className="loading w-20 py-4 mb-2 ml-4 md:ml-2 rounded-lg"></h1>
                    <div className="bg-[#469BFF] h-[3px] w-full"></div>
                    <div className="h-[420px] md:h-full my-6 overflow-y-scroll overflow-x-hidden news-scroll">
                        {Array(5).fill('').map((_, i: number) => (
                            <div key={i} className={`${i === 2 ? 'mb-20' : 'mb-4'} h-[100px] rounded-[10px] mx-2 bg-[rgba(7,7,7,0.16)] flex justify-start items-center`}>
                                <div className="loading rounded-[10px] ml-2 my-1 w-[105px] h-[80px]"></div>
                                <div className="ml-2 w-2/3 md:w-full p-2">
                                    <h1 className="loading py-3 mb-4 w-1/3"></h1>
                                    <p className="loading w-full py-2 mb-1"></p>
                                    <p className="loading w-1/2 py-2"></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Loading
