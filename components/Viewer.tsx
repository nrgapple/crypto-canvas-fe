import React, { useEffect, useState } from "react";
import { Pixel } from "../interfaces";
import { createImageFromPixels } from "../utils/helpers";
import { Skeleton } from "@chakra-ui/skeleton";
import { Image } from "@chakra-ui/image";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

interface Props {
  pixels?: Pixel[];
  disableLightBox?: boolean;
  image?: string;
}

const Viewer = ({
  pixels,
  disableLightBox = false,
  image,
}: Props): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [isImageOpen, setImageOpen] = useState<boolean>(false);
  const [imageUri, setImageUri] = useState<string>("");
  const getImage = async () => {
    setIsLoading(true);
    const newImageUri = (await createImageFromPixels(pixels!)) as string;
    setImageUri(newImageUri!);
    setIsLoading(false);
  };

  useEffect(() => {
    if (pixels && pixels.length > 0) {
      getImage();
    }
  }, [pixels]);
  return (
    <>
      {isLoading ? (
        <Skeleton />
      ) : (
        <Image
          onClick={() => !disableLightBox && setImageOpen(true)}
          src={image ?? imageUri}
          objectFit="contain"
          maxH="100%"
          width="auto"
        />
      )}
      {isImageOpen && (
        <Lightbox
          mainSrc={imageUri}
          onCloseRequest={() => setImageOpen(false)}
          enableZoom={false}
        />
      )}
    </>
  );
};

export default Viewer;
