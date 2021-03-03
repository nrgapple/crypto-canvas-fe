import { useCallback, useEffect, useMemo, useState } from "react";
import { Bid, Web3Contract } from "../interfaces";
import { Contract } from "web3-eth-contract";

interface UseBidsReturn {
  loading: boolean;
  bids: Bid[];
  update: () => void;
  placeBid: (amount: number) => Promise<void>;
}

export const useBids = (
  web3Contract: Web3Contract,
  blockId: number | undefined
) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(false);

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
    update();
  }, [contract, blockId]);

  const getBids = async (instance: Contract, blockId: number) => {
    setLoading(true);
    const b = await instance.methods.getBids(blockId).call();
    const newBids = b.map(
      ({ fromAddress, amount }: { fromAddress: string; amount: string }) =>
        ({
          from: fromAddress,
          amount: parseFloat(web3.utils.fromWei(amount)),
        } as Bid)
    );

    console.log("bids", newBids);
    setBids(newBids);
    setLoading(false);
  };

  const handleBid = useCallback(
    async (amount: number) => {
      if (contract && accounts && web3) {
        console.log("accouonts", accounts);
        await contract.methods.placeBid(blockId).send({
          from: accounts[0],
          value: web3.utils.toWei(amount.toString(), "ether"),
        });
      } else {
        console.error(`There is no contact or web3`, { contract, web3 });
      }
    },
    [blockId]
  );

  const update = () => {
    if (contract && blockId) {
      getBids(contract, blockId);
    } else {
      setBids([]);
    }
  };

  return { bids, update, placeBid: handleBid, loading } as UseBidsReturn;
};
