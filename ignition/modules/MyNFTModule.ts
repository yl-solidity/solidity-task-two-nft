import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MyNFTModule = buildModule("MyNFTModule", (m) => {
  // 部署参数
  const nftName = m.getParameter("name", "MyDigitalArt");
  const nftSymbol = m.getParameter("symbol", "MDA");
  
  // 部署 MyNFT 合约
  const myNFT = m.contract("MyNFT", [nftName, nftSymbol]);
  
  // 铸造一个初始 NFT（可选）
  const initialTokenURI = m.getParameter(
    "initialTokenURI", 
    "ipfs://QmXxx/initial.json"
  );
  
  m.call(myNFT, "mint", [
    m.getAccount(0),  // 第一个账户（部署者）
    initialTokenURI
  ]);
  
  // 返回部署结果
  return { myNFT };
});

export default MyNFTModule;