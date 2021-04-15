import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Divider, VStack } from "@chakra-ui/layout";
import { Textarea } from "@chakra-ui/textarea";
import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { config } from "../../../app.config";
import { useProfile } from "../../../hooks/useProfile";
import { User } from "../../../interfaces";
import { authTokenState, userState } from "../../../state";

const ProfileForm = () => {
  const { updateProfile, isLoading } = useProfile();
  const [username, setUsername] = useState<string>("");
  const [about, setAbout] = useState<string>("");

  const handleSubmit = async () => {
    const success = await updateProfile(username, about);
    if (success) {
      setUsername("");
      setAbout("");
    }
  };

  return (
    <VStack p="16px">
      <FormControl>
        <FormLabel>Username</FormLabel>
        <Input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>About</FormLabel>
        <Textarea
          value={about}
          onChange={(event) => setAbout(event.target.value)}
        />
      </FormControl>
      <Divider />
      <Button
        disabled={!about || !username}
        onClick={handleSubmit}
        isLoading={isLoading}
        isFullWidth
      >
        Submit
      </Button>
    </VStack>
  );
};

export default ProfileForm;
