const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const Order = new Scheme({
    id_client: {
        type: String,
        required: true
    },
    name_user:{
        type: String,
        required: true
    },
    phone_user:{
        type: String,
        required: true,
    },
    address_user:{
        type: String,
        required: true
    },
    products: [
        {
            productId: { type: Scheme.Types.ObjectId, ref: 'product', required: true },
            sizeId: { type: Scheme.Types.ObjectId, ref: 'sizes', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            id_producttype:{type:Scheme.Types.ObjectId,ref:'typeproducts'},
        }
    ],
    state: {
        type: Number,
        enum: [0, 1, 2, 3], // 0 = Chờ xử lý, 1 = Đã thanh toán, 2 = hủy, 3 = chờ thanh toán
        default: 0,
    },
    payment_method: {
        type: String,
        required: true
    },
    total_amount: {
        type: Number,
        required: true
    },
    order_time: {
        type: Date,
        default: Date.now
    },
    payment_time: {
        type: Date
    },
    completion_time: {
        type: Date
    },
    cancleOrder_time:{
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('order', Order);
