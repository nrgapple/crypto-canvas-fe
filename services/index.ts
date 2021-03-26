import { config } from "../app.config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import PixelToken from "../contracts/DARToken.json";
import { checkEmptyAddress } from "../utils/helpers";
import { Dart, DartRawResp } from "../interfaces";
import DataURIParser from "datauri/parser";
import { imageToWebp, resizeImage } from "../utils/node-helpers";

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

export const toUri = (buffer: Buffer) => {
  const parser = new DataURIParser();
  const dartDataUri = parser.format(".png", buffer);
  return dartDataUri.content;
};

export const getDartData = async (dartRaw: DartRawResp, web3: Web3) => {
  return {
    owner: dartRaw.owner,
    dartId: parseInt(dartRaw.dartId),
    name: checkEmptyAddress(dartRaw.name)
      ? "No Name"
      : web3.utils.toUtf8(dartRaw.name),
  } as Dart;
};

export const getAllDarts = async (): Promise<Dart[]> => {
  const { contract, web3 } = getServerContract();
  const dartResp = (await contract.methods
    .getDartsMeta()
    .call()) as DartRawResp[];
  return await Promise.all(
    dartResp.map(async (d) => await getDartData(d, web3))
  );
};

export const getDart = async (dartId: number) => {
  const { contract, web3 } = getServerContract();
  const dartResp = (await contract.methods
    .getDartMeta(dartId)
    .call()) as DartRawResp;
  console.log(dartResp);
  return await getDartData(dartResp, web3);
};

export const getDartImage = async (dartId: number, size: number = 500) => {
  const { contract } = getServerContract();
  const dartResp = (await contract.methods
    .getDartContent(dartId)
    .call()) as DartRawResp;
  if (size === 0) {
    return dartResp.rgbaArray.map((x) => parseInt(x));
  }
  return await resizeImage(
    Buffer.from(dartResp.rgbaArray.map((x) => parseInt(x))),
    size
  );
};

export const getDartMetaData = async (dartId: number) => {
  const { contract, web3 } = getServerContract();
  const dartResp = (await contract.methods
    .getDartMeta(dartId)
    .call()) as DartRawResp;
  return {
    name: checkEmptyAddress(dartResp.name)
      ? "No Name"
      : web3.utils.toUtf8(dartResp.name),
    image: `${config.baseUri}api/darts/image/${dartResp.dartId}`,
  };
};

export const convertBufferToWebp = async (buffer: Buffer) => {
  return await imageToWebp(Buffer.from(buffer));
};
