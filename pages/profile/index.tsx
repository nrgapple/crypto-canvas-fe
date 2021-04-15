import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import Layout from "../../components/Layout";
import { useProfile } from "../../hooks/useProfile";
import { userState } from "../../state";
import ProfileForm from "./ProfileForm";

const Profile = () => {
  const user = useRecoilValue(userState);
  const { getProfile } = useProfile();

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <Layout>
      <h1>Hello {user && user.wallet}</h1>
      <p>{user?.profile?.username}</p>
      <ProfileForm />
    </Layout>
  );
};

export default Profile;
