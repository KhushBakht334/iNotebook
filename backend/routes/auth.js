const express= require('express'); 
const router= express.Router();
const User=require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt =require('bcryptjs');  
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET='Harryisagoodboy';

//Route 1: Creating a User
router.post('/createuser',[
  body('email', 'enter a valid email').isEmail(),
  body('name','enter a valid name').isLength({min:3}),
  body('password').isLength({min:5})
],async (req, res)=>{
  const errors=validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }
  try{
  let user = await User.findOne({email: req.body.email});
  if (user){
    return res.status(400).json({error: "sorry already exists"})
  }
  const salt=await bcrypt.genSalt(10);
  secPass=await bcrypt.hash(req.body.password , salt);
  user= await User.create({
    name: req.body.name,
    password: secPass,
    email: req.body.email,
  })
  const data={
    user:{
      id: user.id
    }
  }
  const authtoken= jwt.sign(data, JWT_SECRET);
  res.json({authtoken})
}catch(error){
  console.error(error.message);
  res.status(500).send("some error occured");
}
})
//Route2: Validating the user
router.post('/login',[
  body('email', 'enter a valid email').isEmail(),
  body('password', 'password cant be blank').exists(),
],async (req, res)=>{
  let success=false;
  const errors=validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }
  const {email,password}=req.body;
  try {
    let user=await User.findOne({email});
    if(!user){
      success=false;
      return res.status(400).json({success, error:"use correct credentials"});
    }
    const passwordCompare=await bcrypt.compare(password, user.password);
    if(!passwordCompare){
      success=false;
      return res.status(400).json({success, error:"use correct credentials"});
    }
    const data={
      user:{
        id: user.id
      }
    }
    const authtoken= jwt.sign(data, JWT_SECRET);
    success=true;
    res.json({success, authtoken})
  } catch(error){
    console.error(error.message);
    res.status(500).send("some error occured");
  }
})
//Route 3: Get User's details
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    
    const userId = req.user;
   console.log({userId})
    const user = await User.findById(`${userId.id}`).select("-password");
    res.send(user);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports= router 