import { useCallback, useEffect, useMemo, useState } from "react";
import { AllBidsResponse, Bid, Web3Contract } from "../interfaces";
import { Contract } from "web3-eth-contract";
import { checkEmptyAddress } from "../utils/helpers";
import { useRecoilState } from "recoil";
import { allBidsState } from "../state";
import { useToast } from "@chakra-ui/toast";

interface UseBidsReturn {
  loading: boolean;
  highestBid: Bid | undefined;
  update: () => void;
  placeBid: (amount: number) => Promise<void>;
  acceptBid: () => Promise<void>;
}

export const useBids = (
  web3Contract: Web3Contract,
  exhibitId?: number,
  initAllBids?: Bid[],
  initBid?: Bid
) => {
  const [highestBid, setHighestBid] = useState<Bid | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [allBids, setAllBids] = useRecoilState(allBidsState);
  const toast = useToast();

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
  }, [contract, exhibitId]);

  useEffect(() => {
    if (contract && !allBids.length) {
      getAllBids(contract);
    }
  }, [contract]);

  useEffect(() => {
    if (initAllBids && initAllBids.length > 0) {
      setAllBids(initAllBids);
    }
  }, [initAllBids]);

  useEffect(() => {
    if (initBid) {
      setHighestBid(initBid);
    }
  }, [initBid]);

  const getBids = async (contract: Contract, exhibitId: number) => {
    setLoading(true);
    const b = await contract.methods.getBid(exhibitId).call();
    const newBid = !checkEmptyAddress(b.fromAddress)
      ? ({
          from: b.fromAddress,
          amount: parseFloat(web3.utils.fromWei(b.amount)),
        } as Bid)
      : undefined;

    setHighestBid(newBid);
    setLoading(false);
  };

  const handleAcceptBid = useCallback(
    () =>
      new Promise((resolve, reject) => {
        if (contract && accounts && web3) {
          contract.methods
            .acceptBid(exhibitId)
            .send({ from: accounts[0] })
            .once("transactionHash", (e: any) => {
              toast({
                title: "Transaction Created",
                position: "top-right",
                isClosable: true
              })
            })
            .once("receipt", (e: any) => {
              update();
              toast({
                title: "Transaction Success",
                position: "top-right",
                isClosable: true
              })
              resolve(e as string);
            })
            .once("error", (e: any) => {
              console.error(e);
              toast({
                title: "Transaction Failed",
                position: "top-right"
              })
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
    [exhibitId, web3Contract]
  );

  const handleBid = useCallback(
    (amount: number) =>
      new Promise((resolve, reject) => {
        if (contract && accounts && web3) {
          contract.methods
            .placeBid(exhibitId)
            .send({
              from: accounts[0],
              value: web3.utils.toWei(amount.toString(), "ether"),
            })
            .once("transactionHash", (e: any) => {
              toast({
                title: "Transaction Created",
                position: "top-right"
              })
            })
            .once("receipt", (e: any) => {
              update();
              toast({
                title: "Transaction Success",
                position: "top-right"
              })
              resolve(e as string);
            })
            .once("error", (e: any) => {
              console.error(e);
              toast({
                title: "Transaction Failed",
                position: "top-right"
              })
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
    [exhibitId, contract, accounts, web3]
  );

  const update = () => {
    if (contract && exhibitId != undefined) {
      getBids(contract, exhibitId);
    } else {
      setHighestBid(undefined);
    }
  };

  const getAllBids = async (contract: Contract) => {
    try {
      if (contract) {
        const currAllBids = await contract.methods.getAllHighestBids().call();
        setAllBids(
          currAllBids
            .map(
              ({
                fromAddress: from,
                amount,
                exhibitId: exId,
              }: AllBidsResponse) => ({
                from,
                amount: parseFloat(web3.utils.fromWei(amount)),
                exhibitId: parseInt(exId),
              })
            )
            .filter((b: Bid) => !checkEmptyAddress(b.from as string))
        );
      }
    } catch (e) {
      console.error(e);
      setAllBids([]);
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
