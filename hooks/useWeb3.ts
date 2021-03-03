import { useCallback, useEffect, useState } from "react";
import getWeb3 from "../utils/getWeb3";
import PixelToken from "../contracts/PixelToken.json";
import { AbiItem } from "web3-utils";
import { Web3Contract } from "../interfaces";
import { EventData } from "web3-eth-contract";
import { useRecoilState } from "recoil";
import { transactionsInSessionState } from "../state";

type UseWeb3Return = {
  loading: boolean;
  web3Contract: Web3Contract;
};

export const useWeb3 = () => {
  const [web3Contract, setWeb3Contract] = useState<Web3Contract>();
  const [loading, setLoading] = useState<boolean>(false);
  const [transactionsInSession, setTransactionsInSession] = useRecoilState(
    transactionsInSessionState
  );

  useEffect(() => {
    init();
    return () => {
      if (web3Contract?.web3) {
        web3Contract.web3.eth.clearSubscriptions(() => {});
      }
    };
  }, []);

  const handleMineComplete = useCallback((e: EventData) => {
    console.log("Incoming data", e);
    setTransactionsInSession((curr) => [...curr, e]);
  }, []);

  useEffect(() => {
    if (web3Contract?.contract) {
      const { contract } = web3Contract;
      contract.events.allEvents().on("data", handleMineComplete);
    }
    return () => {
      if (web3Contract?.contract) {
        const { contract } = web3Contract;
        contract.events.allEvents().off("data", handleMineComplete);
      }
    };
  }, [web3Contract, handleMineComplete]);

  // useEffect(() => {
  //   if (web3Contract?.web3) {
  //     const { web3 } = web3Contract;
  //     web3.eth.subscribe("pendingTransactions", (e) =>
  //       console.log("pending transactions", e)
  //     );
  //   }
  // }, [web3Contract]);

  const init = async () => {
    setLoading(true);
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      //@ts-ignore
      const deployedNetwork = PixelToken.networks[networkId];
      const instance = new web3.eth.Contract(
        PixelToken.abi as AbiItem[] | AbiItem,
        deployedNetwork && deployedNetwork.address
      );

      // TODO: what is this?
      // web3.eth
      //   .subscribe("logs", { address: instance.address }, (error, result) => {})
      //   .on("data", (data) => {})

      setWeb3Contract({
        web3,
        contract: instance,
        accounts,
      } as Web3Contract);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, web3Contract } as UseWeb3Return;
};
