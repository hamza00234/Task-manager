const mongoose = require('mongoose');
const validator=require('validator')
const bcrypt= require('bcryptjs')
const jwt= require('jsonwebtoken')
const Task= require('./task')

const userschema= new mongoose.Schema({
    name: {
    type: String,
    required:true,
    trim: true
},
email:{
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase:true,
    validate(value){
        if(!validator.isEmail(value)){
            throw new Error('invalid email')
        }
    }
},
password:{
    type: String,
    trim: true,
   required: true,
    minlength:7,
    validate(value){
        const v= value.toLowerCase()
        if(v.includes('password')){
            throw new Error('Cannot use password')
        }
    }
},
age: {
    type: Number,
    default: 0,
    validate(value){
        if(value<0){
            throw new Error('age must be greater than 0')
        }
    }
},
tokens:[{ 
    token:{
        type: String,
        required: true
    }
}]
},{
    timestamps:true
})

userschema.virtual('tasks', {
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})


userschema.methods.toJSON= function(){
    const user= this
    const userObject= user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}


userschema.methods.generateToken= async function (){
    const user= this
    const token= jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens= user.tokens.concat({ token })
    await user.save()
    
    return token

}



userschema.statics.findByCredentials= async(email, password)=>{
    const user= await User.findOne({email})
    if(!user){
        throw new Error('unable to find email')
    }
    const isMatch= await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('unable to login')
    }
    return user
}



userschema.pre('save',async function(next){
    const user= this

    if(user.isModified('password')){
        user.password= await bcrypt.hash(user.password,8)

    }

    next()
})




userschema.methods.deleteAllTasksAndUser= async function(){
    const user= this
    await Task.deleteMany({owner: user._id})
    await user.deleteOne()
}

const User = mongoose.model('User', userschema);

module.exports= User