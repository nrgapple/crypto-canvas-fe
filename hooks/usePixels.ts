import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Contract } from "web3-eth-contract";
import { Pixel, Web3Contract } from "../interfaces";
import { pixelsState } from "../state";

interface UsePixelsReturn {
  update: () => Promise<void>;
  checkout: (selectedPixels: Pixel[]) => Promise<void>;
  editPixels: (edited: Pixel[]) => Promise<void>;
}

export const usePixels = (web3Contract: Web3Contract) => {
  const setPixels = useSetRecoilState(pixelsState);

  const { contract, web3, accounts } = useMemo(
    () =>
      ({
        contract: web3Contract?.contract,
        web3: web3Contract?.web3,
        accounts: web3Contract?.accounts,
      } as Web3Contract),
    [web3Contract]
  );

  useEffect(() => {
    if (contract) {
      getPixels(contract);
    }
  }, [contract]);

  const getPixels = async (instance: Contract) => {
    const p = await instance.methods.getPixels().call();
    console.log("pixels", p);

    setPixels(
      p.map(
        ({
          x,
          y,
          hexColor,
          owner,
          exhibitId,
          pixelId,
        }: {
          x: string;
          y: string;
          hexColor: string;
          owner: string;
          exhibitId: number;
          pixelId: string;
        }) =>
          ({
            x: parseInt(x),
            y: parseInt(y),
            hexColor,
            owner,
            exhibitId: exhibitId,
            pixelId,
          } as Pixel)
      )
    );
  };

  const handleEdit = (edited: Pixel[]) =>
    new Promise((res, rej) => {
      if (edited.length < 1) {
        rej(`There is no pixels to edit`);
      }
      const valsToSend = edited.map(({ x, y, hexColor, pixelId }) => ({
        x: x.toString(),
        y: y.toString(),
        hexColor,
        id: pixelId,
      }));

      const transaction = contract.methods.changePixels(
        edited[0].exhibitId,
        valsToSend
      );

      transaction
        .send({
          from: accounts[0],
        })
        .once("receipt", (e: any) => {
          console.log("receipt", e);
          update();
          res(e as string);
        })
        .once("error", (e: any) => {
          console.error(e);
          rej(e);
        })
        .catch((e: any) => {
          console.error(e);
          rej(e);
        });

      if (contract && web3) {
      } else {
        console.error(`There is no contact or web3`, { contract, web3 });
        rej(`There is no contact or web3`);
      }
    });

  const handleCheckout = (selected: Pixel[]) =>
    new Promise((res, rej) => {
      if (contract && web3) {
        const valsToSend = selected.map(({ x, y, hexColor }) => ({
          x: x.toString(),
          y: y.toString(),
          hexColor,
          id: ethers.utils.formatBytes32String("null"),
        }));

        const transaction = contract.methods.create(valsToSend);

        //const estimatedGas = transaction.
        transaction
          .send({
            from: accounts[0],
            value: web3.utils.toWei(".01", "ether"),
          })
          .once("receipt", (e: any) => {
            console.log("receipt", e);
            update();
            res(e as string);
          })
          .once("error", (e: any) => {
            console.error(e);
            rej(e);
          })
          .catch((e: any) => {
            console.error(e);
            rej(e);
          });
      } else {
        console.error(`There is no contact or web3`, { contract, web3 });
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
