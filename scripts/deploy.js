import hre from "hardhat";
import fs from "fs";

async function main() {
  const [deployer] = await hre.viem.getWalletClients();
  console.log("Deploying contracts with the account:", deployer.account.address);

  // 部署合约
  const MyNFT = await hre.viem.deployContract("MyNFT", [
    "MyDigitalArt",  // 名称
    "MDA"           // 符号
  ]);

  console.log("MyNFT deployed to:", MyNFT.address);
  console.log("Contract deployed by:", deployer.account.address);

  // 保存部署信息到文件
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: MyNFT.address,
    deployer: deployer.account.address,
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync(
    `deployment-${hre.network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("Deployment info saved to deployment file");

  return MyNFT;
}

// 错误处理
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});