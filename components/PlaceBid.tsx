import React, { useEffect, useState } from "react";
import { Bid } from "../interfaces";

const PlaceBid = ({
  highestBid,
  onPlaceBid,
}: {
  highestBid: Bid | undefined;
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
      {highestBid ? (
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
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(parseFloat(e.target.value))}
        />
        <div onClick={() => onPlaceBid(bidAmount)}>Place Bid</div>
      </div>
    </>
  );
};

export default PlaceBid;
