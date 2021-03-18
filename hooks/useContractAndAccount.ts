import { useEffect, useMemo, useState } from "react";
import PixelToken from "../contracts/PixelToken.json";
import { AbiItem } from "web3-utils";
import { useWallet } from "use-wallet";
import Web3 from "web3";
import { config } from "../app.config";
import { Contract } from "web3-eth-contract/types";
import { showConnectPageState, wasSignedInState } from "../state";
import { useRecoilState, useSetRecoilState } from "recoil";

let web3: Web3 | undefined = undefined;
let contract: Contract | undefined = undefined;

export const useContractAndAccount = (connectOnMount: boolean = false) => {
  const wallet = useWallet();
  const { ethereum, connect, account } = useMemo(() => wallet, [wallet]);
  const [wasSignedIn, setWasSignedIn] = useRecoilState(wasSignedInState);

  useEffect(() => {
    if (ethereum && !contract) {
      web3 = new Web3(ethereum as any) as Web3;
      contract = new web3.eth.Contract(
        PixelToken.abi as AbiItem[] | AbiItem,
        config.contractAddress
      ) as Contract;
    }
  }, [ethereum, contract]);

  useEffect(() => {
    (async () => {
      if (connectOnMount && !account && wasSignedIn) {
        console.log("here");

        await connect("injected");
        if (status === "connected") {
          setWasSignedIn(true);
        }
      }
    })();
  }, [connectOnMount, account, wasSignedIn]);

  useEffect(() => {
    setWasSignedIn(account !== undefined);
  }, [account]);

  return { ...wallet, contract, web3 } as const;
};

export const useRequireLogin = (status: string) => {
  const setShowConnectPage = useSetRecoilState(showConnectPageState);
  const [hadError, setHadError] = useState(false);

  useEffect(() => {
    if (!hadError) {
      if (status === "error") {
        setShowConnectPage(true);
      }
    } else {
      if (status === "connected") {
        setShowConnectPage(false);
      }
    }
  }, [status, hadError]);
};
