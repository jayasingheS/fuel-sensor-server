const mongoose = require('mongoose');

const mongoDbUri = 'mongodb+srv://Shehan:ENMSI17359948@cluster0.kmvju.mongodb.net/New_Test?retryWrites=true&w=majority';
mongoose.connect (mongoDbUri,{useNewUrlParser: true, 
                             useUnifiedTopology: true,
                             useFindAndModify:false,
                             useCreateIndex:true    });

mongoose.connection.on('connected',()=>{
    console.log('connected to mongo DB instance')
})
mongoose.connection.on('error',(err)=>{
    console.log('connction error',err)
})

