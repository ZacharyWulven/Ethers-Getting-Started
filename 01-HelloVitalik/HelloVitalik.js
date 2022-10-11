
// 导入ethers包
const { ethers } = require("ethers");

// playcode免费版不能安装ethers，用这条命令，需要从网络上import包（把上面这行注释掉）
// import { ethers } from "https://cdn-cors.ethers.io/lib/ethers-5.6.9.esm.min.js";

// 利用ethers默认的Provider连接以太坊网络
const provider = new ethers.getDefaultProvider();
async function main() {
    // 查询vitalik的ETH余额
    const balance = await provider.getBalance(`vitalik.eth`);
    // 将余额输出在console
    console.log(`ETH Balance of vitalik: ${ethers.utils.formatEther(balance)} ETH`);
}

main().then(() => process.exit(0)).catch(
    (error) => {
        console.error(error);
        process.exit(1);
});
