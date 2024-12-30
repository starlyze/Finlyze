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

const dataModel = mongoose.model('Data', dataSchema);
export const itemModel = mongoose.model('Item', dataSchema);
export default dataModel;
