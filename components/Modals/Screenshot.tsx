import Image from '@/utils/Image';

type Props = {
    imageUrl: string;
    onClose: () => void;
}

const Screenshot = ({ imageUrl, onClose }: Props) => {
    return (
        <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-black p-2 max-h-screen overflow-auto custom-scroll">
                <Image src={imageUrl} alt={imageUrl} width={600} height={900} className="max-w-full max-h-full rounded-lg" />
                <button onClick={onClose} className="absolute p-2 rounded-2xl top-6 right-6 mr-2 mt-2 bg-black cursor-pointer">
                    <Image src='/svg/close.svg' alt='close' width={26} height={26} />
                </button>
            </div>
        </div>
    );
};

export default Screenshot;
