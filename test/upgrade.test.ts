import { expect } from "chai";
import { ethers } from "hardhat";
import Proxy from "../abis/Proxy.json";
import V2 from "../abis/V2.json";

describe("Proxy Pattern Test", function () {
  const provider = new ethers.JsonRpcProvider(process.env.KAIA_TEST_RPC_URL);
  const admin = new ethers.Wallet(process.env.PROXY_ADMIN_PK || "", provider);
  const proxy = new ethers.Contract(Proxy.address, Proxy.abi, admin);
  const v2 = new ethers.Contract(Proxy.address, V2.abi, admin);

  it("(1) Should upgrade to V2 and delegate calls to the upgraded implementation", async function () {
    const getImplementation = await proxy.getImplementation();
    console.log(getImplementation);

    expect(getImplementation).to.equal(V2.address);
  });

  it("(2) Should upgrade to V2 and delegate calls to the upgraded implementation", async function () {
    const setValue = await v2.setValue(1);
    await setValue.wait();

    const value = await v2.value();
    console.log("value", value);
  });

  it("(3) Should delegate calls to the upgraded implementation", async function () {
    const adminTransfer = await proxy.adminTransfer(
      "0xB521b6e252ab5A6Edf55804E7F4e65F66415861F"
    );
    await adminTransfer.wait();

    const newOwner = await proxy.getAdmin();
    console.log("newOwner", newOwner);
  });
});
