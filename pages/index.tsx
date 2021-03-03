import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { Button, Fade } from "reactstrap";
import SidePanel from "../components/SidePanel";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  isEditState,
  selectedBlockState,
  selectedPixelsState,
  transactionsInSessionState,
} from "../state";
import dynamic from "next/dynamic";
import { useWeb3 } from "../hooks/useWeb3";
import { usePixels } from "../hooks/usePixels";
import { Pixel } from "../interfaces";
import BlockDetailPanel from "../components/BlockDetailPanel";

const World = dynamic(() => import("../components/World"), {
  ssr: false,
});

const HomePage = () => {
  const { loading, web3Contract } = useWeb3();
  const { pixels, checkout } = usePixels(web3Contract);
  const [isEdit, setIsEdit] = useRecoilState(isEditState);
  const setSelectedPixels = useSetRecoilState(selectedPixelsState);
  const selectedBlock = useRecoilValue(selectedBlockState);

  const handleCheckout = async (selected: Pixel[]) => {
    try {
      await checkout(selected);
      setSelectedPixels([]);
      setIsEdit(false);
    } catch (e) {
      console.error(e);
    }
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
      {loading && !web3Contract ? (
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
        <Fade in={!loading && web3Contract != undefined} timeout={1000}>
          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              justifyContent: "center",
              margin: "8px",
            }}
          >
            <World pixels={pixels} you={web3Contract?.accounts[0] ?? ""} />
            {!isEdit && selectedBlock && (
              <BlockDetailPanel pixels={pixels} web3Contract={web3Contract} />
            )}
            {isEdit && <SidePanel onCheckout={handleCheckout} />}
          </div>
        </Fade>
      )}
    </Layout>
  );
};

export default HomePage;
