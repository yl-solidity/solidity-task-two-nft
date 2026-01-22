// scripts/mint-fixed-nft.js
import { network } from "hardhat";

async function main() {
  console.log("🎨 铸造修复后的NFT\n");
  
  const { viem } = await network.connect("sepolia");
  const [account] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();
  
  const contractAddress = "0x5DDec0ed62698A8c76469154AaD5323B32BD8607";
  const myNFT = await viem.getContractAt("MyNFT", contractAddress);
  
  // 🔴 这里填入你从Pinata获取的新CID 🔴
  const fixedTokenURI = "ipfs://bafkreihg2hpm2d4e6pqudn2pwg743hvvvipfssj57jt622lufathlc33ky";
  
  console.log("铸造信息:");
  console.log("   接收者:", account.account.address);
  console.log("   修复后的URI:", fixedTokenURI);
  
  // 验证新URI是否可访问
  if (fixedTokenURI.startsWith('ipfs://')) {
    const testUrl = `https://gateway.pinata.cloud/ipfs/${fixedTokenURI.slice(7)}`;
    console.log("\n🔗 验证链接:", testUrl);
    
    try {
      const response = await fetch(testUrl);
      if (response.ok) {
        const metadata = await response.json();
        console.log("✅ 验证成功!");
        console.log("   NFT名称:", metadata.name);
        console.log("   图片链接:", metadata.image);
        
        // 验证图片
        if (metadata.image.startsWith('ipfs://')) {
          const imageUrl = `https://gateway.pinata.cloud/ipfs/${metadata.image.slice(7)}`;
          const imgResponse = await fetch(imageUrl, { method: 'HEAD' });
          console.log("   图片状态:", imgResponse.status);
        }
      } else {
        console.log("❌ 验证失败，HTTP:", response.status);
        return;
      }
    } catch (error) {
      console.log("❌ 验证错误:", error.message);
      return;
    }
  }
  
  // 检查当前状态
  console.log("\n📊 当前合约状态:");
  const currentTokenId = await myNFT.read.getCurrentTokenId();
  console.log("   总NFT数量:", Number(currentTokenId));
  
  // 检查权限
  const owner = await myNFT.read.owner();
  if (owner.toLowerCase() !== account.account.address.toLowerCase()) {
    console.error("❌ 你不是合约所有者");
    console.log("   合约所有者:", owner);
    console.log("   你的地址:", account.account.address);
    return;
  }
  
  console.log("✅ 权限验证通过");
  
  // 铸造新的NFT
  console.log("\n🔄 发送铸造交易...");
  try {
    const hash = await myNFT.write.mint([
      account.account.address,
      fixedTokenURI
    ]);
    
    console.log("✅ 交易已发送");
    console.log("交易哈希:", hash);
    
    // 等待确认
    console.log("⏳ 等待确认...");
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    
    console.log("\n🎉 修复版NFT铸造成功！");
    console.log("   区块:", receipt.blockNumber);
    
    // 获取新Token ID
    const newTokenId = await myNFT.read.getCurrentTokenId();
    const mintedTokenId = Number(newTokenId) - 1;
    
    console.log("   新Token ID:", mintedTokenId);
    
    // 验证
    const tokenOwner = await myNFT.read.ownerOf([BigInt(mintedTokenId)]);
    const tokenURI = await myNFT.read.tokenURI([BigInt(mintedTokenId)]);
    
    console.log("   Token所有者:", tokenOwner);
    console.log("   Token URI:", tokenURI);
    
    console.log("\n🌟 NFT信息:");
    console.log(`   合约: ${contractAddress}`);
    console.log(`   Token ID: ${mintedTokenId}`);
    console.log(`   元数据: ${tokenURI}`);
    
  } catch (error) {
    console.error("❌ 铸造失败:", error.message);
    if (error.message.includes("insufficient funds")) {
      console.log("\n💸 余额不足提示:");
      console.log("   获取Sepolia测试ETH:");
      console.log("   https://sepoliafaucet.com/");
      console.log("   https://faucet.quicknode.com/ethereum/sepolia");
    }
  }
}

main().catch(console.error);