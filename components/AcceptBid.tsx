import React from "react";
import { Button } from "reactstrap";
import { Bid } from "../interfaces";

const AcceptBid = ({ bids, highestBid }: { bids: Bid[]; highestBid: Bid }) => {
  return (
    <div>
      <div>You own this block.</div>
      {bids.length > 0 ? (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto auto",
              gap: "4px",
            }}
          >
            <div>Current Highest Bid:</div>
            <div>{highestBid.amount}</div>
          </div>
          <Button>Accept Bid</Button>
        </>
      ) : (
        <div>Currently no bids</div>
      )}
    </div>
  );
};

export default AcceptBid;
