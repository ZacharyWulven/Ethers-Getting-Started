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

其他方法：通过JSON文件创建wallet对象

以上三种方法即可满足大部分需求，当然还可以通过ethers.Wallet.fromEncryptedJson解密一个JSON钱包文件创建钱包实例，
JSON文件即keystore文件，通常来自Geth, Parity等钱包，通过Geth搭建过以太坊节点的个人对keystore文件不会陌生。
*/



// 利用Wallet类发送ETH
// 由于playcode不支持ethers.Wallet.createRandom()函数，我们只能用VScode运行这一讲代码
const { ethers } = require("ethers");

// 利用 Alchemy 的 rpc 节点连接以太坊网络
// 准备 alchemy API 可以参考 https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/XqQDHKZd3RL6QtV747CGnAel5AwtcJII';
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.g.alchemy.com/v2/2xBLjI3tCgMQ18kLGre8Z75_wtYYsa4X';
// 连接以太坊主网
const providerETH = new ethers.providers.JsonRpcProvider(ALCHEMY_MAINNET_URL)
// 连接Goerli测试网
const providerGoerli = new ethers.providers.JsonRpcProvider(ALCHEMY_GOERLI_URL)


// 方法1：创建随机的wallet对象
const wallet1 = new ethers.Wallet.createRandom()
const wallet1WithProvider = wallet1.connect(providerGoerli)
const mnemonic = wallet1.mnemonic // 获取助记词

// 方法2：用私钥创建wallet对象
// 自己创建一个 metamask 钱包用于测试，永远不要用这个账户打钱
const privateKey = 'dbe0d2ec784b741e00c5dc81f1e65b79f8caff4609a97cd878ac05a975c95ba5'
const wallet2 = new ethers.Wallet(privateKey, providerGoerli)

// 方法3：从助记词创建wallet对象
const wallet3 = new ethers.Wallet.fromMnemonic(mnemonic.phrase)

async function main() {
    // 1. 获取钱包地址
    const address1 = await wallet1.getAddress()
    const address2 = await wallet2.getAddress() 
    const address3 = await wallet3.getAddress() // 获取地址
    console.log(`1. 获取钱包地址`);
    console.log(`钱包1地址: ${address1}`);
    console.log(`钱包2地址: ${address2}`);
    console.log(`钱包3地址: ${address3}`);
    console.log(`钱包1和钱包3的地址是否相同: ${address1 === address3}`);
    
    // 2. 获取助记词
    console.log(`\n2. 获取助记词`);
    console.log(`钱包1 助记词: ${wallet1.mnemonic.phrase}`)
    // 注意：从private key生成的钱包没有助记词
    // console.log(wallet2.mnemonic.phrase)

    // 3. 获取私钥
    console.log(`\n3. 获取私钥`);
    console.log(`钱包2私钥: ${wallet2.privateKey}`)

    console.log(`钱包1私钥: ${wallet1WithProvider.privateKey}`)

    // 4. 获取链上发送交易次数    
    console.log(`\n4. 获取链上交易次数`);
    const txCount1 = await wallet1WithProvider.getTransactionCount()
    const txCount2 = await wallet2.getTransactionCount()
    console.log(`钱包1发送交易次数: ${txCount1}`)
    console.log(`钱包2发送交易次数: ${txCount2}`)

    // 5. 发送ETH
    // 如果这个钱包没goerli测试网ETH了，去水龙头领一些，钱包地址: 0xe16C1623c1AA7D919cd2241d8b36d9E79C1Be2A2
    // 1. chainlink水龙头: https://faucets.chain.link/goerli
    // 2. paradigm水龙头: https://faucet.paradigm.xyz/
    console.log(`\n5. 发送ETH（测试网）`);
    // i. 打印交易前余额
    console.log(`i. 发送前余额`)
    console.log(`钱包1: ${ethers.utils.formatEther(await wallet1WithProvider.getBalance())} ETH`)
    console.log(`钱包2: ${ethers.utils.formatEther(await wallet2.getBalance())} ETH`)
    // ii. 构造交易请求，参数：to为接收地址，value为ETH数额
    /*
    我们可以利用Wallet实例来发送ETH。首先，我们要构造一个交易请求，
    在里面声明接收地址to和发送的ETH数额value。
    交易请求TransactionRequest类型可以包含发送方from，nonce值nounce，
    请求数据data等信息，之后的教程里会更详细介绍
    */
    const tx = {
        to: address1,
        value: ethers.utils.parseEther("0.001")
    }
    // iii. 发送交易，获得收据
    console.log(`\nii. 等待交易在区块链确认（需要几分钟）`)
    const receipt = await wallet2.sendTransaction(tx)
    await receipt.wait() // 等待链上确认交易
    console.log(receipt) // 打印交易详情
    // iv. 打印交易后余额
    console.log(`\niii. 发送后余额`)
    console.log(`钱包1: ${ethers.utils.formatEther(await wallet1WithProvider.getBalance())} ETH`)
    console.log(`钱包2: ${ethers.utils.formatEther(await wallet2.getBalance())} ETH`)
}

main().then(() => process.exit(0)).catch(
    (error) => {
        console.error(error);
        process.exit(1);
    }
);
