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
                <div className="mt-[44px] mx-4">
                    <div className="overflow-hidden">
                        <div className='mb-4'>
                            <div className="loading py-[10px] w-36 rounded-md"></div>
                            <div className='mt-2 loading py-[18px] rounded-md'></div>
                        </div>
                        <div className='mb-4'>
                            <div className="loading py-[10px] w-36 rounded-md"></div>
                            <div className='mt-2 loading py-[18px] rounded-md'></div>
                        </div>
                        <div className='mb-4'>
                            <div className="loading py-[10px] w-32 rounded-md"></div>
                            <div className='mt-2 loading py-[18px] rounded-md'></div>
                        </div>
                        <div className="flex justify-center items-center mt-8">
                            <button className="w-1/3 loading py-6 rounded-lg"></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default loading
