const express = require('express')
const User = require('../models/user')
const Track = require('../models/userTrack')
const auth = require('../middleware/auth')
const router = new express.Router()


router.post('/Users',async (req,res)=>{

    const user = new User(req.body);

    try{
        await user.save();
        const token = await user.genarateAuthToken();
         req.body.vehicles.forEach((vehicle)=>{
            const newTrack= {
                "CompanyID":user._id,
                "CompanyName":user.Name,
                "SensorID":vehicle.sensor_id,
                "vehicle_registration_number":vehicle.vehicle_registration_number,
                "locations":[{
                    "SensorID": 0,
                    "Lon": 0,
                    "Lat": 0,
                    "Year": 0,
                    "Month": 0,
                    "Day": 0,
                    "Hours": 0,
                    "Minutes": 0,
                    "Seconds": 0,
                    "FuelLevel": 0,
                    "FuelHight":0,}]
            }
            const track = new Track(newTrack);
             track.save();

        })
        res.send({user,token});
    }catch(e){
        res.status(400).send(e)
    }

});

router.post('/User/LogIn',async(req,res)=>{
    try{
        const admin = await User.findByCredentiale(req.body.Email,req.body.PassWord);
        const token = await admin.genarateAuthToken();
        
        res.send({admin,token});
    }catch(e){
        res.status(400).send()
    }
})

router.get('/Users/me',auth,(req,res)=>{
        const user = req.user
        const userStatus = req.userStatus
    res.send({user,userStatus})
})
router.get('/Users',(req,res)=>{
    User.find({}).then((user)=>{
        res.send(user)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})
router.get('/Users/:id',(req,res)=>{
    const _id = req.params.id
    User.findById(_id).then((user)=>{
        if(!user){
            res.status(404).send()
        }
        res.send(user)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})


router.patch('/Users/:id',async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['Name', 'PassWord', 'email','vehicles']
    const isValidOperation = updates.every((update) =>allowedUpdates.includes(update))
    if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
    }
      console.log(req.body)
    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators: true })
        req.body.vehicles.forEach((vehicle)=>{
        
          const oldTrack = Track.exists({vehicle_registration_number:vehicle.vehicle_registration_number},function (err, doc) { 
    if (err){ 
         return res.status(400).send({ error: 'Invalid updates vehicle' })
    }else{ 
        if(!doc){
           const newTrackd= {
               "CompanyID":user._id,
               "CompanyName":user.Name,
               "SensorID":vehicle.sensor_id,
               "vehicle_registration_number":vehicle.vehicle_registration_number,
               "locations":[{
                   "SensorID": 0,
                   "Lon": 0,
                   "Lat": 0,
                   "Year": 0,
                   "Month": 0,
                   "Day": 0,
                   "Hours": 0,
                   "Minutes": 0,
                   "Seconds": 0,
                   "FuelLevel": 0,
                   "FuelHight":0,}]
           }
           const trackd = new Track(newTrackd);
            trackd.save();
        
        }
    } 
})
       })
             if (!user) {
             return res.status(404).send()
             }
             res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
})
router.delete('/Users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        const track = await Track.deleteMany({CompanyID:req.params.id})
        if (!user || !track) {
        return res.status(404).send()
        }
        res.send(user)
       } catch (e) {
        res.status(500).send()
       }
   })

module.exports = router;
