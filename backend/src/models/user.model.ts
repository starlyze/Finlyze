import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    amount: {type: Number, required: true},
    name: {type: String, required: true},
    date: {type: Date, required:true},
})

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  verified: { type: Boolean, default: false },
  authToken: { type: String },
  income: [transactionSchema],
  expenses: [transactionSchema],
});

export const User = mongoose.model('User', userSchema);
export const Transaction = mongoose.model('Transaction', transactionSchema)
