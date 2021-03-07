import React, { useEffect, useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useBids } from "../hooks/useBids";
import { Web3Contract, WorldStateType } from "../interfaces";
import { pixelsState, selectedBlockState, worldState } from "../state";
import AcceptBid from "./AcceptBid";
import EditBlock from "./EditBlock";
import PlaceBid from "./PlaceBid";

interface Props {
  web3Contract: Web3Contract;
  onRefresh: () => void;
}

const BlockDetailPanel = ({ web3Contract, onRefresh }: Props) => {
  const pixels = useRecoilValue(pixelsState);
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
    <div className="flex-c-space lb">
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
                  <EditBlock
                    blocksPixels={blocksPixels}
                    web3Contract={web3Contract}
                  />
                ) : (
                  <>
                    <AcceptBid
                      highestBid={highestBid}
                      onAcceptBid={handleAcceptBid}
                    />
                    <div
                      className="button"
                      onClick={() => setWorld(WorldStateType.edit)}
                    >
                      Edit your Block
                    </div>
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
