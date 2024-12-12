const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Evaluate = new Schema({
    id_client: { type: String, required: true },
    product:[
        {
            productId: { type: Schema.Types.ObjectId, ref: 'product', required: true },
            sizeId: { type: Schema.Types.ObjectId, ref: 'sizes', required: true },
            quantity: { type: Number, required: true },
        }
    ],
    text: { type: String, required: true },
    stars: { type: Number, required: true }, 
    date: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

module.exports = mongoose.model('evaluate', Evaluate);
