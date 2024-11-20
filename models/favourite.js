const mongoose =require('mongoose');
const Scheme =mongoose.Schema;

const Favourite =new Scheme({
    userId: { type: String, required: true },
    products: [
        {
            productId: { type: Scheme.Types.ObjectId, ref: 'product', required: true },   
        }
    ],
},{
    timestamps:true,
})

module.exports=mongoose.model('favourite',Favourite)
