import { NextPage } from "next"

type Props = {}

const Loading: NextPage = (props: Props) => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center md:mt-0 md:p-24">
            <div className="p-8 md:rounded-[4rem] md:shadow-lg md:border-2 md:border-[rgba(40,50,68)] w-96">
                <div className="mt-12 md:mt-8 loading py-4 rounded-md w-1/2"></div>
                <div className='mt-7 mb-2 loading py-3 rounded-md'></div>
                <div className='loading py-2 rounded-md'></div>
                <div className="mt-7 mb-4 flex flex-row items-center justify-around">
                    <div className='loading py-5 rounded-md w-10'></div>
                    <div className='loading py-5 rounded-md w-10'></div>
                    <div className='loading py-5 rounded-md w-10'></div>
                    <div className='loading py-5 rounded-md w-10'></div>
                    <div className='loading py-5 rounded-md w-10'></div>
                    <div className='loading py-5 rounded-md w-10'></div>
                </div>
                <div className="mt-6 loading py-6 rounded-md"></div>
                <div className="mt-12 md:mt-8 mb-28 flex flex-col items-center justify-center">
                    <div className="mb-1 loading py-2 rounded-md w-56"></div>
                    <div className="mt-1 loading py-2 rounded-md w-56"></div>
                </div>
            </div>
        </div>
    )
}

export default Loading
