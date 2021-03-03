import React, { useEffect, useMemo } from "react";
import { useRecoilState } from "recoil";
import { useBids } from "../hooks/useBids";
import { Pixel, Web3Contract } from "../interfaces";
import { selectedBlockState } from "../state";
import AcceptBid from "./AcceptBid";
import PlaceBid from "./PlaceBid";

interface Props {
  pixels: Pixel[];
  web3Contract: Web3Contract;
}

const BlockDetailPanel = ({ pixels, web3Contract }: Props) => {
  const [selectedBlock, setSelectedBlock] = useRecoilState(selectedBlockState);
  const { bids, placeBid, loading } = useBids(web3Contract, selectedBlock);

  const blocksPixels = useMemo(() => {
    return pixels.filter((p) => p.creatorId === selectedBlock);
  }, [selectedBlock, pixels]);

  const highestBid = useMemo(() => {
    const bidsSorted = bids.sort((a, b) => b.amount - a.amount);
    return bidsSorted[0];
  }, [bids]);

  useEffect(() => {
    return () => {
      setSelectedBlock(undefined);
    };
  }, []);

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
            {blocksPixels.length > 0 &&
            blocksPixels[0].owner === web3Contract.accounts[0] ? (
              <AcceptBid bids={bids} highestBid={highestBid} />
            ) : (
              <PlaceBid
                bids={bids}
                highestBid={highestBid}
                onPlaceBid={placeBid}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlockDetailPanel;
