import { useToast } from "@chakra-ui/toast";
import { useRecoilState } from "recoil";
import { Dart, Pixel } from "../interfaces";
import { dartsState } from "../state";
import { pointsToDartRaw } from "../utils/helpers";
import { useContractAndAccount } from "./useContractAndAccount";

interface UseDartsReturn {
  fetchAllDarts: () => Promise<void>;
  create: (selectedPixels: Pixel[]) => Promise<void>;
  darts: Dart[];
}

export const useDarts = () => {
  const { contract, web3, account } = useContractAndAccount();
  const toast = useToast();
  const [darts, setDarts] = useRecoilState(dartsState);

  const handleCreate = async (pixels: Pixel[]) =>
    new Promise((res, rej) => {
      if (!account) {
        rej(`You are not signed in`);
        return;
      }
      if (!contract || !web3) {
        rej(`There is no contact or web3`);
        return;
      }
      const { dimensions, rgbaArray } = pointsToDartRaw(pixels);

      const transaction = contract.methods.create(rgbaArray, dimensions);

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

  const fetchAllDarts = async () => {
    if (!contract) {
      throw Error(`There is no contact`);
    }
    const darts = await fetch("/api/darts");
    console.log("darts", darts);
  };

  return { create: handleCreate, fetchAllDarts, darts } as UseDartsReturn;
};
