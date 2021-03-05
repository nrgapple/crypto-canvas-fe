import React, { useEffect, useMemo } from "react";
import { Button } from "reactstrap";
import { useRecoilState } from "recoil";
import { useBids } from "../hooks/useBids";
import { Pixel, Web3Contract, WorldStateType } from "../interfaces";
import { selectedBlockState, worldState } from "../state";
import AcceptBid from "./AcceptBid";
import EditBlock from "./EditBlock";
import PlaceBid from "./PlaceBid";

interface Props {
  pixels: Pixel[];
  web3Contract: Web3Contract;
  onRefresh: () => void;
}

const BlockDetailPanel = ({ pixels, web3Contract, onRefresh }: Props) => {
  const [selectedBlock, setSelectedBlock] = useRecoilState(selectedBlockState);
  const { highestBid, placeBid, loading, acceptBid } = useBids(
    web3Contract,
    selectedBlock
  );
  const [world, setWorld] = useRecoilState(worldState);

  const handleAcceptBid = async () => {
    await acceptBid();
    onRefresh();
  };

  const blocksPixels = useMemo(() => {
    return pixels.filter((p) => p.blockId === selectedBlock);
  }, [selectedBlock, pixels]);

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
            <h1>Block: {blocksPixels[0].blockId}</h1>
            {blocksPixels.length > 0 &&
            blocksPixels[0].owner === web3Contract.accounts[0] ? (
              <>
                {world === WorldStateType.edit ? (
                  <EditBlock blocksPixels={blocksPixels} />
                ) : (
                  <>
                    <AcceptBid
                      highestBid={highestBid}
                      onAcceptBid={handleAcceptBid}
                    />
                    <Button onClick={() => setWorld(WorldStateType.edit)}>
                      Edit your Block
                    </Button>
                  </>
                )}
              </>
            ) : (
              <PlaceBid highestBid={highestBid} onPlaceBid={placeBid} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlockDetailPanel;
