import { ethers } from "hardhat";
import { makeAbi } from "./makeABI";
import Proxy from "../abis/Proxy.json";

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.KAIA_TEST_RPC_URL);
  const admin = new ethers.Wallet(process.env.PROXY_ADMIN_PK || "", provider);
  const proxy = new ethers.Contract(Proxy.address, Proxy.abi, admin);

  const V2 = await ethers.getContractFactory("V2");

  console.log("Upgrading Contract...");

  const v2 = await V2.deploy();
  await v2.waitForDeployment();

  const upgrade = await proxy.upgrade(v2.target);
  await upgrade.wait();

  /* abi */
  await makeAbi("V2", `${v2.target}`);
  console.log("Contract deployed to:", v2.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
