import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Button } from "reactstrap";
import SidePanel from "../components/SidePanel";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isEditState, selectedPixelsState } from "../state";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { Bid, Pixel } from "../interfaces";
import PixelToken from "../contracts/PixelToken.json";
import { AbiItem } from "web3-utils";
import { ethers } from "ethers";
import getWeb3 from "../utils/getWeb3";
import dynamic from "next/dynamic";

const World = dynamic(() => import("../components/World"), {
  ssr: false,
});

const IndexPage = () => {
  const [web3, setWeb3] = useState<Web3 | undefined>(undefined);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [contract, setContract] = useState<Contract>();
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [isEdit, setIsEdit] = useRecoilState(isEditState);
  const setSelectedPixels = useSetRecoilState(selectedPixelsState);

  useEffect(() => {
    start();
    return () => {
      if (web3) {
        web3.eth.clearSubscriptions(() => {});
      }
    };
  }, []);

  const start = async () => {
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

      setWeb3(web3);
      setAccounts(accounts);
      setContract(instance);
      fetchPixels(instance);
      getBids(instance);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  const fetchPixels = async (instance: Contract) => {
    const p = await instance.methods.getPixels().call();
    console.log("p", p);
    setPixels(
      p.map(
        ({ x, y, hexColor }: { x: string; y: string; hexColor: string }) => ({
          x: parseInt(x),
          y: parseInt(y),
          hexColor,
        })
      )
    );
  };

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
    if (contract && web3) {
      console.log("accouonts", accounts);
      await contract.methods.placeBid(0).send({
        from: accounts[0],
        value: web3.utils.toWei(".2", "ether"),
      });
    } else {
      console.error(`There is no contact or web3`, { contract, web3 });
    }
  };

  const handleCheckout = async (selected: Pixel[]) => {
    if (contract && web3) {
      const valsToSend = selected.map(({ x, y, hexColor }) => ({
        x: x.toString(),
        y: y.toString(),
        hexColor,
        id: ethers.utils.formatBytes32String("null"),
        owner: accounts[0],
        creatorId: 0,
      }));
      const transaction = await contract.methods.create(valsToSend);
      console.log({ transaction, accounts });
      transaction.send({
        from: accounts[0],
        value: web3.utils.toWei(".01", "ether"),
      });
      setSelectedPixels([]);
      setIsEdit(false);
      fetchPixels(contract);
    } else {
      console.error(`There is no contact or web3`, { contract, web3 });
    }
  };

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <Layout title="Crypto Canvas">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "8px",
        }}
      >
        <h5>Crypto Pixels</h5>
        <Button onClick={handleBid}>Bid</Button>
        <ul>
          {bids &&
            bids.map((b, i) => (
              <li key={i}>
                <div>
                  <b>Ether</b> {web3.utils.fromWei(b.amount.toString())}
                </div>
                <div>
                  <b>From</b> {b.from}
                </div>
              </li>
            ))}
        </ul>
        <Button onClick={() => setIsEdit(!isEdit)}>
          {!isEdit ? "Buy" : "Cancel"}
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          justifyContent: "center",
          margin: "8px",
        }}
      >
        <World pixels={pixels} />
        {isEdit && <SidePanel onCheckout={handleCheckout} />}
      </div>
    </Layout>
  );
};

export default IndexPage;
