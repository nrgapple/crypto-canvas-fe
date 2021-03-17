import { Bid } from "../interfaces";
import { Wrap } from "@chakra-ui/layout";
import { useRecoilValue } from "recoil";
import { pixelsState } from "../state";
import React, { useMemo } from "react";
import ExhibitBox from "./ExhibitBox";

interface Props {
  allBids: Bid[];
  isLoaded?: boolean;
}

const BidsList = ({ allBids, isLoaded: isLoadedForced = true }: Props) => {
  const pixels = useRecoilValue(pixelsState);
  const renderBids = useMemo(() => {
    if (!isLoadedForced)
      return Array.from(Array(5)).map((_, i) => (
        <ExhibitBox key={i} pixels={[]} isLoaded={false} />
      ));
    return allBids.map((bid) => {
      const exhibitPixels = pixels.filter(
        (p) => p.exhibitId !== undefined && p.exhibitId === bid.exhibitId
      );

      return (
        <ExhibitBox key={bid.exhibitId} pixels={exhibitPixels} bid={bid} />
      );
    });
  }, [pixels, allBids, isLoadedForced]);

  return (
    <Wrap justify="center" w="100%">
      {renderBids}
    </Wrap>
  );
};

export default BidsList;
