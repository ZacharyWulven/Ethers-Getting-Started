/*
这一讲，我们将介绍Signer签名者类和和它派生的Wallet钱包类，并利用它来发送ETH。
Signer签名者类

Web3.js认为用户会在本地部署以太坊节点，私钥和网络连接状态由这个节点管理（实际并不是这样）；
而在ethers.js中，Provider提供器类管理网络连接状态，Signer签名者类或Wallet钱包类管理密钥，安全且灵活。

在ethers中，Signer签名者类是以太坊账户的抽象，可用于对消息和交易进行签名，并将签名的交易发送到以太坊网络，
并更改区块链状态。Signer类是抽象类，不能直接实例化，我们需要使用它的子类：Wallet钱包类。

Wallet钱包类
Wallet类继承了Signer类，并且开发者可以像包含私钥的外部拥有帐户（EOA）一样，用它对交易和消息进行签名。

下面我们介绍创建Wallet实例的几种办法：
*/


// 导入 ethers 包
const { ethers } = require("ethers");

// 利用 Alchemy 的 rpc 节点连接以太坊网络
// 准备 alchemy API 可以参考 https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/XqQDHKZd3RL6QtV747CGnAel5AwtcJII';
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.g.alchemy.com/v2/2xBLjI3tCgMQ18kLGre8Z75_wtYYsa4X';
// 连接以太坊主网
const providerETH = new ethers.providers.JsonRpcProvider(ALCHEMY_MAINNET_URL)
// 连接Goerli测试网
const providerGoerli = new ethers.providers.JsonRpcProvider(ALCHEMY_GOERLI_URL)

const main = async () => {
    // 利用 provider 读取链上信息
    // 1. 查询 vitalik 在主网和 Goerli 测试网的 ETH 余额
    console.log("1. 查询 vitalik 在主网和 Goerli 测试网的 ETH 余额");
    const name = "vitalik.eth";
    const balance = await providerETH.getBalance(name);
    const balanceGoerli = await providerGoerli.getBalance(name);
    // 将余额输出在 console（主网）
    console.log(`ETH Balance of ${name}: ${ethers.utils.formatEther(balance)} ETH`);
    // 输出 Goerli 测试网 ETH 余额
    console.log(`Goerli ETH Balance of ${name}: ${ethers.utils.formatEther(balanceGoerli)} ETH`);
    
    // 2. 查询 provider 连接到了哪条链，homestead 代表 ETH 主网：
    console.log("\n2. 查询provider连接到了哪条链")
    const network = await providerETH.getNetwork();
    console.log(network);

    // 3. 查询区块高度
    console.log("\n3. 查询区块高度")
    const blockNumber = await providerETH.getBlockNumber();
    console.log(blockNumber);

    // 4. 查询当前 gas price
    /*
    利用 getGasPrice() 查询当前 gas price，返回的数据格式为 BigNumber，
    可以用 BigNumber 类的 toNumber() 或 toString() 方法转换成数字和字符串。
    */
    console.log("\n4. 查询当前 gas price")
    const gasPrice = await providerETH.getGasPrice();
    console.log(`gas price is ${gasPrice.toString()}`);

    // 5. 查询当前建议的 gas 设置，返回的数据格式为 BigNumber。
    console.log("\n5. 查询当前建议的gas设置")
    const feeData = await providerETH.getFeeData();
    console.log(`lastBaseFeePerGas is ${feeData.lastBaseFeePerGas.toString()}`);
    console.log(`maxFeePerGas is ${feeData.maxFeePerGas.toString()}`);
    console.log(`maxPriorityFeePerGas is ${feeData.maxPriorityFeePerGas.toString()}`);
    console.log(`gasPrice is ${feeData.gasPrice.toString()}`);


    // 6. 查询区块信息
    console.log("\n6. 查询区块信息")
    const block = await providerETH.getBlock(0);
    console.log(block);

    // 7. 给定合约地址查询合约 bytecode，参数为合约地址，例子用的 WETH 地址
    console.log("\n7. 给定合约地址查询合约bytecode，例子用的WETH地址")
    const code = await providerETH.getCode("0xc778417e063141139fce010982780140aa0cd5ab");
    console.log(code);
}

main().then(() => process.exit(0)).catch(
    (error) => {
        console.error(error);
        process.exit(1);
    }
);

