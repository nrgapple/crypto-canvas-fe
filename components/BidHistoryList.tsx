import { Table, Tbody, Th, Thead, Tr, Td } from "@chakra-ui/table";
import React, { useEffect, useState } from "react";
import { Bid } from "../interfaces";
import { ETH_SYMBOL } from "../utils/helpers";

interface Props {
  exhibitId: number;
}

const BidHistoryList = ({ exhibitId }: Props) => {
  const [highestBids, setHighestBids] = useState<Bid[] | undefined>();

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Price</Th>
          <Th>From</Th>
          <Th>Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        {highestBids &&
          highestBids.map((bid, i) => (
            <Tr key={i}>
              <Td>{`${ETH_SYMBOL}${bid.amount}`}</Td>
              <Td>{bid.from}</Td>
              <Td>PENDING</Td>
            </Tr>
          ))}
      </Tbody>
    </Table>
  );
};

export default BidHistoryList;
