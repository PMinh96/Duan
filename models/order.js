const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const Order = new Scheme({
    id_client: {
        type: String,
        required: true
    },
    products: [
        {
            productId: { type: Scheme.Types.ObjectId, ref: 'product', required: true },
            sizeId: { type: Scheme.Types.ObjectId, ref: 'sizes', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        }
    ],
    state: {
        type: Number,
        enum: [0, 1, 2], // 0 = Chờ xử lý, 1 = Đã thanh toán, 2 = hủy
        default: 0,
    },
    payment_method: {
        type: String,
        enum: ['Cash on Delivery', 'paypal'],
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
