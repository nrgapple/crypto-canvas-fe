import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { Contract } from "web3-eth-contract";
import { Pixel, Web3Contract } from "../interfaces";

interface UsePixelsReturn {
  pixels: Pixel[];
  update: () => Promise<void>;
  checkout: (selectedPixels: Pixel[]) => Promise<void>;
}

export const usePixels = (web3Contract: Web3Contract) => {
  const [pixels, setPixels] = useState<Pixel[]>([]);

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

    setPixels(
      p.map(
        ({
          x,
          y,
          hexColor,
          owner,
          creatorId,
        }: {
          x: string;
          y: string;
          hexColor: string;
          owner: string;
          creatorId: number;
        }) =>
          ({
            x: parseInt(x),
            y: parseInt(y),
            hexColor,
            owner,
            creatorId,
          } as Pixel)
      )
    );
  };

  const handleCheckout = async (selected: Pixel[]) => {
    if (contract && web3) {
      const valsToSend = selected.map(({ x, y, hexColor }) => ({
        x: x.toString(),
        y: y.toString(),
        hexColor,
        id: ethers.utils.formatBytes32String("null"),
        owner: accounts[0],
        creatorId: 0,
      }));
      const transaction = await contract.methods.create(valsToSend);

      transaction.send({
        from: accounts[0],
        value: web3.utils.toWei(".01", "ether"),
      });
      getPixels(contract);
    } else {
    }
  };

  const update = async () => {
    await getPixels(contract);
  };

  return { pixels, update, checkout: handleCheckout } as UsePixelsReturn;
};
