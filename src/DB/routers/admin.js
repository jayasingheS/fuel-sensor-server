const express = require('express')
const Admin = require('../models/admin')
const admin = require('../middleware/admin')
const router = new express.Router()


router.post('/Admins',async (req,res)=>{
    const admin = new Admin(req.body);
    console.log(req.body)
    try{
        await admin.save();
        const token = await admin.genarateAuthToken();
        res.send({admin,token});
    }catch(e){
        res.status(400).send(e)
    }

});

router.post('/Admins/LogIn',async(req,res)=>{
    try{
        const admin = await Admin.findByCredentiale(req.body.Email,req.body.PassWord);
        const token = await admin.genarateAuthToken();
        res.send({admin,token});
    }catch(e){
        res.status(400).send()
    }
})
router.get('/Admins/LogOut',admin,async (req,res)=>{
    try{
        req.admin.tokens = req.admin.tokens.filter((token)=>{
            return token.token ==! req.token
        })
        await req.admin.save();
        res.send("admin log Out")
    }catch(e){
        res.status(400).send(e)
    }

});

router.get('/Admins/me',admin,(req,res)=>{
    const admin = req.admin
    const admintatus = req.adminStatus
    res.send({admin,admintatus})
})
router.get('/Admins',(req,res)=>{
    Admin.find({}).then((admin)=>{
        res.send(admin)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})
router.get('/Admins/:id',(req,res)=>{
    const _id = req.params.id
    Admin.findById(_id).then((admin)=>{
        if(!admin){
            res.status(404).send()
        }
        res.send(admin)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})

router.patch('/Admins/:id',async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['Name', 'PassWord', 'Email']
    const isValidOperation = updates.every((update) =>allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try{
        // const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators: true })
        const admin = await Admin.findById(req.params.id);
        updates.forEach((update)=>{
            admin[update] = req.body[update];
        })
        await admin.save();
        if (!admin) {
            return res.status(404).send()
        }
        res.send(admin)
    }catch{
        res.status(400).send(e)
    }
})
router.delete('/Admins/:id', async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id)
        if (!admin) {
            return res.status(404).send()
        }
        res.send(admin)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router;
