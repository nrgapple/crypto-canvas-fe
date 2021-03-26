import { useAsync } from "react-use";
import { bufferToHex } from "../utils/helpers";

export const useImageBuffer = (dartId: number) => {
  const buffer = useAsync(async () => {
    const resp = await fetch(`api/darts/buffer/${dartId}`);
    const array = (await resp.body?.getReader().read())!.value;

    return array;
  }, [dartId]);

  return buffer.value;
};

export const useImageString = (dartId: number) => {
  const buffer = useImageBuffer(dartId);
  console.log(buffer);
  return buffer ? bufferToHex(Buffer.from(buffer)) : "";
};
