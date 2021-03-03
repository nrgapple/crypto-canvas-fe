import { useMemo, useState } from "react";
import { Button, Input } from "reactstrap";
import { useRecoilState } from "recoil";
import { useBids } from "../hooks/useBids";
import { Pixel, Web3Contract } from "../interfaces";
import { selectedBlockState } from "../state";

interface Props {
  pixels: Pixel[];
  web3Contract: Web3Contract;
}

const BlockDetailPanel = ({ pixels, web3Contract }: Props) => {
  const [selectedBlock, setSelectedBlock] = useRecoilState(selectedBlockState);
  const { bids, placeBid, loading } = useBids(web3Contract, selectedBlock);
  const [bidAmount, setBidAmount] = useState(0);

  const blocksPixels = useMemo(() => {
    return pixels.filter((p) => p.creatorId === selectedBlock);
  }, [selectedBlock, pixels]);

  const highestBid = useMemo(() => {
    const bidsSorted = bids.sort((a, b) => b.amount - a.amount);
    return bidsSorted[0];
  }, [bids]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        borderRight: "1px solid black",
        borderBottom: "1px solid black",
        borderTop: "1px solid black",
        padding: "8px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <h1>Loading</h1>
        ) : (
          <>
            <h1>Block: {blocksPixels[0].creatorId}</h1>
            {bids.length > 0 ? (
              <>
                <div
                  style={{
                    display: "grid",
                    gridRow: "auto auto",
                  }}
                >
                  <div>Current Bid</div>
                  <div>{highestBid.amount}</div>
                </div>
              </>
            ) : (
              <div>Currently no bids</div>
            )}
            <div>Place Bid</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto auto",
                padding: "8px",
              }}
            >
              <Input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(parseFloat(e.target.value))}
              />
              <Button onClick={() => placeBid(bidAmount)}>Place Bid</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlockDetailPanel;
