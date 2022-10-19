
const { ethers } = require("ethers");

// 利用 Alchemy 的 rpc 节点连接以太坊网络
// 准备 alchemy API 可以参考 https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.g.alchemy.com/v2/2xBLjI3tCgMQ18kLGre8Z75_wtYYsa4X';
// 连接Goerli测试网
const providerGoerli = new ethers.providers.JsonRpcProvider(ALCHEMY_GOERLI_URL)


// WETH ABI，只包含我们关心的Transfer事件
const abiWETH = [
  "event Transfer(address indexed from, address indexed to, uint amount)"
];

// 测试网WETH地址
const addressWETH = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6'
// 声明合约实例
const contract = new ethers.Contract(addressWETH, abiWETH, providerGoerli)

async function main() {
      // 获取过去10个区块内的Transfer事件
      console.log("\n1. 获取过去10个区块内的Transfer事件，并打印出1个");
      // 得到当前block
      const block = await providerGoerli.getBlockNumber();
      console.log(`当前区块高度: ${block}`);
      console.log(`打印事件详情:`);
      const transferEvents = await contract.queryFilter('Transfer', block - 10, block);
      // 打印第1个Transfer事件
      console.log(transferEvents[0]);
  
      // 解析Transfer事件的数据（变量在args中）
      console.log("\n2. 解析事件：");
      const amount = ethers.utils.formatUnits(ethers.BigNumber.from(transferEvents[0].args["amount"]), "ether");
      console.log(`地址 ${transferEvents[0].args["from"]} 转账 ${amount} WETH 到地址 ${transferEvents[0].args["to"]}`);

}

main().then(() => process.exit(0))
      .catch((error) => {
      console.error(error);
      process.exit(1);
  }
);
