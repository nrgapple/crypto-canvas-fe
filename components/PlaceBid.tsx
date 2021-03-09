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
          <div className="flex-c-center-center">
            <div>
              <h5>Current Highest Bid</h5>
            </div>
            <div>{highestBid.amount} Eth</div>
            <div>
              <h5>User</h5>
            </div>
            <div className="address">{highestBid.from}</div>
          </div>
        </>
      ) : (
        <div className="flex-c-center-center">
          <div>
            <h5>Currently No Bids</h5>
          </div>
        </div>
      )}
      <div className="border-sm p8 flex-c-center">
        <div>Place Bid</div>
        <div className="flex-center-center p8">
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(parseFloat(e.target.value))}
          />
          <div className="button" onClick={() => onPlaceBid(bidAmount)}>
            Place Bid
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceBid;
