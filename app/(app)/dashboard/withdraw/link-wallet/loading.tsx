import { NextPage } from "next"

type Props = {}

const Loading: NextPage = (props: Props) => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-start md:justify-center mt-8 md:mt-0 md:p-24">
            <div className="px-4 md:p-8 md:rounded-[4rem] md:shadow-lg md:border-2 md:border-[rgba(40,50,68)] w-full md:w-96">
                <div className="ml-2 mt-2 md:mt-0">
                    <div className="w-10 block">
                        <div className="w-[49px] h-[49px]" />
                    </div>
                </div>
                <h1 className="my-8 flex justify-center items-center">
                    <span className="loading py-5 w-2/3 rounded-lg"></span>
                </h1>
                <div className="mt-8">
                    <div className='mb-8'>
                        <div className="loading py-[10px] w-44 rounded-md"></div>
                        <div className='mt-2 loading py-[18px] rounded-md'></div>
                    </div>
                    <div className='mb-8'>
                        <div className="loading py-[10px] w-24 rounded-md"></div>
                        <div className='mt-3 loading w-[62px] h-[40px] rounded-[15px]'></div>
                    </div>
                    <div className='mb-4'>
                        <div className="loading py-[10px] w-32 rounded-md"></div>
                        <div className='mt-2 loading py-[18px] rounded-md'></div>
                    </div>
                    <div className="loading w-full py-6 mt-16 rounded-xl"></div>
                </div>
            </div>
        </div>
    )
}

export default Loading
