const express = require('express')
const cors = require('cors')
require('./src/db/mongoose')
const assetRouter = require('./src/routers/asset')
const userRouter = require('./src/routers/user')

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
        file = fs.readFileSync('./src/routers/contracts/DashTestToken.sol').toString();
        console.log(file);
        // Input structure for solidity compiler
        const input = {
            language: "Solidity",
            sources: {
            "DashTestToken.sol": {
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
        var output = JSON.parse(solc.compile(JSON.stringify(input)));
        console.log("Result : ", output);
        ABI = output.contracts["DashTestToken.sol"]["DashTestToken"].abi;
        bytecode = output.contracts["DashTestToken.sol"]["DashTestToken"].evm.bytecode.object;
        console.log("Bytecode: ", bytecode);
        console.log("ABI: ", ABI);
        return res.send(ABI)
    }catch(err){
        console.log(err)
        return res.status(500).json({error: err.message || 'Server Error'})
    }
})

module.exports = app

