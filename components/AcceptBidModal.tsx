import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from "@chakra-ui/modal";
import { Button, ButtonGroup, Checkbox, FormControl, FormHelperText, FormLabel, Text, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import { Bid } from "../interfaces";
import { ETH_SYMBOL } from "../utils/helpers";

const AcceptBidModal = ({
  isOpen,
  highestBid,
  exhibitId,
  onAcceptBid,
  onClose
}: {
  isOpen: boolean;
  highestBid?: Bid;
  exhibitId: number;
  onAcceptBid: () => void;
  onClose: () => void
}) => {  
  const [isChecked, setChecked] = useState<boolean>(false);

  const handleAcceptBid = () => {
    onAcceptBid();
    setChecked(false);
    onClose();
  }

  const handleOnClose = () => {
    setChecked(false);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <ModalContent>
        <ModalHeader>Accept Offer?</ModalHeader>
        <ModalCloseButton />
      <ModalBody>
        <FormControl>
          <FormLabel>Amount</FormLabel>
          { highestBid && `${ETH_SYMBOL}${highestBid.amount}`}
          <FormHelperText>{`From ${highestBid?.from}`}</FormHelperText>
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Confirmation</FormLabel>
          <Checkbox isChecked={isChecked} onChange={(e) => setChecked(e.target.checked)}>
            <Text fontSize="sm" color="gray">
              {`By checking the box you are confirming the transfer of Exhibit (XBT) #${exhibitId}
              for the amount of ${ETH_SYMBOL}${highestBid?.amount} to address ${highestBid?.from}`}
            </Text>
          </Checkbox>
        </FormControl>
      </ModalBody>
      <ModalFooter>
          <ButtonGroup>
            <Button disabled={!isChecked} onClick={handleAcceptBid}>Accept</Button>
          </ButtonGroup>
      </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AcceptBidModal;
