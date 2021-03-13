import React, { useEffect, useState } from "react";
import { Pixel } from "../interfaces";
import { createImageFromPixels } from "../utils/helpers";
import { Skeleton } from "@chakra-ui/skeleton";
import { Image } from "@chakra-ui/image";

interface Props {
  pixels: Pixel[];
}

const Viewer = ({ pixels }: Props): JSX.Element => {
  const [isloading, setIsLoading] = useState(false);
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
  return <>{isloading ? <Skeleton /> : <Image src={imageUri} />}</>;
};

export default Viewer;
