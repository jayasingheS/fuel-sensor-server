const express = require('express')
const Track = require('../models/userTrack')
const auth = require('../middleware/auth')
const router = new express.Router()


router.post('/Track',async (req,res)=>{

    try{
        const track = await Track.findByid(req.body.vehicle_registration_number,req.body);
        console.log(track)
        res.send(track);
        req.app.io.emit('tx', track);
    }catch(e){
        res.status(400).send(e)
    }
    
});
router.post('/Track/New',async(req,res)=>{
    try{

     const track = await Track.findByid(req.body.owner,req.body);
     req.app.io.emit('tx', track);
    res.send(track);
    }catch(e){
      res.status(400).send()
    }
})

router.get('/Track/New',async(req,res)=>{
    try{

        Track.find({}).then((track)=>{
            res.send(track)
            req.app.io.emit('tx', track);
        }).catch((e)=>{
            res.status(500).send(e)
        })
    }catch(e){
      res.status(400).send()
    }
})
router.post('/Track/vehiclReregistrationNumber',async(req,res)=>{
    try{
        const track = await Track.findBy_vehicle_registration_number(req.body.vehicle_registration_number);
        res.send(track)

    }catch(e){
      res.status(400).send() 
    }
})

module.exports = router
