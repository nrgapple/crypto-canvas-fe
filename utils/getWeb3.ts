import Web3 from "web3";

const getWeb3 = (): Promise<Web3> =>
  new Promise((resolve, reject) => {
    const get = async () => {
      // Modern dapp browsers...
      //@ts-ignore
      if (window.ethereum) {
        //@ts-ignore
        const web3 = new Web3(window.ethereum) as Web3;
        try {
          // Request account access if needed
          //@ts-ignore
          await window.ethereum.enable();
          // Acccounts now exposed
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      // Legacy dapp browsers...
      //@ts-ignore
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        //@ts-ignore
        const web3 = window.web3 as Web3;
        console.log("Injected web3 detected.");
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:8545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
    };

    if (document.readyState === "complete") {
      get();
    } else {
      // Wait for loading completion to avoid race conditions with web3 injection timing.
      window.addEventListener("load", get);
    }
  });

export default getWeb3;
