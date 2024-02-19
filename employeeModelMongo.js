const mongoose=require('mongoose')

const empSchema=new mongoose.Schema({
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true
    },
    gender:{
        type:String,
        enum:['Male', 'Female', 'Other'],
    },
    salary:{
        type:Number,
        required:true
    }
})

module.exports=mongoose.model('employee', empSchema)