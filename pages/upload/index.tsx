import { Center } from "@chakra-ui/layout";
import Layout from "../../components/Layout";
import FileUpload from "../../components/UploadImage";

const UploadPage = () => {
  return (
    <Layout>
      <Center p="8px">
        <FileUpload />
      </Center>
    </Layout>
  );
};

export default UploadPage;
