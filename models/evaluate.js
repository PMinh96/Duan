const mongoose =require('mongoose');
const Scheme =mongoose.Schema;

const Evaluate =new Scheme({
    id_client:{type:String,require: true},
    id_product:{type:Scheme.Types.ObjectId,ref:'product'},
    chat:{type:String},
},{
    timestamps:true,
})

module.exports=mongoose.model('evaluate',Evaluate)