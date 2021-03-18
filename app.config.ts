enum WalletId {
  euth = 1,
  rin = 4,
}

export const config = {
  contractAddress: "0xE6414896BB0708c51C246aC43b295033D550ea36",
  infuraProviderUri:
    "https://rinkeby.infura.io/v3/566baaea6f1246d8b5e3762f833bc321",
  chainId: WalletId.rin.valueOf(),
};
