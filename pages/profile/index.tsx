
import Layout from "../../components/Layout";
import { useProfile } from "../../hooks/useProfile";

const Profile = () => {
  useProfile();

  return <Layout></Layout>;
};

export default Profile;
