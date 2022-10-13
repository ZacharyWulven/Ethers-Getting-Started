
// 导入ethers包
const { ethers } = require("ethers");

// playcode免费版不能安装ethers，用这条命令，需要从网络上import包（把上面这行注释掉）
// import { ethers } from "https://cdn-cors.ethers.io/lib/ethers-5.6.9.esm.min.js";

// 利用ethers默认的 Provider 连接以太坊网络
// 在ethers中，Provider 类是一个为以太坊网络连接提供抽象的类，
// 它提供对区块链及其状态的只读访问。
// 我们声明一个provider用于连接以太坊网络。ethers 内置了一些公用 rpc，方便用户连接以太坊
// 注意: ethers 内置的 rpc 访问速度有限制，仅测试用，生产环境还是要申请个人 rpc。
const provider = new ethers.getDefaultProvider();
async function main() {
    // 查询 vitalik 的 ETH 余额
    // 由于 ethers 原生支持 ENS 域名，我们不需要知道具体地址，
    // 用 ENS 域名 vitalik.eth 就可以查询到以太坊创始人豚林-vitalik的余额。
    // vitalik.eth
    const name = "vitalik.eth"
    const balance = await provider.getBalance(`${name}`);
    // 将余额输出在console
    // 我们从链上获取的以太坊余额以 wei 为单位，而 1 ETH = 10^18 wei。
    // 我们打印之前，需要进行单位转换。ethers 提供了功能函数 formatEther，
    // 我们可以利用它将 wei 转换为 ETH
    console.log(`ETH Balance of ${name} : ${ethers.utils.formatEther(balance)} ETH`);
}

main().then(() => process.exit(0)).catch(
    (error) => {
        console.error(error);
        process.exit(1);
});
