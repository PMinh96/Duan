const mongoose = require('mongoose');
mongoose.set('strictQuery', true)
//compasss
const local = "mongodb://127.0.0.1:27017/GenZFashion"

// const local="mongodb://127.0.0.1:27017/QLiProduct"
//alast(cloud)
const dataatlas = "mongodb+srv://dieptv:123@cluster0.f5sdmgn.mongodb.net/GenZFashion?retryWrites=true&w=majority&appName=Cluster0"
const connect = async () => {
    try {
        await mongoose.connect(local, { useNewUrlParser: true, useUnifiedTopology: true, })
        console.log('connet success')
    } catch (error) {
        console.log(error);
        console.log('connet fail')
    }
}
module.exports = { connect }