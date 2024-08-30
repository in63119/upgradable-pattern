import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    kaiaTestnet: {
      url: process.env.KAIA_TEST_RPC_URL,
      accounts: [process.env.PROXY_ADMIN_PK || ""],
    },
  },
};

export default config;
