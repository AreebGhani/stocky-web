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
                <div className="mt-12 mx-4">
                    <div className="flex justify-start items-center">
                        <div className="w-[41px] h-[40px] loading rounded-full" />
                        <div className="ml-4">
                            <h4 className="loading py-2 w-1/2 rounded-lg mb-2"></h4>
                            <p className="loading py-2 px-16 rounded-md"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default loading
