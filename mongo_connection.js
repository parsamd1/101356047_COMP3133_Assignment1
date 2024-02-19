const mongoose=require('mongoose')



module.exports = mongoose.connect('mongodb+srv://john123:john123@cluster0.sqtw7uq.mongodb.net/comp3133%5Fassignment1?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(success => {
    console.log('Success Mongodb connection')
}).catch(err => {
    console.log('Error Mongodb connection')
    process.exit()
});