// scripts/test-image.js
async function testImage() {
    const imageCid = "bafybeihdsnaclxt7hcxifq4yonhmntdjgkhy6rbtg2cp4z4dl2xixzwile";
    const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageCid}/my-nft.png`;
    
    console.log("🖼️ 测试NFT图片\n");
    console.log(`图片CID: ${imageCid}`);
    console.log(`完整链接: ${imageUrl}`);
    
    const testUrls = [
      `https://gateway.pinata.cloud/ipfs/${imageCid}/my-nft.png`,
      `https://gateway.pinata.cloud/ipfs/${imageCid}`,
      `https://ipfs.io/ipfs/${imageCid}/my-nft.png`,
      `https://ipfs.io/ipfs/${imageCid}`,
      `https://cloudflare-ipfs.com/ipfs/${imageCid}/my-nft.png`
    ];
    
    for (const url of testUrls) {
      console.log(`\n测试: ${url}`);
      
      try {
        const response = await fetch(url, { method: 'HEAD' });
        console.log(`状态: ${response.status} ${response.statusText}`);
        console.log(`类型: ${response.headers.get('content-type')}`);
        
        if (response.ok) {
          console.log("✅ 图片存在!");
          return url;
        }
      } catch (error) {
        console.log(`❌ 错误: ${error.message}`);
      }
    }
    
    console.log("\n🚨 图片可能不存在或CID错误");
    return null;
  }
  
  testImage().then(result => {
    if (!result) {
      console.log("\n💡 需要修复图片链接:");
      console.log("1. 确保图片已上传到Pinata");
      console.log("2. 获取正确的CID");
      console.log("3. 更新JSON文件");
      console.log("4. 重新上传JSON并铸造新NFT");
    }
  });