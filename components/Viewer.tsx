import React, { useState } from "react";
import { Image } from "@chakra-ui/image";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

type Direction = "height" | "width";

interface Props {
  disableLightBox?: boolean;
  image: string;
  direction?: Direction;
  className?: string;
}

const Viewer = ({
  disableLightBox = false,
  image,
  direction = "height",
  className,
}: Props): JSX.Element => {
  const [isImageOpen, setImageOpen] = useState<boolean>(false);
  return (
    <>
      <Image
        className={className}
        onClick={() => !disableLightBox && setImageOpen(true)}
        src={image}
        objectFit="contain"
        height={direction === "height" ? "100%" : "auto"}
        width={direction === "width" ? "100%" : "auto"}
        borderRadius="3px"
        cursor={disableLightBox ? "" : "pointer"}
      />
      {isImageOpen && (
        <Lightbox
          mainSrc={image}
          onCloseRequest={() => setImageOpen(false)}
          enableZoom={false}
        />
      )}
    </>
  );
};

export default Viewer;
