import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    amount: {type: Number, required: true},
    name: {type: String, required: true},
})

const dataSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  income: [itemSchema],
  expenses: [itemSchema],
});

export const Data = mongoose.model('Data', dataSchema);
export const Item = mongoose.model('Item', dataSchema);
