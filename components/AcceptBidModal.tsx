import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@chakra-ui/modal";
import { Button, ButtonGroup, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { Bid } from "../interfaces";
import { ETH_SYMBOL } from "../utils/helpers";

const AcceptBidModal = ({
  isOpen,
  highestBid,
  onAcceptBid,
  onClose
}: {
  isOpen: boolean;
  highestBid?: Bid;
  onAcceptBid: () => void;
  onClose: () => void
}) => {  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
      <ModalHeader>
        Hello World
      </ModalHeader>
      <ModalBody>
        { highestBid && `${ETH_SYMBOL}${highestBid.amount}`}
      </ModalBody>
      <ModalFooter>
          <ButtonGroup>
            <Button onClick={onClose}>Close</Button>
            <Button onClick={onAcceptBid}>Accept</Button>
          </ButtonGroup>
      </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AcceptBidModal;
