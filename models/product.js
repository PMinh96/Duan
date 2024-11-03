const mongoose =require('mongoose');
const Scheme =mongoose.Schema;

const Product=new Scheme({
    quantity:{type:Number},
    price:{type:Number},
    description:{type:String},
    product_name:{type:String},
    image:{type:Array},
    state:{type:Boolean},
    id_suppliers:{type:Scheme.Types.ObjectId,ref:'suppliers'},
    id_producttype:{type:Scheme.Types.ObjectId,ref:'typeproducts'},
},{
    timestamps:true,
})

module.exports=mongoose.model('product',Product)