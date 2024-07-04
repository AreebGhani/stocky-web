import { NextPage } from "next"

type Props = {}

const Loading: NextPage = (props: Props) => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center md:mt-0 md:p-24">
            <div className="p-8 md:rounded-[4rem] md:shadow-lg md:border-2 md:border-[rgba(40,50,68)] w-96">
                <div className="flex flex-row items-center justify-center">
                    <div className="loading py-6 rounded-3xl w-1/2"></div>
                </div>
                <div className="mt-8 mb-20 md:mb-12 flex flex-col items-center justify-center">
                    <div className='mb-2 loading py-3 rounded-md w-2/3'></div>
                    <div className='loading py-2 rounded-md w-2/3'></div>
                </div>
                <div className="mb-6 flex flex-row items-center">
                    <span className="mr-2 loading py-3 rounded-md w-16"></span>
                    <span className="ml-2 loading py-3 rounded-md w-16"></span>
                </div>
                <div className="mb-4 loading py-5 rounded-md"></div>
                <div className="mt-2 loading py-6 rounded-md"></div>
                <div className="flex flex-row items-center justify-center">
                    <div className="mt-7 mb-8 loading py-2 rounded-md w-44"></div>
                </div>
            </div>
        </div>
    )
}

export default Loading