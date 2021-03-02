import { useMemo } from "react";
import { useBids } from "../hooks/useBids";
import { Web3Contract } from "../interfaces";

interface Props {
  web3Contract: Web3Contract;
}

const BidsList = ({ web3Contract }: Props) => {
  const { bids } = useBids(web3Contract);
  const { web3 } = useMemo(
    () => ({
      web3: web3Contract?.web3,
    }),
    [web3Contract]
  );

  return (
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
  );
};

export default BidsList;
