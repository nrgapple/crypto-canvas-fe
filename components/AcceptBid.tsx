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
    <div className="flex-c-center-center">
      <div className="text-center">
        <h5>You own this Exhibit</h5>
      </div>
      {highestBid ? (
        <>
          <div className="flex-c-center-center">
            <div>
              <h5>Current Highest Bid</h5>
            </div>
            <div>{highestBid.amount} Eth</div>
          </div>
          <div className="button" onClick={onAcceptBid}>
            Accept Bid
          </div>
        </>
      ) : (
        <div className="error">
          <h5>Currently no bids</h5>
        </div>
      )}
    </div>
  );
};

export default AcceptBid;
