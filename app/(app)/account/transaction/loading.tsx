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
                    {Array(10).fill('').map((_, i: number) => (
                        <div key={i} className="pt-4 flex flex-col justify-center items-center">
                            <div className="flex justify-between items-center w-full">
                                <h3 className="loading px-12 py-2 rounded-lg mb-2"></h3>
                                <p className="loading px-4 py-2 rounded-lg"></p>
                            </div>
                            <div className="flex justify-between items-center w-full">
                                <h4 className="loading px-16 rounded-md py-2 mb-2"></h4>
                                <h4 className="loading px-10 rounded-md py-2"></h4>
                            </div>
                            <div className="w-full h-[2px] bg-[rgba(255,255,255,0.40)]" />
                        </div>
                    ))}
                    <div className="my-56 block md:hidden"></div>
                </div>
            </div>
        </div>
    )
}

export default loading
