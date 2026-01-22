// scripts/mint-with-correct-ipfs.js
import { network } from "hardhat";

async function main() {
  const { viem } = await network.connect("sepolia");
  const [account] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();
  
  const contractAddress = "0x5DDec0ed62698A8c76469154AaD5323B32BD8607";
  const myNFT = await viem.getContractAt("MyNFT", contractAddress);
  
  // ✅ 使用你验证过的正确CID
  const correctTokenURI = "ipfs://bafkreihg2hpm2d4e6pqudn2pwg743hvvvipfssj57jt622lufathlc33ky";
  
  console.log("✅ 使用验证过的IPFS链接:", correctTokenURI);
  
  // 铸造新的NFT
  const hash = await myNFT.write.mint([
    account.account.address,
    correctTokenURI
  ]);
  
  console.log("交易哈希:", hash);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  
  // 获取新Token ID
  const newTokenId = await myNFT.read.getCurrentTokenId();
  const mintedTokenId = Number(newTokenId) - 1;
  
  console.log("\n🎉 新NFT铸造成功!");
  console.log("Token ID:", mintedTokenId);
  console.log("查看链接: https://testnets.opensea.io/assets/sepolia/" + contractAddress + "/" + mintedTokenId);
}

main().catch(console.error);