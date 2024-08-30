import { ethers } from "hardhat";
import Proxy from "../abis/Proxy.json";
import V1 from "../abis/V1.json";

describe("Proxy delegateCall Test", function () {
  const provider = new ethers.JsonRpcProvider(process.env.KAIA_TEST_RPC_URL);
  const admin = new ethers.Wallet(process.env.PROXY_ADMIN_PK || "", provider);
  const proxy = new ethers.Contract(Proxy.address, Proxy.abi, admin);
  const v1 = new ethers.Contract(Proxy.address, V1.abi, admin);

  it("Should delegate calls to the initial implementation (V1)", async function () {
    const getImplementation = await proxy.getImplementation();
    console.log("getImplementation", getImplementation);
    const value = await v1.value();
    console.log("value", value);

    const setValue = await v1.setValue(42);
    await setValue.wait();

    const value2 = await v1.value();
    console.log("value2", value2);

    const owner = await proxy.getAdmin();
    console.log("owner", owner);
  });
});
