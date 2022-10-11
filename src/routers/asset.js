const express = require('express')
const Asset = require('../models/assets')
const path = require("path");
const fs = require("fs-extra");
var solc = require('solc');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const router = new express.Router();
const auth = require('../middleware/auth')
const fss = require("fs");

//creating asset
router.post('/asset', auth, async (req, res) => {
  const asset = new Asset({
    ...req.body
  })
  try {
    await asset.save()
    res.send({ status: 'success', message: 'Asset Created Successfully', assetId: asset._id })
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})


//get assets by query
router.get('/asset', auth, async (req, res) => {
  try {
    //owner gets only owner assets
    if (req.query.assetStatus == 'myAssets') {
      const assets = await Asset.find({ assetOwner: req.user._id }).sort({$natural:-1})
      return res.send({ status: 'success', assets })
    }
    //get tranfered success records only for owner and investor
    if ((req.user.role == 'Owner' || req.user.role == 'Investor') && req.query.assetStatus == 'tokenized') {
      req.query['ownerTranferStatus'] = true
    }
    const assets = await Asset.find(req.query).sort({$natural:-1})
    res.send({ status: 'success', assets })
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

//get asset by id
router.get('/asset/:id', auth, async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
    res.send({ status: 'success', asset })
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

//get investor assets
router.get('/investorAssets', auth, async (req, res) => {
  const query = { "investorReceiverWalletAddress.userId": req.user._id.toString() }
  try {
    const assets = await Asset.find(query)
    res.send({ status: 'success', assets:assets})
  } catch (e) {
    console.log(e,'error')
    res.status(400).send({ error: e.message })
  }
})

//update asset by id
router.patch('/asset/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdated = ['tokenName', 'tokenSymbol', 'tokenPrice', 'tokenSupply', 'assetStatus', 'contractAddress', 'ownerAccountAddress', 'investorReceiverWalletAddress', 'ownerWalletAddress', 'ownerTranferStatus', 'numberOfTokensAvailable','soldout','investedDate']
  const isValidOperation = updates.every((update) => allowedUpdated.includes(update))
  if (!isValidOperation) {
    return res.status(400).send({ error: "invaid updates!" })
  }
  try {
    const asset = await Asset.findById(req.params.id)
    // asset['promissoryId'] = req.user._id
    updates.forEach((update) => asset[update] = req.body[update])
    await asset.save()
    res.send({ status: 'success', message: "Asset Updated Successfully" })
  } catch (e) {
    res.status(400).send(e)
  }
})

//delete asset by id
router.delete('/asset/:id', auth, async (req, res) => {
  try {
    await Asset.deleteOne({ _id: req.params.id })
    res.send({ status: 'success', message: 'Asset Deleted Successfully' })
  } catch (e) {
    res.status(500).send()
  }
})


router.post('/getBalanceOf', auth, async (req, res) => {
  var data = req.body;
  const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ROPSTEN_ENDPOINT))
  // The minimum ABI required to get the ERnpmC20 Token balance
  const minABI = [
    // balanceOf
    {
      constant: true,
      inputs: [{ name: "_owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "balance", type: "uint256" }],
      type: "function",
    },
  ];

  const tokenAddress = data.contractAddress;
  const walletAddress = data.ownerWalletAddress;
  const contract = new web3.eth.Contract(minABI, tokenAddress);
  const result = await contract.methods.balanceOf(walletAddress).call();
  const format = web3.utils.fromWei(result);
  res.send({ BalanceOf: format })
})

router.post('/generateTokens', auth, async (req, res) => {
  console.log(req.body, 'body')
  var data = req.body;
  const provider = new HDWalletProvider(
    //Your mnemonic phrase goes here
    process.env.PRIVATE_PHRASE,
    //Your Infura Rinkeby Network Endpoint here
    process.env.ROPSTEN_ENDPOINT
  );
  const $web3 = new Web3(provider);
  const accounts = await $web3.eth.getAccounts();
  console.log('Attempting to deploy from account ', accounts[0]);
  var input = {
    language: 'Solidity',
    sources: {
      'Promissory.sol': {
        content: fs.readFileSync(path.resolve(__dirname, 'contracts', 'Promissory.sol'), 'utf8')
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  if (output.errors) {
    output.errors.forEach(err => {
      console.log(err.formattedMessage);
    });
    res.send({ Error: 'Error in code' });
  }
  else {
    const result = await new $web3.eth.Contract(
      output.contracts["Promissory.sol"]['Promissory'].abi
    )
      .deploy({
        data: output.contracts["Promissory.sol"]['Promissory'].evm.bytecode.object,
        arguments: [data.tokenName, data.tokenSymbol, data.tokenSupply]
      })
      .send({ gas: '1000000', from: accounts[0] });
    res.send({ contract_address: result.options.address })

  }
})

router.post('/transferTokens', auth, async (req, res) => {
  var data = req.body;
  const tokenAddress = data.contractAddress;
  const receiverWalletAddress = data.ownerWalletAddress;
  const numberOfTokens = data.tokenSupply;
  const provider = new HDWalletProvider(
    process.env.PRIVATE_PHRASE,
    process.env.ROPSTEN_ENDPOINT
  );
  const $web3 = new Web3(provider);
  const accounts = await $web3.eth.getAccounts();
  console.log('Attempting to deploy from account ', accounts[0]);

  const minABI = [
    {
      inputs: [{ internalType: "address", name: "receiver", type: "address" },
      { internalType: "uint256", name: "numTokens", type: "uint256" }
      ],
      name: "transfer",
      outputs: [{ internalType: "bool", name: "", type: "bool" }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
  ];
  const contract = new $web3.eth.Contract(minABI, tokenAddress);
  var isTransferred = await contract.methods.transfer(receiverWalletAddress, numberOfTokens)
    .send({ gas: '1000000', from: accounts[0] });
  res.send({ isTransferred: isTransferred })
})

router.post('/transferTokensToInvestor', auth, async (req, res) => {
  var data = req.body;
  const tokenAddress = data.contractAddress;
  const receiverWalletAddress = data.investorReceiverWalletAddress;
  const numberOfTokensToBuy = data.numberOfTokensToBuy;
  const ownerWalletAddress = data.ownerWalletAddress;
  const provider = new HDWalletProvider(
    process.env.PRIVATE_PHRASE,
    process.env.ROPSTEN_ENDPOINT
  );
  const $web3 = new Web3(provider);
  const accounts = await $web3.eth.getAccounts();
  console.log('Attempting to deploy from account ', ownerWalletAddress);

  const minABI = [
    {
      inputs: [{ internalType: "address", name: "receiver", type: "address" },
      { internalType: "uint256", name: "numTokens", type: "uint256" }
      ],
      name: "transfer",
      outputs: [{ internalType: "bool", name: "", type: "bool" }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
  ];
  const contract = new $web3.eth.Contract(minABI, tokenAddress);
  var isTransferred = await contract.methods.transfer(receiverWalletAddress, numberOfTokensToBuy)
    .send({ gas: '1000000', from: ownerWalletAddress });
  res.send({ isTransferred: isTransferred })
})

router.post('/getAndPayInEtherPrice', async (req, res) => {
  var data = req.body;
  const web3 = new Web3(new Web3.providers.HttpProvider(process.env.KOVAN_ENDPOINT))
  const aggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]
  const addr = process.env.ETH_PRICE_KOVAN_CONTRACT;
  const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, addr);
  priceFeed.methods.latestRoundData().call()
      .then((roundData) => {
        const roundDataFormat = roundData.answer / 100000000;
        const PayInEther = data.dollarValue / roundDataFormat;
        res.send({PayInEther: PayInEther});
    })
  })

module.exports = router