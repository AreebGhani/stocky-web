import { NextPage } from "next"

type Props = {}

const loading: NextPage = (props: Props) => {
    return (
        <div className="pt-14 md:pt-32 flex flex-col justify-start items-center w-full h-screen">
            <div className="flex flex-col md:flex-row justify-around items-start md:w-3/4">
                <div className="w-full md:w-auto flex flex-col justify-center items-center">
                    <div className="w-[93px] h-[88px] rounded-full border-2 border-[#FF21CE] loading" />
                    <div className="mt-5 flex flex-col justify-center items-center">
                        <h1 className="loading py-3 w-3/4 mb-4"></h1>
                        <h3 className="loading py-2 px-24"></h3>
                    </div>
                </div>
                <div className="mt-16 md:mt-0">
                    {Array(4).fill('').map((_, i) => <div key={i} className={`loading py-3 px-28 ${i > 0 && 'mt-6'}`}></div>)}
                </div>
            </div>
            <div className="md:hidden absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-3/4">
                <div className="loading py-3 px-14"></div>
            </div>
            <div className="absolute bottom-28 lg:bottom-32 text-center">
                <div className="loading py-2 px-10"></div>
            </div>
        </div>
    )
}

export default loading
