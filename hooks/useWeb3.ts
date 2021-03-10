import { useEffect, useState } from "react";
import getWeb3 from "../utils/getWeb3";
import PixelToken from "../contracts/PixelToken.json";
import { AbiItem } from "web3-utils";
import { Web3Contract } from "../interfaces";

export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

type UseWeb3Return = {
  loading: boolean;
  web3Contract: Web3Contract;
};

export const useWeb3 = () => {
  const [web3Contract, setWeb3Contract] = useState<Web3Contract>();
  const [loading, setLoading] = useState<boolean>(false);

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
        contractAddress ?? deployedNetwork.address
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
