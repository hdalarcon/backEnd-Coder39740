import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const prodcutCollection = 'products';

const productSchema = new Schema({
    title: { type: Schema.Types.String, require: true },
    description: { type: Schema.Types.String, require: true },
    code: { type: Schema.Types.String, require: true },
    price: { type: Schema.Types.Number, require: true },
    status: { type: Schema.Types.Boolean, default: true },
    stock: { type: Schema.Types.Number, require: true },
    category: { type: Schema.Types.String, require: true },
    thumbnail: { type: Schema.Types.String, require: true },
    owner: { type: Schema.Types.String, default: 'admin' }
})

productSchema.plugin(mongoosePaginate);
export default mongoose.model(prodcutCollection, productSchema);