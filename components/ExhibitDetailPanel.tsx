import React, { useEffect, useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useBids } from "../hooks/useBids";
import { Web3Contract, WorldStateType } from "../interfaces";
import { pixelsState, selectedExhibitState, worldState } from "../state";
import AcceptBid from "./AcceptBid";
import EditExhibit from "./EditExhibit";
import PlaceBid from "./PlaceBid";

interface Props {
  web3Contract: Web3Contract;
  onRefresh: () => void;
}

const ExhibitDetailPanel = ({ web3Contract, onRefresh }: Props) => {
  const pixels = useRecoilValue(pixelsState);
  const [selectedExhibit, setSelectedExhibit] = useRecoilState(
    selectedExhibitState
  );
  const { highestBid, placeBid, loading, acceptBid } = useBids(
    web3Contract,
    selectedExhibit
  );

  const [world, setWorld] = useRecoilState(worldState);

  const handleAcceptBid = async () => {
    await acceptBid();
    onRefresh();
  };

  const ExhibitPixels = useMemo(() => {
    if (pixels.length > 0 && selectedExhibit != undefined) {
      return pixels.filter((p) => p.exhibitId === selectedExhibit);
    }
    return undefined;
  }, [selectedExhibit, pixels]);

  useEffect(() => {
    return () => {
      setSelectedExhibit(undefined);
    };
  }, []);

  return (
    <div className="flex-c-space plaque side-panel p8">
      <div className="flex-c-space hw100 p8">
        {loading || !ExhibitPixels ? (
          <h1>Loading</h1>
        ) : (
          <>
            <h1>Exhibit: {ExhibitPixels[0].exhibitId}</h1>
            {ExhibitPixels.length > 0 &&
            ExhibitPixels[0].owner === web3Contract.accounts[0] ? (
              <>
                {world === WorldStateType.edit ? (
                  <EditExhibit
                    exhibitPixels={ExhibitPixels}
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
                      Edit your Exhibit
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

export default ExhibitDetailPanel;
