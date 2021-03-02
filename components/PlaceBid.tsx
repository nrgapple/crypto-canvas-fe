import { Web3Contract } from "../interfaces";
import { useBids } from "../hooks/useBids";
import React from "react";
import { Button } from "reactstrap";

interface Props {
  web3Contract: Web3Contract;
}

const PlaceBid = ({ web3Contract }: Props) => {
  const { placeBid } = useBids(web3Contract);
  return <Button onClick={placeBid}>Bid</Button>;
};

export default PlaceBid;
