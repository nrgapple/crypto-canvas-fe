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
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { FormEvent, useState } from "react";
import { useContractAndAccount } from "../hooks/useContractAndAccount";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: number) => void;
}

const OfferModal = ({ isOpen, onClose, onSubmit }: Props) => {
  const [value, setValue] = useState<string>("");
  const [isChecked, setChecked] = useState<boolean>(false);
  const { web3 } = useContractAndAccount();

  const handleClose = () => {
    setValue("");
    setChecked(false);
    onClose();
  };

  const handlePlaceOffer = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(Number(value));
    setValue("");
    setChecked(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Make Offer</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handlePlaceOffer}>
            <FormControl id="price" isRequired>
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
                  WETH {web3!.utils.toWei(value, "ether")}
                </FormHelperText>
              )}
              <FormErrorMessage>Too low</FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>{"Terms & Conditions"}</FormLabel>
              <Checkbox
                isChecked={isChecked}
                onChange={(e) => setChecked(e.target.checked)}
              >
                By clicking you agree to our terms
              </Checkbox>
            </FormControl>
            <ButtonGroup>
              <Button
                disabled={value === "" || parseInt(value) < 0 || !isChecked}
                mt={4}
                mb={4}
                type="submit"
              >
                Submit
              </Button>
            </ButtonGroup>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OfferModal;
