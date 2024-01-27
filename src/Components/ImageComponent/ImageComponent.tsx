import { LazyLoadImage } from "react-lazy-load-image-component";

/* eslint-disable @typescript-eslint/no-explicit-any */
const ImageComponent = ({ src }: any) => {
  return (
    <LazyLoadImage
      key={src}
      src={src}
      effect="black-and-white"
      className="w-full object-contain h-[100px]"
      // width="50%"
      // height="100px"
      placeholderSrc="https://cimex.cl/wp-content/themes/cimex/assets/img/placeholder/full.png"
    ></LazyLoadImage>
  );
};

export default ImageComponent;
