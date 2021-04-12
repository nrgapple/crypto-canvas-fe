import { useEffect, useMemo, useState } from "react";
import PixelToken from "../contracts/DARToken.json";
import { AbiItem } from "web3-utils";
import { useWallet } from "use-wallet";
import Web3 from "web3";
import { config } from "../app.config";
import { Contract } from "web3-eth-contract/types";
import {
  authTokenState,
  showConnectPageState,
  wasSignedInState,
} from "../state";
import { useRecoilState, useSetRecoilState } from "recoil";
import { NextRouter } from "next/dist/client/router";

let web3: Web3 | undefined = undefined;
let contract: Contract | undefined = undefined;

export const useContractAndAccount = (connectOnMount: boolean = false) => {
  const wallet = useWallet();
  const { ethereum, connect, account, status } = useMemo(() => wallet, [
    wallet,
  ]);
  const [wasSignedIn, setWasSignedIn] = useRecoilState(wasSignedInState);

  useEffect(() => {
    if (ethereum && !contract) {
      web3 = new Web3(ethereum as any) as Web3;
      contract = new web3.eth.Contract(
        PixelToken.abi as AbiItem[] | AbiItem,
        config.contractAddress,
      ) as Contract;
    }
  }, [ethereum, contract]);

  useEffect(() => {
    (async () => {
      if (connectOnMount && !account && wasSignedIn) {
        await connect("injected");
      }
    })();
  }, [connectOnMount, account, wasSignedIn]);

  useEffect(() => {
    setWasSignedIn(account !== undefined);
  }, [account]);

  useEffect(() => {
    if (status === "connected") {
      setWasSignedIn(true);
    }
  }, [status]);

  return { ...wallet, contract, web3 } as const;
};

export const useRequireLogin = (status: string) => {
  const setShowConnectPage = useSetRecoilState(showConnectPageState);
  const [hadError, setHadError] = useState(false);

  useEffect(() => {
    if (!hadError) {
      if (status === "error") {
        setShowConnectPage(true);
        setHadError(true);
      }
    } else {
      if (status === "connected") {
        setShowConnectPage(false);
      }
    }
  }, [status, hadError]);
};

export const useAuth = () => {
  const { web3, connect, account } = useContractAndAccount();
  const setAuthToken = useSetRecoilState(authTokenState);

  useEffect(() => {
    connect("injected");
  }, []);

  const signin = async (router: NextRouter) => {
    if (account && web3) {
      const nonceResponse = await fetch(
        `${config.baseUri}api/user/nonce?publicAddress=${account}`,
      );

      let nonce = (await nonceResponse.json()).nonce;

      if (nonce === undefined) {
        const signupResp = await fetch(`${config.baseUri}api/auth/signup`, {
          method: "POST",
          body: JSON.stringify({
            publicAddress: account,
          }),
        });
        nonce = (await signupResp.json()).nonce;
      }

      const signature = await web3?.eth.personal.sign(
        `${config.signMsg} ${nonce}`,
        account!,
        "",
      );
      const response = await fetch(`${config.baseUri}api/auth/login`, {
        method: "POST",
        body: JSON.stringify({
          publicAddress: account,
          signature,
        }),
      });
      const token = (await response.json()).token;
      setAuthToken(token);
      router.push("/profile");
    }
  };

  const logout = () => {
    setAuthToken(undefined as string | undefined);
  };

  return { signin, logout } as const;
};
