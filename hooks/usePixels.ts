import { useEffect, useMemo } from "react";
import { useRecoilSnapshot, useRecoilState } from "recoil";
import { Contract } from "web3-eth-contract";
import { Pixel, Web3Contract } from "../interfaces";
import { pixelsState } from "../state";
import {
  contractExhibitsRespToPixels,
  pointsToContractData,
} from "../utils/helpers";

interface UsePixelsReturn {
  update: () => Promise<void>;
  checkout: (selectedPixels: Pixel[]) => Promise<void>;
  editPixels: (edited: Pixel[]) => Promise<void>;
}

export const usePixels = (web3Contract: Web3Contract, initPixels?: Pixel[]) => {
  const [pixels, setPixels] = useRecoilState(pixelsState);

  const { contract, web3, accounts } = useMemo(
    () =>
      ({
        contract: web3Contract?.contract,
        web3: web3Contract?.web3,
        accounts: web3Contract?.accounts,
      } as Web3Contract),
    [web3Contract]
  );
  console.log({ contract, web3, accounts });

  useEffect(() => {
    if (contract && !pixels.length) {
      getPixels(contract);
    }
  }, [contract]);

  const getPixels = async (instance: Contract) => {
    const exResp = await instance.methods.getPixels().call();
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
      }
      const { rgbArray } = pointsToContractData(edited);
      const transaction = contract.methods.changePixels(
        edited[0].exhibitId,
        rgbArray
      );
      transaction
        .send({
          from: accounts[0],
        })
        .once("receipt", (e: any) => {
          update();
          res(e as string);
        })
        .once("error", (e: any) => {
          rej(e);
        })
        .catch((e: any) => {
          rej(e);
        });
      if (contract && web3) {
      } else {
        rej(`There is no contact or web3`);
      }
    });

  const handleCheckout = (selected: Pixel[]) =>
    new Promise((res, rej) => {
      if (contract && web3) {
        const { bounds, rgbArray } = pointsToContractData(selected);

        const transaction = contract.methods.create(rgbArray, bounds);

        //const estimatedGas = transaction.
        transaction
          .send({
            from: accounts[0],
            value: web3.utils.toWei(".01", "ether"),
          })
          .once("receipt", (e: any) => {
            update();
            res(e as string);
          })
          .once("error", (e: any) => {
            rej(e);
          })
          .catch((e: any) => {
            rej(e);
          });
      } else {
        rej(`There is no contact or web3`);
      }
    });

  const update = async () => {
    await getPixels(contract);
  };

  return {
    update,
    checkout: handleCheckout,
    editPixels: handleEdit,
  } as UsePixelsReturn;
};
