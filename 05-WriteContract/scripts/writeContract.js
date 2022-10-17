/*
## 声明可写的Contract变量的规则：
const contract = new ethers.Contract(address, abi, signer)
其中address为合约地址，abi是合约的abi接口，signer是wallet对象。注意，这里你需要提供signer，
而在声明可读合约时你只需要提供 provider。
你也可以利用下面的方法，将可读合约转换为可写合约：
const contract2 = contract.connect(signer)

## 我们在第三讲介绍了读取合约信息。它不需要gas。
这里我们介绍写入合约信息，你需要构建交易，并且支付gas。
该交易将由整个网络上的每个节点以及矿工验证，并改变区块链状态。


## 与合约进行交互
// 发送交易
const tx = await contract.METHOD_NAME(args [, overrides])
// 等待链上确认交易
await tx.wait() 
其中METHOD_NAME为调用的函数名，args为函数参数，[, overrides]是可以选择传入的数据，包括：
    gasPrice：gas价格
    gasLimit：gas上限
    value：调用时传入的ether（单位是wei）
    nonce：nounce
注意： 此方法不能获取合约运行的返回值，如有需要，要使用Solidity事件记录，然后利用交易收据去查询。


*/
const { ethers } = require("ethers");

// 利用 Alchemy 的 rpc 节点连接以太坊网络
// 准备 alchemy API 可以参考 https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/XqQDHKZd3RL6QtV747CGnAel5AwtcJII';
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.g.alchemy.com/v2/2xBLjI3tCgMQ18kLGre8Z75_wtYYsa4X';
// 连接以太坊主网
const providerETH = new ethers.providers.JsonRpcProvider(ALCHEMY_MAINNET_URL)
// 连接Goerli测试网
const providerGoerli = new ethers.providers.JsonRpcProvider(ALCHEMY_GOERLI_URL)

// 利用私钥和provider创建wallet对象
const privateKey = 'dbe0d2ec784b741e00c5dc81f1e65b79f8caff4609a97cd878ac05a975c95ba5'
const wallet = new ethers.Wallet(privateKey, providerGoerli)

// WETH的ABI
const abiWETH = [
    "function balanceOf(address) public view returns(uint)",
    "function deposit() public payable",
    "function transfer(address, uint) public returns (bool)",
    "function withdraw(uint) public ",
];
// WETH合约地址（Goerli测试网）
const addressWETH = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6' // WETH Contract

// 声明可写合约
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)
// 也可以声明一个只读合约，再用connect(wallet)函数转换成可写合约。
// const contractWETH = new ethers.Contract(addressWETH, abiWETH, provider)
// contractWETH.connect(wallet)

async function main() {

    const address = await wallet.getAddress()
    // 1. 读取WETH合约的链上信息（WETH abi）
    console.log("\n1. 读取WETH余额")
    const balanceWETH = await contractWETH.balanceOf(address)
    console.log(`存款前WETH持仓: ${ethers.utils.formatEther(balanceWETH)}\n`)
    //读取钱包内ETH余额
    const balanceETH = await wallet.getBalance()
    
    // 如果钱包ETH足够
    if(ethers.utils.formatEther(balanceETH) > 0.0015){

        // 2. 调用desposit()函数，将0.001 ETH转为WETH
        console.log("\n2. 调用desposit()函数，存入0.001 ETH")
        // 发起交易
        const tx = await contractWETH.deposit({value: ethers.utils.parseEther("0.001")})
        // 等待交易上链
        await tx.wait()
        console.log(`交易详情：`)
        console.log(tx)
        const balanceWETH_deposit = await contractWETH.balanceOf(address)
        console.log(`存款后WETH持仓: ${ethers.utils.formatEther(balanceWETH_deposit)}\n`)
        // 3. 调用transfer()函数，将0.001 WETH转账给 vitalik
        console.log("\n3. 调用transfer()函数，给vitalik转账0.001 WETH")
        // 发起交易
        const tx2 = await contractWETH.transfer("vitalik.eth", ethers.utils.parseEther("0.001"))
        // 等待交易上链
        await tx2.wait()
        const balanceWETH_transfer = await contractWETH.balanceOf(address)
        console.log(`转账后WETH持仓: ${ethers.utils.formatEther(balanceWETH_transfer)}\n`)

    }else{
        // 如果ETH不足
        console.log("ETH不足，去水龙头领一些Goerli ETH")
        console.log("1. chainlink水龙头: https://faucets.chain.link/goerli")
        console.log("2. paradigm水龙头: https://faucet.paradigm.xyz/")
    }
}

main().then(() => process.exit(0)).catch(
    (error) => {
        console.error(error);
        process.exit(1);
    }
);

