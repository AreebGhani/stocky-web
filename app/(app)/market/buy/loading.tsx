import { NextPage } from "next"

type Props = {}

const Loading: NextPage = (props: Props) => {
    return (
        <div className="flex min-h-screen flex-col md:items-center md:justify-center md:mt-0 md:p-24">
            <div className="p-8 md:rounded-[4rem] md:shadow-lg md:border-2 md:border-[rgba(40,50,68)] w-96">
                <div className="ml-2 mt-2 md:mt-0">
                    <div className="mt-16 w-10 block"></div>
                </div>
                <h1 className="mt-10 flex justify-center items-center"><span className="loading py-6 w-3/5 rounded-lg"></span></h1>
                <div className="flex justify-between items-start mt-4">
                    <div className="mt-6">
                        <h1 className="mt-2 loading py-3 px-20 rounded-lg"></h1>
                        <div className="flex justify-center items-center ml-2 mt-2">
                            <p className="ml-1 loading py-1 w-2/3"></p>
                        </div>
                    </div>
                    <div className="w-[100px] h-[131px] loading rounded-3xl" />
                </div>
                <div className="mt-6 md:mt-4">
                    <h2 className="mt-2 loading py-2 w-3/5 loading rounded-lg"></h2>
                    <div className="flex justify-around items-center mt-6">
                        <div className="loading w-[117px] h-[49px] flex justify-center items-center rounded-[2px]"></div>
                        <div className="loading w-[117px] h-[49px] flex justify-center items-center rounded-[2px]"></div>
                    </div>
                </div>
                <div className="my-6 -ml-8 md:ml-0 w-[560px] md:w-full h-[1px] bg-[rgba(255,255,255,0.33)]" />
                <div className="pt-6 w-[310px] h-[166px] rounded-[5px] bg-[rgba(0,0,0,0.18)]">
                    <div className="ml-4 py-3 w-3/5 loading"></div>
                    <div className="mt-6 ml-4 py-3 w-2/3 loading"></div>
                    <div className="mt-6 ml-4 py-3 w-1/2 loading"></div>
                </div>
                <div className="mt-8 md:mt-6 mb-12 flex justify-center items-center"><span className="loading py-6 w-2/5 rounded-lg"></span></div>
            </div>
        </div>
    )
}

export default Loading
