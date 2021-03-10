import React, { useEffect, useState } from "react";
import { Input, InputGroup, InputGroupText } from "reactstrap";
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
          <div className="border-sm">
            <div className="flex-c-center-center p8">
              <div>
                <h5>Current Highest Bid</h5>
              </div>
              <div>{highestBid.amount} Eth</div>
              <div>
                <h5>User</h5>
              </div>
              <div className="address">{highestBid.from}</div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-c-center-center">
          <div>
            <h5>Currently No Bids</h5>
          </div>
        </div>
      )}
      <div className="border-sm flex-c-center">
        <div className="p8">Place Bid</div>
        <div className="p8">
          <InputGroup className="p8tb">
            <Input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(parseFloat(e.target.value))}
            />
            <InputGroupText>Eth</InputGroupText>
          </InputGroup>
          <div className="button" onClick={() => onPlaceBid(bidAmount)}>
            Place Bid
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceBid;
