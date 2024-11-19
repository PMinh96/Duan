const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const Order = new Scheme({
    id_client: {
        type: String,
        required: true
    },
    id_cart: {
        type: Scheme.Types.ObjectId,
        ref: 'cart', // Liên kết với giỏ hàng (Cart)
        required: true
    },
    state: {
        type: Number,
        default: 0 // Trạng thái của đơn hàng: 0 = Chưa xử lý, 1 = Đã thanh toán, 2 = Hoàn thành
    },
    payment_method: {
        type: String,
        required: true // Phương thức thanh toán, ví dụ: "cash", "credit_card", "paypal"
    },
    total_amount: {
        type: Number,
        required: true // Tổng số tiền của đơn hàng, có thể lấy từ tổng giá trị của giỏ hàng
    },
    order_time: {
        type: Date,
        default: Date.now // Thời gian đặt hàng, mặc định là thời gian hiện tại
    },
    payment_time: {
        type: Date // Thời gian thanh toán (sau khi khách thanh toán)
    },
    completion_time: {
        type: Date // Thời gian hoàn thành đơn hàng
    }
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
});

module.exports = mongoose.model('order', Order)