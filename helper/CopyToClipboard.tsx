import Image from 'next/image';
import React, { useState } from 'react';

type Props = {
    textToCopy: string;
    iconBlack: boolean;
}

const CopyToClipboardButton: React.FC<Props> = ({ textToCopy, iconBlack }: Props) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyClick = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }).catch((err) => {
            console.error('Unable to copy to clipboard', err);
        });
    };

    return (
        <>
            <button onClick={handleCopyClick} >
                {isCopied ?
                    <>{iconBlack ?
                        <Image className='w-5 h-5' src={'/svg/done-black.svg'} alt='copy' width={800} height={800} />
                        : <Image className='w-5 h-5' src={'/svg/done.svg'} alt='copy' width={800} height={800} />
                    }</>
                    :
                    <>{iconBlack ?
                        <Image className='w-5 h-5' src={'/svg/copy-black.svg'} alt='done' width={800} height={800} />
                        : <Image className='w-5 h-5' src={'/svg/copy.svg'} alt='done' width={800} height={800} />
                    }</>
                }
            </button>
        </>
    );
};

export default CopyToClipboardButton;
