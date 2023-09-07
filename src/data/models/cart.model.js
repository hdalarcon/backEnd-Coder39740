import mongoose, { Schema } from "mongoose";
import paginate from 'mongoose-paginate-v2';

const cartCollection = 'carts';

const cartSchema = new Schema({
    products: {
        type: [{
            _id: { type: Schema.Types.ObjectId, ref: 'products', required: true },
            quantity: { type: Schema.Types.Number, required: true }
        }],
        default: [],
        required: true,
    }
})

cartSchema.plugin(paginate);

export default mongoose.model(cartCollection, cartSchema);
