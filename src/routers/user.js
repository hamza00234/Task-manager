const express= require('express')
const router= new express.Router()
const User= require('../models/user')
const auth= require('../middlewear/auth')
const {sendwelcome,senddelete}= require('../emails/account')
const bcrypt=require('bcrypt')
const jwt= require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET||'thisismykey'; // Use your secret key here
//require("dotenv").config();

router.get('/test', (req,res)=>{
    res.send('testing')
})

router.post('/register', async (req, res)=>{
    try{
        //check if user is already registered
        const check=await User.findOne({email:req.body.email})
        if(check){
            return res.status(409).send("user already registered")
        }
        const user=new User(req.body)
        const hashedPassword=await bcrypt.hash(user.password,8)
       console.log(user.password)
        user.password=hashedPassword
        await user.save()
        console.log(user.password)
        return res.status(201).send("successfully registered")
        
    }catch(e){
        return  res.status(500).send(e.message)
    }

})


router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;
  
        const user = await User.findOne({ email });
        console.log(password)
        if (!user) {
          return res.status(404).send("email not found");
        }
        //console.log(user);
        console.log(user.password);
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log(passwordMatch)
        if (!passwordMatch) {
          return res.status(405).send("incorrect password");
        }
        console.log(secretKey)
        const currentDateTime = new Date();
        const expiresAt = new Date(+currentDateTime + 1800000);
  
        // Generate a JWT token
        const token = jwt.sign(
          { user: { userId: user._id} },
          secretKey,
          {
            expiresIn: "1d",
          }
        );
  
        return res
          .cookie("token", token, {
            expires: expiresAt,
            httpOnly: true,
            secure: true, // Set to true if using HTTPS
            sameSite: "none",
          })
          .status(200)
          .send(user);
      } catch (e) {
        res.status(500).send(e.message);
      }
})

router.post('/logout', auth, async (req,res)=>{
    try{
        req.user.tokens= req.user.tokens.filter((token)=>{
            return token.token!== req.token
        })
        await req.user.save()
    res.send()

    }catch(e){
        res.status(500).send()
    }
})


router.post('/logoutAll', auth, async (req,res)=>{
    try{
        req.user.tokens= []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})


router.get('/me', auth, async (req,res)=>{
  try {
    console.log('Incoming cookies:', req.cookies);
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'No token in cookies' });
  }
  const decoded = jwt.verify(token, secretKey);
  const user = await User.findById(decoded.user.userId).select('-password'); // exclude password
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json(user);
} catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Internal server error' });
}
  
})


router.patch('/me', auth, async (req,res)=>{
    try {
        const id = req.user.userId; // Use req.user.userId to get the current user's ID
        const user = await User.findById(id);
        console.log(user)
        console.log(user.password)
        if (!user) {
          return res.status(404).send("user not found");
        }
        const password = req.body.password;
        if (password) {
          const compare = await bcrypt.compare(password, user.password);
          if (!compare) {
            const hashedPassword = await bcrypt.hash(password, 8);
            user.password = hashedPassword;
            await user.save();
            console.log(user.password)
          } else {
            return res.status(400).send("you must use a new password");
          }
          delete req.body.password;
        }
        Object.assign(user, req.body);
        console.log(user.password)
              await user.save();
              return res.status(200).send("updated successfully")
      } catch (e) {
        return res.status(500).send(e);
      }
})




router.delete('/me', auth,  async(req, res)=>{
    try{
       await req.user.deleteAllTasksAndUser()
       senddelete(req.user.email, req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})



module.exports= router