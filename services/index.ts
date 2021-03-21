import { config } from "../app.config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import PixelToken from "../contracts/PixelToken.json";
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

export const getContractPixels = async () => {
  const { contract } = getServerContract();
  const exResp = await contract.methods.getPixels().call();
  const newPixels = contractExhibitsRespToPixels(exResp);
  return newPixels;
};

export const getContractAllBids = async () => {
  const { contract, web3 } = getServerContract();
  const currAllBids = await contract.methods.getAllHighestBids().call();
  return currAllBids
    .map(({ fromAddress: from, amount, exhibitId: exId }: AllBidsResponse) => ({
      from,
      amount: parseFloat(web3.utils.fromWei(amount)),
      exhibitId: parseInt(exId),
    }))
    .filter((b: Bid) => !checkEmptyAddress(b.from as string));
};

export const getContractBidForExhibit = async (exhibitId: number) => {
  const { contract, web3 } = getServerContract();
  const b = await contract.methods.getBid(exhibitId).call();
  return !checkEmptyAddress(b.fromAddress)
    ? ({
        from: b.fromAddress,
        amount: parseFloat(web3.utils.fromWei(b.amount)),
      } as Bid)
    : undefined;
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
 */
export const getDartPng = (
  rgbaArray: string[],
  dimensions: DimensionsResp,
  resolution: number = 10
): string | undefined => {
  const expandedWidth = parseInt(dimensions.width) * resolution;
  const expandedHeight = parseInt(dimensions.height) * resolution;
  const expandedData = increaseResolution(rgbaArray, resolution);
  const image = new PNG();
  image.width = expandedWidth;
  image.height = expandedHeight;
  image.data = Buffer.from(expandedData);
  image.pack();
  const parser = new DataURIParser();
  const dartDataUri = parser.format(".png", PNG.sync.write(image));
  return dartDataUri.content;
};

export const getDartMetaData = (dartRaw: DartRawResp): Dart => {
  return {
    image: getDartPng(dartRaw.rgbaArray, dartRaw.dimensions, 10),
    owner: dartRaw.owner,
    dartId: parseInt(dartRaw.dartId),
  } as Dart;
};

export const getAllDarts = async (): Promise<Dart[]> => {
  const { contract } = getServerContract();
  const dartResp = (await contract.methods.getDarts().call()) as DartRawResp[];
  return dartResp.map((d) => getDartMetaData(d));
};

export const getDart = async (dartId: number): Promise<Dart> => {
  const { contract } = getServerContract();
  const dartResp = (await contract.methods
    .getDart(dartId)
    .call()) as DartRawResp;
  return getDartMetaData(dartResp);
};

export const getDartImage = async (
  dartId: number,
  resolution: number
): Promise<string | undefined> => {
  const { contract } = getServerContract();
  const dartResp = (await contract.methods
    .getDart(dartId)
    .call()) as DartRawResp;
  return getDartPng(dartResp.rgbaArray, dartResp.dimensions, resolution);
};
