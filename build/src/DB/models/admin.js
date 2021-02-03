const mongoose = require('mongoose')
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const AdminSchema = new mongoose.Schema({
    Name:{
        type:String,
        required: true,
        trim: true
    },
    PassWord:{
        type:String,
        required: true,
        minlength:7,
        trim: true
    },
    Email: {
        type: String,
        required: true,
        unique:true,
        trim: true,

    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

AdminSchema.statics.findByCredentiale = async(Email,PassWord)=>{

    const admin = await Admin.findOne({Email})

    if(!admin){
        throw new Error("unable to LogIn")
    }
    const isMatch = await bcrypt.compare(PassWord,admin.PassWord);
    if(!isMatch){
        throw new Error("unable to LogIn")
    }
    return admin
}

AdminSchema.methods.genarateAuthToken = async function(){
    const admin = this
    const token=await jwt.sign({ _id: admin._id.toString() }, 'BlackSJ')
    admin.tokens = admin.tokens.concat({ token })
    await admin.save()
    return token
}
AdminSchema.methods.toJSON = function () {
    const admin = this
    const adminObject = admin.toObject()
    delete adminObject.PassWord
    delete adminObject.tokens
    return adminObject
}
AdminSchema.pre('save', async function (next) {
    const admin = this

    if (admin.isModified('PassWord')) {
        admin.PassWord = await bcrypt.hash(admin.PassWord, 8)

    }
    next()
})



const Admin = mongoose.model('Admin',AdminSchema);

module.exports = Admin;