import React from 'react';

type Props = {
  content: string;
}

const AutoFontSize: React.FC<Props> = ({ content }: Props) => {
  const determineFontSize = (contentLength: number): string => {
    if (contentLength < 10) {
      return 'text-[16px]';
    } else if (contentLength < 20) {
      return 'text-[14px]';
    } else if (contentLength < 30) {
      return 'text-[12px]';
    } else {
      return 'text-[9px]';
    }
  };

  const fontSizeClass = determineFontSize(content.length);

  return (
    <div className="overflow-hidden">
      <span className={`${fontSizeClass} inline-block truncate max-w-[7rem]`}>
        {content}
      </span>
    </div>
  );
};

export default AutoFontSize;
