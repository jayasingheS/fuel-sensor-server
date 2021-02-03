const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const UserSchema = new mongoose.Schema({
    Name:{
        type:String,
        required: true,
        trim: true,
        unique:true,
    },
    email:{
        type:String,
        required: true,
        trim: true,
        unique:true,
    },
    PassWord:{
        type:String,
        required: true,
        minlength:7,
        trim: true
    },
    vehicles: [{
        vehicle_registration_number: {
            type: String,
            required: true,
            unique:true,
        },
        sensor_id: {
            type: String,
            required: true,
            unique:true,
        }
    }],
tokens: [{
    token: {
    type: String,
    required: true
    }
    }]
})
UserSchema.statics.findByCredentiale = async(email,PassWord)=>{

 const user = await User.findOne({email})
 if(!user){
     throw new Error("unable to LogIn")
 }
 const isMatch = await bcrypt.compare(PassWord,user.PassWord);
 if(!isMatch){
     throw new Error("unable to LogIn")
 }
 return user
}

UserSchema.methods.genarateAuthToken = async function(){
    const user = this
    const token=await jwt.sign({ _id: user._id.toString() }, 'BlackSJ')
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}
UserSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.PassWord
    delete userObject.tokens
    return userObject
   }
UserSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('PassWord')) {
    user.PassWord = await bcrypt.hash(user.PassWord, 8)

    }
    next()
   })
const User = mongoose.model('User',UserSchema);

module.exports = User;
