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
    sizeQuantities: [
        {
            sizeId: { type: Scheme.Types.ObjectId, ref: 'sizes', required: true },
            quantity: { type: Number, required: true }
        }
    ]
    
},{
    timestamps:true,
})

module.exports=mongoose.model('product',Product)