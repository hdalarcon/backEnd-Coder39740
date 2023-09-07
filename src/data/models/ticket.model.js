import mongoose, { Schema } from 'mongoose';

const ticketCollection = 'tickets';
const ticketSchema = new Schema({
    code: { type: Schema.Types.String },
    purchaseDateTime: { type: Schema.Types.String },
    amount: { type: Schema.Types.Number },
    purchaser: { type: Schema.Types.String }
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);
export default ticketModel;