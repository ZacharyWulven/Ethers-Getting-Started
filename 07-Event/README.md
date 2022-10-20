# Ethers-07 检索 Event

智能合约释放出的事件存储于以太坊虚拟机的日志中。日志分为两个主题 `topics` 和数据 `data` 部分，其中`事件哈希`和 `indexed` 变量存储在 `topics` 中，作为`索引`方便以后搜索；没有`indexed` 变量存储在 `data` 中，不能被直接检索，但可以存储更复杂的数据结构。

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

### 3 执行查询脚本
```js
$ node deploy.js
```
