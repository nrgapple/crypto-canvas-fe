import { useAsync } from "react-use";
import { bufferToHex } from "../utils/helpers";

export const useImageBuffer = (dartId?: number) => {
  const buffer = useAsync(async () => {
    if (!dartId) return undefined;
    const resp = await fetch(`/api/darts/buffer/${dartId}`);
    const array = (await resp.body?.getReader().read())!.value;
    return array;
  }, [dartId]);

  return buffer.value;
};

export const useImageString = (dartId?: number) => {
  const buffer = useImageBuffer(dartId);
  return buffer ? bufferToHex(Buffer.from(buffer.reverse())) : "";
};

export const useImageDataSVG = (dartId?: number) => {
  const buffer = useImageBuffer(dartId);
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><text x="5%" y="5%" font-size="30" fill="red">${
    buffer ? bufferToHex(Buffer.from(buffer.reverse())) : ""
  }</text></svg>`;
};
