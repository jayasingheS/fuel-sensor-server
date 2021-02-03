

const mongoose = require('mongoose')

const pointSchema = new mongoose.Schema({
    Lon:{
        type: Number,
        required: true,
    },Lat: {
        type: Number,
        required: true,
    },Year: {
        type: Number,
        required: true,
    },Month: {
        type: Number,
        required: true,
    },Day: {
        type: Number,
        required: true,
    },Hours: {
        type: Number,
        required: true,
    },
    Minutes: {
        type: Number,
        required: true,
    },
    Seconds: {
        type: Number,
        required: true,
    },
    FuelLevel: {
        type: Number,
        required: true,
    },
    FuelHight: {
        type: Number,
        required: true,
    },
});

const trackSchema = new mongoose.Schema({
    CompanyID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        type: String,
        required: true,


    },
    CompanyName: {
        required: true,
        ref: 'User',
        type: String,


    },
    SensorID: {
        type: Number,
        required: true,

    },
    vehicle_registration_number: {
        type: String,
        required: true,

    },
    locations: [pointSchema]
},{
    timestamps: true
})




trackSchema.statics.findByid = async (vehicle_registration_number,body)=>{
    const trackPresent = body.locations[0]
    const trackPast = await Track.findOne({vehicle_registration_number})
    if(!trackPast){
        return " sensor ID not register"

    }
    trackPast.locations = [...trackPast.locations,{
                                                   SensorID:trackPresent.SensorID,
                                                   Lon:trackPresent.Lon,
                                                   Lat:trackPresent.Lat,
                                                   Year:trackPresent.Year,
                                                   Month:trackPresent.Month,
                                                   Day:trackPresent.Day,
                                                   Hours:trackPresent.Hours,
                                                   Minutes:trackPresent.Minutes,
                                                   Seconds:trackPresent.Seconds,
                                                   FuelLevel:trackPresent.FuelLevel,
                                                   FuelHight:trackPresent.FuelHight,
                                                     }]
    await trackPast.save()
    return trackPast
   }
   
    trackSchema.statics.findBy_vehicle_registration_number = async (vehicle_registration_number)=>{
        
    const vehicle = await Track.findOne({vehicle_registration_number})
    return vehicle
   }
   


const Track = mongoose.model('Track', trackSchema)

module.exports = Track
