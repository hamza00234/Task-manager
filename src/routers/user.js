const express= require('express')
const router= new express.Router()
const User= require('../models/user')
const auth= require('../middlewear/auth')
const {sendwelcome,senddelete}= require('../emails/account')

router.get('/test', (req,res)=>{
    res.send('testing')
})

router.post('/users', async (req, res)=>{
    const user = new User(req.body)
    try{

        await user.save()
        sendwelcome(user.email, user.name)
        const token = await user.generateToken()
        res.status(201).send({user, token})

    }catch(e){
        res.status(400).send(e)
    }

})


router.post('/users/login', async(req, res)=>{
    try{
        const user= await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateToken()
        res.send({ user, token})
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req,res)=>{
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


router.post('/users/logoutAll', auth, async (req,res)=>{
    try{
        req.user.tokens= []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})


router.get('/users/me', auth, async (req,res)=>{
     res.send(req.user)
  
})


router.patch('/user/me', auth, async (req,res)=>{
    const updates= Object.keys(req.body)
    const allowed=['name', 'email', 'password','age']
    const isfound= updates.every((update)=>allowed.includes(update))

    if(!isfound){
        return res.status(400).send('error: invalid update')
    }
    try{
        updates.forEach((update)=> req.user[update]= req.body[update])
        await req.user.save()
      //  const user= await User.findByIdAndUpdate(req.params.id,req.body, {new :true, runValidators: true})
    res.send(req.user)
    
    }catch(e){
        return res.status(400).send(e)
    }
})




router.delete('/users/me', auth,  async(req, res)=>{
    try{
       await req.user.deleteAllTasksAndUser()
       senddelete(req.user.email, req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})



module.exports= router