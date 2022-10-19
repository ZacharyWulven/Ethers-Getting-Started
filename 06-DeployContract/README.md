# Sample Hardhat Project

# Ethers-06 部署合约

## 理论
我们将介绍 ethers.js 中的合约工厂 ContractFactory 类型，并利用它部署合约。

在以太坊上，智能合约的部署是一种特殊的交易：将编译智能合约得到的字节码发送到 0 地址。如果这个合约的构造函数有参数的话，需要利用 abi.encode 将参数编码为字节码，然后附在在合约字节码的尾部一起发送。

ethers.js 创造了合约工厂 ContractFactory 类型，方便开发者部署合约。你可以利用合约 abi，编译得到的字节码 bytecode 和签名者变量 signer 来创建合约工厂实例，为部署合约做准备。

**注意**：如果合约的构造函数有参数，那么在`abi`中必须包含构造函数。


## 操作步骤

### 1 创建目录

```js
$ mkdir 06-DeployContract 
$ cd 06-DeployContract
$ code . // 打开 vsCode
```
### 2 安装 hardhat
新建 vsCode 控制台

```js
$ yarn add --dev hardhat
$ yarn hardhat 选择 js 模板
```

### 3 编译合约
合约放到 contracts 目录中

```js
$ yarn hardhat compile

```
### 4 生成 ABI 和 ByteCode
这里我们使用 solcjs 生成 ABI 和 ByteCode，通过 solc 生成 ABI 和 ByteCode后对应目录会出现 .abi 和 .bin（bytecode）.

```js
$ yarn add solc // 安装 solcjs
$ yarn solcjs --version // 查看 solcjs 安装是否正常
$ yarn solcjs --bin --abi --include-path node_modules --base-path ./contracts -o .
/contracts/ ./contracts/ERC20.sol  // 生成 ABI 和 ByteCode
```

### 5 生成 ContractFactory
脚本代码，这里的私钥请为了学习专门创建的一个 MetaMask 钱包，用于学习的钱包请不要用于任何真实的交易，生成完 factoryERC20 就可以进行与合约交互了
```js
const providerGoerli = new ethers.providers.JsonRpcProvider(ALCHEMY_GOERLI_URL)   // 连接Goerli测试网
const privateKey = ''
const wallet = new ethers.Wallet(privateKey, providerGoerli)

const bytecodeERC20 = // copy 通过 solc 生成的 bytecode
const abiERC20 = []; // copy 通过 solc 生成的 abi
const factoryERC20 = new ethers.ContractFactory(fullAbiERC20, bytecodeERC20, wallet);
```

### 6 部署合约
```js
$ node deployContract.js.js
```

### 详细代码见 contracts/deployContract.js
