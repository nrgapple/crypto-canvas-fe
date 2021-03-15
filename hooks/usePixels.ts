import { ethers } from "ethers";
import hexRgb from "hex-rgb";
import { useEffect, useMemo } from "react";
import { useRecoilState } from "recoil";
import rgbHex from "rgb-hex";
import { Contract } from "web3-eth-contract";
import { Bounds, Pixel, Web3Contract } from "../interfaces";
import { pixelsState } from "../state";
import { getMaxMinPoints } from "../utils/helpers";

interface UsePixelsReturn {
  update: () => Promise<void>;
  checkout: (selectedPixels: Pixel[]) => Promise<void>;
  editPixels: (edited: Pixel[]) => Promise<void>;
}

export const usePixels = (web3Contract: Web3Contract) => {
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

  useEffect(() => {
    if (contract && !pixels.length) {
      getPixels(contract);
    }
  }, [contract]);

  const getPixels = async (instance: Contract) => {
    const p = await instance.methods.getPixels().call();
    const newPixels: Pixel[] = [];
    p.forEach(
      ({
        rgbArray,
        bounds,
        owner,
        exhibitId,
      }: {
        rgbArray: string[];
        bounds: {
          topLeft: { x: string; y: string };
          bottomRight: { x: string; y: string };
        };
        owner: string;
        exhibitId: number;
      }) => {
        //const height = bounds.bottomRight.y - bounds.topLeft.y;
        let count = 0;

        const newBounds = {
          topLeft: {
            x: parseInt(bounds.topLeft.x),
            y: parseInt(bounds.topLeft.y),
          },
          bottomRight: {
            x: parseInt(bounds.bottomRight.x),
            y: parseInt(bounds.bottomRight.y),
          },
        } as Bounds;
        const width = newBounds.bottomRight.x - newBounds.topLeft.x + 1;
        for (let i = 0; i < rgbArray.length; i += 3) {
          const hex = `#${rgbHex(
            parseInt(rgbArray[i]),
            parseInt(rgbArray[i + 1]),
            parseInt(rgbArray[i + 2])
          )}`;
          newPixels.push({
            x: newBounds.topLeft.x + (count % width),
            y: newBounds.topLeft.y + Math.floor(count / width),
            hexColor: hex,
            owner,
            exhibitId,
          } as Pixel);
          count++;
        }
      }
    );

    setPixels(newPixels);
  };

  const handleEdit = (edited: Pixel[]) =>
    new Promise((res, rej) => {
      // if (edited.length < 1) {
      //   rej(`There is no pixels to edit`);
      // }
      // const valsToSend = edited.map(({ x, y, hexColor, pixelId }) => ({
      //   x: x.toString(),
      //   y: y.toString(),
      //   hexColor,
      //   id: pixelId,
      // }));
      // const transaction = contract.methods.changePixels(
      //   edited[0].exhibitId,
      //   valsToSend
      // );
      // transaction
      //   .send({
      //     from: accounts[0],
      //   })
      //   .once("receipt", (e: any) => {
      //     update();
      //     res(e as string);
      //   })
      //   .once("error", (e: any) => {
      //     rej(e);
      //   })
      //   .catch((e: any) => {
      //     rej(e);
      //   });
      // if (contract && web3) {
      // } else {
      //   rej(`There is no contact or web3`);
      // }
    });

  const handleCheckout = (selected: Pixel[]) =>
    new Promise((res, rej) => {
      if (contract && web3) {
        const { max, min } = getMaxMinPoints(selected);
        const pixelsSorted = [...selected].sort((a, b) =>
          a.y === b.y ? a.x - b.x : a.y - b.y
        );
        const rgbArray: number[] = [];
        pixelsSorted.forEach((p) => {
          const rgb = hexRgb(p.hexColor, { format: "array" });
          rgbArray.push(rgb[0]);
          rgbArray.push(rgb[1]);
          rgbArray.push(rgb[2]);
        });

        const bounds = {
          topLeft: {
            x: min[0],
            y: min[1],
          },
          bottomRight: { x: max[0], y: max[1] },
        } as Bounds;

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
