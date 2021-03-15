import { Bid } from "../interfaces";
import { Wrap } from "@chakra-ui/layout";
import { useRecoilValue } from "recoil";
import { pixelsState } from "../state";
import React, { useMemo } from "react";
import ExhibitBox from "./ExhibitBox";

interface Props {
  allBids: Bid[];
}

const BidsList = ({ allBids }: Props) => {
  const pixels = useRecoilValue(pixelsState);

  const renderBids = useMemo(() => {
    return allBids.map((bid) => {
      const exhibitPixels = pixels.filter((p) => p.exhibitId === bid.exhibitId);

      return (
        <ExhibitBox key={bid.exhibitId} pixels={exhibitPixels} bid={bid} />
      );
    });
  }, [pixels, allBids]);

  return <Wrap>{renderBids}</Wrap>;
};

export default BidsList;
