const mongoose= require('mongoose');
const Scheme=mongoose.Schema;
const Vouchers=new Scheme({
    name: { type: String, required: true },
    image: { type: String },  
    description: { type: String },  // Mô tả về voucher
    discountValue: { type: Number, required: true },  // Giá trị giảm giá
    discountType: { type: String, enum: ['percent', 'fixed'], required: true },  // Loại giảm giá
    validFrom: { type: String, required: true },  // Ngày bắt đầu hiệu lực
    validUntil: { type: String, required: true },  // Ngày hết hạn
    minimumOrderValue: { type: Number, required: true },  // Giá trị tối thiểu để sử dụng voucher
},{
})
module.exports=mongoose.model('vouchers',Vouchers)