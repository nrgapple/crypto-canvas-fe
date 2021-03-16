import { Button, ButtonGroup } from "@chakra-ui/button";
import { Checkbox } from "@chakra-ui/checkbox";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/form-control";
import { Input, InputGroup, InputLeftAddon } from "@chakra-ui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { useState } from "react";
import { useWeb3 } from "../hooks/useWeb3";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: number) => void;
}

const OfferModal = ({ isOpen, onClose, onSubmit }: Props) => {
  const [value, setValue] = useState<string | undefined>();
  const [isChecked, setChecked] = useState<boolean>(false);
  const { web3Contract } = useWeb3();

  const handleClose = () => {
    setValue(undefined);
    setChecked(false);
    onClose();
  };

  const handlePlaceOffer = () => {
    onSubmit(Number(value));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Make Offer</ModalHeader>
        <ModalBody>
          <FormControl>
            <FormLabel>Price</FormLabel>
            <InputGroup>
              <InputLeftAddon children="Ξ" />
              <Input
                value={value}
                type="number"
                placeholder="0.00"
                onChange={(e) => {
                  setValue(
                    e.target.value[0] === "."
                      ? `0${e.target.value}`
                      : e.target.value
                  );
                }}
              />
            </InputGroup>
            {value && (
              <FormHelperText>
                WETH {web3Contract.web3.utils.toWei(value, "ether")}
              </FormHelperText>
            )}
            <FormErrorMessage>Too low</FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel>{"Terms & Conditions"}</FormLabel>
            <Checkbox
              isChecked={isChecked}
              onChange={(e) => setChecked(e.target.checked)}
            >
              By clicking you agree to our terms
            </Checkbox>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handlePlaceOffer}>Submit</Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OfferModal;
