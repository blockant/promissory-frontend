const mongoose = require('mongoose')

const assetSchema = new mongoose.Schema({
    street:{type:String, required:true},
    city:{type:String, trim:true, required:true},
    state:{type:String, trim:true, required:true},
    zipcode:{type:String, trim:true, required:true},
    county:{type:String, trim:true},
    lat:{type:Number,trim:true},
    long:{type:Number,trim:true},
    totalPrice:{type:Number,trim:true,required:true},
    tokenName:{type:String, trim:true},
    tokenSymbol:{type:String, trim:true},
    tokenSupply:{type:Number,trim:true},
    tokenPrice:{type:Number,trim:true },
    rateOfInterest:{type:Number,trim:true, required:true},
    compoundedInterest:{type:Number,trim:true},
    interestEarnings:{type:Number,trim:true, required:true},
    assetStatus:{type:String,required:true,default:'pending'},
    contractAddress:{type:String,trim:true},
    ownerWalletAddress:{type:String,trim:true},
    ownerTranferStatus:{type:Boolean,default:false},
    investorReceiverWalletAddress:[
        { 
          investorWalletAddress: {type:String,trim:true}, 
          purchasedTokens: {type:String,trim:true},
          userId:{type:String,trim:true},
          investedDate:{type:String,trim:true} 
        }
    ],
    soldout:{type:Boolean,default:false},
    promissoryId:{type:String,trim:true},
    numberOfTokensAvailable:{type:String,trim:true},
    createdUser:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'User'
    },
    assetOwner:{type:String,trim:true,required:true},
    standard:{type:String,trim:true,required:true,default:'ERC20'}
},{timestamps:true})

const Asset = mongoose.model('asset',assetSchema)

module.exports = Asset