import React from "react";
import { Bid } from "../interfaces";

const AcceptBid = ({
  highestBid,
  onAcceptBid,
}: {
  highestBid: Bid | undefined;
  onAcceptBid: () => void;
}) => {
  return (
    <div>
      <div>You own this Exhibit.</div>
      {highestBid ? (
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
          <div className="button" onClick={onAcceptBid}>
            Accept Bid
          </div>
        </>
      ) : (
        <div>Currently no bids</div>
      )}
    </div>
  );
};

export default AcceptBid;
