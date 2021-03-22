import React, { useEffect, useState } from "react";
import { Pixel } from "../interfaces";
import { createImageFromPixels } from "../utils/helpers";
import { Skeleton } from "@chakra-ui/skeleton";
import { Image } from "@chakra-ui/image";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

interface Props {
  disableLightBox?: boolean;
  image: string;
}

const Viewer = ({ disableLightBox = false, image }: Props): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [isImageOpen, setImageOpen] = useState<boolean>(false);

  return (
    <>
      {isLoading ? (
        <Skeleton />
      ) : (
        <Image
          onClick={() => !disableLightBox && setImageOpen(true)}
          src={image}
          objectFit="contain"
          maxH="100%"
          width="auto"
        />
      )}
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
