import React from "react";
import Layout from "../components/Layout";
import { Button, Fade } from "reactstrap";
import SidePanel from "../components/SidePanel";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { selectedBlockState, selectedPixelsState, worldState } from "../state";
import dynamic from "next/dynamic";
import { useWeb3 } from "../hooks/useWeb3";
import { usePixels } from "../hooks/usePixels";
import { Pixel, WorldStateType } from "../interfaces";
import BlockDetailPanel from "../components/BlockDetailPanel";

const World = dynamic(() => import("../components/World"), {
  ssr: false,
});

const HomePage = () => {
  const { loading, web3Contract } = useWeb3();
  const { pixels, checkout, update } = usePixels(web3Contract);
  const [world, setWorld] = useRecoilState(worldState);
  const setSelectedPixels = useSetRecoilState(selectedPixelsState);
  const selectedBlock = useRecoilValue(selectedBlockState);

  const handleCheckout = async (selected: Pixel[]) => {
    try {
      await checkout(selected);
      setSelectedPixels([]);
      setWorld(WorldStateType.view);
    } catch (e) {
      console.error(e);
    }
  };

  const refresh = () => {
    update();
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
        <Button
          onClick={() =>
            setWorld(
              world !== WorldStateType.view
                ? WorldStateType.view
                : WorldStateType.create
            )
          }
        >
          {world === WorldStateType.view ? "Create" : "Cancel"}
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
            {world !== WorldStateType.create && selectedBlock && (
              <BlockDetailPanel
                pixels={pixels}
                web3Contract={web3Contract}
                onRefresh={refresh}
              />
            )}
            {world === WorldStateType.create && (
              <SidePanel onCheckout={handleCheckout} />
            )}
          </div>
        </Fade>
      )}
    </Layout>
  );
};

export default HomePage;
