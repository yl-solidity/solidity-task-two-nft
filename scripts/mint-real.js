// scripts/mint-real-fixed.js
import { network } from "hardhat";

async function main() {
  console.log("🎨 铸造真实的 NFT");
  
  // 连接到网络
  const { viem } = await network.connect("sepolia");
  const [account] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();
  
  const contractAddress = "0x5DDec0ed62698A8c76469154AaD5323B32BD8607";
  
  // ✅ 正确方式：使用合约名称
  const myNFT = await viem.getContractAt("MyNFT", contractAddress);
  
  // 使用你的真实 IPFS 链接
  const realTokenURI = "ipfs://bafkreidkccigmb6immampocljihokzwo5dif2ajxdqjec2sedhtj65rrq4/metadata.json";
  
  console.log("铸造信息:");
  console.log("   接收者:", account.account.address);
  console.log("   元数据:", realTokenURI);
  
  console.log("\n📝 检查权限...");
  const owner = await myNFT.read.owner();
  console.log("合约所有者:", owner);
  
  if (owner.toLowerCase() !== account.account.address.toLowerCase()) {
    console.error("❌ 错误：你不是合约所有者");
    return;
  }
  
  console.log("✅ 权限验证通过");
  
  // 检查当前 NFT 数量
  const currentTokenId = await myNFT.read.getCurrentTokenId();
  const myBalance = await myNFT.read.balanceOf([account.account.address]);
  console.log("\n当前状态:");
  console.log("   总 NFT 数量:", Number(currentTokenId));
  console.log("   我的 NFT 余额:", Number(myBalance));
  
  // 铸造 NFT
  console.log("\n🔄 发送铸造交易...");
  const hash = await myNFT.write.mint([
    account.account.address,
    realTokenURI
  ]);
  
  console.log("✅ 交易已发送");
  console.log("交易哈希:", hash);
  
  // 等待确认
  console.log("⏳ 等待确认...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  
  console.log("\n🎉 NFT 铸造成功！");
  console.log("   区块:", receipt.blockNumber);
  console.log("   Gas 使用:", receipt.gasUsed.toString());
  
  // 检查新的状态
  const newTokenId = await myNFT.read.getCurrentTokenId();
  const newBalance = await myNFT.read.balanceOf([account.account.address]);
  
  console.log("\n📈 更新后的状态:");
  console.log("   新的总数量:", Number(newTokenId));
  console.log("   新的余额:", Number(newBalance));
  
  // 获取新铸造的 tokenId
  const mintedTokenId = Number(newTokenId) - 1;
  console.log("   新铸造的 Token ID:", mintedTokenId);
  
  // 验证所有权
  const tokenOwner = await myNFT.read.ownerOf([BigInt(mintedTokenId)]);
  console.log("   Token 所有者:", tokenOwner);
  
  // OpenSea 链接
  console.log("\n🌐 在 OpenSea 上查看:");
  console.log(`https://testnets.opensea.io/assets/sepolia/${contractAddress}/${mintedTokenId}`);
}

main().catch((error) => {
  console.error("脚本执行失败:", error.message);
  process.exit(1);
});