import { Circle, HStack, Text } from "@chakra-ui/react";
import React from "react";
import stc from "string-to-color";
import { displayUserId } from "../utils/helpers";

interface Props {
  id?: string;
}

const DisplayUser = ({ id }: Props) => {
  return (
    <>
      {id && (
        <HStack justifyContent="start">
          <Circle size="15px" background={stc(id)} />
          <Text marginLeft="5px !important">{displayUserId(id)}</Text>
        </HStack>
      )}
    </>
  );
};

export default DisplayUser;
