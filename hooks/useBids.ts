import { useCallback, useEffect, useMemo, useState } from "react";
import { Bid, Web3Contract } from "../interfaces";
import { Contract } from "web3-eth-contract";
import { useRecoilState, useRecoilValue } from "recoil";
import { transactionsInSessionState } from "../state";
import { rejects } from "node:assert";

interface UseBidsReturn {
  loading: boolean;
  highestBid: Bid | undefined;
  update: () => void;
  placeBid: (amount: number) => Promise<void>;
  acceptBid: () => Promise<void>;
}

export const useBids = (
  web3Contract: Web3Contract,
  blockId: number | undefined
) => {
  const [highestBid, setHighestBid] = useState<Bid | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [transactionsInSession, setTransactionsInSession] = useRecoilState(
    transactionsInSessionState
  );

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

  useEffect(() => {
    if (transactionsInSession.length > 0) {
      update();
    }
  }, [transactionsInSession]);

  const getBids = async (contact: Contract, blockId: number) => {
    setLoading(true);
    const b = await contact.methods.getBid(blockId).call();
    const newBid = {
      from: b.fromAddress,
      amount: parseFloat(web3.utils.fromWei(b.amount)),
    } as Bid;

    setHighestBid(newBid);
    setLoading(false);
  };

  const handleAcceptBid = useCallback(
    () =>
      new Promise((resolve, reject) => {
        if (contract && accounts && web3) {
          console.log("accouonts", accounts);
          contract.methods
            .acceptBid(blockId)
            .send({ from: accounts[0] })
            .once("receipt", (e: any) => {
              console.log("receipt", e);
              update();
              resolve(e as string);
            })
            .once("error", (e: any) => {
              console.error(e);
              reject(e);
            })
            .catch((e: any) => {
              console.error(e);
              reject(e);
            });
        } else {
          console.error(`There is no contact or web3`, { contract, web3 });
          reject(`There is no contact or web3`);
        }
      }),
    [blockId]
  );

  const handleBid = useCallback(
    (amount: number) =>
      new Promise((resolve, reject) => {
        if (contract && accounts && web3) {
          console.log("accouonts", accounts);
          contract.methods
            .placeBid(blockId)
            .send({
              from: accounts[0],
              value: web3.utils.toWei(amount.toString(), "ether"),
            })
            .once("receipt", (e: any) => {
              console.log("receipt", e);
              update();
              resolve(e as string);
            })
            .once("error", (e: any) => {
              console.error(e);
              reject(e);
            })
            .catch((e: any) => {
              console.error(e);
              reject(e);
            });
        } else {
          console.error(`There is no contact or web3`, { contract, web3 });
          reject(`There is no contact or web3`);
        }
      }),
    [blockId]
  );

  const update = () => {
    if (contract && blockId) {
      getBids(contract, blockId);
    } else {
      setHighestBid(undefined);
    }
  };

  return {
    highestBid,
    update,
    placeBid: handleBid,
    loading,
    acceptBid: handleAcceptBid,
  } as UseBidsReturn;
};
