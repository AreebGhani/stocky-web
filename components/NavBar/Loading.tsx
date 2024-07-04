
type Props = {}

const Loading = (props: Props) => {
    return (
        <>
            {Array(5).fill('').map((_, i: number) => <div key={i} className="loading rounded-lg py-3 px-8"></div>)}
        </>
    )
}

export default Loading
