type Props = {}

const Spinner = (props: Props) =>
    <div className="flex justify-center items-center">
        <div className="w-16 h-16 border-t-4 border-pink-400 rounded-full animate-spin"></div>
    </div>;

export default Spinner
