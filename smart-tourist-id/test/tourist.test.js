const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TouristID", function() {
  it("deploy, create record, update score", async function() {
    const [owner, updater, authority] = await ethers.getSigners();
    const Tourist = await ethers.getContractFactory("TouristID");
    const t = await Tourist.deploy(owner.address);
    await t.deployed();

    // grant roles
    const UPDATER = await t.UPDATER_ROLE();
    await t.grantRole(UPDATER, updater.address);

    const blob = ethers.utils.toUtf8Bytes("0x00"); // dummy
    const encKey = ethers.utils.toUtf8Bytes("0x01");
    const expiry = Math.floor(Date.now()/1000) + 3600;
    const tx = await t.createRecord(blob, encKey, expiry, 60);
    const rcpt = await tx.wait();
    const id = 1;

    let meta = await t.getMeta(id);
    expect(meta.exists).to.eq(true);

    await t.connect(updater).updateScore(id, 80);
    meta = await t.getMeta(id);
    expect(meta.safetyScore).to.eq(80);
  });
});
