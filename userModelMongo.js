const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true,

    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true,
        validate:{
            validator:(password)=>{
                const regex = /^(?=.*[a-zA-Z0-9]).{8,}$/;
                return regex.test(password);
            },
            message: "password must be 8 alphanumeric characters or above"
        }
    }
})

module.exports = mongoose.model('user', userSchema)