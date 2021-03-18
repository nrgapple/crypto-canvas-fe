import { useToast } from "@chakra-ui/toast";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { Pixel } from "../interfaces";
import { pixelsState } from "../state";
import {
  contractExhibitsRespToPixels,
  pointsToContractData,
} from "../utils/helpers";
import { useContractAndAccount } from "./useContractAndAccount";

interface UsePixelsReturn {
  update: () => Promise<void>;
  checkout: (selectedPixels: Pixel[]) => Promise<void>;
  editPixels: (edited: Pixel[]) => Promise<void>;
}

export const usePixels = (initPixels?: Pixel[]) => {
  const { contract, web3, account } = useContractAndAccount();
  const [pixels, setPixels] = useRecoilState(pixelsState);
  const toast = useToast();

  useEffect(() => {
    if (contract && !pixels.length) {
      getPixels();
    }
  }, [contract]);

  const getPixels = async () => {
    if (!contract) {
      throw Error(`There is no contact`);
    }
    const exResp = await contract.methods.getPixels().call();
    const newPixels = contractExhibitsRespToPixels(exResp);
    setPixels(newPixels);
  };

  useEffect(() => {
    if (initPixels && initPixels.length > 0) {
      setPixels(initPixels);
    }
  }, [initPixels]);

  const handleEdit = (edited: Pixel[]) =>
    new Promise((res, rej) => {
      if (edited.length < 1) {
        rej(`There is no pixels to edit`);
        return;
      }
      if (!account) {
        rej(`You are not signed in`);
        return;
      }
      if (!contract || !web3) {
        rej(`There is no contact or web3`);
        return;
      }
      const { rgbArray } = pointsToContractData(edited);
      const transaction = contract.methods.changePixels(
        edited[0].exhibitId,
        rgbArray
      );
      transaction
        .send({
          from: account,
        })
        .once("transactionHash", (e: any) => {
          toast({
            title: "Transaction Created",
            position: "top-right",
          });
        })
        .once("receipt", (e: any) => {
          update();
          toast({
            title: "Transaction Success",
            position: "top-right",
          });
          res(e as string);
        })
        .once("error", (e: any) => {
          toast({
            title: "Transaction Failed",
            position: "top-right",
          });
          rej(e);
        })
        .catch((e: any) => {
          rej(e);
        });
    });

  const handleCheckout = (selected: Pixel[]) =>
    new Promise((res, rej) => {
      if (!account) {
        rej(`You are not signed in`);
        return;
      }
      if (!contract || !web3) {
        rej(`There is no contact or web3`);
        return;
      }
      const { bounds, rgbArray } = pointsToContractData(selected);

      const transaction = contract.methods.create(rgbArray, bounds);

      //const estimatedGas = transaction.
      transaction
        .send({
          from: account,
          value: web3.utils.toWei(".01", "ether"),
        })
        .once("transactionHash", (e: any) => {
          toast({
            title: "Transaction Created",
            position: "top-right",
            isClosable: true,
          });
        })
        .once("receipt", (e: any) => {
          update();
          toast({
            title: "Transaction Success",
            position: "top-right",
            isClosable: true,
          });
          res(e as string);
        })
        .once("error", (e: any) => {
          toast({
            title: "Transaction Failed",
            position: "top-right",
          });
          rej(e);
        })
        .catch((e: any) => {
          rej(e);
        });
    });

  const update = async () => {
    await getPixels();
  };

  return {
    update,
    checkout: handleCheckout,
    editPixels: handleEdit,
  } as UsePixelsReturn;
};
