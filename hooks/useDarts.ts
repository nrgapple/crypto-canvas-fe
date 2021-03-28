import { useToast } from "@chakra-ui/toast";
import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { Dart, Dimensions, Pixel } from "../interfaces";
import { dartsState } from "../state";
import { pointsToDartRaw } from "../utils/helpers";
import { useContractAndAccount } from "./useContractAndAccount";

interface UseDartsReturn {
  fetchAllDarts: () => Promise<void>;
  create: (selectedPixels: Pixel[], name: string) => Promise<void>;
  createRaw: (
    rgbaArray: Uint8Array,
    dimensions: Dimensions,
    name: string
  ) => Promise<void>;
  darts: Dart[];
}

export const useDarts = (initDarts?: Dart[]) => {
  const { contract, web3, account } = useContractAndAccount();
  const toast = useToast();
  const [darts, setDarts] = useRecoilState(dartsState);

  const handleCreateRaw = useCallback(
    (rgbaArray: Uint8Array, dimensions: Dimensions, name: string) =>
      new Promise((res, rej) => {
        if (!account) {
          rej(`You are not signed in`);
          return;
        }
        if (!contract || !web3) {
          rej(`There is no contact or web3`);
          return;
        }
        const transaction = contract.methods.createDart(
          [...rgbaArray],
          dimensions,
          web3.utils.fromUtf8(name)
        );

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
              status: "success",
            });
            res(e as string);
          })
          .once("error", (e: any) => {
            toast({
              title: "Transaction Failed",
              position: "top-right",
              status: "error",
            });
            rej(e);
          })
          .catch((e: any) => {
            console.log(e);
            rej(e);
          });
      }),
    [contract, account, web3]
  );

  const handleCreate = useCallback(
    async (pixels: Pixel[], name: string) => {
      const { dimensions, rgbaArray } = pointsToDartRaw(pixels);

      await handleCreateRaw(new Uint8Array(rgbaArray), dimensions, name);
    },
    [handleCreateRaw]
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

  return {
    create: handleCreate,
    fetchAllDarts,
    darts,
    createRaw: handleCreateRaw,
  } as UseDartsReturn;
};
