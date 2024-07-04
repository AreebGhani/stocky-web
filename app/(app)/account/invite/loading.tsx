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
                <h1 className="my-14 flex justify-center items-center">
                    <span className="loading py-4 w-3/5 rounded-lg"></span>
                </h1>
                <div className="flex flex-col justify-center items-center">
                    <div className="w-fit h-fit rounded-[25px] p-0 m-0 loading">
                        <div className="h-[134px] w-[266px] p-0 m-0 flex flex-col justify-center items-center"></div>
                    </div>
                    <div className="mt-14" />
                    {Array(4).fill('').map(((_, i: number) => (
                        <div key={i} className="ml-8 md:ml-0 w-full flex justify-start items-center mt-4">
                            <div className="rounded-full loading w-[24px] h-[22px]" />
                            <p className="ml-4 loading px-32 py-2 rounded-md"></p>
                        </div>
                    )))}
                    <div className="my-4" />
                </div>
            </div>
        </div>
    )
}

export default loading
