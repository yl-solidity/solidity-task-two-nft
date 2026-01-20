// scripts/deploy.js
import { network } from "hardhat";
import fs from "fs";

async function main() {
  console.log("开始部署到网络: sepolia");
  
  try {
    // 1. 连接到网络
    const { viem } = await network.connect("sepolia");
    
    // 2. 获取客户端
    const publicClient = await viem.getPublicClient();
    const [deployer] = await viem.getWalletClients();
    
    console.log("✅ 连接到网络成功");
    console.log("部署者地址:", deployer.account.address);
    
    // 3. 检查余额
    const balance = await publicClient.getBalance({
      address: deployer.account.address
    });
    console.log("余额:", Number(balance) / 1e18, "ETH");
    
    // 4. 读取编译好的合约
    const contractJson = JSON.parse(
      fs.readFileSync("./artifacts/contracts/MyNFT.sol/MyNFT.json", "utf8")
    );
    
    // 5. 部署合约
    console.log("部署合约...");
    const hash = await deployer.deployContract({
      abi: contractJson.abi,
      bytecode: contractJson.bytecode,
      args: ["MyDigitalArt", "MDA"]
    });
    
    console.log("交易哈希:", hash);
    
    // 6. 等待确认
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    
    if (!receipt.contractAddress) {
      throw new Error("合约地址未返回");
    }
    
    console.log("🎉 部署成功！");
    console.log("合约地址:", receipt.contractAddress);
    
    // 7. 保存信息
    const deploymentInfo = {
      network: "sepolia",
      contractAddress: receipt.contractAddress,
      deployer: deployer.account.address,
      timestamp: new Date().toISOString(),
      transactionHash: hash
    };
    
    fs.writeFileSync(
      "deployment-sepolia.json",
      JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log("部署信息已保存");
    
  } catch (error) {
    console.error("❌ 部署失败:", error.message);
    if (error.shortMessage) {
      console.error("详细错误:", error.shortMessage);
    }
    throw error;
  }
}

// 运行
main().catch((error) => {
  console.error("脚本执行失败");
  process.exit(1);
});