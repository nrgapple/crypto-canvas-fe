import React from "react";
import { Button } from "reactstrap";
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
      <div>You own this block.</div>
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
          <Button onClick={onAcceptBid}>Accept Bid</Button>
        </>
      ) : (
        <div>Currently no bids</div>
      )}
    </div>
  );
};

export default AcceptBid;
