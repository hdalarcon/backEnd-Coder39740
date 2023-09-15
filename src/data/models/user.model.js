import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";

const userCollection = 'users';

const UserSchema = new Schema({
  firstName: { type: Schema.Types.String, required: true },
  lastName: { type: Schema.Types.String },
  email: { type: Schema.Types.String, unique: true, required: true },
  age: { type: Schema.Types.Number, required: true },
  role:{ type: Schema.Types.String, ref: 'roles', default: 'client' },
  isAdmin: { type: Schema.Types.Boolean, default: false },
  password: { type: Schema.Types.String },
  cart: [{ type: Schema.Types.ObjectId, ref:'carts', index: true }],
  documents: [{ name:{ type: Schema.Types.String }, link:{ type: Schema.Types.String } }],
  lastConnection: { type: Schema.Types.Date, default: Date.now },
  terminal: { type: Schema.Types.Boolean, default: false }
});

UserSchema.plugin(paginate);

UserSchema.pre('find', function () {
  this.populate(['cart role']);
});

UserSchema.pre('findOne', function () {
  this.populate(['cart role']);
});

UserSchema.pre('findOneAndUpdate', function(next)
{
    this.populate('cart');
    next();
});

UserSchema.pre('updateOne', function(next)
{
    this.populate('cart');
    next();
});

export default mongoose.model(userCollection, UserSchema);
