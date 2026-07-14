const usermodel=require('../models/user.model');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

async function userregister(req,res){
    try{
        const {name,emsil,password}=req.body;
        const existinguser=await usermodel.findOne({email});
        if(existinguser){
            return res.status(400).json({message:"User already exists"});
        }
        const hashpassword=await bcrypt.hash(password,10);
        const newuser=await usermodel.create({name,email,password:hashpassword});
        const token=jwt.sign({id:newuser._id},process.env.SECRET_KEY);
        res.cookies('token',token,{httpOnly:true});
        res.status(201).json({message:"User registered successfully",user:newuser});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:"Internal server error"});
    }
}

async function userlogin(req,res){
    try{
        const {email,password}=req.body;
        const existinguser=await usermodel.findOne({email});
        if(!existinguser){
            return res.status(400).json({message:"User does not exist"});
        }
        const ispasswordvalid=await bcrypt.compare(password,existinguser.password);
        if(!ispasswordvalid){
            return res.status(400).json({message:"Invalid password"});
        }
        const token=jwt.sign({id:existinguser._id},process.env.SECRET_KEY);
        res.cookies('token',token,{httpOnly:true});
        res.status(200).json({message:"User logged in successfully",user:existinguser});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:"Internal server error"});
    }
}

async function userlogout(req,res){
    try{
        res.clearCookie('token');
        res.status(200).json({message:"User logged out successfully"});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:"Internal server error"});
    }
}

module.exports={userregister,userlogin,userlogout};