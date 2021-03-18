import { useCallback, useEffect, useState } from "react";
import { AllBidsResponse, Bid } from "../interfaces";
import { Contract } from "web3-eth-contract";
import { checkEmptyAddress } from "../utils/helpers";
import { useRecoilState } from "recoil";
import { allBidsState } from "../state";
import { useToast } from "@chakra-ui/toast";
import { useContractAndAccount } from "./useContractAndAccount";

interface UseBidsReturn {
  loading: boolean;
  highestBid: Bid | undefined;
  update: () => void;
  placeBid: (amount: number) => Promise<void>;
  acceptBid: () => Promise<void>;
}

export const useBids = (
  exhibitId?: number,
  initAllBids?: Bid[],
  initBid?: Bid
) => {
  const { contract, web3, account } = useContractAndAccount();
  const [highestBid, setHighestBid] = useState<Bid | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [allBids, setAllBids] = useRecoilState(allBidsState);
  const toast = useToast();

  useEffect(() => {
    if (contract && exhibitId !== undefined) {
      update();
    }
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
    if (!contract) {
      throw Error(`There is no contact`);
    }
    if (!web3) {
      throw Error(`Web3 is not defined`);
    }
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
        if (!account) {
          reject(`You are not signed in`);
          return;
        }
        if (!contract || !web3) {
          reject(`There is no contact or web3`);
          return;
        }
        contract.methods
          .acceptBid(exhibitId)
          .send({ from: account })
          .once("transactionHash", (e: any) => {
            toast({
              title: "Transaction Created",
              position: "top-right",
              isClosable: true,
            });
          })
          .once("receipt", (e: any) => {
            update();
            toast({
              title: "Transaction Success",
              position: "top-right",
              isClosable: true,
            });
            resolve(e as string);
          })
          .once("error", (e: any) => {
            console.error(e);
            toast({
              title: "Transaction Failed",
              position: "top-right",
            });
            reject(e);
          })
          .catch((e: any) => {
            console.error(e);
            reject(e);
          });
      }),
    [exhibitId, contract, account, web3]
  );

  const handleBid = useCallback(
    (amount: number) =>
      new Promise((resolve, reject) => {
        if (!account) {
          reject(`You are not signed in`);
          return;
        }
        if (!contract || !web3) {
          reject(`There is no contact or web3`);
          return;
        }
        contract.methods
          .placeBid(exhibitId)
          .send({
            from: account,
            value: web3.utils.toWei(amount.toString(), "ether"),
          })
          .once("transactionHash", (e: any) => {
            toast({
              title: "Transaction Created",
              position: "top-right",
            });
          })
          .once("receipt", (e: any) => {
            update();
            toast({
              title: "Transaction Success",
              position: "top-right",
            });
            resolve(e as string);
          })
          .once("error", (e: any) => {
            console.error(e);
            toast({
              title: "Transaction Failed",
              position: "top-right",
            });
            reject(e);
          })
          .catch((e: any) => {
            console.error(e);
            reject(e);
          });
      }),
    [exhibitId, contract, account, web3]
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
      if (!contract) {
        throw Error(`There is no contact`);
      }
      if (!web3) {
        throw Error(`Web3 is not defined`);
      }
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
