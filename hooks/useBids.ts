import { useEffect, useMemo, useState } from "react";
import { Bid, Web3Contract } from "../interfaces";
import { Contract } from "web3-eth-contract";

interface UseBidsReturn {
  bids: Bid[];
  update: () => void;
  placeBid: () => void;
}

export const useBids = (web3Contract: Web3Contract) => {
  const [bids, setBids] = useState<Bid[]>([]);

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
      getBids(contract);
    }
  }, [contract]);

  const getBids = async (instance: Contract) => {
    const b = await instance.methods.getBids().call();
    setBids(
      b.map(
        ({ fromAddress, amount }: { fromAddress: string; amount: number }) => ({
          from: fromAddress,
          amount: amount,
        })
      )
    );
  };

  const handleBid = async () => {
    if (contract && accounts && web3) {
      console.log("accouonts", accounts);
      await contract.methods.placeBid(0).send({
        from: accounts[0],
        value: web3.utils.toWei(".2", "ether"),
      });
    } else {
      console.error(`There is no contact or web3`, { contract, web3 });
    }
  };

  const update = () => {
    getBids(contract);
  };

  return { bids, update, placeBid: handleBid } as UseBidsReturn;
};
