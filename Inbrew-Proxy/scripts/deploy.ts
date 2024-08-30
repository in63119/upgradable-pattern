import { ethers } from "hardhat";
import { makeAbi } from "./makeABI";

async function main() {
  const Proxy = await ethers.getContractFactory("Proxy");
  const V1 = await ethers.getContractFactory("V1");

  console.log("Deploying Contract...");

  const v1 = await V1.deploy();
  await v1.waitForDeployment();

  const proxy = await Proxy.deploy(v1.target);
  await proxy.waitForDeployment();

  /* abi */
  await makeAbi("V1", `${v1.target}`);
  console.log("Contract deployed to:", v1.target);

  await makeAbi("Proxy", `${proxy.target}`);
  console.log("Contract deployed to:", proxy.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
