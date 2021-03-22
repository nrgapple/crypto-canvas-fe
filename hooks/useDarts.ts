import { useToast } from "@chakra-ui/toast";
import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { Dart, Pixel } from "../interfaces";
import { dartsState } from "../state";
import { pointsToDartRaw } from "../utils/helpers";
import { useContractAndAccount } from "./useContractAndAccount";

interface UseDartsReturn {
  fetchAllDarts: () => Promise<void>;
  create: (selectedPixels: Pixel[], name: string) => Promise<void>;
  darts: Dart[];
}

export const useDarts = (initDarts?: Dart[]) => {
  const { contract, web3, account } = useContractAndAccount();
  const toast = useToast();
  const [darts, setDarts] = useRecoilState(dartsState);

  const handleCreate = useCallback(
    (pixels: Pixel[], name: string) =>
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

        const transaction = contract.methods.createDart(
          rgbaArray,
          dimensions,
          web3.utils.fromAscii(name)
        );

        //const estimatedGas = transaction.
        console.log({ rgbaArray, dimensions });
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
            console.log(e);
            rej(e);
          });
      }),
    [account, web3, contract]
  );

  const fetchAllDarts = useCallback(async () => {
    if (!contract) {
      throw Error(`There is no contact`);
    }
    const resp = await fetch("/api/darts");
    const newDarts = await resp.json();
    console.log("darts", newDarts);
    setDarts(newDarts);
  }, [contract]);

  useEffect(() => {
    if (initDarts && initDarts.length > 0) {
      setDarts(initDarts);
    }
  }, [initDarts]);

  return { create: handleCreate, fetchAllDarts, darts } as UseDartsReturn;
};
