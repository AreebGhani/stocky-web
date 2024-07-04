import NextImage, { ImageProps, ImageLoaderProps } from "next/image";

const customLoader = ({ src }: ImageLoaderProps): string => {
  return src;
};

const Image: React.FC<ImageProps> = (props: ImageProps) => {
  return (
    <NextImage
      {...props}
      loader={customLoader}
    />
  );
};

export default Image;
