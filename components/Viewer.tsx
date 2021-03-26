import React, { useState } from "react";
import { Image } from "@chakra-ui/image";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

interface Props {
  disableLightBox?: boolean;
  image: string;
}

const Viewer = ({ disableLightBox = false, image }: Props): JSX.Element => {
  const [isImageOpen, setImageOpen] = useState<boolean>(false);
  return (
    <>
      <Image
        onClick={() => !disableLightBox && setImageOpen(true)}
        src={image}
        objectFit="contain"
        height="100%"
        width="100%"
        borderRadius="3px"
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
