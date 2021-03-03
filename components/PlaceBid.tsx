import React, { useEffect, useState } from "react";
import { Button, Input } from "reactstrap";
import { Bid } from "../interfaces";

const PlaceBid = ({
  bids,
  highestBid,
  onPlaceBid,
}: {
  bids: Bid[];
  highestBid: Bid;
  onPlaceBid: (bidAmount: number) => void;
}) => {
  const [bidAmount, setBidAmount] = useState(0);
  useEffect(() => {
    if (highestBid) {
      setBidAmount(highestBid.amount + highestBid.amount * 0.05);
    }
  }, [highestBid]);

  return (
    <>
      {bids.length > 0 ? (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 200px",
              minWidth: "0",
              overflow: "hidden",
              gap: "4px",
            }}
          >
            <div>Current Bid:</div>
            <div>{highestBid.amount}</div>
            <div>User:</div>
            <div>{highestBid.from}</div>
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
        <Button onClick={() => onPlaceBid(bidAmount)}>Place Bid</Button>
      </div>
    </>
  );
};

export default PlaceBid;
