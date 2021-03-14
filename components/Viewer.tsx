import React, { useEffect, useState } from "react";
import { Pixel } from "../interfaces";
import { createImageFromPixels } from "../utils/helpers";
import { Skeleton } from "@chakra-ui/skeleton";
import { Image } from "@chakra-ui/image";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';


interface Props {
  pixels: Pixel[];
}

const Viewer = ({ pixels }: Props): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [isImageOpen, setImageOpen] = useState<boolean>(false)
  const [imageUri, setImageUri] = useState<string>("");
  const getImage = async () => {
    setIsLoading(true);
    const newImageUri = (await createImageFromPixels(pixels)) as string;
    setImageUri(newImageUri!);
    setIsLoading(false);
  };

  useEffect(() => {
    if (pixels.length > 0) {
      getImage();
    }
  }, [pixels]);
  return (
    <>
      {isLoading ? <Skeleton /> : <Image onClick={() => setImageOpen(true)} src={imageUri} />}
      {isImageOpen 
        && <Lightbox 
              mainSrc={imageUri} 
              onCloseRequest={() => setImageOpen(false)} 
              enableZoom={false}
        />}
    </>
  );
};

export default Viewer;
