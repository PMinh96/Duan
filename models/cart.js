const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const Cart = new Scheme({
    userId: { type: String, required: true },
    products: [
        {
            productId: { type: Scheme.Types.ObjectId, ref: 'product', required: true },
            sizeId: { type: Scheme.Types.ObjectId, ref: 'sizes', required: true }, // Thêm kích thước (size)
            quantity: { type: Number, required: true, default: 1 },
            isSelected: { type: Boolean, default: false } // Trạng thái được chọn
        }
    ],
    voucher: {
        type: Scheme.Types.ObjectId, ref: 'vouchers', default: null
    },
    totalPrice: { type: Number, required: true, default: 0 }
}, {
    timestamps: true,
});

module.exports = mongoose.model('cart', Cart);
