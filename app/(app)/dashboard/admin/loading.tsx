import { NextPage } from "next"
import Spinner from "@/components/Loader/Spinner"

type Props = {}

const Loading: NextPage = (props: Props) => {
    return (
        <div className="pt-10 md:pt-32 flex flex-col lg:flex-row justify-start lg:justify-center items-center lg:items-start w-full h-screen">
            <Spinner />
        </div>
    )
}

export default Loading
