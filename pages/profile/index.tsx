import { useEffect } from "react";
import Layout from "../../components/Layout";
import { useProfile } from "../../hooks/useProfile";

const Profile = () => {
  const { getProfile, user } = useProfile();

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <Layout>
      <h1>Hello {user && user.wallet}</h1>
    </Layout>
  );
};

export default Profile;
