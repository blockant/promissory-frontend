const express = require('express')
const cors = require('cors')
require('./src/db/mongoose')
const assetRouter = require('./src/routers/asset')
const userRouter = require('./src/routers/user')
const HDWalletProvider = require("@truffle/hdwallet-provider")
const Web3=require('web3')
const app = express()
app.use(express.json())
app.use(cors())
app.use(assetRouter)
app.use(userRouter)

const solc = require("solc");
const fs = require("fs");

app.post('/contract/deploy', async(req, res)=>{
    try{
      // Reading the file
        file = fs.readFileSync('./src/routers/contracts/Promissory.sol').toString();
        //console.log(file);
        // Input structure for solidity compiler
        const input = {
            language: "Solidity",
            sources: {
            "Promissory.sol": {
                content: file,
            },
            },
            settings: {
            outputSelection: {
                "*": {
                "*": ["*"],
                },
            },
            },
        };
        const output = JSON.parse(solc.compile(JSON.stringify(input)));
        console.log("Result : ", output);
        const ABI = output.contracts["Promissory.sol"]["Promissory"].abi;
        const bytecode = output.contracts["Promissory.sol"]["Promissory"].evm.bytecode.object;
        //console.log("Bytecode: ", bytecode);
        // console.log("ABI: ", ABI);
        const privatePhrase=process.env.PRIVATE_PHRASE
        const rpcURL=process.env.RPC_URL
        console.log('Private Url is', privatePhrase)
        console.log('RPC URL is', rpcURL)
        const provider = new HDWalletProvider(
            privatePhrase,
            rpcURL,
        );
        //console.log('Provider is', provider)    
        //const web3 = new Web3();
        let contractAddress
        const web3 = new Web3(provider);
        const accounts=await web3.eth.getAccounts()
        console.log('Using Account', accounts[0])
        const contract = new web3.eth.Contract(ABI);
        //console.log('Contract is', contract)
        await contract.deploy({ data: bytecode, arguments:['Promissory', 'PBC', 1000000]  }).send({ from: accounts[0].toLowerCase()}).on("receipt", (receipt) => {
            // Contract Address will be returned here
            console.log("Contract Address:", receipt.contractAddress);
            contractAddress=receipt.contractAddress
        }).on('error', function(error){ 
            console.log(error)
            return res.status(500).message({message: 'Contact deployment failed'}) 
        }).on('transactionHash', function(transactionHash){ console.log('Transaction hash is', transactionHash) })
        return res.send({message: `Contact Deployment Success, Address:  ${contractAddress}`})
    }catch(err){
        console.log(err)
        return res.status(500).json({error: err.message || 'Server Error'})
    }
})

module.exports = app

