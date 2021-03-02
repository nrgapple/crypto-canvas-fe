import React from "react";
import Layout from "../components/Layout";
import { Button, Fade } from "reactstrap";
import SidePanel from "../components/SidePanel";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isEditState, selectedPixelsState } from "../state";
import dynamic from "next/dynamic";
import { useWeb3 } from "../hooks/useWeb3";
import { usePixels } from "../hooks/usePixels";
import { Pixel } from "../interfaces";

const World = dynamic(() => import("../components/World"), {
  ssr: false,
});

const HomePage = () => {
  const { loading, web3Contract } = useWeb3();
  const { pixels, update: updatePixels, checkout } = usePixels(web3Contract);
  const [isEdit, setIsEdit] = useRecoilState(isEditState);
  const setSelectedPixels = useSetRecoilState(selectedPixelsState);

  const handleCheckout = async (selected: Pixel[]) => {
    await checkout(selected);
    setSelectedPixels([]);
    setIsEdit(false);
    await updatePixels();
  };

  return (
    <Layout title="Crypto Canvas">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "8px",
          height: "50px",
          borderBottom: "1px solid black",
        }}
      >
        <h5
          style={{
            padding: "8px",
            marginBottom: "0px",
          }}
        >
          Crypto Pixels
        </h5>
        <Button onClick={() => setIsEdit(!isEdit)}>
          {!isEdit ? "Buy" : "Cancel"}
        </Button>
      </div>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <h3>Loading Web3</h3>
        </div>
      ) : (
        <Fade in={!loading} timeout={1000}>
          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              justifyContent: "center",
              margin: "8px",
            }}
          >
            <World pixels={pixels} />
            {isEdit && <SidePanel onCheckout={handleCheckout} />}
          </div>
        </Fade>
      )}
    </Layout>
  );
};

export default HomePage;
