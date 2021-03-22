import { config } from "../app.config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import PixelToken from "../contracts/DARToken.json";
import {
  checkEmptyAddress,
  contractExhibitsRespToPixels,
  increaseResolution,
} from "../utils/helpers";
import {
  AllBidsResponse,
  Bid,
  Dart,
  DartRaw,
  DartRawResp,
  Dimensions,
  DimensionsResp,
} from "../interfaces";
import jpeg from "jpeg-js";
import { PNG } from "pngjs";
import DataURIParser from "datauri/parser";
import sharp from "sharp";

export const getServerContract = () => {
  const provider = new Web3.providers.HttpProvider(config.infuraProviderUri);
  const web3 = new Web3(provider);
  return {
    contract: new web3.eth.Contract(
      PixelToken.abi as AbiItem[] | AbiItem,
      config.contractAddress
    ),
    web3,
  } as const;
};

/**
 * https://www.npmjs.com/package/jpeg-js
 * I don't think this one works.
 */
export const getDartJpeg = async (
  dartRaw: DartRawResp,
  resolution: number = 10
) => {
  const {
    dimensions: { width, height },
    rgbaArray: data,
  } = dartRaw;
  const expandedWidth = parseInt(width) * resolution;
  const expandedHeight = parseInt(height) * resolution;
  const expandedData = increaseResolution(data, resolution);
  const rawImageData = {
    data: expandedData,
    width: expandedWidth,
    height: expandedHeight,
  } as jpeg.RawImageData<jpeg.BufferLike>;
  const jpegImageData = jpeg.encode(rawImageData, 50);
  return jpegImageData.data.toString();
};

/**
 * https://github.com/lukeapage/pngjs
 * a * b = c
 * a * b = c * 100
 */
export const getDartPng = async (
  rgbaArray: string[],
  dimensions: DimensionsResp,
  resolution: number = 10
) => {
  const height = parseInt(dimensions.height);
  const width = parseInt(dimensions.width);

  //const expandedData = increaseResolution(rgbaArray, resolution);
  //console.log("exp data", expandedData);
  const image = new PNG();
  image.width = width;
  image.height = height;
  image.data = Buffer.from(increaseResolution(rgbaArray, 1));
  console.log("data before", image.data);
  const buffer = PNG.sync.write(image, { colorType: 6 });
  const resized = await sharp(buffer)
    .resize(width * resolution, height * resolution, {
      kernel: sharp.kernel.nearest,
      fit: "contain",
      position: "right top",
    })
    .toBuffer();
  const parser = new DataURIParser();
  const dartDataUri = parser.format(".png", resized);
  return dartDataUri.content;
};

export const getDartMetaData = async (dartRaw: DartRawResp, web3: Web3) => {
  return {
    image: await getDartPng(dartRaw.rgbaArray, dartRaw.dimensions, 100),
    owner: dartRaw.owner,
    dartId: parseInt(dartRaw.dartId),
    name: checkEmptyAddress(dartRaw.name)
      ? "No Name"
      : web3.utils.toAscii(dartRaw.name),
  } as Dart;
};

export const getAllDarts = async (): Promise<Dart[]> => {
  const { contract, web3 } = getServerContract();
  const dartResp = (await contract.methods.getDarts().call()) as DartRawResp[];
  return await Promise.all(
    dartResp.map(async (d) => await getDartMetaData(d, web3))
  );
};

export const getDart = async (dartId: number) => {
  const { contract, web3 } = getServerContract();
  const dartResp = (await contract.methods
    .getDart(dartId)
    .call()) as DartRawResp;
  console.log(dartResp);
  return await getDartMetaData(dartResp, web3);
};

export const getDartImage = async (
  dartId: number,
  resolution: number
): Promise<string | undefined> => {
  const { contract } = getServerContract();
  const dartResp = (await contract.methods
    .getDart(dartId)
    .call()) as DartRawResp;
  return await getDartPng(dartResp.rgbaArray, dartResp.dimensions, resolution);
};
