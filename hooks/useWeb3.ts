import { useEffect, useState } from "react";
import getWeb3 from "../utils/getWeb3";
import PixelToken from "../contracts/PixelToken.json";
import { AbiItem } from "web3-utils";
import { Web3Contract } from "../interfaces";
import { config } from "../app.config";

type UseWeb3Return = {
  loading: boolean;
  web3Contract: Web3Contract;
  isMetaMask: boolean;
};

export const useWeb3 = () => {
  const [web3Contract, setWeb3Contract] = useState<Web3Contract>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isMetaMask, setIsMetaMask] = useState<boolean>(false);

  useEffect(() => {
    init();
    return () => {
      if (web3Contract?.web3) {
        web3Contract.web3.eth.clearSubscriptions(() => {});
      }
    };
  }, []);

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
        config.contractAddress ?? deployedNetwork.address
      );

      //@ts-ignore
      if (!web3.currentProvider?.isMetaMask) {
        setIsMetaMask(false);
        return;
      }

      setIsMetaMask(true);
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, web3Contract, isMetaMask } as UseWeb3Return;
};
